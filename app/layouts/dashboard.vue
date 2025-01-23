<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();

const links = [
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
    to: "/admin/merchant",
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
  //   {
  //     id: "inbox",
  //     label: "Inbox",
  //     icon: "i-heroicons-inbox",
  //     to: "/inbox",
  //     badge: "4",
  //     tooltip: {
  //       text: "Inbox",
  //       shortcuts: ["G", "I"],
  //     },
  //   },
  //   {
  //     id: "users",
  //     label: "Users",
  //     icon: "i-heroicons-user-group",
  //     to: "/users",
  //     tooltip: {
  //       text: "Users",
  //       shortcuts: ["G", "U"],
  //     },
  //   },
  //   {
  //     id: "settings",
  //     label: "Settings",
  //     to: "/settings",
  //     icon: "i-heroicons-cog-8-tooth",
  //     children: [
  //       {
  //         label: "General",
  //         to: "/settings",
  //         exact: true,
  //       },
  //       {
  //         label: "Members",
  //         to: "/settings/members",
  //       },
  //       {
  //         label: "Notifications",
  //         to: "/settings/notifications",
  //       },
  //       {
  //         label: "Items",
  //         to: "/settings/items",
  //       },
  //     ],
  //     tooltip: {
  //       text: "Settings",
  //       shortcuts: ["G", "S"],
  //     },
  //   },
];

const footerLinks = [
  //   {
  //     label: "Invite people",
  //     icon: "i-heroicons-plus",
  //     to: "/settings/members",
  //   },
  {
    label: "Help & Support",
    icon: "i-heroicons-question-mark-circle",
    click: () => (isHelpSlideoverOpen.value = true),
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
  {
    key: "code",
    label: "Code",
    commands: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${
              route.path === "/" ? "/index" : route.path
            }.vue`,
            "_blank"
          );
        },
      },
    ],
  },
];

// const defaultColors = ref(
//   ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
//     label: color,
//     chip: color,
//     click: () => ((appConfig.ui as any).primary = color),
//   }))
// );
// const colors = computed(() =>
//   defaultColors.value.map((color) => ({
//     ...color,
//     active: (appConfig.ui as any).primary === color.label,
//   }))
// );
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <!-- <TeamsDropdown /> -->
          <MerchantDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <!-- <UDashboardSidebarLinks
          :links="[{ label: 'Colors', draggable: true, children: colors }]"
          @update:links="(colors) => (defaultColors = colors)"
        /> -->

        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>

  <UNotifications />
  <UModals />
  <USlideovers />
</template>
<style>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
