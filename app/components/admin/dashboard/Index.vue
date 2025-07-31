
<script setup lang="ts">
// import { ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import type { ProductStat } from '~~/shared/types'

const kpis = [
  { label: 'Total Responses', value: '1,248' },
  { label: 'Unique Respondents', value: '980' },
  { label: 'Average Rating', value: '⭐ 4.2 / 5' },
  { label: 'Response Rate', value: '42%', class: 'text-blue-600' },
  { label: 'Completion Rate', value: '85%', class: 'text-green-600' }
]

const products: ProductStat[] = [
  {
    name: '🔥 Hot Noodles',
    avgRating: 4.3,
    sentiment: { positive: 65, neutral: 20, negative: 15 },
    nps: 52,
    summary: 'Customers love the spicy flavor and portion size. Some complain about packaging leakage.',
    themes: [
      'Taste → 80% positive',
      'Packaging → 45% negative',
      'Price → 70% positive'
    ],
    quote: '“The noodles are delicious, but the cup leaks sometimes.”'
  },
  {
    name: '🔥 Jebew Noodles',
    avgRating: 4.9,
    sentiment: { positive: 70, neutral: 25, negative: 5 },
    nps: 52,
    summary: 'Customers love the spicy flavor and portion size. Some complain about packaging leakage.',
    themes: [
      'Taste → 80% positive',
      'Packaging → 45% negative',
      'Price → 70% positive'
    ],
    quote: '“The noodles are delicious, but the cup leaks sometimes.”'
  }
] 

const feedbackChart = useTemplateRef<HTMLCanvasElement>("feedbackChart")
const completionChart = useTemplateRef<HTMLCanvasElement>("completionChart")
// const sentimentCharts = useTemplateRef<HTMLCanvasElement>("sentimentCharts")

onMounted(() => {
  // Feedback Volume Over Time
  new Chart(feedbackChart.value!.getContext('2d')!, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Responses',
        data: [120, 190, 150, 220, 300, 250, 400],
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34,197,94)',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 50 } } }
    }
  })

  // Completion vs Abandoned
  new Chart(completionChart.value!.getContext('2d')!, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Abandoned'],
      datasets: [{
        data: [85, 15],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderWidth: 2
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } }, cutout: '70%' }
  })

  // Sentiment Breakdown per product
//   products.forEach((product, index) => {
//     const ctx = sentimentCharts.value[index].getContext('2d')
//     new Chart(ctx, {
//       type: 'doughnut',
//       data: {
//         labels: ['Positive', 'Neutral', 'Negative'],
//         datasets: [{
//           data: [product.sentiment.positive, product.sentiment.neutral, product.sentiment.negative],
//           backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
//           borderWidth: 2
//         }]
//       },
//       options: { plugins: { legend: { display: false } }, cutout: '70%' }
//     })
//   })
})
</script>
<template>
    <!-- Header -->
    <!-- <h1 class="text-3xl font-bold mb-6">Feedback Dashboard</h1> -->

    <!-- KPI Cards -->

    <UPageGrid  class="lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-px">
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
    <UPageCard class="grid grid-cols-2 md:grid-cols-1 gap-6 my-8" orientation="horizontal">
      <div class=" p-6 rounded-2xl shadow">
        <h2 class="text-xl font-semibold mb-4">Feedback Volume Over Time</h2>
        <canvas ref="feedbackChart" height="100"></canvas>
      </div>

      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Completion vs Abandoned</h2>
        <canvas ref="completionChart" height="100"></canvas>
      </div>
    </UPageCard>
    <!-- Product Feedback Cards -->
    <div class="grid grid-cols-1 gap-6">
      <AdminDashboardPerProduct
        v-for="(product, index) in products"
        :key="index"
        :product="product"
      />
    </div>
</template>

