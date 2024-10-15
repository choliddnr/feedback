<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
const colors = [...useAppConfig().primary_color];
const merchantId = useRoute().params.id as string;
const { $pb } = useNuxtApp();
const { user, avatarBlob } = storeToRefs(useUserStore());
const { merchants } = storeToRefs(useMerchantStore());
const merchant = computed(() => {
  if (!merchants.value) return;
  for (let i = 0, len = merchants.value.length; i < len; i++) {
    if (merchants.value[i]?.id === merchantId) return merchants.value[i];
  }
});
definePageMeta({
  layout: "dashboard",
});

import { z } from "zod";
import type { ImageError, Merchant } from "~/types";
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpeg", "image/png"];

const logoError = ref<ImageError>({
  isError: false,
  message: "",
});

const backgroudImageError = ref<ImageError>({
  isError: false,
  message: "",
});

const schema = z.object({
  title: z.string().min(4),
  description: z.string().min(5),
  category: z.string(),
  primary_color: z.string(),
});

const imageSchema = z
  .instanceof(Blob)
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Invalid file type. Only JPEG and PNG files are allowed.",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size should be less than 2MB.",
  });

type Schema = z.output<typeof schema>;
const state = reactive({
  title: "",
  description: "",
  category: "",
  primary_color: "",
  image_background: "",
  logo: "",
});

const initState = () => {
  if (!merchant.value) return;
  state.title = merchant.value!.title;
  state.description = merchant.value!.description;
  state.category = merchant.value!.category;
  state.primary_color = merchant.value!.primary_color;
  state.image_background = $pb.files.getUrl(
    merchant.value!,
    merchant.value!.image_background
  );
  state.logo = $pb.files.getUrl(merchant.value!, merchant.value!.logo);
};

if (merchant.value) {
  initState();
} else {
  const unwatch = watch(merchant, () => {
    if (merchant.value) {
      initState();
      unwatch;
    }
  });
}

const logoRef = ref<HTMLInputElement>();
const imageBackgroundRef = ref<HTMLInputElement>();
// const isAvatarChanged = ref<boolean>(false);
// const isDeleteAccountModalOpen = ref(false);
const isEdit = ref<boolean>(false);

const toast = useToast();

const changeLogo = (e: Event) => {
  logoRef.value!.click();
};
const changeImageBackground = (e: Event) => {
  console.log();

  imageBackgroundRef.value!.click();
};

const onLogoChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  console.log("input", input);

  if (!input.files?.length) return;
  const res = imageSchema.safeParse(input.files[0]);
  if (!res.success) {
    logoError.value = {
      isError: !res.success,
      message: res.error.errors[0]?.message!,
    };
  } else {
    state.logo = URL.createObjectURL(input.files[0]!);
    logoError.value = {
      isError: !res.success,
      message: "",
    };
  }
};

const onImageBackgroundChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  const res = imageSchema.safeParse(input.files[0]);
  if (!res.success) {
    backgroudImageError.value = {
      isError: !res.success,
      message: res.error.errors[0]?.message!,
    };
  } else {
    state.image_background = URL.createObjectURL(input.files[0]!);
    backgroudImageError.value = {
      isError: !res.success,
      message: "",
    };
  }
};
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const formData = new FormData();
  formData.append("title", state.title);
  formData.append("description", state.description);
  formData.append("category", state.category);
  formData.append("primary_color", state.primary_color);
  if (logoRef.value!.files?.length! > 0) {
    formData.append("logo", logoRef.value!.files![0]!);
  }
  if (imageBackgroundRef.value!.files?.length! > 0) {
    formData.append("image_background", imageBackgroundRef.value!.files![0]!);
  }
  const newMerchantData = await $pb
    .collection("merchant")
    .update(merchant.value!.id, formData);
  for (let i = 0, len = merchants.value?.length || 0; i < len; i++) {
    if (merchants.value![i]?.id === merchant.value?.id) {
      merchants.value?.splice(i, 1);
      merchants.value?.push(newMerchantData as unknown as Merchant);
      break;
    }
  }
  toast.add({ title: "Merchant updated", icon: "i-heroicons-check-circle" });
  isEdit.value = false;
};
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="user.name || user.username" />

      <!-- <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar> -->

      <UDashboardPanelContent class="pb-24">
        <!-- :validate="validate" -->
        <UForm :state="state" :schema="schema" @submit="onSubmit">
          <UDashboardSection
            :title="merchant?.title"
            :description="merchant?.description"
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
                <UButton
                  v-else
                  label="Edit Profile"
                  color="black"
                  leading-icon="i-heroicons-pencil-square-16-solid"
                  @click="isEdit = true"
                />
              </Transition>
            </template>

            <UFormGroup
              name="title"
              label="Nama"
              required
              class="grid grid-cols-2 gap-2 items-center"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.title"
                autocomplete="off"
                size="md"
                :disabled="!isEdit"
              />
            </UFormGroup>

            <UFormGroup
              name="description"
              label="Deskripsi"
              description="Deskripsikan mengenai merchant anda"
              required
              class="grid grid-cols-2 gap-2"
              :ui="{ container: '' }"
            >
              <UTextarea
                v-model="state.description"
                autocomplete="off"
                size="md"
                :disabled="!isEdit"
              />
            </UFormGroup>

            <UFormGroup
              name="category"
              label="Kategori"
              description="Apakah jenis merchant anda ini? misalkan cafe, warung padang, dll."
              required
              class="grid grid-cols-2 gap-2"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.category"
                autocomplete="off"
                size="md"
                :disabled="!isEdit"
              >
                <!-- input-class="ps-[20px]" -->
              </UInput>
            </UFormGroup>

            <UFormGroup
              name="primary_color"
              label="Warna Primer"
              description="Digunakan pada form feedback sebagai warna primer"
              required
              class="grid grid-cols-2 gap-2 items-center"
              :ui="{ container: '' }"
            >
              <USelectMenu v-model="state.primary_color" :options="colors">
                <template #label>
                  <span
                    :class="`flex-shrink-0 w-5 h-3.5 mt-px rounded-none bg-${state.primary_color}-500`"
                  />
                  <span class="truncate">{{ state.primary_color }}</span>
                </template>
                <template #option="{ option }">
                  <span
                    :class="`flex-shrink-0 w-5 h-3.5 mt-px rounded-none bg-${option}-500`"
                  />
                  <span class="truncate">{{ option }}</span>
                </template>
              </USelectMenu>
            </UFormGroup>

            <UFormGroup
              name="logo"
              label="Logo"
              class="grid grid-cols-2 gap-2"
              help="JPG, JPEG or PNG. 1MB Max."
              :error="logoError.isError && logoError.message"
              :ui="{
                container: 'flex flex-wrap items-center gap-3',
                help: 'mt-0',
              }"
            >
              <input
                type="file"
                class="hidden"
                accept=".jpg, .jpeg, .png"
                @change="onLogoChange"
                ref="logoRef"
              />

              <UAvatar :src="state.logo" :alt="state.title" size="lg" />

              <UButton
                label="Choose"
                color="white"
                size="md"
                :disabled="!isEdit"
                @click="changeLogo"
              />
            </UFormGroup>

            <UFormGroup
              name="image_background"
              label="Background"
              description="Gambar sebagai background pada halaman feedback form."
              class="grid grid-cols-2 gap-2"
              help="JPG, GIF or PNG. 1MB Max."
              :error="
                backgroudImageError.isError && backgroudImageError.message
              "
              :ui="{
                container: 'flex flex-wrap items-center gap-3',
                help: 'mt-0',
              }"
            >
              <input
                ref="imageBackgroundRef"
                type="file"
                class="hidden"
                accept=".jpg, .jpeg, .png,"
                @change="onImageBackgroundChange"
              />
              <NuxtImg
                :src="state.image_background"
                :alt="state.title"
                size="lg"
              />

              <UButton
                label="Choose"
                color="white"
                size="md"
                :disabled="!isEdit"
                @click="changeImageBackground"
              />
            </UFormGroup>
          </UDashboardSection>
        </UForm>

        <UDivider class="mb-4" />

        <!-- <UDashboardSection
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

        <AdminUserDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
<style>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-out;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
