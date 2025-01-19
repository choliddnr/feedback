<script setup lang="ts">
const appConfig = useAppConfig();
const route = useRoute();
const router = useRouter();
import { useMerchantStore } from "../../stores/merchant";
const { merchant } = storeToRefs(useMerchantStore());
// await useFetch(`collections/merchant/records/${route.params.merchant}`, {
//   baseURL: pbApi,
//   query: { expand: "greeting" },
//   onResponse: ({ response }) => {
//     merchant.value = {
//       id: response._data.id,
//       title: response._data.title,
//       description: response._data.description,
//       category: response._data.category,
//       greeting: {
//         id: response._data.expand.greeting.id,
//         text: response._data.expand.greeting.text,
//         title: response._data.expand.greeting.title,
//         btn_label: response._data.expand.greeting.btn_label,
//       },
//       primary_color: response._data.primary_color,
//       image_background: response._data.image_background,
//     };
//     console.log(merchant.value);
//     appConfig.ui.primary = merchant.value!.primary_color;
//     appConfig.background_image_url = `${pbApi}/api/files/merchant/${
//       merchant.value!.id
//     }/${merchant.value!.image_background}`;
//   },
// });
</script>
<template>
  <ClientOnly>
    <UCard>
      <article class="text-wrap text-xl text-center items-center">
        <p class="font-bold">
          {{ merchant?.expand?.greeting.title }}
        </p>
        <UDivider class="mb-4 mt-2" />
        <p>
          {{ merchant?.expand?.greeting.text }}
          <br />
        </p>
        <UButton
          class="mt-5"
          :ui="{ block: 'w-20' }"
          size="xl"
          :label="merchant?.expand?.greeting.btn_label"
          @click="router.push(`/${route.params.merchant}/respondent`)"
        />
      </article>
    </UCard>
  </ClientOnly>
</template>
