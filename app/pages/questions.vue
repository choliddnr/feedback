<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { isEmptyObject } from "~/utils";
const { productsMap, selectedProducts } = storeToRefs(useProductsStore());
const {
  productQuestions,
  productsQuestions,
  currentProductId,
  currentProductIndex,
  lastQuestionsIndex,
  currentQuestionId,
  currentQuestionIndex,
  totalQuestions,
} = storeToRefs(useQuestionsStore());

const product = computed(() => productsMap.value.get(currentProductId.value));

const answers = ref<{
  [key: string]: { [key: string]: any };
}>({});

const loadAnsweredQuestions = () => {
  for (let i = 0, len = selectedProducts.value.length; i < len; i++) {
    const pid = selectedProducts.value[i];
    const questions = productsQuestions.value[pid!];
    if (pid) {
      const savedAnswers = JSON.parse(localStorage.getItem(pid) || "{}");
      answers.value[pid] = {};
      for (let j = 0, len = questions?.length || 0; j < len; j++) {
        const QId = questions![j]?.id;
        if (QId) {
          answers.value[pid][QId] = savedAnswers[QId] || undefined;
        }
      }
    }
  }
};

const answeredProduct = ref<{ [key: string]: boolean }>({});
const setAnsweredProductDefaultValue = () => {
  loadAnsweredQuestions();
  for (let i = 0, len = selectedProducts.value.length; i < len; i++) {
    answeredProduct.value[selectedProducts.value[i]!] = false;
  }
};
// console.log();

if (!isEmptyObject(productsQuestions.value)) {
  console.log("watch productsQuestions", false);
  setAnsweredProductDefaultValue();
} else {
  console.log("watch productsQuestions", true);
  const unwatch = watch(productsQuestions, () => {
    if (!isEmptyObject(productsQuestions.value)) {
      setAnsweredProductDefaultValue();
      unwatch();
    }
  });
}

const allCurrentProductQuestionsAnswered = computed(() => {
  for (let key in answers.value[currentProductId.value]) {
    if (
      answers.value[currentProductId.value]![key] === undefined ||
      answers.value[currentProductId.value]![key] === ""
    ) {
      answeredProduct.value[currentProductId.value] = false;
      return false;
    }
  }

  answeredProduct.value[currentProductId.value] = true;
  return true;
});
const saveToLocalStorage = (key: string) => {
  localStorage.setItem(key, JSON.stringify(answers.value[key]));
};

const prevProduct = () => {
  saveToLocalStorage(currentProductId.value);
  lastQuestionsIndex.value[currentProductIndex.value] =
    currentQuestionIndex.value;
  if (currentProductIndex.value !== 0) {
    currentProductIndex.value--;
    currentQuestionIndex.value =
      lastQuestionsIndex.value[currentProductIndex.value] || 0;
  }
};
const nextProduct = () => {
  saveToLocalStorage(currentProductId.value);
  lastQuestionsIndex.value[currentProductIndex.value] =
    currentQuestionIndex.value;
  if (selectedProducts.value.length - 1 > currentProductIndex.value) {
    currentProductIndex.value++;
    currentQuestionIndex.value =
      lastQuestionsIndex.value[currentProductIndex.value] || 0;
  }
};

const prevQuestion = () => {
  saveToLocalStorage(currentProductId.value);
  currentQuestionIndex.value--;
};

const nextQuestion = () => {
  saveToLocalStorage(currentProductId.value);
  currentQuestionIndex.value++;
};
/**
 * Allow user to submit
 */

const allowToSubmit = computed(() => {
  console.log("cek", totalQuestions.value, totalAnsweredQuestions.value);
  if (
    totalAnsweredQuestions.value === undefined ||
    totalAnsweredQuestions.value === 0
  )
    return false;
  if (totalQuestions.value !== totalAnsweredQuestions.value) return false;

  return true;
});

const totalAnsweredQuestions = computed<number>(() => {
  let count = 0;
  for (let key in answers.value) {
    count = count + countObjectAttribute(answers.value[key]);
  }
  return count;
});
watchDebounced(
  answers,
  () => {
    saveToLocalStorage(currentProductId.value);
  },
  { debounce: 1000, maxWait: 2000, deep: true }
);
const readyToMount = ref<boolean>(true);
</script>
<template>
  <UCard
    :ui="{ background: 'backdrop-blur-sm bg-white/60' }"
    class="w-full md:w-2/3"
    v-show="readyToMount"
  >
    <template #header>
      <ClientOnly>
        <div class="flex text-xl justify-between">
          <span class="font-bold"
            >{{ product ? product.title : "" }} -
            {{ allCurrentProductQuestionsAnswered }}</span
          >
          <div class="flex flex-row gap-1">
            <UButton
              icon="i-heroicons-chevron-left-solid"
              @click="prevProduct"
              :color="currentProductIndex === 0 ? 'gray' : 'primary'"
              :variant="currentProductIndex === 0 ? 'soft' : 'solid'"
              :disabled="currentProductIndex === 0"
            />
            <UBadge size="lg"
              >{{ selectedProducts.indexOf(currentProductId!) + 1 }}/{{
                selectedProducts.length
              }}</UBadge
            >
            <UButton
              icon="i-heroicons-chevron-right-solid"
              @click="nextProduct"
              :color="
                currentProductIndex === productQuestions.length - 1
                  ? 'gray'
                  : 'primary'
              "
              :variant="
                currentProductIndex === productQuestions.length - 1
                  ? 'soft'
                  : 'solid'
              "
              :disabled="
                currentProductIndex === productQuestions.length - 1 ||
                !answeredProduct[currentProductId]
              "
            />
            <UButton label="submit" :disabled="!allowToSubmit" />
          </div>
        </div>
      </ClientOnly>
    </template>
    <UFormGroup :ui="{ label: { base: 'text-2xl mb-2' } }">
      <template #label>
        <span>{{ productQuestions[currentQuestionIndex]?.q }}</span>
      </template>
      <UTextarea
        v-if="productQuestions[currentQuestionIndex]?.type === 'textarea'"
        size="xl"
        variant="outline"
        placeholder="Search..."
        v-model="answers[currentProductId!]![productQuestions[currentQuestionIndex]?.id!]"
        :ui="{
          variant: { outline: 'ring-2 focus:ring-2 focus:border-b-4' },
        }"
      />
    </UFormGroup>
    <div class="flex flex-row gap-1 my-2">
      <UButton
        v-for="(opt, index) in productQuestions[currentQuestionIndex]?.options"
        :label="opt"
        color="white"
        :ui="{ rounded: 'rounded-full' }"
        @click="
          answers[currentProductId!]![
            productQuestions[currentQuestionIndex]?.id!
          ] = opt
        "
      />
    </div>
    <UButtonGroup size="md" orientation="horizontal" class="w-1/2 my-3">
      <UButton
        color="primary"
        block
        icon="i-heroicons-arrow-left"
        @click="prevQuestion"
        :disabled="currentQuestionIndex === 0"
        variant="soft"
      />
      <UButton
        color="primary"
        block
        icon="i-heroicons-arrow-right"
        @click="nextQuestion"
        :disabled="productQuestions.length - 1 === currentQuestionIndex"
        variant="soft"
      />
    </UButtonGroup>
    <br />

    <div class="flex flex-row gap-1">
      <UButton
        v-for="(answer, key, index) in answers[currentProductId!]"
        :ui="{
          block: 'w-8',
        }"
        :class="{ 'ring-2 ring-primary-600': currentQuestionIndex === index }"
        :variant="answer ? 'solid' : 'soft'"
        @click="currentQuestionIndex = index as number"
        block
        >{{ index }}</UButton
      >
    </div>
    <!--<pre>{{ totalQuestions }}/{{ totalAnsweredQuestions }}</pre>
    <pre
      >{{ answers }}/{{ currentProductId }}/{{ productQuestions }}/{{
        currentQuestionIndex
      }}</pre
    >-->
  </UCard>
</template>
