<script setup lang="ts">
// import { useUserStore } from "../../../_stores/user";
// const model = defineModel({
//   type: Boolean,
// });
// const { user } = storeToRefs(useUserStore());
const toast = useToast();

const loading = ref(false);

const emit = defineEmits(["cancel"]);

const onDelete = async () => {
  // loading.value = true;
  // await $pb.collection("users").delete(user.value.id!);
  // setTimeout(() => {
  //   loading.value = false;
  //   toast.add({
  //     icon: "i-heroicons-check-circle",
  //     title: "Your account has been deleted",
  //     color: "red",
  //   });
  //   model.value = false;
  //   navigateTo("/auth");
  // }, 2000);
};
</script>

<template>
  <UModal
    title="Delete account"
    description="Are you sure you want to delete your account?"
    icon="i-heroicons-exclamation-circle"
    prevent-close
    :close-button="null"
    :ui="{
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
      <UButton color="neutral" label="Cancel" @click="emit('cancel')" />
    </template>
  </UModal>
</template>
