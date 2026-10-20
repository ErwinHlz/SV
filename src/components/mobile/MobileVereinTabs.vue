<script setup lang="ts">
const subNav = [
  { label: "Verein", to: "/verein" },
  { label: "Historie", to: "/historie" },
  { label: "Mitgliedsantrag", to: "/mitglied-werden" },
];
</script>

<template>
  <nav class="m-tabs verein-tabs" aria-label="Verein">
    <RouterLink
      v-for="item in subNav"
      :key="item.to"
      :to="item.to"
      class="m-tab"
      exact-active-class="is-active">
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.verein-tabs {
  margin: 14px var(--m-gutter) 0;
  padding: 0;
}
</style>
