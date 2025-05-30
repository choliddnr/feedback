<script lang="ts" setup>
type OnDelete = { act: "delete"; id: string | number };
type OnUpdate = {
  act: "update";
  id: string | number;
  state: { title: string; description: string; updated: string | Date };
};
type OnCreate = {
  act: "create";
  state: {
    title: string;
    description: string;
    unit: string;
    category: string;
    barcode: number;
  };
};

const props = withDefaults(
  defineProps<{
    message: string;
    action?: {
      continue?: {
        label?: string;
        color?:
          | "primary"
          | "secondary"
          | "neutral"
          | "success"
          | "info"
          | "warning"
          | "error";
      };
      cancel?: {
        label?: string;
        color?:
          | "primary"
          | "secondary"
          | "neutral"
          | "success"
          | "info"
          | "warning"
          | "error";
      };
    };
  }>(),
  {
    message: "Are you sure?",
    action: () => {
      return {
        continue: {
          label: "Yes",
          color: "primary",
        },
        cancel: {
          label: "Cancel",
          color: "warning",
        },
      };
    },
  }
);

const emit = defineEmits(["continue", "cancel"]);
const onloading = ref<boolean>(false);

onBeforeUnmount(() => {
  onloading.value = false;
});
</script>

<template>
  <UModal>
    <template #content>
      <UCard>
        <div class="space-y-2">
          <h6>{{ message }}</h6>
          <UButton
            :loading="onloading"
            @click="
              () => {
                onloading = true;
                emit('continue');
              }
            "
            class="w-min-20 justify-center mr-3"
            :color="action.continue?.color || 'primary'"
          >
            {{ action.continue?.label }} </UButton
          ><UButton
            @click="emit('cancel')"
            class="w-min-20 justify-center"
            :color="action.cancel?.color || 'warning'"
          >
            {{ action.cancel?.label || "Cancel" }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
