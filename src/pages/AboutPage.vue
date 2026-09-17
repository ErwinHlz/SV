<template>
  <div> About</div>
  <section class="widgetShell">
    <h2>Aktuelle Tabelle</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      :data-id="externalLinks.fussballde.widgets.about.tabelle"
      data-type="table"
      placeholder-title="Tabelle von fussball.de"
      placeholder-description="Die aktuelle Tabelle wird erst geladen, wenn du externe Inhalte zulässt."
      :fallback-url="externalLinks.fussballde.homepageUrl"
      :fallback-label="externalLinks.fussballde.fallbackLabel" />
  </section>
  <section class="widgetShell">
    <h2>letzte und nächste spiele</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      :data-id="externalLinks.fussballde.widgets.about.spiele"
      data-type="team-matches"
      placeholder-title="Spiele von fussball.de"
      placeholder-description="Die Spielansicht wird erst geladen, wenn du externe Inhalte zulässt."
      :fallback-url="externalLinks.fussballde.homepageUrl"
      :fallback-label="externalLinks.fussballde.fallbackLabel" />
  </section>
  <section class="widgetShell">
    <h2>Spielberichte</h2>
    <ConsentControlledWidget
      provider="fussballde"
      widget-class="fussballde_widget"
      :data-id="externalLinks.fussballde.widgets.about.spielberichte"
      data-type="news"
      placeholder-title="Spielberichte von fussball.de"
      placeholder-description="Die Spielberichte werden erst geladen, wenn du externe Inhalte zulässt."
      :fallback-url="externalLinks.fussballde.homepageUrl"
      :fallback-label="externalLinks.fussballde.fallbackLabel" />
  </section>
</template>

<script setup>
import ConsentControlledWidget from "@/components/ConsentControlledWidget.vue";
import externalLinks from "@/content/external-links.json";
</script>

<style scoped>
.widgetShell {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 12px;
}
</style>
