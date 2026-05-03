<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
  <SiteHeader />
  <main class="app-content">
    <div class="app-page">
      <RouterView />
    </div>
    <SiteFooter />
  </main>
</template>

<style scoped>
.app-page {
  flex: 1 0 auto;
}
</style>
