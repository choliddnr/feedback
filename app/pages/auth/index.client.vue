<script setup lang="ts">
import type { User } from "#auth-utils";
import { useUserStore } from "../../stores/user";

const { user } = storeToRefs(useUserStore());
const { $pb } = useNuxtApp();

const { data } = await useAsyncData(async () => {
  // fetch and return all "example" records...
  const records = await $pb.collection("users").listAuthMethods();

  return structuredClone(records);
});

useSeoMeta({
  title: "Login",
});

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
];

const validate = (state: any) => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is required" });
  if (!state.password)
    errors.push({ path: "password", message: "Password is required" });
  return errors;
};
const providers = [
  {
    label: "Masuk dengan akun Google",
    icon: "i-simple-icons-google",
    color: "primary" as const,
    to: "/auth/google",
    external: true,
  },
];

function onSubmit(data: any) {
  console.log("Submitted", data);
}

// const methods = await;
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <!-- :fields="fields"
    :validate="validate" -->
    <UAuthForm
      :providers="providers"
      title="Selamat Datang"
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

      <template #>
        <pre>{{ data }}</pre>
      </template>
    </UAuthForm>
  </UCard>
</template>
