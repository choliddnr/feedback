<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold">Welcome to the app</h1>
    <!-- <p class="text-lg">
      You are logged in as {{ $auth.user?.email }}
    </p>
    <button @click="$auth.signOut()" class="mt-4 btn btn-primary">
      Sign out
    </button> -->
  </div>
</template>
