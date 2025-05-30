<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Merchant } from "~~/shared/types";
defineProps<{
  collapsed?: boolean;
}>();

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
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
</script>

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
      v-bind="{
        ...merchants,
        label: collapsed ? undefined : selected_merchant?.title,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
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
