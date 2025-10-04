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
const chart = ref<Chart>();
const generateAnalysis = async () => {
  onGenerating.value = true;
  try {
    const data = await $fetch<ProductAnalysis>(
      "/api/analysis/analyze/product/" + analysisData.value.product
    );
    analysisData.value = {
      product: analysisData.value.product,
      name: analysisData.value.name,
      ...data,
    };
    isAnalysisAvailable.value = true;

    await nextTick();

    if (sentimentCharts.value) {
      if (chart.value) chart.value.destroy();
      drawChart(sentimentCharts.value);
    }
  } catch (error) {
    console.error("Failed to generate analysis:", error);
  } finally {
    onGenerating.value = false;
  }
};

const drawChart = (canvas: HTMLCanvasElement) => {
  chart.value = new Chart(canvas.getContext("2d")!, {
    type: "pie",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: [
            analysisData.value.sentiment?.positive || 0,
            analysisData.value.sentiment?.neutral || 0,
            analysisData.value.sentiment?.negative || 0,
          ],
          backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
          borderWidth: 2,
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });
};

onMounted(() => {
  if (sentimentCharts.value) {
    drawChart(sentimentCharts.value);
  }
});
</script>
<template>
  <UPageCard v-if="isAnalysisAvailable">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">{{ analysisData.name }}</h2>
        <div class="flex items-center gap-4">
          <span
            class="px-3 py-1 text-sm rounded-full"
            :class="[
              analysisData.average_rating && analysisData.average_rating >= 4
                ? 'bg-green-100 text-green-700'
                : analysisData.average_rating &&
                  analysisData.average_rating >= 2
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700',
            ]"
            >{{ analysisData.average_rating }} ★ Avg Rating</span
          >
          <UButton
            :loading="onGenerating"
            size="xs"
            label="Re-Generate Analysis"
            trailing-icon="i-simple-icons-googlegemini"
            color="primary"
            @click="generateAnalysis"
          />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
      <!-- Left (2/5): Chart and Stats -->
      <div class="md:col-span-2 flex flex-col gap-6">
        <UCard :ui="{ body: 'p-4 sm:p-4' }">
          <canvas ref="sentimentCharts" height="150"></canvas>
        </UCard>
        <UCard :ui="{ body: 'p-4 sm:p-6' }">
          <div class="flex justify-around text-center mb-4">
            <div>
              <p class="text-lg font-bold text-green-500">
                {{ analysisData.sentiment!.positive }}%
              </p>
              <p class="text-sm text-gray-400">Positive</p>
            </div>
            <div>
              <p class="text-lg font-bold text-yellow-500">
                {{ analysisData.sentiment!.neutral }}%
              </p>
              <p class="text-sm text-gray-400">Neutral</p>
            </div>
            <div>
              <p class="text-lg font-bold text-red-500">
                {{ analysisData.sentiment!.negative }}%
              </p>
              <p class="text-sm text-gray-400">Negative</p>
            </div>
          </div>
          <UDivider />
          <div class="flex flex-col gap-4 mt-4">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-gray-300">NPS (Adapted):</span>
              <span class="text-2xl font-bold text-primary">{{
                analysisData.net_promoter_score
              }}</span>
            </div>
            <div
              v-if="analysisData.un_analyzed_responses! > 0"
              class="flex justify-between items-center"
            >
              <span class="font-semibold text-gray-300">New Responses:</span>
              <UBadge size="lg">{{
                analysisData.un_analyzed_responses
              }}</UBadge>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Right (3/5): AI Insights -->
      <div class="md:col-span-3 flex flex-col gap-4">
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">AI Summary</h3>
          </template>
          <p class="text-sm text-gray-400 prose dark:prose-invert max-w-none">
            {{ analysisData.summary }}
          </p>
        </UCard>
        <UCard>
          <template #header>
            <h3 class="text-base font-semibold">Highlighted Feedback</h3>
          </template>
          <blockquote
            class="border-l-4 border-gray-500 pl-4 italic text-gray-400 text-sm"
          >
            "{{ analysisData.highlight }}"
          </blockquote>
        </UCard>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UCard v-if="analysisData.themes && analysisData.themes.length > 0">
            <template #header>
              <h3 class="text-base font-semibold">Top Themes</h3>
            </template>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(theme, i) in analysisData.themes"
                :key="i"
                color="primary"
                variant="soft"
                >{{ theme }}</UBadge
              >
            </div>
          </UCard>
          <UCard v-if="analysisData.trends && analysisData.trends.length > 0">
            <template #header>
              <h3 class="text-base font-semibold">Trends</h3>
            </template>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="(trend, i) in analysisData.trends"
                :key="i"
                color="info"
                variant="soft"
                >{{ trend }}</UBadge
              >
            </div>
          </UCard>
        </div>
        <UCard
          v-if="
            analysisData.recomendations &&
            analysisData.recomendations.length > 0
          "
        >
          <template #header>
            <h3 class="text-base font-semibold">Recomendations</h3>
          </template>
          <ul class="space-y-2">
            <li
              v-for="(rec, i) in analysisData.recomendations"
              :key="i"
              class="flex items-center gap-2 text-sm text-gray-400"
            >
              <UIcon name="i-heroicons-check-circle" class="text-green-500" />
              <span>{{ rec }}</span>
            </li>
          </ul>
        </UCard>
      </div>
    </div>
  </UPageCard>
  <UPageCard v-else>
    <div
      class="w-auto mx-auto flex flex-col gap-5 justify-center items-center p-8 text-center"
    >
      <UIcon
        name="i-heroicons-inbox-arrow-down"
        class="text-5xl text-gray-400"
      />
      <h2 class="text-2xl font-bold">{{ analysisData.name }}</h2>
      <p
        v-if="
          analysisData.un_analyzed_responses &&
          analysisData.un_analyzed_responses > 0
        "
        class="text-gray-400"
      >
        No analysis available. There are
        <span class="font-bold text-primary">{{
          analysisData.un_analyzed_responses
        }}</span>
        new responses to analyze.
      </p>
      <p v-else class="text-gray-400">
        No responses to analyze. Try to collect some feedback first.
      </p>
      <UButton
        v-if="
          analysisData.un_analyzed_responses &&
          analysisData.un_analyzed_responses > 0
        "
        :loading="onGenerating"
        size="lg"
        label="Generate Analysis"
        trailing-icon="i-simple-icons-googlegemini"
        color="primary"
        @click="generateAnalysis"
      />
    </div>
  </UPageCard>
</template>

<style></style>
