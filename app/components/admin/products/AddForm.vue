<script lang="ts" setup>
import { z } from "zod";
import type { NewProduct } from "~~/shared/types";

const { merchants, active_merchant } = storeToRefs(useMerchantsStore());
const { fetch } = useProductsStore();

const toast = useToast();

const Schema = z.object({
  title: z.string().min(5).max(25),
  description: z.string().optional(),
  image: z.string(),
  merchant: z.number(),
});

const emits = defineEmits<{
  close: [];
}>();

const state = reactive<NewProduct>({
  title: "",
  description: "",
  image: "",
  merchant: active_merchant.value as number,
});

const imageRef = ref<HTMLInputElement>();
const imageError = ref<{ isError: boolean; message: string }>({
  isError: false,
  message: "",
});

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

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
  formData.append("merchant", state.merchant.toString());
  if (imageRef.value?.files?.length) {
    formData.append("image", imageRef.value!.files![0]!);
  } else {
    imageError.value = {
      isError: true,
      message: "Image is required",
    };
    return;
  }
  const res = await $fetch<Response>("/api/products", {
    method: "post",
    body: formData,
    onResponse: async ({ response }) => {
      if (response.ok) {
        await fetch();
      }
    },
  });

  console.log("res", res);

  // const updatedProduct = await $pb.collection("products").create(formData);
  // products.value!.push(updatedProduct as unknown as Product); // ;

  emits("close");
  toast.add({ title: "Product added", icon: "i-heroicons-check-circle" });
};
</script>

<template>
  <USlideover prevent-close title="Add new Product">
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
          :schema="Schema"
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
