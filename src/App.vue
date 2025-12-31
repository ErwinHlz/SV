<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
  <SiteHeader />
  <main class="app-content">
    <RouterView />
    <SiteFooter />
  </main>
</template>
