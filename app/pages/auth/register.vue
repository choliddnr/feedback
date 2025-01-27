<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import type { User } from "#auth-utils";
import { userSchema } from "../../../shared/zod.schemas";

const user = useUserSession().user as ComputedRef<User | null>;
useSeoMeta({
  title: "Daftar",
});

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "Enter your email",
    readonly: true,
    value: user.value?.email,
  },
  {
    name: "name",
    label: "Nama Lengkap",
    type: "string",
    placeholder: "nama lengkap",
    value: user.value?.name,
  },
  {
    name: "username",
    label: "Username",
    type: "string",
    placeholder: "username",
    value: "",
  },
];

const validate = async (state: any): Promise<FormError[]> => {
  const errors = [] as FormError[];

  const result = await userSchema.spa({
    name: state.name,
    username: state.username,
  });
  if (!result.success) {
    for (let i = 0; i < result.error.errors.length; i++) {
      errors.push({
        path: (result.error.errors[i]?.path[0] as string) || "",
        message: result.error.errors[i]?.message || "",
      });
    }
  }
  return errors;
};

const onSubmit = async (state: any) => {
  const res = await $fetch("/api/user/register", {
    method: "POST",
    body: {
      name: state.name,
      username: state.username,
    },
    onResponse: ({ response }) => {
      if (response.status === 200) navigateTo("/admin");
    },
  });
};
</script>
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :validate="validate"
      :fields="fields"
      title="Sepertinya ini adalah kunjungan pertama anda. Silahkan lengkapi data diri anda."
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="onSubmit"
    >
      <template #icon>
        <UAvatar :src="user?.picture!" />
      </template>

      <template #footer>
        <div class="grid grid-cols-1 gap-4">
          <div>
            By signing in, you agree to our
            <NuxtLink to="/" class="text-primary font-medium"
              >Terms of Service</NuxtLink
            >.
          </div>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
