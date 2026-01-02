<template>
  <PageHero
    :image="newsHero"
    title="Unsere 2. Mannschaft"
    lead="Kreisklasse A" />
  <TeamOneNav base-path="/teams/two" team-label="2. Mannschaft" />
  <div id="fp-widget_root-37aqKSilbQ7bjar6peFCZK5GfeX" class="fupa-widget"
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
  background: transparent !important;
  justify-items: center;
}
</style>
