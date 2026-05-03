<template>
  <section class="section">
    <div class="home-stage">
      <HeroComponent class="home-hero" />
      <MatchHighlights />
    </div>
  </section>
  <NewsSection />
  <TermineSection />
</template>

<script setup>
import HeroComponent from "../components/HeroComponent.vue";
import MatchHighlights from "../components/MatchHighlights.vue";
import NewsSection from "../components/NewsSection.vue";
import TermineSection from "../components/TermineSection.vue";
</script>

<style scoped>
.home-hero {
  width: 80dvw;
}

.section {
  height: calc(100dvh - var(--sv-header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
  scroll-margin-top: var(--sv-header-height);
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  overflow: hidden;
}

.home-stage {
  width: 100%;
  height: min(70dvh, calc(100dvh - var(--sv-header-height) - 32px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5dvh;
  position: relative;
  top: -5dvh;
}

.home-hero :deep(.heroRow) {
  height: clamp(240px, 46dvh, 420px);
  min-height: 0;
}

@media (max-width: 900px) {
  .section {
    height: auto;
    min-height: calc(100dvh - var(--sv-header-height));
    padding: 12px 0 24px;
    overflow: visible;
  }

  .home-hero {
    width: calc(100dvw - 24px);
  }

  .home-stage {
    height: auto;
    min-height: 0;
    gap: 16px;
    top: 0;
  }

  .home-hero :deep(.heroRow) {
    height: auto;
  }
}
</style>
