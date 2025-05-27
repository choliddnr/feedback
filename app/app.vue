<script setup lang="ts">
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());

if (
  merchants.value !== undefined &&
  active_merchant.value !== undefined &&
  merchants.value.length > 0
) {
  const index = merchants.value.findIndex(
    (m) => m.id === active_merchant.value
  );
  // const app_config = useAppConfig();
  // app_config.ui.colors.primary = merchants.value[index]!.primery_color
  //   ? merchants.value[index]!.primery_color
  //   : "blue";
  // console.log("appConfig", app_config, merchants.value[index]!.primery_color);
}

onMounted(() => {
  // const colormode = useColorMode();
  // colormode.preference = "light";
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
