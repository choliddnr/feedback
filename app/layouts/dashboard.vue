<script setup lang="ts">
const { user } = storeToRefs(useUserStore());
const { fetch } = useUserStore();
callOnce("user", async () => await fetch());

const route = useRoute();
const toast = useToast();

const open = ref(false);

const links = [
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
      label: "Pengguna",
      icon: "i-heroicons-user",
      to: "/admin/user",
      tooltip: {
        text: "User",
        shortcuts: ["G", "U"],
      },
    },
    {
      id: "merchant",
      label: "Merchant",
      icon: "i-heroicons-building-storefront",
      to: "/admin/merchants",
      // badge: "4",
      tooltip: {
        text: "Merchant",
        shortcuts: ["G", "M"],
      },
    },
    {
      id: "products",
      label: "Produk",
      icon: "i-heroicons-cube-20-solid",
      to: "/admin/products",
      badge: "4",
      tooltip: {
        text: "Products",
        shortcuts: ["G", "P"],
      },
    },
    {
      id: "questions",
      label: "Pertanyaan",
      icon: "i-heroicons-question-mark-circle-16-solid",
      to: "/admin/questions",
      tooltip: {
        text: "Item",
        shortcuts: ["G", "Q"],
      },
    },
  ],
  [
    {
      label: "Feedback",
      icon: "i-lucide-message-circle",
      to: "https://github.com/nuxt-ui-pro/dashboard",
      target: "_blank",
    },
    {
      label: "Help & Support",
      icon: "i-lucide-info",
      to: "https://github.com/nuxt/ui-pro",
      target: "_blank",
    },
  ],
];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.flat(),
  },
  {
    id: "code",
    label: "Code",
    items: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${
          route.path === "/" ? "/index" : route.path
        }.vue`,
        target: "_blank",
      },
    ],
  },
]);

onMounted(async () => {
  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") {
    return;
  }

  toast.add({
    title:
      "We use first-party cookies to enhance your experience on our website.",
    duration: 0,
    close: false,
    actions: [
      {
        label: "Accept",
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
      {
        label: "Opt out",
        color: "neutral",
        variant: "ghost",
      },
    ],
  });
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
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

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
