<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
</script>

<template>
  <SiteHeader />
  <main class="app-content">
    <div class="app-page">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
