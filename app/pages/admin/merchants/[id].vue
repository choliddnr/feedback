<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { ImageError, Merchant } from "~~/shared/types";
import { LazyAdminMerchantEditLogo, LazyModalConfirm } from "#components";

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const { fetch } = useMerchantsStore();
const merchantId = useRoute().params.id as string;
const merchant = ref<Merchant>();

const state = reactive({
  title: "",
  slug: "",
  description: "",
  category: 0,
  primary_color: "",
  logo: "",
  image_background: "",
});

definePageMeta({
  layout: "dashboard",
});
const { merchant_categories } = storeToRefs(useMerchantCategoriesStore());
const { fetch: fetchCategories } = useMerchantsStore();

const toast = useToast();
const overlay = useOverlay();

const modal_edit_logo = overlay.create(LazyAdminMerchantEditLogo);
const modal_delete_merchant = overlay.create(LazyModalConfirm);
const base_url = useRuntimeConfig().public.BASE_URL;
const form = useTemplateRef<HTMLFormElement>("form");

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
      if (!data) {
        return true;
      } else {
        if (data.id === Number(merchantId)) {
          return true;
        }
        return false;
      }
    }, "Slug already exists"),
  description: z.string().min(5),
  category: z.number(),
  primary_color: z.string(),
});

type Schema = z.output<typeof schema>;

const logoRef = ref<HTMLInputElement>();
const logoBlob = ref<Blob>();
const isEdit = ref<boolean>(false);
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

  if (state.title !== merchant.value?.title)
    formData.append("title", state.title!);
  if (state.slug !== merchant.value?.slug) formData.append("slug", state.slug!);

  if (state.description !== merchant.value?.description)
    formData.append("description", state.description!);

  if (state.category !== merchant.value?.category)
    formData.append("category", String(state.category!));

  if (logoBlob.value) {
    formData.append("logo", logoBlob.value);
  }

  await $fetch("/api/merchants/" + merchantId, {
    method: "patch",
    body: formData,
    onResponse: async ({ response }) => {
      if (response.status === 200) {
        await fetch();
        on_submit.value = false;
        navigateTo("/admin/merchants");
        toast.add({
          title: "Merchant updated",
          icon: "i-heroicons-check-circle",
        });
      }
    },
    onResponseError: ({ response, error }) => {
      if (response.status !== 200) {
        on_submit.value = false;
        toast.add({
          title: "Failed to update the merchant",
          description: error?.message,
          icon: "i-heroicons-x-circle",
          color: "error",
        });
      }
    },
  });
};

const on_delete = ref<boolean>(false);
const processDelete = async () => {
  on_delete.value = true;
  await $fetch("/api/merchants/" + merchantId, {
    method: "DELETE",
    onResponse: async ({ response }) => {
      if (response.ok) {
        const index = merchants.value?.findIndex(
          (m) => m.id === Number(merchantId)
        );
        if (index) merchants.value?.splice(index!, 1);
        if (active_merchant.value === Number(merchantId)) {
          active_merchant.value = merchants.value![0]?.id || 0;
        }
        on_delete.value = false;
        navigateTo("/admin/merchants");
      }
    },
  });
};
const deleteMerchant = async () => {
  modal_delete_merchant.open({
    message: "Are you sure you want to delete this merchant?",
    action: {
      cancel: { color: "neutral" },
      continue: { color: "error", label: "Delete" },
    },
    onCancel: () => modal_delete_merchant.close(),
    onContinue: () => {
      processDelete();
      modal_delete_merchant.close();
    },
  });
  //
};

onMounted(async () => {
  if (
    merchant_categories.value === undefined ||
    merchant_categories.value.length === 0
  ) {
    await fetchCategories();
  }
  if (merchants.value) {
    for (let i = 0, len = merchants.value.length; i < len; i++) {
      if (merchants.value[i]?.id === Number(merchantId)) {
        merchant.value = merchants.value[i];
        break;
      }
    }
  } else {
    const unwatch = watch(merchants, () => {
      if (!merchants.value) return;
      for (let i = 0, len = merchants.value.length; i < len; i++) {
        if (merchants.value[i]?.id === Number(merchantId)) {
          merchant.value = merchants.value[i];
          unwatch();
        }
      }
    });
  }
  state.title = merchant.value?.title!;

  state.slug = merchant.value?.slug!;
  state.description = merchant.value?.description!;
  state.category = merchant.value?.category!;
  state.primary_color = "blue";
  state.logo = getImg(merchant.value?.logo!);
});
const copyLink = async () => {
  await navigator.clipboard.writeText(
    String(base_url + "/" + merchant.value!.slug)
  );
  toast.add({
    title: "Form link copied!",
    icon: "i-heroicons-check-circle",
  });
};
</script>

<template>
  <UDashboardPanel resizable>
    <template #header>
      <UDashboardNavbar :title="state.title" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <Transition mode="out-in" name="slide-right">
            <div>
              <div v-if="isEdit" class="flex gap-1">
                <UButton
                  type="submit"
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
                  @click="isEdit = false"
                />
              </div>
              <UButton
                v-else
                label="Edit Merchant"
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
      <UPageCard spotlight>
        <template #body>
          <div class="flex flex-col">
            <span>Form Link</span>
            <span class="text-neutral-400"
              >{{ base_url }}/{{ merchant ? merchant!.slug : "" }}

              <UButton
                icon="i-heroicons-square-2-stack-solid"
                variant="ghost"
                @click="copyLink"
                v-if="merchant"
              />
            </span>
          </div>
        </template>
      </UPageCard>
      <UForm
        :state="state"
        :schema="schema"
        @submit="onSubmit"
        ref="form"
        :validate-on="['blur']"
      >
        <UPageCard :variant="isEdit ? 'subtle' : 'outline'">
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
              :disabled="!isEdit"
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
              :disabled="!isEdit"
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
              :disabled="!isEdit"
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
              :disabled="!isEdit"
            />
          </UFormField>

          <UFormField
            name="logo"
            label="Logo"
            class="grid grid-cols-2 gap-2"
            help="Any image allowed"
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
            <!-- accept=".jpg, .jpeg, .png, .webp" -->

            <UAvatar :src="state.logo" :alt="state.title" size="lg" />

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              @click="changeLogo"
              :disabled="!isEdit"
            />
          </UFormField>
        </UPageCard>
      </UForm>

      <USeparator class="mb-4" v-if="merchants?.length! > 1" />
      <UPageCard
        v-if="merchants?.length! > 1"
        spotlight
        spotlight-color="error"
        title="Delete Merchant"
        description="Please be careful, once you delete this merchant, all the data related to this merchant will be deleted permanently."
      >
        <div>
          <UButton
            :loading="on_delete"
            color="error"
            label="Delete"
            size="md"
            @click="deleteMerchant"
          />
        </div>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
