<script setup lang="ts">
import { z } from "zod";
import { useStorage } from "@vueuse/core";
import type { Respondent } from "~~/shared/types";
const { merchant } = storeToRefs(useFeedbackStore());
const state = reactive<Partial<Respondent>>({
  name: undefined,
  gender: undefined,
  age: undefined,
  whatsapp: undefined,
});
const schema = z.object({
  name: z.string().min(5),
  gender: z.string(),
  age: z.number(),
  whatsapp: z
    .number()
    .min(8000000000, "minimal 10 angka dan diawali dengan angka 8."),
});

const { respondent } = storeToRefs(useFeedbackStore());

const onsubmit = () => {
  console.log(state);
  // useStorage("respondent", state);
  localStorage.setItem(
    `${merchant.value?.id}_respondent`,
    JSON.stringify(state)
  );
  respondent.value = {
    name: state.name || "",
    age: state.age || 0,
    gender: state.gender || "",
    whatsapp: state.whatsapp || 0,
  };
  useRouter().push(`/${merchant.value?.id}/products`);
};
onMounted(() => {
  if (import.meta.client) {
    if (localStorage.getItem(`${merchant.value?.id}_respondent`)) {
      respondent.value = JSON.parse(
        localStorage.getItem(`${merchant.value?.id}_respondent`)!
      );
    }
  }
  if (respondent.value) {
    state.name = respondent.value.name;
    state.gender = respondent.value.gender;
    state.age = respondent.value.age;
    state.whatsapp = respondent.value.whatsapp;
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
      <UFormGroup
        label="Nama:"
        size="xl"
        description="Bisa nama lengkap atau pangilan. Pilih apa yang membuat anda nyaman saja."
        :ui="{ wrapper: 'my-4' }"
        name="name"
      >
        <UInput v-model="state.name" placeholder="Isikan nama anda disini" />
      </UFormGroup>

      <UFormGroup
        label="Jenis Kelamin:"
        size="xl"
        :ui="{ wrapper: 'my-4' }"
        name="gender"
      >
        <USelect v-model="state.gender" :options="['Pria', 'wanita']" />
      </UFormGroup>

      <UFormGroup label="Umur:" size="xl" :ui="{ wrapper: 'my-4' }" name="age">
        <UInput
          v-model="state.age"
          type="number"
          placeholder="Isikan umur anda sekarang disini"
          :ui="{ trailing: { padding: { xl: 'pe-20' } } }"
        >
          <template #trailing>
            <UBadge>Tahun</UBadge>
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
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
          :ui="{ leading: { padding: { xl: 'ps-16' } } }"
        >
          <template #leading>
            <UBadge>+62</UBadge>
            <!-- <span class="text-gray-500 dark:text-gray-400 text-xs"
            >+62
          </span> -->
          </template>
        </UInput>
      </UFormGroup>
      <UButton type="submit" label="Selanjutnya" size="xl" block />
    </UForm>
  </UCard>
</template>
