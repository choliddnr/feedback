<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

import { authClient } from "@/utils/client"; //import the auth client

const toast = useToast();

const fields = [
  {
    name: "name",
    type: "text" as const,
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "username",
    type: "text" as const,
    label: "Username",
    placeholder: "Username must be unique",
    required: true,
  },
  {
    name: "email",
    type: "text" as const,
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Enter your password",
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: async () => {
      const data = await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onResponse: () => {
            toast.add({ title: "Google", description: "Login with Google" });
            navigateTo("/admin");
          },
        }
      );
    },
  },
];

const schema = z.object({
  name: z.string().min(4),
  username: z.string().min(4),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  const session = authClient.useSession();

  const { data, error } = await authClient.signUp.email(
    {
      name: payload.data.name, // user display name
      username: payload.data.username,
      email: payload.data.email, // user email address
      password: payload.data.password, // user password -> min 8 characters by default
      // User image URL (optional)
      // callbackURL: "/admin", // A URL to redirect to after the user verifies their email (optional)
    },
    {
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
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        @submit="onSubmit"
      >
        <template #description>
          Have an account?
          <ULink to="/auth/signin" class="text-primary font-medium"
            >Sign in</ULink
          >.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
