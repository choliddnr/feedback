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
  description: "",
  category: 0,
  primary_color: "",
  logo: "",
  image_background: "",
});

definePageMeta({
  layout: "dashboard",
});

if (import.meta.server) {
  console.log("server merchant", merchant.value);
}
if (import.meta.client) {
  console.log("clinet merchant", merchant.value);
}

const { merchant_categories } = storeToRefs(useMerchantCategoriesStore());

const overlay = useOverlay();

const modal_edit_logo = overlay.create(LazyAdminMerchantEditLogo);
const modal_delete_merchant = overlay.create(LazyModalConfirm);

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

const backgroudImageError = ref<ImageError>({
  isError: false,
  message: "",
});

const schema = z.object({
  title: z.string().min(4),
  description: z.string().min(5),
  category: z.number(),
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

const logoRef = ref<HTMLInputElement>();
const imageBackgroundRef = ref<HTMLInputElement>();
const toast = useToast();
const logoBlob = ref<Blob>();
const isEdit = ref<boolean>(false);
const changeLogo = (e: Event) => {
  logoRef.value!.click();
};
const changeImageBackground = (e: Event) => {
  imageBackgroundRef.value!.click();
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

  if (state.title !== merchant.value?.title)
    formData.append("title", state.title!);

  if (state.description !== merchant.value?.description)
    formData.append("description", state.description!);

  if (state.category !== merchant.value?.category)
    formData.append("category", String(state.category!));

  //   formData.append("primary_color", state.primary_color);
  // if (logoRef.value!.files?.length! > 0) {
  //   formData.append("logo", logoRef.value!.files![0]!);
  // }

  if (logoBlob.value) {
    formData.append("logo", logoBlob.value);
  }

  if (imageBackgroundRef.value!.files?.length! > 0) {
    formData.append("image_background", imageBackgroundRef.value!.files![0]!);
  }

  await $fetch("/api/merchants/" + merchantId, {
    method: "patch",
    body: formData,
    onResponse: async ({ response }) => {
      await fetch();
      navigateTo("/admin/merchants");
    },
  });

  toast.add({ title: "Merchant updated", icon: "i-heroicons-check-circle" });
};

onMounted(() => {
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
  state.description = merchant.value?.description! + " people said";
  state.category = merchant.value?.category!;
  state.primary_color = "blue";
  state.logo = "/merchant/logo/" + merchant.value?.logo!;
  state.image_background =
    "/merchant/image_background/" + merchant.value?.image_background!;
});
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
    message: "Are you sure?",
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
      <UForm :state="state" :schema="schema" @submit="onSubmit" ref="form">
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
              :readonly="!isEdit"
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
              :readonly="!isEdit"
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
              :disabled="!isEdit"
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
              :disabled="!isEdit"
            />
          </UFormField>

          <UFormField
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
              :alt="state.title"
              size="lg"
            />

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              @click="changeImageBackground"
              :disabled="!isEdit"
            />
          </UFormField>
        </UPageCard>
      </UForm>

      <USeparator class="mb-4" />
      <UPageCard
        v-if="merchants?.length! > 1"
        :ui="{ root: 'rounded-none' }"
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
