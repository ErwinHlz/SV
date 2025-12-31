<template>
  <section class="section flex flex-col gap-20">
    <HeroComponent class="home-hero" />
    <div class="spiele" id="fp-widget_root-37QicSEXzGwJsZJ8wGteBUCutrW"
      ><a
        href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
        target="_blank"
        rel="noopener"
        >FSG Ottweiler-Steinbach auf FuPa</a
      ></div
    >
  </section>
  <NewsSection />
  <TermineSection />
</template>

<script setup>
import HeroComponent from "../components/HeroComponent.vue";
import NewsSection from "../components/NewsSection.vue";
import TermineSection from "../components/TermineSection.vue";
</script>

<style scoped>
.home-hero {
  width: 80dvw;
}

.section {
  min-height: calc(100dvh - var(--sv-header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  scroll-margin-top: var(--sv-header-height);
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.spiele {
  overflow: scroll;
  width: 80dvw;
  height: 15dvh;
}
</style>
