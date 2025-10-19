<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

import { authClient } from "@/utils/client"; // import the auth client

const toast = useToast();

const fields = [
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
      // const _data = await authClient.signIn.social(
      //   {
      //     provider: "google",
      //   },
      //   {
      //     onSuccess: () => {
      //       toast.add({ title: "Google", description: "Login with Google" });
      //       navigateTo("/admin");
      //     },
      //     onError: (ctx) => {
      //       console.log("ctx", ctx);

      //       toast.add({
      //         title: "Google",
      //         description: ctx.error.message,
      //         color: "error",
      //       });
      //     },
      //   }
      // );
      try {
        await authClient.signIn.social(
          {
            /**
             * The social provider ID
             * @example "github", "google", "apple"
             */
            provider: "google",
            /**
             * A URL to redirect after the user authenticates with the provider
             * @default "/"
             */
            callbackURL: "/admin",
            /**
             * A URL to redirect if an error occurs during the sign in process
             */
            errorCallbackURL: "/error",
            /**
             * A URL to redirect if the user is newly registered
             */
            newUserCallbackURL: "/welcome",
            /**
             * disable the automatic redirect to the provider.
             * @default false
             */
            // disableRedirect: true,
          },
          {
            // callbacks

            onRequest: (_ctx) => {
              // show loading
              console.log("on request", _ctx);
            },
            onSuccess: (_ctx) => {
              // redirect to the dashboard or sign in page
              //
              console.log("on Success", _ctx);
            },
            onError: (ctx) => {
              // display the error message
              alert(ctx.error.message);
            },
            onFinally: (_ctx: any) => {
              // hide loading
              console.log("finally", _ctx);
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  remember: z.boolean(),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  await authClient.signIn.email(
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
      callbackURL: "/admin",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: payload.data.remember,
    },
    {
      // callbacks

      onRequest: (_ctx) => {
        // show loading
      },
      onSuccess: (_ctx) => {
        // redirect to the dashboard or sign in page
        navigateTo("/admin");
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
      onFinally: (_ctx: any) => {
        // hide loading
        console.log("finally", _ctx);
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
