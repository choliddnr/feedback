<script setup lang="ts">
import { UButtonGroup } from "#components";
import {
  CropperCanvas,
  CropperImage,
  CropperCrosshair,
  CropperGrid,
  CropperHandle,
  CropperSelection,
  CropperShade,
} from "vue-cropperjs2";

const imageBlob = defineModel("imageBlob", { type: Blob, default: new Blob() });
const emit = defineEmits(["cancel"]);
const props = defineProps<{ image: string }>();
const selectionRef = useTemplateRef<any>("sel");
const imageRef = useTemplateRef<any>("imageRef");
const isZoomable = ref<boolean>(true);

const convertCanvasToWebp = async (
  canvas: HTMLCanvasElement
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // resolve(URL.createObjectURL(blob));
          resolve(blob);
        } else {
          reject("Converting failed");
        }
      },
      "image/webp",
      0.9
    );
  });
};

const onSave = async () => {
  // const scale = 1280 / selectionRef.value.selection.width - 1;
  // console.log("scale", scale);
  isZoomable.value = true;
  selectionRef.value.selection.$zoom(1);
  imageRef.value.image.$zoom(1);
  // imageRef.value.$center();
  console.log("zoomed", selectionRef.value.selection, imageRef.value.image);
  isZoomable.value = false;
  // const canvas =
  //   (await selectionRef.value.selection.$toCanvas()) as HTMLCanvasElement;
  // imageBlob.value = await convertCanvasToWebp(canvas);
  // console.log("blob", imageBlob.value);
};
watch(selectionRef, () => {
  if (selectionRef.value) {
    console.log("sel", selectionRef.value.selection);
    isZoomable.value = true;
    // imageRef.value.$scale(0.1);
    selectionRef.value.selection.$zoom(-2);
    // selectionRef.value.selection.$zoom(-2);
    selectionRef.value.selection.$center();
    isZoomable.value = false;
  }
});
const onChange = (e: any) => {
  console.log("changed", e.detail.width, e.detail.height);
};
</script>
<template>
  <UModal :prevent-close="true" fullscreen>
    <UCard>
      <CropperCanvas background>
        <CropperImage
          :src="props.image"
          alt="Picture"
          rotatable
          scalable
          skewable
          translatable
          ref="imageRef"
        ></CropperImage>
        <CropperHandle
          action="move"
          theme-color="rgba(255, 255, 255, 0.0)"
        ></CropperHandle>
        <CropperShade hidden></CropperShade>
        <!-- :initial-coverage="0.5" -->
        <CropperSelection
          :zoomable="isZoomable"
          ref="sel"
          :width="1280"
          :height="720"
          @change="onChange"
        >
          <CropperGrid role="grid" covered></CropperGrid>
          <CropperCrosshair centered></CropperCrosshair>
          <CropperHandle
            action="move"
            theme-color="rgba(255, 255, 255, 0.0)"
          ></CropperHandle>
          <CropperHandle action="n-resize" />
          <CropperHandle action="e-resize" />
          <CropperHandle action="s-resize" />
          <CropperHandle action="w-resize" />
          <CropperHandle action="ne-resize" />
          <CropperHandle action="nw-resize" />
          <CropperHandle action="se-resize" />
          <CropperHandle action="sw-resize" />
        </CropperSelection>
      </CropperCanvas>
      <div class="w-ful mt-4">
        <UButtonGroup size="md" orientation="horizontal" class="w-1/2 my-3">
          <UButton
            @click="onSave"
            class="w-full justify-center"
            leading-icon="i-heroicons-document-check-16-solid"
            >Simpan</UButton
          >
          <UButton
            @click="emit('cancel')"
            color="error"
            class="w-full justify-center"
            leading-icon="i-heroicons-x-mark-16-solid"
            >Batal</UButton
          >
        </UButtonGroup>
      </div>
    </UCard>
  </UModal>
</template>
