<script lang="ts" setup>
const props = defineProps<{ image: File }>();
const imageURL = ref<string>("");
const originalImage = URL.createObjectURL(props.image);
const emit = defineEmits(["success"]);

const imageBlob = ref<Blob>();

// reduceImage(props.image, 100, 100, (blob?: Blob) => {
//   // Generate a URL for the reduced image blob
//   imageBlob.value = blob;
//   imageURL.value = blob ? URL.createObjectURL(blob) : "";
//   console.log("reduced", imageURL.value, props.image.size, blob?.size);
// });

cropImage(props.image, 50, 50, 200, 200, (blob?: Blob) => {
  // Generate a URL for the reduced image blob
  imageBlob.value = blob;
  imageURL.value = blob ? URL.createObjectURL(blob) : "";
  console.log("reduced", imageURL.value, props.image.size, blob?.size);
});
function onSuccess() {
  emit("success");
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <p>{{ imageBlob?.size }}</p>
        <NuxtImg :src="originalImage" />
        <NuxtImg :src="imageURL" />
        <UButton @click="onSuccess"> Click to emit a success event </UButton>
      </div>
    </UCard>
  </UModal>
</template>
