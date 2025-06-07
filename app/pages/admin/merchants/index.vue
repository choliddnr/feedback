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
      <div class="flex flex-row gap-3" v-if="merchants && merchants.length > 0">
        <UPageCard
          v-for="merchant in merchants"
          :title="merchant.title"
          :description="merchant.description!"
          :to="`/admin/merchants/${merchant.id}`"
          orientation="horizontal"
          spotlight
          spotlight-color="primary"
          class="w-full xl:w-[50%] max-h-96"
          reverse
        >
          <!-- class="md:w-[25%] lg:w-[20%]" -->
          <template #default>
            <NuxtImg
              :src="merchant.logo ? getImg(merchant.logo) : ''"
              :alt="merchant.title"
              class="h-auto"
            />
          </template>
        </UPageCard>
      </div>
      <div class="w-auto mx-auto max-w-xs flex flex-col gap-5" v-else>
        <NuxtImg src="/empty.png" />
        <span class="mx-auto font-bold text-xl">No Merchant </span>
        <UButton
          label="Create Merchant"
          trailing-icon="i-heroicons-plus"
          color="neutral"
          @click="navigateTo('/admin/merchants/add')"
          class="mx-auto"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
