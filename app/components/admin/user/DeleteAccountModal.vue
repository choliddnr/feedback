<script setup lang="ts">
import { useUserStore } from "../../../stores/user";
const model = defineModel({
  type: Boolean,
});
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
        color="red"
        label="Delete"
        :loading="loading"
        @click="onDelete"
      />
      <UButton color="white" label="Cancel" @click="model = false" />
    </template>
  </UDashboardModal>
</template>
