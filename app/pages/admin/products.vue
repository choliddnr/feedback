<script setup lang="ts">
import {
  LazyAdminProductsEditForm,
  LazyAdminProductsAddForm,
} from "#components";
import type { FormError, FormSubmitEvent } from "#ui/types";
import { boolean } from "zod";
import type { Product } from "~/types";
const { $pb } = useNuxtApp();
const { user, avatarBlob } = storeToRefs(useUserStore());
definePageMeta({
  layout: "dashboard",
});
const { products, productToDelete } = storeToRefs(useProductsStore());
const slideover = useSlideover();
const modal = useModal();
const confirmDeleteProduct = ref<boolean>(false);

const multiProducts = computed<Product[]>(() => {
  if (!products.value) return [];
  return [
    ...products.value!,
    ...products.value!,
    ...products.value!,
    ...products.value!,
    ...products.value!,
  ];
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Products" :badge="products?.length || 0">
        <template #right>
          <UButton
            label="New Item"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="
              () => {
                slideover.open(LazyAdminProductsAddForm, {
                  onClose: slideover.close,
                });
              }
            "
          />
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent class="pb-24">
        <UPageColumns
          id="testimonials"
          :ui="{
            wrapper: 'sm:column-2 md:columns-3 lg:columns-4 gap-8 space-y-8',
          }"
        >
          <div
            v-for="(product, index) in multiProducts"
            :key="index"
            class="break-inside-avoid"
          >
            <UCard
              class=""
              :ui="{
                header: {
                  padding: 'p-0 sm:px-0 overflow-hidden',
                  base: 'h-56',
                },
                footer: {
                  padding: 'p-1 sm:px-1 overflow-hidden',
                  base: '',
                },
                base: 'content-between',
                divide: 'divide-y-0',
              }"
            >
              <template #header>
                <div
                  class="bg-cover bg-center h-full overflow-hidden rounded-t-lg"
                  :style="{ backgroundImage: `url(${$pb.files.getUrl(product, product.images!)}` }"
                ></div>
              </template>
              <span class="font-bold">{{ product.title }}</span>
              <p>{{ product.description }}</p>

              <template #footer>
                <div class="grid grid-cols-2 gap-0 h-auto w-full">
                  <UButton
                    color="white"
                    block
                    icon="i-heroicons-pencil-square-16-solid"
                    :ui="{ rounded: 'rounded-r-none' }"
                    @click="
                      () => {
                        slideover.open(LazyAdminProductsEditForm, {
                          product: product,
                          onClose: slideover.close,
                        });
                      }
                    "
                  />
                  <UButton
                    color="red"
                    block
                    icon="i-heroicons-trash-16-solid"
                    :ui="{ rounded: 'rounded-l-none' }"
                    @click="
                      () => {
                        productToDelete = product;
                        confirmDeleteProduct = true;
                      }
                    "
                  />
                </div>
              </template>
            </UCard>
          </div>
        </UPageColumns>
        <LazyAdminProductsDeleteConfirm v-model="confirmDeleteProduct" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
