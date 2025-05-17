<script setup lang="ts">
import { useUserStore } from "../_stores/user";
const model = defineModel({
  type: Boolean,
});

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
    title?: string;
    icon?: string;
    iconColor?: string;
    message: string;
    label?: {
      continue?: string;
      cancel?: string;
    };
  }>(),
  {
    label: () => {
      return {
        cancel: "Batal",
        continue: "Lanjut",
      };
    },
  }
);

const emit = defineEmits(["continue", "cancel"]);

const { $pb } = useNuxtApp();
const { user } = storeToRefs(useUserStore());
const toast = useToast();

const loading = ref(false);

const onDelete = async () => {
  loading.value = true;
  await $pb.collection("users").delete(user.value.id!);
  setTimeout(() => {
    loading.value = false;
    toast.add({
      icon: "i-heroicons-check-circle",
      title: "Your account has been deleted",
      color: "red",
    });
    model.value = false;
    navigateTo("/auth");
  }, 2000);
};
</script>

<template>
  <UDashboardModal
    v-model="model"
    title="Delete account"
    description="Are you sure you want to delete your account?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
      icon: {
        base: 'text-red-500 dark:text-red-400'
      } as any,
      footer: {
        base: 'ml-16'
      } as any
    }"
  >
    <template #footer>
      <UButton
        color="error"
        label="Delete"
        :loading="loading"
        @click="onDelete"
      />
      <UButton color="neutral" label="Cancel" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
