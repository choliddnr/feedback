<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";
import { ModalConfirm } from "#components";
import { type output as zodOutput } from "zod";
import { z } from "zod";
import type { Product } from "~~/shared/types";

import { useProductsStore } from "../../../stores/products";
const { products } = storeToRefs(useProductsStore());
const { $pb } = useNuxtApp();
const toast = useToast();

const EditSchema = z.object({
  title: z.string().min(5).max(25),
  description: z.string().optional(),
  images: z.string(),
});

const props = defineProps<{
  product: Product;
}>();

const emits = defineEmits<{
  close: [];
}>();

const submitBtnRef = ref<HTMLButtonElement>();

const state = reactive<Partial<Product> & { image?: string }>({
  title: props.product.title,
  description: props.product.description,
  image: $pb.files.getURL(props.product, props.product.images!),
});

const imageRef = ref<HTMLInputElement>();
const imageError = ref<{ isError: boolean; message: string }>({
  isError: false,
  message: "",
});

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpeg", "image/png"];

const imageSchema = z
  .instanceof(Blob)
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Invalid file type. Only JPEG and PNG files are allowed.",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size should be less than 1MB.",
  });

const changeImage = () => {
  imageRef.value?.click();
};
const onImageChange = () => {
  if (!imageRef.value?.files?.length) return;
  const validate = imageSchema.safeParse(imageRef.value.files[0]);
  if (validate.success) {
    state.image = URL.createObjectURL(imageRef.value.files[0]!);
    imageError.value.isError = false;
  } else {
    imageError.value = {
      isError: true,
      message: validate.error.errors[0]?.message!,
    };
  }
};
const onSubmit = async () => {
  const formData = new FormData();
  formData.append("title", state.title!);
  formData.append("description", state.description!);
  if (imageRef.value?.files?.length) {
    formData.append("images", imageRef.value!.files![0]!);
  }
  const updatedProduct = await $pb
    .collection("products")
    .update(props.product.id!, formData);
  for (let i = 0, len = products.value?.length || 0; i < len; i++) {
    if (products.value![i]?.id === props.product.id) {
      products.value![i] = updatedProduct as unknown as Product;
      break;
    }
  }
  emits("close");
  toast.add({ title: "Product updated", icon: "i-heroicons-check-circle" });
};
</script>

<template>
  <USlideover prevent-close>
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ "Edit " + props.product.title }}
          </h3>
          <div class="flex gap-1">
            <UButton
              color="primary"
              variant="solid"
              icon="i-heroicons-document-check-16-solid"
              label="Save"
              @click="submitBtnRef!.click()"
            />
            <UButton
              color="red"
              icon="i-heroicons-x-mark-20-solid"
              @click="emits('close')"
            />
          </div>
        </div>
      </template>

      <UForm :schema="EditSchema" :state="state" class="space-y-4">
        <UFormGroup label="Title" name="title">
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="state.description" />
        </UFormGroup>
        <UFormGroup
          name="images"
          label="Gambar"
          class="grid grid-cols-2 gap-2"
          help="JPG, GIF or PNG. 1MB Max."
          :error="imageError.isError && imageError.message"
          :ui="{
            container: 'flex flex-wrap items-center gap-3 content-center',
            help: 'mt-0',
          }"
        >
          <template #description>
            <NuxtImg :src="state.image" :alt="state.title" size="lg" />
          </template>
          <input
            ref="imageRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png,"
            @change="onImageChange"
          />

          <UButton
            label="Choose"
            color="white"
            size="md"
            @click="changeImage"
          />
        </UFormGroup>

        <button @click="onSubmit" hidden ref="submitBtnRef">Submit</button>
      </UForm>
    </UCard>
  </USlideover>
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
