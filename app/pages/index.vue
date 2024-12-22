<script setup lang="ts">
import Cropper, {
  CropperCanvas,
  CropperSelection,
  CropperViewer,
} from "cropperjs";

type SelectionProperty = {
  height: number;
  width: number;
  x: number;
  y: number;
};
const croppedImg = ref();
const { $pb } = useNuxtApp();
const record = await $pb.collection("merchant").getOne("x66966zmzugrkt9");
const imgURL = $pb.files.getURL(record, record.image_background);
const { data: imageBlob } = await useFetch(imgURL);
const objectURL = URL.createObjectURL(imageBlob.value as Blob);
const { width, height } = await getImageDimensions(imageBlob.value as File);
console.log(width, height);
const croppedURL = ref();
const img = new Image();
img.width = width;
img.height = height;
img.src = URL.createObjectURL(imageBlob.value as Blob);
const canvasRef = useTemplateRef("cropperCanvas");
const cropper = ref<Cropper>();
const cs = async () => {
  const cs = cropper.value?.getCropperSelection();
  const ci = cropper.value?.getCropperImage();
  const cc = cropper.value?.getCropperCanvas();
  const tc = await cs?.$toCanvas();
  // console.log(cs, ci, cc, tc);
  // console.log(typeof );
  tc?.toBlob((blob) => {
    if (blob) {
      croppedURL.value = URL.createObjectURL(blob);
      console.log("blob", blob);
    }
  }, "image/jpg");
};

onMounted(() => {
  cropper.value = new Cropper(img, {
    container: canvasRef.value as HTMLDivElement,
  });

  console.log(cropper, canvasRef.value);
  // cropper.value?.getCropperSelection()?.onchange?(function(e:Event){
  //   console.log(e);

  // }
  // )
});
</script>
<template>
  <div>
    <UButton @click="cs">Crop Image</UButton>
    <div class="grid grid-cols-2 gap-2">
      <div ref="cropperCanvas" id="cropperCanvas" />
      <NuxtImg :src="croppedURL || objectURL" width="h-[300px] w-[300px]" />
    </div>
  </div>
</template>
<style scoped>
#cropperCanvas {
  :deep(cropper-canvas) {
    height: 300px;
    width: 300px;
  }
}
</style>
