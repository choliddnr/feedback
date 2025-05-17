<script setup lang="ts">
import type { Product } from "~~/shared/types";

const route = useRoute();
const merchant_id = route.params.merchant;

const { data: _products } = await useFetch<Product[]>(
  "/api/products/" + merchant_id
);
const { merchant } = storeToRefs(useResponseStore());
import type { CheckboxGroupValue } from "@nuxt/ui";
const { respondent, selected_product, products } = storeToRefs(
  useResponseStore()
);
const onSubmit = () => {
  if (selected_product.value.length > 0 && _products.value) {
    localStorage.setItem(
      merchant_id + "_selected_product",
      JSON.stringify(selected_product.value)
    );
    products.value = _products.value?.filter((p) =>
      selected_product.value?.includes(p.id)
    );
    localStorage.setItem(
      merchant_id + "_products",
      JSON.stringify(products.value)
    );
    navigateTo(`/${merchant_id}/questions`);
  }
};
</script>
<template>
  <template>
    <UCard variant="subtle">
      <template #header>
        <Placeholder class="h-8" />
      </template>

      <Placeholder class="h-32" />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
  </template>
  <UCard
    :ui="{ root: 'backdrop-blur-sm bg-neutral/80 ring-primary' }"
    class="w-full"
  >
    <p class="font-bold mb-3 text-xl mx-auto text-center w-[250px]">
      Please, choose some product to be reviewed.
    </p>
    <div class="flex flex-col gap-4">
      <UCheckboxGroup
        v-model="selected_product"
        :items="_products"
        value-key="id"
        label-key="title"
        variant="card"
        size="xl"
      >
        <template #label="{ item }">
          <NuxtImg
            :src="`/product/${item.image}`"
            height="auto"
            width="200px"
          />
        </template>
      </UCheckboxGroup>
    </div>
    <UButton
      label="Selanjutnya"
      size="xl"
      class="mt-4"
      block
      @click="onSubmit"
      :color="selected_product?.length! > 0 ? 'primary' : 'neutral'"
      :disabled="selected_product?.length! === 0"
    />
  </UCard>
</template>
