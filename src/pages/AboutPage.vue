<template>
  <div> About</div>
  <HeroComponent />
  <FussballDeWidget
    container-id="widget-spielplan"
    widget-key="DEIN_KEY_SPIELPLAN" />
</template>

<script setup>
import HeroComponent from "../components/HeroComponent.vue";
import FussballDeWidget from "@/components/FussballDeWidget.vue";
</script>
