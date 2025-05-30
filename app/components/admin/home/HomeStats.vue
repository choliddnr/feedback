<script setup lang="ts">
import type { Period, Range } from "~~/shared/types";
import type { Stat } from "~~/shared/types";

const props = defineProps<{
  period: Period;
  range: Range;
}>();
const { active_merchant } = storeToRefs(useMerchantsStore());
const { data } = await useFetch<{
  respondent: number;
  response: number;
  avg_rating: number;
}>(() => "/api/statistics/" + active_merchant.value, {
  watch: [active_merchant],
});

const stats = computed<Stat[]>(() => [
  {
    title: "Respondents",
    icon: "i-lucide-users",
    value: data.value!.respondent === undefined ? 0 : data.value!.respondent,
    variation: 10,
  },
  {
    title: "Response",
    icon: "i-lucide-clipboard-pen-line",
    value: data.value!.response,
    variation: 10,
  },
  {
    title: "Rating",
    icon: "i-lucide-star",
    value:
      data.value!.avg_rating === null ? 0.0 : data.value!.avg_rating.toFixed(1),
    variation: 10,
  },
]);
</script>

<template>
  <UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      orientation="horizontal"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-center',
        leading:
          'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>

        <!-- <UBadge
          :color="stat.variation > 0 ? 'success' : 'error'"
          variant="subtle"
          class="text-xs"
        >
          {{ stat.variation > 0 ? "+" : "" }}{{ stat.variation }}%
        </UBadge> -->
      </div>
    </UPageCard>
  </UPageGrid>
</template>
