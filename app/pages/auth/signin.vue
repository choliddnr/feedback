<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

import { authClient } from "@/utils/client"; //import the auth client

const toast = useToast();

const fields = [
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Enter your email",
    required: true,
    defaultValue: "cholid.dnr@gmail.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Enter your password",
    defaultValue: "Password123",
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox" as const,
    defaultValue: false,
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: async () => {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      toast.add({ title: "Google", description: "Login with Google" });
    },
  },
];

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  remember: z.boolean(),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  const { data, error } = await authClient.signIn.email(
    {
      /**
       * The user email
       */
      email: payload.data.email,
      /**
       * The user password
       */
      password: payload.data.password,
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: payload.data.remember,
    },
    {
      //callbacks

      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        navigateTo("/admin");
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    }
  );
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 p-4 h-screen my-auto"
  >
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      >
        <template #description>
          Don't have an account?
          <ULink to="/auth/signup" class="text-primary font-medium"
            >Sign up</ULink
          >.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
