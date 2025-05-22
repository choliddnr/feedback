<script setup lang="ts">
const { merchant } = storeToRefs(useResponseStore());
const route = useRoute();
navigateTo(`/${route.params.merchant}/respondent`);
</script>
<template>
  <UCard>
    <article class="text-wrap text-xl text-center items-center">
      <h4 class="font-bold">Welcome,</h4>
      <USeparator class="mb-4 mt-2" />
      <p>
        {{ merchant?.greeting }}
      </p>
      <UButton
        label="Continue"
        class="mt-5"
        :ui="{ base: 'block w-20' }"
        size="xl"
        @click="navigateTo(`/${route.params.merchant}/respondent`)"
      />
    </article>
  </UCard>
</template>
