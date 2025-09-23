<script lang="ts" setup>
let loadingAnimationSrc: string;
if (import.meta.dev) {
  loadingAnimationSrc = getImg("public/loading.gif");
} else {
  loadingAnimationSrc = "/loading.gif";
}
const prop = defineProps<{
  title: string;
  description: string;
}>();
const title = ref<string>(prop.title || "");
const description = ref<string>(prop.description || "");
const keys = ref<string>(
  "kuah, rasa, pentol, toping, harga, porsi, beli lagi."
);

const emit = defineEmits(["continue", "cancel"]);
</script>

<template>
  <UModal>
    <template #content>
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: 'flex-1',
          root: 'ring-0 divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <!-- <UForm
          :schema="Schema"
          :state="state"
          class="space-y-4"
          @submit.prevent="onSubmit"
        > -->
        <UFormField label="Title" name="title" class="mb-3">
          <UInput v-model="title" class="w-full" />
        </UFormField>
        <UFormField label="Description" name="description" class="mb-3">
          <UTextarea v-model="description" class="w-full" />
        </UFormField>

        <UFormField label="keys" name="keys" class="mb-3">
          <UTextarea v-model="keys" class="w-full" />
        </UFormField>

        <UButtonGroup class="w-full">
          <UButton
            block
            color="primary"
            variant="solid"
            icon="i-heroicons-document-check-16-solid"
            label="Save"
            type="submit"
            @click="emit('continue', title, description, keys)"
          />
          <!-- :loading="onSubmitting" -->
          <UButton
            block
            label="Cancel"
            color="error"
            icon="i-heroicons-x-mark-20-solid"
            @click="emit('cancel')"
          />
        </UButtonGroup>
        <!-- </UForm> -->
      </UCard>
    </template>
  </UModal>
</template>
