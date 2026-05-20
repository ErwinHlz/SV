<template>
  <div> About</div>
  <section class="widgetShell">
    <h2>Aktuelle Tabelle</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      data-id="6bdd5140-b8f6-4e0f-b8df-b098fee30e6e"
      data-type="table"
      placeholder-title="Tabelle von fussball.de"
      placeholder-description="Die aktuelle Tabelle wird erst geladen, wenn du externe Inhalte zulässt."
      fallback-url="https://www.fussball.de/"
      fallback-label="fussball.de öffnen" />
  </section>
  <section class="widgetShell">
    <h2>letzte und nächste spiele</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      data-id="3bddcced-1dbc-4f7b-baf1-ed4126600967"
      data-type="team-matches"
      placeholder-title="Spiele von fussball.de"
      placeholder-description="Die Spielansicht wird erst geladen, wenn du externe Inhalte zulässt."
      fallback-url="https://www.fussball.de/"
      fallback-label="fussball.de öffnen" />
  </section>
  <section class="widgetShell">
    <h2>Spielberichte</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      data-id="add4de41-6c00-4bcc-b8a4-fbfe9ba93ff0"
      data-type="news"
      placeholder-title="Spielberichte von fussball.de"
      placeholder-description="Die Spielberichte werden erst geladen, wenn du externe Inhalte zulässt."
      fallback-url="https://www.fussball.de/"
      fallback-label="fussball.de öffnen" />
  </section>
</template>

<script setup>
import ConsentControlledWidget from "@/components/ConsentControlledWidget.vue";
</script>

<style scoped>
.widgetShell {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 12px;
}
</style>
