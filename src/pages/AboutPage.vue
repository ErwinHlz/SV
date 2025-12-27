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
  <section class="widgetShell">
    <h2>letzte und nächste spiele</h2>
    <div
      class="fussballde_widget"
      data-id="3bddcced-1dbc-4f7b-baf1-ed4126600967"
      data-type="team-matches"
      style="width: 100%">
    </div>
  </section>
  <section class="widgetShell">
    <h2>Spielberichte</h2>
    <div
      class="fussballde_widget"
      data-id="add4de41-6c00-4bcc-b8a4-fbfe9ba93ff0"
      data-type="news"
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
}
</style>
