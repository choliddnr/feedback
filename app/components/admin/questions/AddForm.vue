<script lang="ts" setup>
import type { FormSubmitEvent, InputMenuItem } from "#ui/types";
import { ModalConfirm, UInput } from "#components";
import { type output as zodOutput } from "zod";
import { z } from "zod";
import type { NewProduct, NewQuestion, Product } from "~~/shared/types";
import { useQuestionTypesStore } from "~/stores/question_types";

const { questions } = storeToRefs(useQuestionsStore());
const { question_types } = storeToRefs(useQuestionTypesStore());
const { products, active_product } = storeToRefs(useProductsStore());

const toast = useToast();

const Schema = z.object({
  question: z.string().min(10),
  answer_options: z.array(z.string()),
  type: z.number().gt(0),
  product: z.number().gt(0),
});

const emits = defineEmits<{
  close: [];
}>();

const state = reactive<NewQuestion>({
  question: "",
  answer_options: [],
  type: 0,
  product: active_product.value || 0,
});
const answer_option = ref<string>();
const pushNewOption = () => {
  if (answer_option.value) {
    state.answer_options?.push(answer_option.value);
    answer_option.value = undefined;
  }
};

watch(
  () => state.product,
  () => {
    active_product.value = state.product;
  }
);
const on_post = ref<boolean>(false);
const onSubmit = async () => {
  const res = await $fetch<Response>("/api/questions", {
    method: "post",
    body: state,
    onRequest: () => {
      on_post.value = true;
    },
    onResponse: async ({ response }) => {
      if (response.ok) {
        questions.value.push(response._data[0]);
        toast.add({ title: "Product added", icon: "i-heroicons-check-circle" });
      }
    },
  });
  emits("close");
};
</script>

<template>
  <USlideover prevent-close title="Add new question">
    <template #body>
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: 'flex-1',
          root: 'ring-0 divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <UForm
          :schema="Schema"
          :state="state"
          class="space-y-4"
          @submit.prevent="onSubmit"
        >
          <UFormField label="Question" name="question">
            <UTextarea v-model="state.question" class="w-full" />
          </UFormField>

          <UFormField label="Answer options" name="answer_options">
            <UButtonGroup class="mt-2 w-full">
              <UInput
                block
                v-model="answer_option"
                class="w-full"
                placeholder="Add option"
              />
              <UButton
                block
                icon="i-lucide-plus"
                class="max-w-10"
                @click="pushNewOption"
              />
            </UButtonGroup>
          </UFormField>
          <UInputMenu
            v-model="state.answer_options as string[]"
            multiple
            aria-readonly="true"
            size="xl"
            variant="none"
            trailing-icon=""
            :ui="{ base: 'px-0 h-auto' }"
            readonly
            :disabled="on_post"
          />

          <UFormField label="Type" name="type">
            <USelectMenu
              v-model="state.type as number"
              class="w-full"
              :items="question_types"
              label-key="title"
              value-key="id"
            />
          </UFormField>
          <UFormField label="Product" name="product">
            <USelectMenu
              v-model="state.product as number"
              class="w-full"
              :items="products"
              label-key="title"
              value-key="id"
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
