<script setup lang="ts">
import Cropper, {
  CropperCanvas,
  CropperImage,
  CropperHandle,
  CropperCrosshair,
  CropperSelection,
  CropperGrid,
} from "cropperjs";
type SelectionProperty = {
  height: number;
  width: number;
  x: number;
  y: number;
};
CropperCanvas.$define();
CropperImage.$define();
CropperHandle.$define();
CropperCrosshair.$define();
CropperSelection.$define();
CropperGrid.$define();

const { $pb } = useNuxtApp();
const record = await $pb.collection("merchant").getOne("x66966zmzugrkt9");
const imgURL = $pb.files.getURL(record, record.image_background);
const canvasRef = useTemplateRef<CropperCanvas>("cropperCanvas");
const cropper = ref<Cropper>();
const { data: imageBlob } = await useFetch(imgURL);
const { width, height } = await getImageDimensions(imageBlob.value as File);
const img = new Image();
img.width = 500;
img.height = 100;
img.src = URL.createObjectURL(imageBlob.value as Blob);
const CImage = h("cropper-image", {
      src: img.src,
      alt: "image",
      rotatable: true,
      scalable: true,
      skewable: true,
      translatable: true,
      //   sizes: 300,
    }),
const CShade = h("cropper-shade", { hidden: true }),
const CHandleSelect = h("cropper-handle", { action: "select", plain: true }),
const CGrid = h("cropper-grid", { role: "grid", covered: true }),
const CCrosshair =  h("cropper-crosshair", { centered: true }),
const CSelection = h(
      "cropper-selection",
      {
        movable: true,
        intialCoverage: "0.5",
        resizable: true,
      },
      [
        CGrid,
        CCrosshair,
        h("cropper-handle", {
          action: "move",
          themeColor: "rgba(255,255,255,0.35)",
        }),
        h("cropper-handle", {
          action: "n-resize",
        }),
        h("cropper-handle", {
          action: "e-resize",
        }),
        h("cropper-handle", {
          action: "s-resize",
        }),
        h("cropper-handle", {
          action: "w-resize",
        }),
        h("cropper-handle", {
          action: "ne-resize",
        }),
        h("cropper-handle", {
          action: "nw-resize",
        }),
        h("cropper-handle", {
          action: "se-resize",
        }),
        h("cropper-handle", {
          action: "sw-resize",
        }),
      ]
    ),
const canvasEl = h(
  "cropper-canvas",
  { background: true, style: `width:300px;height:300px` },
  [
    CImage,
    CShade,
    CHandleSelect,
    CSelection
  ]
);

// [
//   h("cropper-image", {
//     src: img.src,
//     alt: "image",
//   }),
//   h(
//     "cropper-selection",
//     {
//       movable: true,
//       intialCoverage: "0.5",
//     },
//     [
//       h("cropper-grid", { role: "grid", covered: true }),
//       h("cropper-crosshair", { centered: true }),
//       h("cropper-handle", {
//         action: "move",
//         themeColor: "rgba(255,255,255,0.35)",
//       }),
//     ]
//   ),
// ]

onMounted(() => {
  //   cropper.value = new Cropper(img, {
  //     container: canvasRef.value as HTMLDivElement,
  //   });
  // viewer.value = `<cropper-viewer
  //     selection="#cropperSelection"
  //     style="width: 320px"
  //   ></cropper-viewer>`;
  console.log(canvasRef.value.);
});
</script>
<template>
  <div>
    <!-- <div
      ref="cropperCanvas"
      class="w-full h-[500px] bg-primary"
      id="cropperCanvas"
    ></div> -->
    <!-- <h1>kldfghidhf</h1> -->
    <component :is="canvasEl" ref="cropperCanvas"></component>
  </div>
</template>
