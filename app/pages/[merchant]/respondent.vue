<script setup lang="ts">
/**
 * This file represents a Vue.js page component for the respondent view of a specific merchant.
 *
 *
 * Description:
 * - The `[merchant]` in the filepath indicates a dynamic route parameter, allowing this page to
 *   handle different merchants dynamically.
 * - This component is likely used to display or manage feedback respondents for a specific merchant.
 *
 * Usage:
 * - This page is part of a Nuxt.js application, where dynamic routes are automatically generated
 *   based on the file structure.
 * - Access this page by navigating to `/feedback/app/pages/{merchant}/respondent` where `{merchant}`
 *   is replaced with the merchant's identifier.
 *
 * Notes:
 * - Ensure that the dynamic route parameter `[merchant]` is properly handled in the component logic.
 * - Additional functionality or data-fetching logic may be implemented to support the respondent view.
 */

import { z } from "zod";
import { useStorage } from "@vueuse/core";
import type { RespondentForm } from "~~/shared/types";

const state = reactive<RespondentForm>({
  name: "",
  gender: "female",
  age: 20,
  whatsapp: 8,
});
const schema = z.object({
  name: z.string().min(5),
  gender: z.string(),
  age: z.number().gt(14).lt(90),
  whatsapp: z
    .number()
    .min(8000000000, "minimal 10 angka dan diawali dengan angka 8.")
    .optional(),
});

const { merchant, respondent } = storeToRefs(useResponseStore());

const onsubmit = () => {
  useStorage("respondent", state);
  localStorage.setItem(
    `${merchant.value?.id}_respondent`,
    JSON.stringify(state)
  );
  respondent.value = {
    name: state.name || "",
    age: state.age || 20,
    gender: state.gender || "female",
    whatsapp: state.whatsapp || 0,
  };
  navigateTo(`/${merchant.value?.slug}/products`);
};
onMounted(() => {
  /**
   * logic state
   * 1. make sure this code only run on client side
   * 2. watch for merchant store, if merchant store is not null, then check localStorage for respondent data
   * 3. if localStorage has respondent data, then set state with that data
   * 4. if state has data, then set the state to the form fields
   * 5. unwatch the merchant store
   * 6. this code will only run once when the component is mounted
   * 7. this code will not run on server side
   * 8. this code will not run on client side if the merchant store is not set
   */
  if (import.meta.client) {
    const unwatch = watch(merchant, () => {
      if (!merchant.value) return;
      const localRespondent = localStorage.getItem(
        `${merchant.value?.id}_respondent`
      );
      console.log("localRespondent", merchant.value, localRespondent);
      if (localRespondent) {
        respondent.value = JSON.parse(localRespondent);
      }
      if (respondent.value) {
        state.name = respondent.value.name;
        state.gender = respondent.value.gender;
        state.age = respondent.value.age;
        state.whatsapp = respondent.value.whatsapp as number;
      }
      unwatch();
    });
  }
});
</script>
<template>
  <UCard class="max-w-lg">
    <div class="justify-center text-center">
      <span class="font-bold text-2xl mb-4"
        >Sebelum melanjutkan, mohon isi data diri anda pada form dibawah</span
      >
    </div>

    <UForm :state="state" :schema="schema" @submit="onsubmit">
      <UFormField
        label="Nama:"
        size="xl"
        description="Bisa nama lengkap atau pangilan. Pilih apa yang membuat anda nyaman saja."
        :ui="{ wrapper: 'my-4' }"
        name="name"
      >
        <UInput
          v-model="state.name"
          placeholder="Isikan nama anda disini"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Jenis Kelamin:"
        size="xl"
        :ui="{ wrapper: 'my-4' }"
        name="gender"
      >
        <USelect
          v-model="state.gender"
          :items="['female', 'male']"
          default-value="female"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Umur:" size="xl" :ui="{ wrapper: 'my-4' }" name="age">
        <UInput
          v-model="state.age"
          type="number"
          placeholder="Isikan umur anda sekarang disini"
          :ui="{ base: 'pr-24' }"
          class="w-full"
        >
          <template #trailing>
            <UBadge>Tahun</UBadge>
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Whatsapp:"
        description="kode voucher diskon akan dikirimkan ke nomer whatsapp ini."
        size="xl"
        :ui="{ wrapper: 'my-4' }"
        name="whatsapp"
      >
        <UInput
          v-model="state.whatsapp"
          placeholder="Isikan nama anda disini"
          type="number"
          :ui="{ base: 'pl-15', leading: 'ml-0' }"
          class="w-full"
        >
          <template #leading>
            <UBadge>+62</UBadge>
          </template>
        </UInput>
      </UFormField>
      <UButton class="mt-5" type="submit" label="Selanjutnya" size="xl" block />
    </UForm>
  </UCard>
</template>
