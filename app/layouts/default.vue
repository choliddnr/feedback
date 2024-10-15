<script setup lang="ts">
const { $pb } = useNuxtApp();
const { merchant } = storeToRefs(useFeedbackStore());
const bgUrl = computed(() => {
  if (!merchant.value) return "";
  return $pb.files.getUrl(merchant.value, merchant.value.image_background);
});
</script>

<template>
  <div class="bg-cover bg-center" :style="{ backgroundImage: `url(${bgUrl})` }">
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
