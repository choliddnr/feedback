<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { ImageError, Merchant } from "~~/shared/types";
import type { NavigationMenuItem } from "@nuxt/ui";
import { LazyAdminMerchantEditLogo } from "#components";

definePageMeta({
  layout: "dashboard",
});

const { merchant_categories } = storeToRefs(useMerchantCategoriesStore());
const { fetch } = useMerchantsStore();
if (
  merchant_categories.value === undefined ||
  merchant_categories.value.length === 0
) {
  await fetch();
}

const overlay = useOverlay();

const modal_edit_logo = overlay.create(LazyAdminMerchantEditLogo);

const form = useTemplateRef("form");

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const logoError = ref<ImageError>({
  isError: false,
  message: "",
});

// const backgroudImageError = ref<ImageError>({
//   isError: false,
//   message: "",
// });

const schema = z.object({
  title: z.string().min(4),
  slug: z
    .string()
    .min(4)
    .refine((val) => {
      const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      return regex.test(val);
    }, "Slug must be lowercase and can only contain letters, numbers, and dashes.")
    .refine(async (val) => {
      if (val === "") return true;
      const data = await $fetch<Merchant>("/api/merchants/slug/" + val, {
        method: "get",
      });
      return !data ? true : false;
    }, "Slug already exists"),
  description: z.string().min(5),
  category: z.number(),
  primary_color: z.string(),
});

// const imageSchema = z
//   .instanceof(Blob)
//   .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
//     message: "Invalid file type. Only JPEG and PNG files are allowed.",
//   })
//   .refine((file) => file.size <= MAX_FILE_SIZE, {
//     message: "File size should be less than 2MB.",
//   });

type Schema = z.output<typeof schema>;
const state = reactive({
  title: "",
  slug: "",
  description: "",
  category: 1,
  primary_color: "blue",
  image_background: "",
  logo: "",
});

const logoRef = ref<HTMLInputElement>();
// const imageBackgroundRef = ref<HTMLInputElement>();
const toast = useToast();

const logoBlob = ref<Blob>();

const changeLogo = (e: Event) => {
  logoRef.value!.click();
};
// const changeImageBackground = (e: Event) => {
//   imageBackgroundRef.value!.click();
// };

const onLogoChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;

  modal_edit_logo.open({
    image: URL.createObjectURL(input.files[0]!),
    "onUpdate:imageBlob": (value) => {
      logoBlob.value = value;
      state.logo = URL.createObjectURL(value!);
      modal_edit_logo.close();
    },
    onCancel: () => {
      state.logo = "";
      modal_edit_logo.close();
    },
  });
};

// const onImageBackgroundChange = (e: Event) => {
//   const input = e.target as HTMLInputElement;
//   if (!input.files?.length) return;
//   const res = imageSchema.safeParse(input.files[0]);
//   if (!res.success) {
//     backgroudImageError.value = {
//       isError: !res.success,
//       message: res.error.errors[0]?.message!,
//     };
//   } else {
//     state.image_background = URL.createObjectURL(input.files[0]!);
//     backgroudImageError.value = {
//       isError: !res.success,
//       message: "",
//     };
//   }
// };
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const formData = new FormData();
  formData.append("title", state.title);

  formData.append("slug", state.slug);
  formData.append("description", state.description);
  formData.append("category", String(state.category));
  formData.append("primary_color", state.primary_color);
  // if (logoRef.value!.files?.length! > 0) {
  //   formData.append("logo", logoRef.value!.files![0]!);
  // }

  if (logoBlob.value) {
    formData.append("logo", logoBlob.value);
  }

  // if (imageBackgroundRef.value!.files?.length! > 0) {
  //   formData.append("image_background", imageBackgroundRef.value!.files![0]!);
  // }

  await $fetch("/api/merchants", {
    method: "post",
    body: formData,
    onResponse: async ({ response }) => {
      await fetch();
      navigateTo("/admin/merchants");
    },
  });

  toast.add({ title: "Merchant created", icon: "i-heroicons-check-circle" });
};
</script>

<template>
  <UDashboardPanel id="add-merchant" resizable>
    <template #header>
      <UDashboardNavbar title="Add Merchant" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <Transition mode="out-in" name="slide-right">
            <div class="flex gap-1">
              <UButton
                label="Save Changes"
                color="neutral"
                leading-icon="i-heroicons-document-check-16-solid"
                @click="form?.submit()"
              />
              <UButton
                label="Cancel"
                color="error"
                leading-icon="i-heroicons-x-mark-16-solid"
                @click="navigateTo('/admin/merchants')"
              />
            </div>
          </Transition>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <!-- :validate="validate" -->
      <UForm
        :state="state"
        :schema="schema"
        @submit="onSubmit"
        ref="form"
        :validate-on="['blur']"
        :validate-on-input-delay="500"
      >
        <!-- :title="merchant?.title"
          :description="merchant?.description" -->
        <UPageCard>
          <UFormField
            name="title"
            label="Nama"
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.title"
              autocomplete="off"
              class="w-full"
              size="md"
            />
          </UFormField>
          <UFormField
            name="slug"
            label="Slug"
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.slug"
              autocomplete="off"
              class="w-full"
              size="md"
            />
          </UFormField>

          <UFormField
            name="description"
            label="Deskripsi"
            description="Deskripsikan mengenai merchant anda"
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UTextarea
              v-model="state.description"
              class="w-full"
              autocomplete="off"
              size="md"
            />
          </UFormField>

          <UFormField
            name="category"
            label="Kategori"
            description="Apakah jenis merchant anda ini? misalkan cafe, warung padang, dll."
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <USelectMenu
              class="w-full"
              :items="merchant_categories"
              v-model="state.category"
              label-key="title"
              value-key="id"
            />
          </UFormField>

          <!-- <UFormField
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
        </UFormField> -->

          <UFormField
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
              color="neutral"
              size="md"
              @click="changeLogo"
            />
          </UFormField>

          <!-- <UFormField
            name="image_background"
            label="Background"
            description="Gambar sebagai background pada halaman feedback form."
            class="grid grid-cols-2 gap-2"
            help="JPG, GIF or PNG. 1MB Max."
            :error="backgroudImageError.isError && backgroudImageError.message"
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
              alt="New Image Background"
              size="lg"
            />

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              @click="changeImageBackground"
            />
          </UFormField> -->
        </UPageCard>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
