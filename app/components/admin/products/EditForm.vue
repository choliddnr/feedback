<script lang="ts" setup>
import type { FormSubmitEvent } from "#ui/types";
import { LazyAdminProductsEditImage, ModalConfirm } from "#components";
import { type output as zodOutput } from "zod";
import { z } from "zod";
import type { Product } from "~~/shared/types";

// import { useProductsStore } from "../../../_stores/products";
// const { products } = storeToRefs(useProductsStore());
// const { $pb } = useNuxtApp();

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const { fetch } = useProductsStore();
const toast = useToast();

// const imageSchema = z
//   .instanceof(Blob)
//   .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
//     message: "Invalid file type. Only JPEG and PNG files are allowed.",
//   })
//   .refine((file) => file.size <= MAX_FILE_SIZE, {
//     message: "File size should be less than 1MB.",
//   });
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

// const submitBtnRef = ref<HTMLButtonElement>();

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

// const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
// const ACCEPTED_FILE_TYPES = [
//   "image/jpeg",
//   "image/jpeg",
//   "image/png",
//   "image/webp",
// ];

const changeImage = () => {
  imageRef.value?.click();
};

const overlay = useOverlay();
const modal_edit_image = overlay.create(LazyAdminProductsEditImage);
const imageBlob = ref<Blob>();
const onImageChange = (e: Event) => {
  // if (!imageRef.value?.files?.length) return;
  // const validate = imageSchema.safeParse(imageRef.value.files[0]);
  // if (validate.success) {
  //   state.image = URL.createObjectURL(imageRef.value.files[0]!);
  //   imageError.value.isError = false;
  // } else {
  //   imageError.value = {
  //     isError: true,
  //     message: validate.error.errors[0]?.message!,
  //   };
  // }

  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    imageError.value = {
      isError: true,
      message: "No file selected.",
    };
    return;
  }
  //   if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
  //     imageError.value = {
  //       isError: true,
  //       message: "Invalid file type. Only JPEG and PNG files are allowed.",
  //     };
  //     return;
  //   } else {
  //   imageError.value.isError = false;
  // }
  //   if (file.size > MAX_FILE_SIZE) {
  //     imageError.value = {
  //       isError: true,
  //       message: "File size should be less than 1MB.",
  //     };
  //     return;
  //   }

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
  const formData = new FormData();
  formData.append("title", state.title!);
  formData.append("description", state.description!);
  formData.append("merchant", state.merchant!.toString());

  if (imageBlob.value) {
    formData.append("image_filename", props.product.image || "");
    formData.append("image", imageBlob.value);
  }
  const res = await $fetch<Response>("/api/products/" + props.product.id, {
    method: "PATCH",
    body: formData,
    onResponse: async ({ response }) => {
      if (response.ok) {
        await fetch();
      }
    },
  });

  // const updatedProduct = await $pb.collection("products").create(formData);
  // products.value!.push(updatedProduct as unknown as Product); // ;

  emits("close");
  toast.add({ title: "Product Updated", icon: "i-heroicons-check-circle" });
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
        <!-- <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Add new Product
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
                color="error"
                icon="i-heroicons-x-mark-20-solid"
                @click="emits('close')"
              />
            </div>
          </div>
        </template> -->

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
            <!-- <UTextarea v-model="state.merchant" class="w-full" /> -->
          </UFormField>
          <UFormField
            name="image"
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
              <NuxtImg :src="state.image" size="lg" />
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
              color="neutral"
              size="md"
              @click="changeImage"
            />
          </UFormField>

          <!-- <button @click="onSubmit" hidden ref="submitBtnRef">Submit</button> -->
          <!-- <div class="flex flex-row gap-1 w-full"> -->
          <UButtonGroup class="w-full">
            <UButton
              block
              color="primary"
              variant="solid"
              icon="i-heroicons-document-check-16-solid"
              label="Save"
              type="submit"
            />
            <UButton
              block
              label="Cancel"
              color="error"
              icon="i-heroicons-x-mark-20-solid"
              @click="emits('close')"
            />
          </UButtonGroup>
          <!-- </div> -->
        </UForm>
      </UCard>
    </template>
  </USlideover>
</template>
