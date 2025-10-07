<script lang="ts" setup>
import type { DateRange } from "~~/shared/types";
import DatePicker from "./DatePicker.vue";

// const props = defineProps<{
//   onAnalyze: (range: DateRange) => void;
// }>();

const emit = defineEmits(["analyze", "close"]);

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const range = ref<DateRange>({
  start: thirtyDaysAgo,
  end: new Date(),
});

const onAnalyzeClick = () => {
  //   props.onAnalyze(range.value);
  emit("analyze", range.value);
};

const onCancelClick = () => {
  emit("close");
};
</script>
<template>
  <UModal title="Select Date Range for Analysis">
    <template #description>
      To ensure the analysis is relevant, please select a date range for the
      responses. Older feedback may not be applicable if you've made recent
      improvements to your product.
    </template>
    <template #body>
      <div class="space-y-4">
        <p class="text-gray-400"></p>
        <div class="flex justify-center">
          <DatePicker v-model="range" />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row w-full justify-end gap-2">
        <UButton color="warning" variant="outline" @click="onCancelClick"
          >Cancel</UButton
        >
        <UButton @click="onAnalyzeClick">Analyze Responses</UButton>
      </div>
    </template>
  </UModal>
</template>
