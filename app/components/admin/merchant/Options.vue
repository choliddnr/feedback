<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Merchant } from "~~/shared/types";
defineProps<{
  collapsed?: boolean;
}>();

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
// if (merchants.value === undefined) {
//   const { fetch } = useMerchantsStore();
//   await fetch();
//   console.log("fetch merchants", merchants.value);
// }
const merchant_list = computed<DropdownMenuItem[]>(() => {
  const items = [] as DropdownMenuItem[];
  merchants.value?.forEach((m) => {
    items.push({
      label: m.title,
      avatar: {
        src: m.logo ? getImg(m.logo) : "",
        alt: m.title,
      },
      onSelect: () => (active_merchant.value = m.id),
    });
  });
  return items;
});

const selected_merchant = computed<Merchant | undefined>(() => {
  if (merchants.value === undefined) return undefined;
  if (active_merchant.value === undefined) return undefined;
  if (merchants.value.length === 0) return undefined;
  return merchants.value!.find((m) => m.id === active_merchant.value);
});

const items = ref([
  [
    {
      label: "Benjamin",
      avatar: {
        src: "https://github.com/benjamincanac.png",
      },
      type: "label",
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
    },
    {
      label: "Billing",
      icon: "i-lucide-credit-card",
    },
    {
      label: "Settings",
      icon: "i-lucide-cog",
      kbds: [","],
    },
    {
      label: "Keyboard shortcuts",
      icon: "i-lucide-monitor",
    },
  ],
  [
    {
      label: "Team",
      icon: "i-lucide-users",
    },
    {
      label: "Invite users",
      icon: "i-lucide-user-plus",
      children: [
        [
          {
            label: "Email",
            icon: "i-lucide-mail",
          },
          {
            label: "Message",
            icon: "i-lucide-message-square",
          },
        ],
        [
          {
            label: "More",
            icon: "i-lucide-circle-plus",
          },
        ],
      ],
    },
    {
      label: "New team",
      icon: "i-lucide-plus",
      kbds: ["meta", "n"],
    },
  ],
  [
    {
      label: "GitHub",
      icon: "i-simple-icons-github",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
    {
      label: "Support",
      icon: "i-lucide-life-buoy",
      to: "/docs/components/dropdown-menu",
    },
    {
      label: "API",
      icon: "i-lucide-cloud",
      disabled: true,
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      kbds: ["shift", "meta", "q"],
    },
  ],
]);
</script>

<!-- //"merchant_list && merchant_list.length > 0" -->
<template>
  <UDropdownMenu
    v-if="merchant_list && merchant_list.length > 0"
    :items="merchant_list"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      :trailingIcon="collapsed ? undefined : 'i-lucide-chevrons-up-down'"
      :label="collapsed ? undefined : selected_merchant?.title"
      color="neutral"
      variant="ghost"
      :avatar="{
        src: selected_merchant?.logo ? getImg(selected_merchant?.logo) : '',
      }"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
  </UDropdownMenu>
</template>
