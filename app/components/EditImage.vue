<script lang="ts" setup>
import {
  CropperCanvas,
  CropperCrosshair,
  CropperImage,
  CropperGrid,
  CropperHandle,
  CropperSelection,
  CropperShade,
} from "vue-cropperjs2";

const props = defineProps<{ image: File }>();
const emit = defineEmits(["success"]);

const originalImage = URL.createObjectURL(props.image);
function onSuccess() {
  emit("success");
}
</script>

<template>
  <UModal fullscreen>
    <UCard>
      <UButton @click="onSuccess"> Click to emit a success event </UButton>

      <CropperCanvas :background="true">
        <CropperImage
          :src="originalImage"
          alt="Picture"
          :rotatable="true"
          :scalable="true"
          :skewable="true"
          :translatable="true"
        />
        <CropperShade :hidden="true" />
        <!-- <CropperHandle action="select" :plain="true" /> -->
        <CropperSelection
          :movable="true"
          :resizable="false"
          :width="400"
          :height="300"
          id="Sel"
        >
          <!-- :initial-coverage="0.5" -2> -->
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
      </CropperCanvas>
    </UCard>
  </UModal>
</template>
