<script setup lang="ts"></script>

<template>
  <!--  :style="{ backgroundImage: `url(${bgUrl})` }" -->
  <div class="bg-cover bg-center">
    <UContainer
      :ui="{
        constrained: 'max-w-4xl',
        base: 'h-screen content-center',
      }"
    >
      <div class="flex justify-center">
        <slot />
      </div>
    </UContainer>
  </div>
</template>
