<script setup lang="ts">
const { merchant, products } = storeToRefs(useFeedbackStore());
</script>
<template>
  <h1>Index</h1>
  <pre>{{ products }}</pre>
</template>
