<script setup lang="ts">
import type { Merchant } from "~~/shared/types";
const route = useRoute();
const merchant_slug = route.params.merchant;
const { data } = await useFetch("/api/public/merchants/" + merchant_slug, {
  transform: (data: Merchant[]) => data[0],
});
console.log("merchant on setup", data.value, merchant_slug);
onMounted(() => {
  if (import.meta.client) {
    console.log("merchant onMounted", data.value);
    const { merchant, respondent, selected_product, products } = storeToRefs(
      useResponseStore()
    );
    merchant.value = data.value;

    respondent.value =
      JSON.parse(localStorage.getItem(`${merchant.value?.id}_respondent`)!) ||
      undefined;
    selected_product.value =
      JSON.parse(
        localStorage.getItem(`${merchant.value?.id}_selected_product`)!
      ) || undefined;
    products.value =
      JSON.parse(localStorage.getItem(`${merchant.value?.id}_products`)!) ||
      undefined;
  }
});
</script>
<template>
  <UMain
    class="flex felx-row my-auto items-center justify-center w-full sm:w-2xl mx-auto"
  >
    <NuxtPage />
  </UMain>
</template>
