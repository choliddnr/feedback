<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { responses } from "~~/shared/db.schema";
import { useUserStore } from "../../stores/user";

const { user } = storeToRefs(useUserStore());
definePageMeta({
  layout: "dashboard",
});

const fileRef = ref<HTMLInputElement>();
const isAvatarChanged = ref<boolean>(false);
const isDeleteAccountModalOpen = ref(false);
const isEdit = ref<boolean>(false);

const state = reactive({
  name: user.value?.name,
  email: user.value?.email,
  username: user.value?.username,
  picture: user.value?.picture,
});
console.log("state", state);

const toast = useToast();

function validate(state: any): FormError[] {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter your name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter your email." });
  if (
    (state.password_current && !state.password_new) ||
    (!state.password_current && state.password_new)
  )
    errors.push({
      path: "password",
      message: "Please enter a valid password.",
    });
  return errors;
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  state.picture = URL.createObjectURL(input.files[0]!);
  isAvatarChanged.value = true;
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  const formData = new FormData();
  formData.append("username", state.username as string);
  formData.append("name", state.name as string);
  if (isAvatarChanged.value) {
    formData.append("picture", fileRef.value!.files![0]!);
  }
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

        isEdit.value = false;
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

// if (avatarBlob.value) {
//   state.avatar = avatarBlob.value;
// } else {
//   const unwatch = watch(avatarBlob, () => {
//     if (avatarBlob.value) {
//       state.avatar = avatarBlob.value;
//       unwatch();
//     }
//   });
// }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="user.name || user?.username" />

      <!-- <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar> -->

      <UDashboardPanelContent class="pb-24">
        <UForm
          :state="state"
          :validate="validate"
          :validate-on="['submit']"
          @submit="onSubmit"
        >
          <UDashboardSection
            title="Profile"
            description="Berikut ini adalah informasi mengenai diri anda. Silahkan dilengkapi."
          >
            <template #links>
              <Transition mode="out-in" name="slide-right">
                <div v-if="isEdit" class="flex gap-1">
                  <UButton
                    type="submit"
                    label="Save Changes"
                    color="black"
                    leading-icon="i-heroicons-document-check-16-solid"
                  />
                  <UButton
                    label="Cancel"
                    color="red"
                    leading-icon="i-heroicons-x-mark-16-solid"
                    @click="isEdit = false"
                  />
                </div>
                <!-- @click="isEdit = !isEdit" -->
                <UButton
                  v-else
                  label="Edit Profile"
                  color="black"
                  leading-icon="i-heroicons-pencil-square-16-solid"
                  @click="isEdit = true"
                />
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
                :disabled="!isEdit"
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
                :disabled="!isEdit"
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
            </UFormGroup>
          </UDashboardSection>
        </UForm>

        <UDivider class="mb-4" />

        <UDashboardSection
          title="Account"
          description="Tidak lagi membutuhkan layanan kami? Anda dapat menghapus akun anda disini. Aksi ini tidak dapat dibatalkan. Semua data yang berhubungan dengan akun ini akan dihapus secara permanen."
        >
          <div>
            <UButton
              color="red"
              label="Delete account"
              size="md"
              @click="isDeleteAccountModalOpen = true"
            />
          </div>
        </UDashboardSection>

        <!-- ~/components/settings/DeleteAccountModal.vue -->
        <AdminUserDeleteAccountModal v-model="isDeleteAccountModalOpen" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
