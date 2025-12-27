<template>
  <div> About</div>
  <HeroComponent />
  <section class="widgetShell">
    <h2>Aktuelle Tabelle</h2>
    <div
      class="fussballde_widget"
      data-id="6bdd5140-b8f6-4e0f-b8df-b098fee30e6e"
      data-type="table"
      style="width: 100%">
    </div>
  </section>
</template>

<script setup>
import HeroComponent from "../components/HeroComponent.vue";
</script>

<style scoped>
.widgetShell {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
}
</style>
