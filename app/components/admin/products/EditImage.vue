<script setup lang="ts">
import {
  CropperCanvas,
  CropperImage,
  CropperCrosshair,
  CropperGrid,
  CropperHandle,
  CropperSelection,
  CropperShade,
} from 'vue-cropperjs2';

const imageBlob = defineModel('imageBlob', { type: Blob });
const emit = defineEmits(['cancel']);
const props = defineProps<{ image: string }>();
const selectionRef = useTemplateRef<any>('sel');

const convertCanvasToWebp = async (
  canvas: HTMLCanvasElement,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject('Converting failed');
        }
      },
      'image/webp',
      0.9,
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
  <UModal :close="{ onClick: () => emit('cancel') }">
    <template #content>
      <UCard>
        <CropperCanvas background>
          <CropperImage
            :src="props.image"
            alt="Picture"
            rotatable
            scalable
            skewable
            translatable
          />
          <CropperShade hidden/>
          <CropperSelection
            ref="sel"
            :initial-coverage="0.5"
            movable
            :width="500"
            :height="800"
          >
            <CropperGrid role="grid" covered/>
            <CropperCrosshair centered/>
            <CropperHandle
              action="move"
              theme-color="rgba(255, 255, 255, 0.0)"
            />
          </CropperSelection>
        </CropperCanvas>
        <div class="w-ful mt-4">
          <UButtonGroup size="md" orientation="horizontal" class="w-1/2 my-3">
            <UButton
              class="w-full justify-center"
              leading-icon="i-heroicons-document-check-16-solid"
              @click="onSave"
              >Save</UButton
            >
            <UButton
              color="error"
              class="w-full justify-center"
              leading-icon="i-heroicons-x-mark-16-solid"
              @click="emit('cancel')"
              >Cancel</UButton
            >
          </UButtonGroup>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
