<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import type { User } from "#auth-utils";
import { object, string, ZodError } from "zod";
import { users, eq } from "../../../shared/db.schema";

const user = useUserSession().user as ComputedRef<User | null>;
useSeoMeta({
  title: "Daftar",
});
const isUsernameUnique = async (username: string): Promise<boolean> => {
  const data = await $fetch<User[]>("/api/user/getOne", {
    query: { k: "username", v: username },
  });
  return data.length === 0;
};

const schema = object({
  name: string().min(4),
  username: string()
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        "Username hanya boleh berupa huruf, angka, garis bawah dan titik.",
    })
    .min(3, { message: "minimal 3 karakter" })
    .max(30, { message: "maksimal 30 karakter" })
    .refine(async (username) => await isUsernameUnique(username), {
      message: "username sudah digunakan.",
    }),
});
const nameSchema = string().min(4);

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

  const result = await schema.spa({
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
      <!-- <template #description>
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary font-medium"
          >Sign up</NuxtLink
        >.
      </template> -->

      <!-- <template #password-hint>
        <NuxtLink to="/" class="text-primary font-medium"
          >Forgot password?</NuxtLink
        >
      </template> -->

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
