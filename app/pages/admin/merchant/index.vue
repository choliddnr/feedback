<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { boolean } from "zod";
import type { Merchant } from "~~/shared/types";
import { useMerchantStore } from "../../../stores/merchant";
const { $pb } = useNuxtApp();
const { merchants } = storeToRefs(useMerchantStore());

definePageMeta({
  layout: "dashboard",
});

// console.log(merchants.value);
</script>

<template>
  <!-- <pre>{{ merchants }}</pre> -->
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Merchant">
        <template #right>
          <UButton
            label="New Item"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="navigateTo('/admin/merchant/add')"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent class="pb-24">
        <div v-for="merchant in merchants">
          <UDashboardSection
            class="mt-4"
            :title="merchant.title"
            :description="merchant.description"
          >
            <template #links>
              <UButton
                label="Show"
                color="black"
                leading-icon="i-heroicons-eye"
                @click="navigateTo(`/admin/merchant/${merchant.id}`)"
              />
            </template>
            <template #icon>
              <UAvatar
                :src="$pb.files.getURL(merchant, merchant.logo!)"
                :alt="merchant.title"
                size="lg"
              />
            </template>
          </UDashboardSection>
          <UDivider />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
  <!-- ~/components/settings/DeleteAccountModal.vue -->
  <!-- <AdminUserDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
</template>
