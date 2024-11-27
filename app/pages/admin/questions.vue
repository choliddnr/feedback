<script setup lang="ts">
import { content } from "#tailwind-config";
import type { Product } from "~~/shared/types";

definePageMeta({
  layout: "dashboard",
});

const { $pb } = useNuxtApp();
const { products } = storeToRefs(useProductsStore());
const { selectedProductId } = storeToRefs(useQuestionsStore());

const sp = { id: "", title: "Select Product" };
const productOptions = ref<Product[]>([sp]);
watchEffect(() => {
  console.log(
    "here",
    products.value && !selectedProductId.value,
    products.value,
    selectedProductId.value
  );
  if (products.value && !selectedProductId.value) {
    productOptions.value = [sp, ...products.value];
    return;
  }
  if (products.value && selectedProductId.value) {
    productOptions.value = products.value;
    navigateTo(`/admin/questions/${selectedProductId.value}`);
  }
  return;
});
</script>
<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Questions" />
      <UDashboardToolbar>
        <USelectMenu
          v-model="selectedProductId"
          :options="productOptions"
          option-attribute="title"
          value-attribute="id"
        >
        </USelectMenu>
      </UDashboardToolbar>
      <UDashboardPanelContent>
        <NuxtPage />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
