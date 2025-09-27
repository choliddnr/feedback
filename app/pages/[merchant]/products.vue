<script setup lang="ts">
import type { CheckboxGroupValue } from "@nuxt/ui";
import type { Product } from "~~/shared/types";

const { merchant } = storeToRefs(useResponseStore());

const { data: _products } = await useFetch<Product[]>(
  "/api/public/products/" + merchant.value?.id
);
const { respondent, selected_product, products } = storeToRefs(
  useResponseStore()
);
const onSubmit = () => {
  if (selected_product.value.length > 0 && _products.value) {
    localStorage.setItem(
      merchant.value?.id + "_selected_product",
      JSON.stringify(selected_product.value)
    );
    products.value = _products.value?.filter((p) =>
      selected_product.value?.includes(p.id)
    );
    localStorage.setItem(
      merchant.value?.id + "_products",
      JSON.stringify(products.value)
    );
    navigateTo(`/${merchant.value?.slug}/questions`);
  }
};
</script>
<template>
  <UCard
    :ui="{ root: 'backdrop-blur-sm bg-neutral/80 ring-primary' }"
    class="w-full sm:w-sm"
  >
    <p class="font-bold mb-3 text-xl mx-auto text-center w-[250px]">
      Please, choose some product to be reviewed.
    </p>
    <!-- <pre>{{ _products }}</pre> -->
    <div class="flex flex-col gap-4">
      <UCheckboxGroup
        v-model="selected_product"
        :items="
          _products?.map((p) => ({ id: p.id, title: p.title, image: p.image }))
        "
        value-key="id"
        label-key="title"
        variant="card"
        size="xl"
      >
        <template #label="{ item }">
          <NuxtImg :src="getImg(item.image)" height="auto" width="200px" />
          <span>{{ item.title }}</span>
        </template>
      </UCheckboxGroup>
    </div>
    <UButton
      label="Selanjutnya"
      size="xl"
      class="mt-4"
      block
      :color="selected_product?.length! > 0 ? 'primary' : 'neutral'"
      :disabled="selected_product?.length! === 0"
      @click="onSubmit"
    />
  </UCard>
</template>
