<script setup lang="ts">
import {
  LazyAdminQuestionsAddForm,
  // LazyAdminQuestionsEditForm,
} from "#components";

// import { content } from "#tailwind-config";
// import type { Product } from "~~/shared/types";
// import { useQuestionsStore } from "../../_stores/questions";
// import { useProductsStore } from "../../_stores/products";

definePageMeta({
  layout: "dashboard",
});

const { products, active_product } = storeToRefs(useProductsStore());
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const overlay = useOverlay();
const slideover_add = overlay.create(LazyAdminQuestionsAddForm);
// const slideover_edit = overlay.create(LazyAdminQuestionsEditForm);

// const { $pb } = useNuxtApp();
// const { products } = storeToRefs(useProductsStore());
// const { selectedProductId } = storeToRefs(useQuestionsStore());

// const sp = { id: "", title: "Select Product" };
// const productOptions = ref<Product[]>([sp]);
// watchEffect(() => {
//   console.log(
//     "here",
//     products.value && !selectedProductId.value,
//     products.value,
//     selectedProductId.value
//   );
//   if (products.value && !selectedProductId.value) {
//     productOptions.value = [sp, ...products.value];
//     return;
//   }
//   if (products.value && selectedProductId.value) {
//     productOptions.value = products.value;
//     navigateTo(`/admin/questions/${selectedProductId.value}`);
//   }
//   return;
// });
</script>
<template>
  <UDashboardPanel id="questions" resizeable>
    <template #header>
      <!-- :badge="products?.length || 0" -->
      <UDashboardNavbar title="Questions">
        <template #right>
          <UButton
            label="New Item"
            trailing-icon="i-heroicons-plus"
            color="neutral"
            @click="
              () => {
                slideover_add.open({
                  onClose: slideover_add.close,
                });
              }
            "
          />
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar>
        <template #left>
          <USelect
            v-model="active_merchant"
            :items="merchants"
            label-key="title"
            value-key="id"
            variant="ghost"
            class="w-full min-w-40"
          />
          <USelect
            v-model="active_product"
            :items="products"
            label-key="title"
            value-key="id"
            variant="ghost"
            class="w-full min-w-40"
          />
        </template>
      </UDashboardToolbar>
    </template>
    <!-- 
    <UDashboardNavbar title="Questions" />
    <UDashboardToolbar> -->
    <!-- <USelectMenu
          v-model="selectedProductId"
          :options="productOptions"
          option-attribute="title"
          value-attribute="id"
        >
        </USelectMenu> -->
    <!-- </UDashboardToolbar> -->
    <template #body>
      <!-- <div
        class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
      >
    </div> -->
      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>
