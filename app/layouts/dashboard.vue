<script setup lang="ts">
const { fetch } = useUserStore();
callOnce("user", async () => await fetch());
const { user } = storeToRefs(useUserStore());

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const { products } = storeToRefs(useProductsStore());
const { questions } = storeToRefs(useQuestionsStore());

const { responses } = storeToRefs(useResponseStore());

const route = useRoute();
const toast = useToast();

const open = ref(false);

const links = computed(() => [
  [
    {
      id: "home",
      label: "Home",
      icon: "i-heroicons-home",
      to: "/admin",
      tooltip: {
        text: "Home",
        shortcuts: ["G", "H"],
      },
    },
    {
      id: "user",
      label: "User",
      icon: "i-heroicons-user",
      to: "/admin/user",
      tooltip: {
        text: "User",
        shortcuts: ["G", "U"],
      },
    },
    {
      id: "merchant",
      label: "Merchants",
      icon: "i-heroicons-building-storefront",
      to: "/admin/merchants",
      badge: merchants.value?.length,
      tooltip: {
        text: "Merchant",
        shortcuts: ["G", "M"],
      },
    },
    {
      id: "products",
      label: "Products",
      icon: "i-heroicons-cube-20-solid",
      to: "/admin/products",
      badge: products.value?.length,
      tooltip: {
        text: "Products",
        shortcuts: ["G", "P"],
      },
    },
    {
      id: "questions",
      label: "Questions",
      icon: "i-heroicons-question-mark-circle-16-solid",
      to: "/admin/questions",
      badge: questions.value.length,
      tooltip: {
        text: "Item",
        shortcuts: ["G", "Q"],
      },
    },
    {
      id: "responses",
      label: "Responses",
      icon: "i-heroicons-clipboard-document-list",
      to: "/admin/responses",
      badge: responses.value.length,
      tooltip: {
        text: "Item",
        shortcuts: ["G", "R"],
      },
    },
  ],
]);

if (!merchants.value) {
  if (route.path !== "/admin/merchants/add") navigateTo("/admin/merchants/add");
  const unwatch = watch(route, () => {
    if (merchants.value && merchants.value.length > 0) {
      unwatch();
      return;
    }
    if (route.path !== "/admin/merchants/add")
      navigateTo("/admin/merchants/add");
  });
}
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      toggle-side="right"
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <AdminMerchantOptions :collapsed="collapsed" />
      </template>
      <template #default="{ collapsed }">
        <UDashboardSearchButton
          v-if="false"
          :collapsed="collapsed"
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>
      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
