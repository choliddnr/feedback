<script setup lang="ts">
import type { Product, Question } from "~~/shared/types";
const { answers, products, all_questions, respondent } = storeToRefs(
  useResponseStore()
);
const route = useRoute();
const toast = useToast();

const submitFeedback = async () => {
  await $fetch("/api/public/response", {
    method: "POST",
    body: {
      respondent: {
        ...respondent.value,
        gender: respondent.value?.gender === "male" ? true : false,
      },
      // respondent: respondent.value,
      answers: Object.fromEntries(answers.value),
    },
    onResponse: ({ response }) => {
      if (response.ok) {
        toast.add({
          title: "Thanks",
          description: "Feedback anda berhasil kami terima!.",
        });
        navigateTo(`/${route.params.merchant}/thankyou`);
      }
    },
    onResponseError: ({ response, error }) => {
      if (!response.ok) {
        toast.add({
          title: "Failded",
          description: response._data.statusMessage,
          color: "error",
          icon: "i-lucide-octagon-x",
          duration: 100000,
        });
      }
    },
  });
};
</script>
<template>
  <ClientOnly>
    <UCard
      :ui="{ root: 'backdrop-blur-sm bg-neutral/60' }"
      class="w-full md:w-2/3"
      variant="outline"
    >
      <div class="text-center">
        <h1 class="font-bold text-xl">Review</h1>
        <p>please, review your answer before submitting</p>
      </div>
      <uSeparator class="my-4" />
      <UPageCard v-for="p in products">
        <template #header>
          <h1 class="text-xl font-bold text-decoration-underline flex">
            {{ p.title }}
          </h1>
        </template>
        <USeparator />
        <div v-for="q in all_questions?.filter((q) => q.product === p.id)">
          <p class="text-lg">Q: {{ q.question }}</p>
          <p v-if="q.type === 1" class="font-bold text-lg">
            A: {{ answers.get(`${p.id}_${q.id}`) }}
          </p>
          <p v-if="q.type === 2" class="flex gap-3 text-warning">
            <svg
              v-for="index in Number(answers.get(`${p.id}_${q.id}`))"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
              <path
                fill="currentColor"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.56.56 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.56.56 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.56.56 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.56.56 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.56.56 0 0 0 .475-.345z"
              />
            </svg>
          </p>
        </div>
      </UPageCard>
      <UButtonGroup class="mt-4 w-full">
        <UButton
          block
          label="Back"
          color="neutral"
          @click="navigateTo(`/${route.params.merchant}/questions`)"
        />
        <UButton block label="Submit" @click="submitFeedback" />
      </UButtonGroup>
    </UCard>
  </ClientOnly>
</template>
