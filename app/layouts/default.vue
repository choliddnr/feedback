<script setup lang="ts">
import { useFeedbackStore } from "../stores/feedback";

const { $pb } = useNuxtApp();
const { merchant } = storeToRefs(useFeedbackStore());
// const bgUrl = computed(() => {
//   if (!merchant.value) return "";
//   return $pb.files.getURL(merchant.value, merchant.value.image_background);
// });
</script>

<template>
  <!--  :style="{ backgroundImage: `url(${bgUrl})` }" -->
  <div class="bg-cover bg-center">
    <UContainer
      :ui="{
        constrained: 'max-w-4xl',
        base: 'h-screen content-center',
      }"
    >
      <div class="flex justify-center">
        <slot />
      </div>
    </UContainer>
  </div>
  <UNotifications />
  <UModals />
  <USlideovers />
</template>
