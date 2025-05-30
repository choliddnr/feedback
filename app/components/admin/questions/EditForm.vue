<script lang="ts" setup>
import { UInput } from "#components";
import { z } from "zod";
import type { NewQuestion, Question } from "~~/shared/types";
import { useQuestionTypesStore } from "~/stores/question_types";

const { question } = defineProps<{ question: Partial<Question> }>();

const emits = defineEmits<{
  close: [];
}>();

const { questions } = storeToRefs(useQuestionsStore());
const { question_types } = storeToRefs(useQuestionTypesStore());
const { products, active_product } = storeToRefs(useProductsStore());

const toast = useToast();
const onSubmitting = ref<boolean>(false);
const Schema = z.object({
  question: z.string().min(10),
  answer_options: z.array(z.string()),
  type: z.number().gt(0),
  product: z.number().gt(0),
});

const state = reactive<NewQuestion>({
  question: question.question!,
  answer_options: question.answer_options,
  type: question.type!,
  product: question.product || 0,
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
const onSubmit = async () => {
  onSubmitting.value = true;
  await $fetch<Response>("/api/questions/" + question.id, {
    method: "patch",
    body: state,
    onResponse: async ({ response }) => {
      if (response.ok) {
        const index = questions.value.findIndex((q) => q.id === question.id);
        questions.value[index] = response._data[0];
        toast.add({
          title: "Question updated",
          icon: "i-heroicons-check-circle",
        });

        onSubmitting.value = false;
        emits("close");
      }
    },
    onResponseError: ({ response, error }) => {
      if (!response.ok) {
        toast.add({
          title: "Failed to update question",
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

          <UFormField
            label="Answer options"
            name="answer_options"
            v-if="state.type !== 2"
          >
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
            v-if="state.type !== 2 && state.answer_options!.length > 0"
            v-model="state.answer_options as string[]"
            multiple
            aria-readonly="true"
            size="xl"
            variant="none"
            trailing-icon=""
            :ui="{ base: 'px-0 h-auto' }"
            readonly
            :disabled="onSubmitting"
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
