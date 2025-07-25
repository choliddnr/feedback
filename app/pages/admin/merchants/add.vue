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
  description: z.string(),
  category: z.number(),
  primary_color: z.string(),
});

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
const toast = useToast();

const logoBlob = ref<Blob>();

const changeLogo = (e: Event) => {
  logoRef.value!.click();
};
const onLogoChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;

  modal_edit_logo.open({
    image: URL.createObjectURL(input.files[0]!),
    "onUpdate:imageBlob": (value) => {
      logoBlob.value = value;
      state.logo = URL.createObjectURL(value!);
      modal_edit_logo.close();
      logoError.value = {
        isError: false,
        message: "",
      };
    },
    onCancel: () => {
      state.logo = "";
      modal_edit_logo.close();
    },
  });
};

const on_submit = ref<boolean>(false);
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  on_submit.value = true;
  const formData = new FormData();
  formData.append("title", state.title);

  formData.append("slug", state.slug);
  formData.append("description", state.description);
  formData.append("category", String(state.category));
  formData.append("primary_color", state.primary_color);

  if (logoBlob.value) {
    formData.append("logo", logoBlob.value);
  } else {
    logoError.value = {
      isError: true,
      message: "Merchant logo is required.",
    };
    return;
  }

  await $fetch("/api/merchants", {
    method: "post",
    body: formData,
    onResponse: async ({ response }) => {
      if (response.status === 200) {
        await fetch();
        on_submit.value = false;
        navigateTo("/admin/merchants");
        toast.add({
          title: "Merchant created",
          icon: "i-heroicons-check-circle",
        });
      }
    },
    onResponseError: ({ response, error }) => {
      if (response.status !== 200) {
        on_submit.value = false;
        toast.add({
          title: "Failed to create merchant",
          description: error?.message,
          icon: "i-heroicons-x-circle",
          color: "error",
        });
      }
    },
  });
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
                :loading="on_submit"
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
      <UForm
        :state="state"
        :schema="schema"
        @submit="onSubmit"
        ref="form"
        :validate-on="['blur']"
        :validate-on-input-delay="500"
      >
        <UPageCard>
          <UFormField
            name="title"
            label="Title"
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
            description="The slug is used on the URL for the respondent to open the feedback form; it must be unique and lowercase."
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
            label="Description"
            description="Describe about your merchant"
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
            label="Category"
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

          <UFormField
            name="logo"
            label="Logo"
            class="grid grid-cols-2 gap-2"
            help="Any image allowed"
            description="A logo or any image that represent your merchant."
            required
            :error="logoError.isError && logoError.message"
            :ui="{
              container: 'flex flex-wrap items-center gap-3',
              help: 'mt-0',
            }"
          >
            <input
              type="file"
              class="hidden"
              @change="onLogoChange"
              ref="logoRef"
            />
            <!-- accept=".jpg, .jpeg, .png" -->

            <UAvatar :src="state.logo" :alt="state.title" size="lg" />

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              @click="changeLogo"
            />
          </UFormField>
        </UPageCard>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
