<script setup lang="ts">
import { Chart } from "chart.js/auto";
// import { useDashboard } from '~~/composables/useDashboard'

const { kpis, products, loading } = useDashboard();

const feedbackChart = useTemplateRef<HTMLCanvasElement>("feedbackChart");
const completionChart = useTemplateRef<HTMLCanvasElement>("completionChart");

onMounted(() => {
  // Feedback Volume Over Time
  new Chart(feedbackChart.value!.getContext("2d")!, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Responses",
          data: [120, 190, 150, 220, 300, 250, 400],
          borderColor: "rgb(34,197,94)",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "rgb(34,197,94)",
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { stepSize: 50 } },
      },
    },
  });
  // Completion vs Abandoned
  new Chart(completionChart.value!.getContext("2d")!, {
    type: "pie",
    data: {
      labels: ["Completed", "Abandoned"],
      datasets: [
        {
          data: [815, 15],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          enabled: true,
        },
      },
      cutout: "70%",
    },
  });
});
</script>
<template>
  <!-- KPI Cards -->
  <div v-if="loading" class="grid grid-cols-5 gap-4">
    <USkeleton v-for="i in 5" :key="i" class="h-24" />
  </div>
  <UPageGrid v-else class="lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(kpi, i) in kpis"
      :key="i"
      variant="subtle"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <p class="text-gray-300">{{ kpi.label }}</p>
      <p class="text-2xl font-bold" :class="kpi.class">{{ kpi.value }}</p>
    </UPageCard>
  </UPageGrid>

  <!-- Charts -->

  <UPageCard class="p-6 rounded-2xl shadow">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl shadow col-span-2">
        <h2 class="text-xl font-semibold mb-4">Feedback Volume Over Time</h2>
        <canvas ref="feedbackChart" height="100"></canvas>
      </div>
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Completion vs Abandoned</h2>
        <canvas ref="completionChart" height="100"></canvas>
      </div>
    </div>
  </UPageCard>
  <!-- Product Feedback Cards -->
  <div v-if="loading" class="grid grid-cols-1 gap-6">
    <USkeleton v-for="i in 2" :key="i" class="h-48" />
  </div>
  <div v-else class="grid grid-cols-1 gap-6">
    <AdminDashboardPerProduct
      v-for="(product, index) in products"
      :key="index"
      :product="product"
    />
  </div>
</template>
