<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useFeedbackStore } from "../stores/feedback";

// const { merchantId } = storeToRefs(useFeedbackStore());
// console.log("merchant", merchantId.value);
const { data: url } = await useFetch<string>("/api/s3");

import { useUserStore } from "../stores/user";
const { user } = storeToRefs(useUserStore());

const fileRef = ref<HTMLInputElement>();

const toast = useToast();

const state = reactive({
  name: user.value?.name,
  email: user.value?.email,
  username: user.value?.username,
  picture: user.value?.picture,
});

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  state.picture = URL.createObjectURL(input.files[0]!);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  const formData = new FormData();
  formData.append("username", state.username as string);
  formData.append("name", state.name as string);
  formData.append("picture", fileRef.value!.files![0]!);
  console.log("formData", formData);

  await $fetch(`/api/user/${user.value?.id}`, {
    method: "PATCH",
    body: formData,
    onRequest: ({ options }: { options: any }) => {
      console.log("formData", formData, options);
    },
    onResponse: ({ response }: { response: any }) => {
      if (response.status === 200) {
        toast.add({
          title: "Profile updated",
          icon: "i-heroicons-check-circle",
        });
        console.log("response", response._data);
      }
    },
    onResponseError: ({ response }: { response: any }) => {
      if (response.status !== 200) {
        toast.add({
          description: response._data.statusMessage,
          title: "Gagal!",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    },
  });
}
</script>
<template>
  <div>
    <!-- <div class="grid grid-cols-2 gap-2">
      <h1>{{ "no merchant" }}</h1>
      <NuxtImg :src="url" alt="mC" />
    </div> -->
    <UDashboardPanelContent class="pb-24">
      <UForm :state="state" @submit="onSubmit">
        <UDashboardSection
          title="Profile"
          description="Berikut ini adalah informasi mengenai diri anda. Silahkan dilengkapi."
        >
          <template #links>
            <Transition mode="out-in" name="slide-right">
              <div class="flex gap-1">
                <UButton
                  type="submit"
                  label="Save Changes"
                  color="black"
                  leading-icon="i-heroicons-document-check-16-solid"
                />
              </div>
              <!-- @click="isEdit = !isEdit" -->
              <!-- @click="isEdit = true" -->
            </Transition>
          </template>
          <UFormGroup
            name="name"
            label="Name"
            description="Berisi nama panggilan atau nama lengkap. Pilih mana yang membuat anda nyaman."
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.name"
              autocomplete="off"
              icon="i-heroicons-user"
              size="md"
            />
          </UFormGroup>

          <UFormGroup
            name="email"
            label="Email"
            description="Email tidak dapat dirubah."
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="off"
              icon="i-heroicons-envelope"
              size="md"
              disabled
            />
          </UFormGroup>

          <UFormGroup
            name="username"
            label="Username"
            description="bagaimana sistem kami mengenali anda."
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.username"
              type="username"
              autocomplete="off"
              size="md"
              input-class="ps-[20px]"
            >
              <!-- <template #leading>
                  <span class="text-gray-500 dark:text-gray-400 text-sm"
                    >nuxt.com/</span
                  >
                </template> -->
            </UInput>
          </UFormGroup>

          <UFormGroup
            name="avatar"
            label="Avatar"
            class="grid grid-cols-2 gap-2"
            help="JPG, GIF or PNG. 1MB Max."
            :ui="{
              container: 'flex flex-wrap items-center gap-3',
              help: 'mt-0',
            }"
          >
            <UAvatar
              src="https://lh3.googleusercontent.com/a/ACg8ocKRch5RTWqZKY9lpuOkPbE8YGoemArMKztdZJLXer-tVc-kCVeE=s96-c"
              :alt="state.name"
              size="lg"
            />

            <UButton
              label="Choose"
              color="white"
              size="md"
              @click="onFileClick"
            />

            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            />
          </UFormGroup>
        </UDashboardSection>
      </UForm>

      <UDivider class="mb-4" />

      <!-- ~/components/settings/DeleteAccountModal.vue -->
    </UDashboardPanelContent>
  </div>
</template>
<style scoped>
#cropperCanvas {
  :deep(cropper-canvas) {
    height: 300px;
    width: 300px;
  }
}
</style>
