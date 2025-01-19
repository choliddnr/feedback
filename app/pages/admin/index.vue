<script lang="ts" setup>
import { useUserStore } from "../../stores/user";
definePageMeta({
  layout: "dashboard",
});
const { user } = storeToRefs(useUserStore());
const theUser = user;
console.log("fetch", user.value?.picture);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Total Items" badge="0">
        <template #right>
          <!-- ref="searchItem" -->
          <!-- v-model="searchItem"
          @keyup="searchDebounch" -->
          <UInput
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter items..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton
            label="New Item"
            trailing-icon="i-heroicons-plus"
            color="gray"
          />
          <!-- @click="openAddForm" -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- v-model="selectedCategories" -->
          <!-- :options="itemCategories" -->
          <USelectMenu
            icon="i-heroicons-document-text"
            placeholder="Categories"
            optionAttribute="title"
            valueAttribute="id"
            multiple
          />
        </template>
      </UDashboardToolbar>

      <!-- <Table /> -->
    </UDashboardPanel>
  </UDashboardPage>
</template>
