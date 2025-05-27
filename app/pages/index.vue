<script setup lang="ts">
navigateTo("/admin/products");
// const filename = "img.webp";
// const url = ref("");
// const state = reactive({
//   image: "",
// });
// const img = useTemplateRef<HTMLInputElement>("img");
// const onSubmit = async (e: Event) => {
//   const formData = new FormData(e.target as HTMLFormElement);
//   const file = img.value?.files![0] as File;
//   console.log("event", file, state.image, img.value?.files![0]);
//   // const blob = new Blob(img.value?.files![0])

//   if (!file) {
//     console.error("No file selected");
//     return;
//   }
//   formData.append("image", file);

//   try {
//     await $fetch(`/api/image/` + filename, {
//       method: "PUT",
//       body: formData,
//       onResponse: ({ response }) => {
//         if (response.ok) {
//           console.log("File uploaded successfully");
//           url.value = getImg(filename);
//         } else {
//           console.error("Failed to upload file", response);
//         }
//       },
//     });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// };

// const deleteFile = async () => {
//   try {
//     await $fetch(`/api/image/` + filename, {
//       method: "DELETE",
//       onResponse: ({ response }) => {
//         if (response.ok) {
//           console.log("File deleted successfully");
//           url.value = ""; // Clear the URL after deletion
//         } else {
//           console.error("Failed to delete file", response);
//         }
//       },
//     });
//     console.log("File deleted successfully");
//   } catch (error) {
//     console.error("Error deleting file:", error);
//   }
// };
</script>

<template>
  <!-- <UForm :state="state" @submit.prevent="onSubmit">
    <UFormField name="image">
      <input type="file" accept="image/*" ref="img" />
    </UFormField>
    <UButton type="submit" color="primary"> Submit </UButton>
  </UForm>

  <UButton label="delete" color="error" @click="deleteFile()" />

  <NuxtImg
    v-if="url !== ''"
    :src="url"
    alt="Uploaded Image"
    width="300"
    height="300"
  /> -->
</template>
