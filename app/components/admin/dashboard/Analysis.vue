<script lang="ts" setup>
import { UPageCard } from "#components";
import { Chart } from "chart.js/auto";
import type { ProductAnalysis } from "~~/shared/types";

const { analysis } = defineProps<{
  analysis: ProductAnalysis;
}>();
const analysisData = ref<ProductAnalysis>(analysis);

// Sentiment Breakdown per product
const sentimentCharts = useTemplateRef<HTMLCanvasElement>("sentimentCharts");

const isAnalysisAvailable = ref<boolean>(false);
if (
  analysisData.value.highlight !== "" &&
  analysisData.value.average_rating! > 0
) {
  isAnalysisAvailable.value = true;
} else {
  isAnalysisAvailable.value = false;
}

const onGenerating = ref<boolean>(false);

const generateAnalysis = async () => {
  // Emit event to parent to generate analysis
  // console.log("Generate analysis for", analysisData.value.name);
  // emit("generate-analysis", productId);
  onGenerating.value = true;
  const data = await $fetch<ProductAnalysis>(
    "/api/analysis/analyze/product/" + analysisData.value.product,
    {
      onResponse: () => {
        onGenerating.value = false;
      },
    }
  );
  analysisData.value = data;
  isAnalysisAvailable.value = true;
};

onMounted(() => {
  if (sentimentCharts.value) {
    new Chart(sentimentCharts.value!.getContext("2d")!, {
      type: "pie",
      data: {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            data: [
              analysisData.value.sentiment!.positive || 0,
              analysisData.value.sentiment!.neutral || 0,
              analysisData.value.sentiment!.negative || 0,
            ],
            backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
            borderWidth: 2,
          },
        ],
      },
      options: { plugins: { legend: { display: false } }, cutout: "70%" },
    });
  }
});
</script>
<template>
  <UPageCard v-if="isAnalysisAvailable" class="p-6 rounded-2xl shadow">
    <!-- Header -->

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left: Sentiment Chart -->
      <div>
        <canvas ref="sentimentCharts" height="100"></canvas>

        <div class="flex justify-around mt-4 text-center">
          <div>
            <p class="text-green-600 font-bold">
              {{ analysisData.sentiment!.positive }}%
            </p>
            <p class="text-sm text-gray-300">Positive</p>
          </div>
          <div>
            <p class="text-yellow-500 font-bold">
              {{ analysisData.sentiment!.neutral }}%
            </p>
            <p class="text-sm text-gray-300">Neutral</p>
          </div>
          <div>
            <p class="text-red-500 font-bold">
              {{ analysisData.sentiment!.negative }}%
            </p>
            <p class="text-sm text-gray-300">Negative</p>
          </div>
        </div>
        <p class="mt-4 text-gray-300">
          <span class="font-bold">NPS (Adapted):</span>
          <span class="text-green-600 font-semibold">{{
            analysisData.net_promoter_score
          }}</span>
        </p>
      </div>

      <!-- Right: AI Insights -->
      <div class="space-y-4 col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ analysisData.name }}</h2>
          <span
            class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full"
            >{{ analysisData.average_rating }} ★ Avg Rating</span
          >
        </div>
        <p class="font-semibold text-gray-200 mb-2">Sentiment Breakdown</p>
        <div>
          <p class="font-semibold text-gray-200">AI Summary</p>
          <p class="text-gray-300 text-sm">{{ analysisData.summary }}</p>
        </div>
        <div>
          <p class="font-semibold text-gray-200">Top Themes</p>
          <ul class="list-disc list-inside text-sm text-gray-300">
            <li v-for="(theme, tIndex) in analysisData.themes" :key="tIndex">
              {{ theme }}
            </li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-gray-200">Highlighted Feedback</p>
          <blockquote
            class="border-l-4 border-gray-300 pl-3 italic text-gray-300 text-sm"
          >
            {{ analysisData.highlight }}
          </blockquote>
        </div>
      </div>
    </div>
  </UPageCard>
  <UPageCard v-else class="p-6 rounded-2xl shadow">
    <div
      class="w-auto mx-auto max-w-xs flex flex-col gap-5 justify-content-center"
    >
      <h2 class="text-2xl font-bold">{{ analysisData.name }}</h2>
      <p class="text-gray-300 text-center">No analysis available.</p>
      <UButton
        :loading="onGenerating"
        class="mx-auto"
        label="Generate Analysis"
        trailing-icon="i-simple-icons-googlegemini"
        color="primary"
        @click="generateAnalysis"
      />
    </div>
  </UPageCard>
</template>

<style></style>
