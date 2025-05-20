<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
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
const isAvatarChanged = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const imageBlob = ref<Blob>();
const formRef = useTemplateRef<HTMLFormElement>("formRef");

const state = reactive({
  name: user.value?.name as string,
  email: user.value?.email as string,
  username: user.value?.username as string,
  image: "/user_picture/" + user.value?.image,
  defaultMerchant: Number(user.value?.defaultMerchant) as number,
});
console.log("defaultMerchant", typeof user.value?.defaultMerchant);

const schema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  username: z.string().min(4),
  defaultMerchant: z.number().gt(0, "select one of this merchents"),
});

const overlay = useOverlay();

const modal_edit_user = overlay.create(LazyAdminUserEditUserPicture);
const modal_delete_user = overlay.create(LazyAdminUserDeleteAccountModal);

const toast = useToast();

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    console.log("returning ", input.files?.length);

    return;
  }

  isAvatarChanged.value = true;
  modal_edit_user.open({
    image: URL.createObjectURL(input.files[0]!),
    "onUpdate:imageBlob": (value) => {
      imageBlob.value = value;
      state.image = URL.createObjectURL(value!);
      modal_edit_user.close();
    },
    onCancel: () => {
      state.image = user.value?.image || "";
      isAvatarChanged.value = false;
      modal_edit_user.close();
    },
  });
};

const onFileClick = () => {
  fileRef.value?.click();
};

const submit = () => formRef.value?.submit();
const onSubmit = async () => {
  const formData = new FormData();
  formData.append("username", state.username as string);
  formData.append("name", state.name as string);
  formData.append(
    "defaultMerchant",
    state.defaultMerchant?.toString() as string
  );
  if (isAvatarChanged.value) {
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
        isEdit.value = false;
      }
    },
    onResponseError: ({ response }) => {
      if (response.status !== 200) {
        toast.add({
          description: response._data.statusMessage,
          title: "Gagal!",
          icon: "i-heroicons-x-circle",
          color: "warning",
        });
      }
    },
  });
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
      <UPageCard
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
      </UPageCard>
      <UForm :state="state" :schema="schema" @submit="onSubmit" ref="formRef">
        <UPageCard
          :variant="isEdit ? 'subtle' : 'outline'"
          title="Profile"
          description="Berikut ini adalah informasi mengenai diri anda. Silahkan dilengkapi."
        >
          <UFormField
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
              :disabled="!isEdit"
              class="w-full"
            />
          </UFormField>

          <UFormField
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
              class="w-full"
            />
          </UFormField>

          <UFormField
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
              :disabled="!isEdit"
              class="w-full"
            >
            </UInput>
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
              class="w-full"
              :items="merchants"
              v-model="(state.defaultMerchant as number)"
              label-key="title"
              value-key="id"
              :disabled="!isEdit"
            />
          </UFormField>

          <UFormField
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
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            />
          </UFormField>
        </UPageCard>
      </UForm>

      <USeparator class="mb-4" v-if="false" />

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
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
