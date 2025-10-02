<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

import type { User } from "better-auth";
import z from "zod";
import { useUserStore } from "@/stores/user";
import {
  LazyAdminUserDeleteAccountModal,
  LazyAdminUserEditUserPicture,
} from "#components";
// const
definePageMeta({
  layout: "dashboard",
});
const { merchants, active_merchant } = storeToRefs(useMerchantsStore());

/**
 * Next:
 * 1.Form Validation
 */

// const { data: session } = await authClient.useSe
const { user } = storeToRefs(useUserStore());
const fileRef = ref<HTMLInputElement>();
const isEdit = ref<boolean>(false);
const imageBlob = ref<Blob>();
const formRef = useTemplateRef<HTMLFormElement>("formRef");

const state = reactive({
  name: user.value?.name as string,
  email: user.value?.email as string,
  username: user.value?.username as string,
  image: user.value?.image ? getImg(user.value?.image) : "",
  defaultMerchant: Number(user.value?.defaultMerchant) as number,
});

const schema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  username: z
    .string()
    .min(4)
    .refine((value) => /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/.test(value), {
      message:
        "username must be lowercase and can only contain letters, numbers, dot, and dashes.",
    })
    .refine(
      async (value) => {
        if (value === user.value.username) return true;
        const data = await $fetch<User>("/api/user/username/" + value);
        return !data;
      },
      {
        message: "username must be unique.",
      }
    ),
  defaultMerchant: z.number().gt(0, "select one of this merchents"),
});

const overlay = useOverlay();

const modal_edit_user = overlay.create(LazyAdminUserEditUserPicture);
const modal_delete_user = overlay.create(LazyAdminUserDeleteAccountModal);

const toast = useToast();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  modal_edit_user.open({
    image: URL.createObjectURL(input.files[0]!),
    "onUpdate:imageBlob": (value) => {
      imageBlob.value = value;
      state.image = URL.createObjectURL(value!);
      modal_edit_user.close();
    },
    onCancel: () => {
      state.image = user.value?.image || "";
      modal_edit_user.close();
    },
  });
};

const onFileClick = () => {
  fileRef.value?.click();
};

// const submit = () => formRef.value?.submit();W
const onSubmitting = ref<boolean>(false);
const onSubmit = async () => {
  onSubmitting.value = true;
  const formData = new FormData();
  if (state.username !== user.value.username)
    formData.append("username", state.username as string);

  if (state.name !== user.value.name)
    formData.append("name", state.name as string);
  if (state.defaultMerchant !== user.value.defaultMerchant)
    formData.append(
      "defaultMerchant",
      state.defaultMerchant?.toString() as string
    );

  if (imageBlob.value) {
    formData.append("image", imageBlob.value!);
  }
  await $fetch(`/api/user/${user.value?.id}`, {
    method: "PATCH" as any,
    body: formData,
    onResponse: async ({ response }) => {
      if (response.status === 200) {
        user.value = response._data.user;
        active_merchant.value = user.value?.defaultMerchant!;
        toast.add({
          title: "Profile updated",
          icon: "i-heroicons-check-circle",
        });
      }
    },
    onResponseError: ({ response }) => {
      if (response.status !== 200) {
        toast.add({
          description: response._data.statusMessage,
          title: "Failed!",
          icon: "i-heroicons-x-circle",
          color: "error",
        });
      }
    },
  });
  onSubmitting.value = false;
  isEdit.value = false;
};

/**
 * Delete Account
 */
const deleteAccount = () => {
  modal_delete_user.open({
    onCancel: () => modal_delete_user.close(),
  });
};
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar
        :title="user?.name || user?.username"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <Transition mode="out-in" name="slide-right">
            <div v-if="merchants?.length! > 0">
              <div v-if="isEdit" class="flex gap-1">
                <UButton
                  type="submit"
                  label="Save Changes"
                  color="neutral"
                  leading-icon="i-heroicons-document-check-16-solid"
                  :loading="onSubmitting"
                  @click="formRef!.submit"
                />
                <UButton
                  label="Cancel"
                  color="error"
                  leading-icon="i-heroicons-x-mark-16-solid"
                  @click="isEdit = false"
                />
              </div>
              <UButton
                v-else
                label="Edit Profile"
                color="neutral"
                leading-icon="i-heroicons-pencil-square-16-solid"
                @click="isEdit = true"
              />
            </div>
          </Transition>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- <UPageCard
        v-if="!merchants || merchants?.length === 0"
        :ui="{ root: 'mx-5 my-5 border-0' }"
        spotlight
        spotlight-color="warning"
        highlight
        highlight-color="warning"
      >
        <template #body>
          <h1>
            You don't have any merchant right now. Please create it at least 1
          </h1>
          <UButton
            label="Create Merchant"
            to="/admin/merchants/add"
            variant="outline"
            color="primary"
            size="xl"
          />
        </template>
      </UPageCard> -->
      <UForm ref="formRef" :state="state" :schema="schema" @submit="onSubmit">
        <UPageCard
          :variant="isEdit ? 'subtle' : 'outline'"
          title="Profile"
          description="Below is your account information"
        >
          <UFormField
            name="name"
            label="Name"
            description="A fullname or nickname is allowed. Choose which you feel comfortable."
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.name"
              autocomplete="off"
              icon="i-heroicons-user"
              size="md"
              :disabled="!isEdit"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="email"
            label="Email"
            description="Email is not changeable."
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
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="username"
            label="Username"
            description="Used by the system to recognise your account."
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
              :disabled="!isEdit"
              class="w-full"
            />
          </UFormField>

          <UFormField
            v-if="merchants?.length! > 0"
            name="defaultMerchant"
            label="Default Merchant"
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <USelectMenu
              v-model="state.defaultMerchant as number"
              class="w-full"
              :items="merchants"
              label-key="title"
              value-key="id"
              :disabled="!isEdit"
            />
          </UFormField>

          <UFormField
            name="avatar"
            label="Avatar"
            class="grid grid-cols-2 gap-2"
            help="choose any image you like."
            :ui="{
              container: 'flex flex-wrap items-center gap-3',
              help: 'mt-0',
            }"
          >
            <UAvatar
              :src="state.image || undefined"
              :alt="state.name"
              size="lg"
            />

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              :disabled="!isEdit"
              @click="onFileClick"
            />

            <input
              ref="fileRef"
              type="file"
              class="hidden"
              @change="onFileChange"
            />
            <!-- accept=".jpg, .jpeg, .png, .gif" -->
          </UFormField>
        </UPageCard>
      </UForm>

      <!-- <USeparator class="mb-4" v-if="false" />

      <UPageCard
        v-if="false"
        spotlight
        spotlight-color="error"
        title="Account"
        description="Tidak lagi membutuhkan layanan kami? Anda dapat menghapus akun anda disini. Aksi ini tidak dapat dibatalkan. Semua data yang berhubungan dengan akun ini akan dihapus secara permanen."
      >
        <div>
          <UButton
            color="error"
            label="Delete account"
            size="md"
            @click="deleteAccount"
          />
        </div>
      </UPageCard> -->
    </template>
  </UDashboardPanel>
</template>
