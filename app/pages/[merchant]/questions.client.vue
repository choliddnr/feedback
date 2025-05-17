<script setup lang="ts">
import type { Product, Question } from "~~/shared/types";
const { selected_product, products, answers } = storeToRefs(useResponseStore());
const { data: all_questions } = await useFetch<Question[]>(
  "/api/public/questions",
  {
    server: false,
    query: {
      q: selected_product,
    },
  }
);
const state = reactive({
  product_index: 0,
  question_index: 0,
});

const answer_invalid = ref<string>();
const product = computed<Product | undefined>(
  () => products.value![state.product_index!]
);
const products_length = computed<number>(() => products.value!.length);
const questions = computed<Question[] | undefined>(() => {
  if (all_questions.value && products.value) {
    return all_questions.value!.filter(
      (question) => question.product === product.value!.id
    );
  } else {
    return [];
  }
});
const question = computed<Question | undefined>(
  () => questions.value![state.question_index!]
);
const questions_length = computed<number>(() => questions.value!.length);
const keyid = computed<string>(() => {
  if (product.value && question.value) {
    return `${product.value!.id}_${question.value!.id}`;
  } else {
    return "";
  }
});
const answer = ref<string>("");
import { watchDebounced } from "@vueuse/core";

const toast = useToast();

const saveState = () => {
  answers.value.set(keyid.value, answer.value);
  localStorage.setItem(keyid.value, answer.value);
};
const loadState = () => {
  const on_map_store = answers.value.get(keyid.value);
  if (!on_map_store || on_map_store === "") {
    answer.value = localStorage.getItem(keyid.value)!;
  } else {
    answer.value = on_map_store;
  }
  /**
   * if question need a number as the answer, pass loaded string answer into
   * answer_as_number variable as number.
   */
  if (question.value!.type === 2) {
    answer_as_number.value = Number(answer.value);
  }
};

const prevProduct = () => {
  if (state.product_index !== 0) {
    saveState();
    state.product_index--;
    loadState();
  }
};
const nextProduct = () => {
  if (state.product_index !== products_length.value - 1) {
    saveState();
    state.product_index++;
    loadState();
  }
};

const prevQuestion = () => {
  if (state.question_index !== 0) {
    saveState();
    state.question_index--;
    loadState();
  }
};

const nextQuestion = () => {
  if (state.question_index !== questions_length.value - 1) {
    saveState();
    state.question_index++;
    loadState();
  }
};
const jumpQuestion = (index: number) => {
  saveState();
  state.question_index = index;
  loadState();
};

/**
 * Allow user to submit
 */

const isAllValid = () => {
  for (let i = 0; i < products.value.length; i++) {
    const p = products.value[i];
    state.product_index = i;
    for (let j = 0; j < questions.value!.length; j++) {
      const q = questions.value![j];
      state.question_index = j;

      const a = answers.value.get(`${p?.id}_${q?.id}`);
      if (!a || a === "") {
        answer_invalid.value = "Please, answer this question.";
        return false;
      }
    }
  }

  return true;
};

const submitFeedback = async () => {
  saveState();
  if (!isAllValid) return;

  toast.add({
    title: "Thanks",
    description: "Feedback anda berhasil kami terima!.",
  });
};
const answer_as_number = ref<number>(0);
watch(answer_as_number, () => {
  answer.value = answer_as_number.value.toString();
});
watch(questions_length, () => {
  if (state.question_index > questions_length.value - 1) {
    state.question_index = questions_length.value - 1;
  }
});
watchDebounced(
  answer,
  () => {
    if (!answer.value && answer.value === "") return;

    answers.value.set(keyid.value, answer.value);
    answer_invalid.value = undefined;
  },
  { debounce: 500, maxWait: 2000, deep: true }
);
watch(keyid, () => {
  loadState();
});

const rating = ref<number>(0);
</script>
<template>
  <ClientOnly>
    <UCard v-if="answer_invalid" class="">
      <h1>{{ answer_invalid }}</h1>
    </UCard>
    <UCard
      :ui="{ root: 'backdrop-blur-sm bg-neutral/60' }"
      class="w-full md:w-2/3"
    >
      <template #header>
        <div class="flex text-xl justify-between">
          <span class="font-bold">{{ product ? product.title : "" }} </span>
          <div class="flex flex-row gap-1">
            <UButton
              @click="prevProduct"
              icon="i-heroicons-chevron-left-solid"
              :color="state.product_index === 0 ? 'neutral' : 'primary'"
              :variant="state.product_index === 0 ? 'soft' : 'solid'"
            />
            <UBadge size="lg"
              >{{ state.product_index! + 1 }}/{{ products_length }}</UBadge
            >
            <UButton
              @click="nextProduct"
              icon="i-heroicons-chevron-right-solid"
              :color="
                state.product_index === products_length - 1
                  ? 'neutral'
                  : 'primary'
              "
              :variant="
                state.product_index === products_length - 1 ? 'soft' : 'solid'
              "
              :disabled="state.product_index === products_length - 1"
            />
            <UButton label="submit" @click="submitFeedback" />
          </div>
        </div>
      </template>
      <UFormField v-if="question">
        <template #label>
          <span>{{ question!.question }}</span>
        </template>
        <UTextarea
          v-if="question!.type === 1"
          size="xl"
          class="w-full"
          variant="outline"
          placeholder="Search..."
          v-model="answer"
        />
        <Rating v-if="question!.type === 2" v-model="answer_as_number" />
      </UFormField>
      <div class="flex flex-row gap-1 my-2" v-if="question">
        <UButton
          v-if="question.type === 1"
          v-for="(opt, index) in question?.answer_options"
          :ui="{ base: 'rounded-full' }"
          :label="opt"
          color="neutral"
          size="sm"
          @click="answer = opt"
        />
      </div>
      <UButtonGroup size="md" orientation="horizontal" class="w-full my-5">
        <UButton
          color="primary"
          block
          icon="i-heroicons-arrow-left"
          :disabled="state.question_index === 0"
          variant="soft"
          @click="prevQuestion"
        />
        <UButton
          color="primary"
          block
          icon="i-heroicons-arrow-right"
          :disabled="state.question_index === questions_length - 1"
          variant="soft"
          @click="nextQuestion"
        />
      </UButtonGroup>
      <br />

      <div class="flex flex-row gap-1">
        <UButton
          v-for="(q, index) in questions"
          :variant="answers.get(`${q.product}_${q.id}`) ? 'solid' : 'soft'"
          :class="[state.question_index === index ? 'ring-2 ring-success' : '']"
          @click="jumpQuestion(index)"
          >{{ index + 1 }}</UButton
        >
      </div>
    </UCard>
  </ClientOnly>
</template>
