<script setup lang="ts">
import type { ButtonProps, FormSubmitEvent } from "@nuxt/ui";

import { authClient } from "@/utils/client"; // import the auth client

const toast = useToast();

const providers = ref<ButtonProps[]>([
  {
    label: "Google",
    icon: "i-simple-icons-google",
    color: "success",
    block: true,
    variant: "solid",
    onClick: async () => {
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
            newUserCallbackURL: "/admin/merchants/add",
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
              toast.add({
                title: "Google",
                description: "Sign on with Google succeeds",
                color: "success",
              });
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
]);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 p-4 h-screen my-auto"
  >
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        description="Use your google account to sign in."
        title="Sign-On"
        icon="i-lucide-user"
        :providers="providers"
      >
      </UAuthForm>
    </UPageCard>
  </div>
</template>
