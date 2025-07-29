<script setup lang="ts">
const { active_merchant } = storeToRefs(useMerchantsStore());
const { data, execute } = await useFetch(
  () => `/api/analysis/${active_merchant.value}`,
  {
    method: 'GET',
    onResponse: ({ response }) => {
      if (!response.ok) {
        throw new Error('Failed to fetch analysis data');
      }
    },
    watch: [active_merchant],
    immediate: true,
  },
);
// console.log("Response Analysis Data:", (data.value as string).replace(/###/g, '<h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'));

const html = computed(() =>
  data.value
    ? (data.value as string)
        .replace(/###/g, '<h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
    : '',
);

const analyzeResponses = () => {
  execute();
};
</script>
<!-- <template>
  <h1>Response Analysis</h1>
  <p>{{ data }}</p>
</template> -->

<template>
  <div v-if="html !== ''" class="prose" v-html="html" />
  <div v-else>
    <button @click="analyzeResponses">Get Response Analysis</button>
  </div>
</template>
