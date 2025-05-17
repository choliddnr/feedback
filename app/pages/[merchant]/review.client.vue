<script setup lang="ts">
import type { Product, Question } from "~~/shared/types";
const { answers, all_questions } = storeToRefs(useResponseStore());

const toast = useToast();

const submitFeedback = () => {
  toast.add({
    title: "Thanks",
    description: "Feedback anda berhasil kami terima!.",
  });
};
</script>
<template>
  <ClientOnly>
    <UCard
      :ui="{ root: 'backdrop-blur-sm bg-neutral/60' }"
      class="w-full md:w-2/3"
    >
      <template #header>
        <div class="text-center">
          <h1 class="font-bold text-xl">Review</h1>
          <p>please, review your answer before submitting</p>
        </div>
      </template>
    </UCard>
  </ClientOnly>
</template>
