<script setup lang="ts">
import {
  LazyAdminProductsEditForm,
  LazyAdminProductsAddForm,
  LazyModalConfirm,
} from '#components';
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
definePageMeta({
  layout: 'dashboard',
});
const overlay = useOverlay();
const slideover_add = overlay.create(LazyAdminProductsAddForm);
const slideover_edit = overlay.create(LazyAdminProductsEditForm);

const modal_delete_product = overlay.create(LazyModalConfirm);
const { products, active_product } = storeToRefs(useProductsStore());

const product_to_delete = ref<string | number>();
const processDelete = async (id: string | number) => {
  product_to_delete.value = id;
  await $fetch('/api/products/' + id, {
    method: 'DELETE',
    onResponse: async ({ response }) => {
      if (response.ok) {
        const index = products.value.findIndex((p) => p.id === id);
        products.value.splice(index, 1);
        active_product.value = products.value[0]?.id || undefined;
        product_to_delete.value = undefined;
      }
    },
  });
};

const deleteProduct = async (id: string | number) => {
  modal_delete_product.open({
    message: 'Are you sure?',
    action: {
      cancel: { color: 'neutral' },
      continue: { color: 'error', label: 'Delete' },
    },
    onCancel: () => modal_delete_product.close(),
    onContinue: () => {
      processDelete(id);
      modal_delete_product.close();
    },
  });
  //
};

onMounted(() => {
  active_merchant.value = Number(active_merchant.value);
  if (!active_merchant.value && merchants.value?.length! > 0) {
    active_merchant.value = merchants.value![0]?.id as number;
  }
});
</script>

<template>
  <UDashboardPanel id="products">
    <template #header>
      <UDashboardNavbar title="Products" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="New Product"
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
            v-if="active_merchant"
            v-model="active_merchant"
            :items="[...merchants]"
            label-key="title"
            value-key="id"
            variant="ghost"
            class="w-full"
            :default-value="1"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div v-if="products && products.length > 0" class="flex flex-row gap-3">
        <UPageCard
          v-for="product in products"
          :title="product.title"
          :description="product.description"
          orientation="vertical"
          spotlight
          spotlight-color="primary"
          class="md:w-[25%] lg:w-[20%]"
          :ui="{ footer: 'w-full' }"
          reverse
        >
          <template #default>
            <NuxtImg
              :src="product.image ? getImg(product.image) : ''"
              :alt="product.title"
              class="w-full"
            />
          </template>
          <template #footer>
            <UButtonGroup class="w-full">
              <UButton
                block
                color="neutral"
                icon="i-heroicons-pencil-square-16-solid"
                :loading="product_to_delete === product.id"
                @click="
                  () => {
                    slideover_edit.open({
                      product: product,
                      onClose: slideover_edit.close,
                    });
                  }
                "
              />
              <UButton
                block
                color="error"
                icon="i-heroicons-trash-16-solid"
                :loading="product_to_delete === product.id"
                @click="
                  () => {
                    deleteProduct(product.id);
                  }
                "
              />
            </UButtonGroup>
          </template>
        </UPageCard>
      </div>
      <div
        v-else
        class="w-auto mx-auto max-w-xs flex flex-col gap-5 justify-content-center"
      >
        <NuxtImg src="/empty.png" />
        <span class="mx-auto font-bold text-xl">No Product </span>
        <UButton
          class="mx-auto"
          label="Add Product"
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
      </div>
    </template>
  </UDashboardPanel>
</template>
