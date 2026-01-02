<template>
  <PageHero
    :image="newsHero"
    title="Unsere 1. Mannschaft"
    lead="Bezirksliga Ill/Theel" />
  <TeamOneNav />
  <div id="fp-widget_root-37fWCw2j1YrUsTr5q6mR3R1eCtF" class="fupa-widget"
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
.fupa-widget * {
  justify-self: center;
  background: transparent;
  color: white;
  font-family: Georgia, "Times New Roman", Times, serif;
  gap: 5px;
}
</style>
