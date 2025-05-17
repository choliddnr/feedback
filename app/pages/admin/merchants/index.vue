<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { boolean } from "zod";
import type { Merchant } from "~~/shared/types";

const { merchants } = storeToRefs(useMerchantsStore());

definePageMeta({
  layout: "dashboard",
});

// console.log(merchants.value);

const test = async () => {
  const data = await $fetch("/api/merchants");
  // console.log("res", data);
};
</script>

<template>
  <UDashboardPanel id="admin_merchant" resizable>
    <!-- <UDashboardNavbar title="Merchant">
      <template #right>
        <UButton
          label="New Item"
          trailing-icon="i-heroicons-plus"
          color="neutral"
          @click="navigateTo('/admin/merchants/add')"
        />
      </template>
    </UDashboardNavbar> -->
    <template #header>
      <UDashboardNavbar title="Merchant">
        <template #right>
          <UButton
            label="New Item"
            trailing-icon="i-heroicons-plus"
            color="neutral"
            @click="navigateTo('/admin/merchants/add')"
          />
          <UButton
            label="Test "
            trailing-icon="i-heroicons-plus"
            color="primary"
            @click="test"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!--  -->
      <!-- :title="merchant.title"
          :description="merchant.description" -->
      <div class="flex flex-row gap-3">
        <UPageCard
          v-for="merchant in merchants"
          :title="merchant.title"
          :description="merchant.description"
          :to="`/admin/merchants/${merchant.id}`"
          orientation="vertical"
          spotlight
          spotlight-color="primary"
          class="w-[25%]"
          reverse
        >
          <template #default>
            <NuxtImg
              :src="`/merchant/logo/` + merchant.logo"
              :alt="merchant.title"
              class="w-full"
            />
          </template>
        </UPageCard>
      </div>
      <!-- <UPageCard
        class="mt-4"
        v-for="merchant in merchants"
        :title="merchant.title"
      >
        <template #body>
          <UButton
            label="Show"
            color="neutral"
            leading-icon="i-heroicons-eye"
            @click="navigateTo(`/admin/merchants/${merchant.id}`)"
          />
        </template>
        <template #header>
          <NuxtImg
            :src="`/merchant/logo/` + merchant.logo"
            :alt="merchant.title"
          />
        </template>
      </UPageCard> -->
      <USeparator />
    </template>
    <!-- <h1>panel body</h1> -->
  </UDashboardPanel>
</template>
<!-- <pre>{{ merchants }}</pre> -->

<!-- <UDashboardPanel resizable>
    <UDashboardNavbar title="Merchant">
      <template #right>
        <UButton
          label="New Item"
          trailing-icon="i-heroicons-plus"
          color="neutral"
          @click="navigateTo('/admin/merchants/add')"
        />
      </template>
    </UDashboardNavbar>

    <template #body> -->
<!-- v-for="merchant in merchants" -->
<!-- :title="merchant.title"
          :description="merchant.description" -->
<!-- <UPageCard class="mt-4">
          <template #body>
            <UButton
              label="Show"
              color="neutral"
              leading-icon="i-heroicons-eye"
            /> -->
<!-- @click="navigateTo(`/admin/merchants/${merchant.id}`)" -->
<!-- </template>
            <template #icon>
              <UAvatar
                :src="$pb.files.getURL(merchant, merchant.logo!)"
                :alt="merchant.title"
                size="lg"
              /> -->
<!-- </template>
        </UPageCard>
        <USeparator />
    <template>
  </UDashboardPanel> -->

<!-- ~/components/settings/DeleteAccountModal.vue -->
<!-- <AdminUserDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
