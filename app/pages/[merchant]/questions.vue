<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { isEmptyObject } from "../../utils";
import { useFeedbackStore } from "../../stores/feedback";

const { $pb } = useNuxtApp();
const toast = useToast();

const { productsMap, selectedProducts } = storeToRefs(useFeedbackStore());
const {
  productQuestions,
  productsQuestions,
  currentProductId,
  currentProductIndex,
  lastQuestionsIndex,
  currentQuestionIndex,
  totalQuestions,
} = storeToRefs(useFeedbackStore());

const { respondent } = storeToRefs(useFeedbackStore());

const product = computed(() => productsMap.value!.get(currentProductId.value));

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
const checkProductsQuestions = (): boolean => {
  if (!isEmptyObject(productsQuestions.value)) {
    for (let key in productsQuestions.value) {
      if (productsQuestions.value[key]?.length === 0) {
        return false;
      }
    }
    return true;
  }
  return false;
};

if (checkProductsQuestions()) {
  setAnsweredProductDefaultValue();
} else {
  const unwatch = watch(
    productsQuestions,
    () => {
      if (checkProductsQuestions()) {
        setAnsweredProductDefaultValue();
        unwatch();
      }
    },
    {
      deep: true,
    }
  );
}

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

const submitFeedback = async () => {
  const { data: ids } = await useAsyncData(async () => {
    const promiseData = [];

    for (let pKey in answers.value) {
      for (let qKey in answers.value[pKey]) {
        const promiseFunc = await $pb
          .collection("answers")
          .create({
            question: qKey,
            answer: answers.value[pKey]![qKey],
          })
          .then((res) => res.id);
        promiseData.push(promiseFunc);
      }
    }
    promiseData.push(
      await $pb
        .collection("respondent")
        .create(respondent.value)
        .then((res) => res.id)
    );

    return await Promise.all(promiseData);
  });

  const respondentId = ids.value!.pop();
  await $pb.collection("feedback").create({
    respondent: respondentId,
    products: selectedProducts.value,
    answers: ids.value,
  });
  toast.add({
    title: "Thanks",
    description: "Feedback anda berhasil kami terima!.",
  });
};
</script>
<template>
  <UCard
    :ui="{ background: 'backdrop-blur-sm bg-white/60' }"
    class="w-full md:w-2/3"
  >
    <template #header>
      <ClientOnly>
        <div class="flex text-xl justify-between">
          <span class="font-bold">{{ product ? product.title : "" }} </span>
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
                currentProductIndex === selectedProducts.length - 1
                  ? 'gray'
                  : 'primary'
              "
              :variant="
                currentProductIndex === selectedProducts.length - 1
                  ? 'soft'
                  : 'solid'
              "
              :disabled="currentProductIndex === selectedProducts.length - 1"
            />
            <UButton
              label="submit"
              :disabled="!allowToSubmit"
              :color="allowToSubmit ? 'primary' : 'gray'"
              @click="submitFeedback"
            />
          </div>
        </div>
      </ClientOnly>
    </template>
    <UFormGroup :ui="{ label: { base: 'text-2xl mb-2' } }">
      <template #label>
        <span>{{ productQuestions[currentQuestionIndex]?.q }}</span>
      </template>
      <UTextarea
        v-if="productQuestions[currentQuestionIndex]?.type === 'text'"
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
        v-for="(opt, index) in productQuestions[currentQuestionIndex]
          ?.answer_options"
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

    <!--<pre>{{ answers }}</pre>-->
  </UCard>
</template>
