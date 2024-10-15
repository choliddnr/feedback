<script setup lang="ts">
const { merchant } = storeToRefs(useFeedbackStore());
</script>
<template>
  <h1>Index</h1>
  <pre>{{ merchant }}</pre>
</template>
