<script setup lang="ts">
const { selectedProductId, questions } = storeToRefs(useQuestionsStore());
selectedProductId.value = useRoute().params.id as string;
</script>
<template>
  <!-- <pre>{{ questions }}</pre> -->
  <div v-for="question in questions">
    <UDashboardSection :title="`${question.q} (${question.type})`">
      <template #description>
        <div v-if="question.answer_options" class="flex gap-1">
          <UBadge
            v-for="opt in question.answer_options"
            :label="opt"
            :ui="{ rounded: 'rounded-full' }"
          />
        </div>
      </template>
    </UDashboardSection>
    <UDivider />
  </div>
</template>
