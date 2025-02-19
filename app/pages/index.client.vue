<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useFeedbackStore } from "../stores/feedback";

// const { merchantId } = storeToRefs(useFeedbackStore());
// console.log("merchant", merchantId.value);
const { data: url } = await useFetch<string>("/api/s3");

import { useUserStore } from "../stores/user";
const { user } = storeToRefs(useUserStore());

const fileRef = ref<HTMLInputElement>();

const toast = useToast();

const state = reactive({
  name: user.value?.name,
  email: user.value?.email,
  username: user.value?.username,
  picture: user.value?.picture,
});

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  state.picture = URL.createObjectURL(input.files[0]!);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  const formData = new FormData();
  formData.append("username", state.username as string);
  formData.append("name", state.name as string);
  formData.append("picture", fileRef.value!.files![0]!);
  console.log("formData", formData);

  await $fetch(`/api/user/${user.value?.id}`, {
    method: "PATCH",
    body: formData,
    onRequest: ({ options }: { options: any }) => {
      console.log("formData", formData, options);
    },
    onResponse: ({ response }: { response: any }) => {
      if (response.status === 200) {
        toast.add({
          title: "Profile updated",
          icon: "i-heroicons-check-circle",
        });
        console.log("response", response._data);
      }
    },
    onResponseError: ({ response }: { response: any }) => {
      if (response.status !== 200) {
        toast.add({
          description: response._data.statusMessage,
          title: "Gagal!",
          icon: "i-heroicons-x-circle",
          color: "red",
        });
      }
    },
  });
}
</script>
<template>
  <div>Home</div>
</template>
<style scoped>
#cropperCanvas {
  :deep(cropper-canvas) {
    height: 300px;
    width: 300px;
  }
}
</style>
