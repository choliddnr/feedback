<script lang="ts" setup>
import { LazyAdminProductsEditImage } from "#components";
import { z } from "zod";
import type { Product } from "~~/shared/types";

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const { fetch } = useProductsStore();
const toast = useToast();
const onSubmitting = ref<boolean>(false);
const EditSchema = z.object({
  title: z.string().min(5).max(25),
  description: z.string().optional(),
  merchant: z.number(),
});

const props = defineProps<{
  product: Partial<Product>;
}>();

const emits = defineEmits<{
  close: [];
}>();

const state = reactive<Partial<Product>>({
  title: props.product.title,
  description: props.product.description,
  image: props.product.image ? getImg(props.product.image) : "",
  merchant: props.product.merchant,
});

const imageRef = ref<HTMLInputElement>();
const imageError = ref<{ isError: boolean; message: string }>({
  isError: false,
  message: "",
});

const changeImage = () => {
  imageRef.value?.click();
};

const overlay = useOverlay();
const modal_edit_image = overlay.create(LazyAdminProductsEditImage);
const imageBlob = ref<Blob>();
const onImageChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    imageError.value = {
      isError: true,
      message: "No file selected.",
    };
    return;
  }
  const file = input.files[0];
  state.image = URL.createObjectURL(file!);
  imageError.value.isError = false;
  modal_edit_image.open({
    image: URL.createObjectURL(input.files[0]!),
    "onUpdate:imageBlob": (value) => {
      imageBlob.value = value;
      state.image = URL.createObjectURL(value!);
      modal_edit_image.close();
    },
    onCancel: () => {
      modal_edit_image.close();
    },
  });
};
const onSubmit = async () => {
  onSubmitting.value = true;
  const formData = new FormData();
  formData.append("title", state.title!);
  formData.append("description", state.description!);
  formData.append("merchant", state.merchant!.toString());

  if (imageBlob.value) {
    formData.append("image", imageBlob.value);
  }
  const res = await $fetch<Response>("/api/products/" + props.product.id, {
    method: "PATCH",
    body: formData,
    onResponse: async ({ response }) => {
      if (response.ok) {
        await fetch();
        emits("close");
        toast.add({
          title: "Product updated",
          icon: "i-heroicons-check-circle",
        });

        onSubmitting.value = false;
      }
    },
    onResponseError: ({ response, error }) => {
      if (!response.ok) {
        toast.add({
          title: "Failed to update product",
          icon: "i-heroicons-x-circle",
          color: "error",
        });
        onSubmitting.value = false;
      }
    },
  });
};
</script>

<template>
  <USlideover prevent-close title="Edit Product">
    <template #body>
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: 'flex-1',
          root: 'ring-0 divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <UForm
          :schema="EditSchema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Title" name="title">
            <UInput v-model="state.title" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" class="w-full" />
          </UFormField>
          <UFormField label="Merchant" name="merchant">
            <USelectMenu
              v-model="state.merchant as number"
              class="w-full"
              :items="merchants"
              label-key="title"
              value-key="id"
            />
          </UFormField>
          <UFormField
            name="image"
            label="Product Image"
            class="grid grid-cols-2 gap-2"
            help="Any image allowed"
            :error="imageError.isError && imageError.message"
            :ui="{
              container: 'flex flex-wrap items-center gap-3 content-center',
              help: 'mt-0',
            }"
          >
            <template #description>
              <NuxtImg :src="state.image" size="lg" />
            </template>
            <input
              ref="imageRef"
              type="file"
              class="hidden"
              @change="onImageChange"
            />
            <!-- accept=".jpg, .jpeg, .png," -->

            <UButton
              label="Choose"
              color="neutral"
              size="md"
              @click="changeImage"
            />
          </UFormField>

          <UButtonGroup class="w-full">
            <UButton
              block
              color="primary"
              variant="solid"
              icon="i-heroicons-document-check-16-solid"
              label="Save"
              type="submit"
              :loading="onSubmitting"
            />
            <UButton
              block
              label="Cancel"
              color="error"
              icon="i-heroicons-x-mark-20-solid"
              @click="emits('close')"
            />
          </UButtonGroup>
        </UForm>
      </UCard>
    </template>
  </USlideover>
</template>
