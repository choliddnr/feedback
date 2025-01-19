<script setup lang="ts">
import { useFeedbackStore } from "../stores/feedback";

// const { merchantId } = storeToRefs(useFeedbackStore());
// console.log("merchant", merchantId.value);
</script>
<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <h1>{{ "no merchant" }}</h1>
      <NuxtImg
        src="https://lh3.googleusercontent.com/a/ACg8ocKRch5RTWqZKY9lpuOkPbE8YGoemArMKztdZJLXer-tVc-kCVeE=s96-c"
        alt="mC"
      />
    </div>
  </div>
</template>
<style scoped>
#cropperCanvas {
  :deep(cropper-canvas) {
    height: 300px;
    width: 300px;
  }
}
</style>
