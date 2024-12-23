<script setup lang="ts">
// import { CropperCanvas } from "cropperjs";
// type CropperCanvasProps = {
//   background?: boolean;
//   disabled?: boolean;
//   scaleStep?: number;
//   themeColor?: string;
// };

// const canvasRef = useTemplateRef<CropperCanvas>("canvasRef");

// CropperCanvas.$define();

// const {
//   background = false,
//   disabled = false,
//   scaleStep = 0.1,
//   themeColor = "#39f",
// } = defineProps<CropperCanvasProps>();

// const el = h("cropper-canvas", {
//   background,
//   disabled,
//   scaleStep,
//   themeColor,
//   style: "height: 500px",
// });
// const $setAction = canvasRef.value?.$setAction;
// const $toCanvas = canvasRef.value?.$toCanvas;

// defineExpose({
//   $setAction,
//   $toCanvas,
// });

import {
  CropperCanvas,
  CropperCrosshair,
  CropperImage,
  CropperGrid,
  CropperHandle,
  CropperSelection,
  CropperShade,
} from "vue-cropperjs2";
// const props = defineProps<{ image?: File }>();
const imageFile = ref<File | null>(null);
if (!imageFile.value) {
  await useFetch<File>(
    "http://127.0.0.1:8090/api/files/kqsl9ce7d20tynj/x66966zmzugrkt9/whats_app_image_2024_10_05_at_8_40_NT9JtCG744.36AM1.jpeg?token=",
    {
      onResponse: ({ response }) => {
        imageFile.value = response._data;
      },
    }
  );
}
const originalImage = URL.createObjectURL(imageFile.value!);
</script>

<template>
  <CropperCanvas style="width: 500px; height: 300px" :background="true">
    <!-- <component :is="el" ref="canvasRef"> -->
    <CropperImage
      :src="originalImage"
      alt="Picture"
      :rotatable="true"
      :scalable="true"
      :skewable="true"
      :translatable="true"
    />
    <CropperShade :hidden="true" />
    <CropperHandle action="select" :plain="true" />
    <CropperSelection
      :movable="true"
      :resizable="true"
      :initial-coverage="0.5"
      id="Sel"
    >
      <CropperGrid role="grid" :covered="true" />
      <CropperCrosshair :centered="true" />
      <CropperHandle action="move" theme-color="rgba(255, 255, 255, 0.1)" />
      <CropperHandle action="n-resize" />
      <CropperHandle action="e-resize" />
      <CropperHandle action="s-resize" />
      <CropperHandle action="w-resize" />
      <CropperHandle action="ne-resize" />
      <CropperHandle action="nw-resize" />
      <CropperHandle action="se-resize" />
      <CropperHandle action="sw-resize" />
    </CropperSelection>
    <!-- </component> -->
  </CropperCanvas>
  <h1>hsjfhjsd</h1>
</template>
