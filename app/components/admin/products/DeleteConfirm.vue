<script setup lang="ts">
import type { Product } from "~~/shared/types";

import { useUserStore } from "../../../stores/user";
import { useProductsStore } from "../../../stores/products";

const model = defineModel({
  type: Boolean,
});
const { $pb } = useNuxtApp();
const { user } = storeToRefs(useUserStore());
const { products, productToDelete } = storeToRefs(useProductsStore());
const toast = useToast();

const loading = ref(false);

const onDelete = async () => {
  if (!productToDelete.value) return;
  loading.value = true;
  await $pb.collection("products").delete(productToDelete.value.id!);
  for (let i = 0, len = products.value?.length || 0; i < len; i++) {
    if (products.value![i]?.id === productToDelete.value.id) {
      products.value?.splice(i, 1);
      break;
    }
  }
  setTimeout(() => {
    loading.value = false;
    toast.add({
      icon: "i-heroicons-check-circle",
      title: "Your product has been deleted",
      color: "red",
    });
    model.value = false;
  }, 1000);
};
</script>

<template>
  <UDashboardModal
    v-model="model"
    :title="`Delete ${productToDelete ? productToDelete.title : ''}`"
    description="Are you sure you want to delete this product?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
    }"
  >
    <template #footer>
      <UButton
        color="red"
        label="Delete"
        :loading="loading"
        @click="onDelete"
      />
      <UButton color="white" label="Cancel" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
