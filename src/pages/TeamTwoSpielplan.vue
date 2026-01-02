<template>
  <PageHero
    :image="newsHero"
    title="Unsere 2. Mannschaft"
    lead="Kreisklasse A" />
  <TeamOneNav base-path="/teams/two" team-label="2. Mannschaft" />
  <div id="fp-widget_root-37g8gKZ2bVAje4WU6hjFa8l1TQX" class="fupa-widget"
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
