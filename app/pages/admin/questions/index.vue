<script setup lang="ts">
import { useProductsStore } from "../../../stores/products";
import { useQuestionsStore } from "../../../stores/questions";
const { products } = storeToRefs(useProductsStore());
const { selectedProductId } = storeToRefs(useQuestionsStore());
selectedProductId.value = undefined;
</script>
<template>
  <div class="flex flex-row gap-3">
    <UPageCard
      v-for="product in products"
      :title="product.title"
      :ui="{
        icon: { wrapper: 'justify-center', base: 'h-20 w-20' },
        body: { base: 'sm:p-0 p-0' },
      }"
      class="p-0"
      :to="`/admin/questions/${product.id}`"
      ><template #icon>
        <UAvatar
          :ui="{ rounded: 'rounded-lg' }"
          size="xl"
          :alt="product.title"
          :src="$pb.files.getURL(product, product.images!)"
        /> </template
    ></UPageCard>
  </div>
</template>
