<script setup lang="ts">
const { merchants } = storeToRefs(useMerchantsStore());
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <UDashboardPanel id="admin_merchant" resizable>
    <template #header>
      <UDashboardNavbar title="Merchant" :ui="{ right: 'gap-4' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="New Merchant"
            trailing-icon="i-heroicons-plus"
            color="neutral"
            @click="navigateTo('/admin/merchants/add')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-row gap-3">
        <UPageCard
          v-for="merchant in merchants"
          :title="merchant.title"
          :description="merchant.description!"
          :to="`/admin/merchants/${merchant.id}`"
          orientation="vertical"
          spotlight
          spotlight-color="primary"
          class="w-[25%]"
          reverse
        >
          <template #default>
            <NuxtImg
              :src="merchant.logo ? getImg(merchant.logo) : ''"
              :alt="merchant.title"
              class="w-full"
            />
          </template>
        </UPageCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
