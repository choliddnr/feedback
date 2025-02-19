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
  const canvas =
    (await selectionRef.value.selection.$toCanvas()) as HTMLCanvasElement;
  imageBlob.value = await convertCanvasToWebp(canvas);
};
</script>
<template>
  <UModal :prevent-close="true">
    <UCard>
      <CropperCanvas background>
        <CropperImage
          :src="props.image"
          alt="Picture"
          rotatable
          scalable
          skewable
          translatable
        ></CropperImage>
        <CropperShade hidden></CropperShade>
        <CropperSelection
          :initial-coverage="0.5"
          movable
          :width="500"
          :height="500"
          ref="sel"
        >
          <CropperGrid role="grid" covered></CropperGrid>
          <CropperCrosshair centered></CropperCrosshair>
          <CropperHandle
            action="move"
            theme-color="rgba(255, 255, 255, 0.0)"
          ></CropperHandle>
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
            color="red"
            class="w-full justify-center"
            leading-icon="i-heroicons-x-mark-16-solid"
            >Batal</UButton
          >
        </UButtonGroup>
      </div>
    </UCard>
  </UModal>
</template>
