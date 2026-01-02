<template>
  <PageHero
    :image="newsHero"
    title="Unsere 1. Mannschaft"
    lead="Bezirksliga Ill/Theel" />
  <TeamOneNav />
  <div id="fp-widget_root-37fxNnaiMg36erHcuTi0Z4mtOdT" class="fupa-widget"
    ><a
      href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
      target="_blank"
      rel="noopener"
      >FSG Ottweiler-Steinbach auf FuPa</a
    ></div
  >
</template>

<script setup lang="ts">
import PageHero from "@/components/PageHero.vue";
import TeamOneNav from "@/components/TeamOneNav.vue";
import newsHero from "@/assets/header/background.png";
</script>

<style scoped>
.fupa-widget {
  justify-self: center;
  width: 80dvw;
  max-width: 80dvw;
}

.fupa-widget:nth-child(odd) {
  width: 80dvw !important;
  max-width: 80dvw !important;
}
</style>
