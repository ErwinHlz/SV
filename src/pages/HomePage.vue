<template>
  <div class="scroll-container">
    <section class="section section--hero">
      <div class="home-stage">
        <HeroComponent class="home-hero" />
        <MatchHighlights class="home-highlights" />
      </div>
    </section>

    <section class="section section--matches">
      <div class="match-stage">
        <MatchHighlights class="matches-page" />
      </div>
    </section>

    <section class="section">
      <NewsSection />
    </section>

    <section class="section">
      <TermineSection />
    </section>
    <section class="section--footer">
      <SiteFooter />
    </section>
  </div>
</template>

<script setup>
import HeroComponent from "../components/HeroComponent.vue";
import MatchHighlights from "../components/MatchHighlights.vue";
import NewsSection from "../components/NewsSection.vue";
import TermineSection from "../components/TermineSection.vue";
import SiteFooter from "../components/SiteFooter.vue";
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

.match-stage {
  width: 100%;
  height: min(70dvh, calc(100dvh - var(--sv-header-height) - 32px));
  display: flex;
  align-items: center;
  justify-content: center;
}

.section--matches {
  display: none;
}

@media (max-width: 900px) {
  .section {
    height: 100dvh;

    overflow: hidden;
    padding-top: 0;
  }

  .home-hero {
    width: 100dvw;
    height: 100%;
    padding-top: 0;
  }

  .home-stage {
    width: 100dvw;
    height: 100%;
    min-height: 100%;
    justify-content: stretch;
    gap: 0;
    top: 0;
  }

  .home-highlights {
    display: none;
  }

  .section--matches {
    display: flex;
    height: 100dvh;
  }

  .match-stage {
    width: 100dvw;
    height: 100%;
  }

  .matches-page {
    width: 100dvw;
    height: 100%;
  }
}

@media (max-width: 640px) {
  .section {
    padding: 0;
  }

  .home-hero {
    width: 100dvw;
  }

  .home-stage {
    gap: 0;
  }

  .section--matches {
    padding: 0;
  }

  .match-stage {
    height: 100%;
  }

  .matches-page :deep(.match-strip) {
    width: 100dvw;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 0;
  }

  .matches-page :deep(.match-card) {
    min-height: 0;
    height: 100%;
    padding: 18px 14px;
    border: 0;
    box-shadow: none;
  }

  .matches-page :deep(.match-main) {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 12px;
  }

  .matches-page :deep(.team-logo) {
    width: 52px;
    height: 52px;
    flex-basis: 52px;
  }

  .matches-page :deep(.team-name) {
    font-size: 13px;
  }

  .matches-page :deep(.match-score) {
    font-size: 32px;
  }

  .matches-page :deep(.match-center) {
    min-width: 84px;
  }

  .matches-page :deep(.match-label) {
    font-size: 13px;
    text-align: center;
  }

  .matches-page :deep(.match-meta) {
    font-size: 12px;
  }

  .matches-page :deep(.match-card--link:hover),
  .matches-page :deep(.match-card--link:focus-visible) {
    scale: 1;
    box-shadow: none;
  }
}

@media (max-width: 767px) {
  .scroll-container {
    height: 100dvh;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
  }

  .section {
    height: 100dvh;
    min-height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .section--footer {
    width: 100%;

    scroll-snap-align: end;
    scroll-snap-stop: normal;
    overflow: visible;
  }
}
</style>
