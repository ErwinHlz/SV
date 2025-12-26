<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
</script>

<template>
  <SiteHeader />
  <main class="app-content">
    <RouterView />
  </main>
</template>
