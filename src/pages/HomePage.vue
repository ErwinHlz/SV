<template>
  <div class="home-page">
    <section class="section section--hero">
      <div class="home-stage">
        <HeroComponent class="home-hero" />
        <div class="home-highlights-group">
          <MatchHighlights
            class="home-highlights home-highlights--team-one"
            team="teamOne" />
          <MatchHighlights
            class="home-highlights home-highlights--team-two"
            team="teamTwo" />
        </div>
      </div>
    </section>

    <section class="section section--matches section--matches-one">
      <div class="match-stage">
        <MatchHighlights class="matches-page" team="teamOne" />
      </div>
    </section>

    <section class="section section--matches section--matches-two">
      <div class="match-stage">
        <MatchHighlights class="matches-page" team="teamTwo" />
      </div>
    </section>

    <section class="section">
      <NewsSection />
    </section>

    <section class="section">
      <TermineSection />
    </section>

    <InlineSponsorAdSection />
    <HomeSponsorsMobileSection />
  </div>
</template>

<script setup>
import InlineSponsorAdSection from "../components/InlineSponsorAdSection.vue";
import HomeSponsorsMobileSection from "../components/HomeSponsorsMobileSection.vue";
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
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  overflow: hidden;
}

.home-stage {
  width: 100%;
  height: min(82dvh, calc(100dvh - var(--sv-header-height) - 16px));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.4dvh;
  position: relative;
  top: -2dvh;
}

:deep(.home-hero) {
  height: clamp(280px, 46dvh, 460px);
  min-height: 0;
}

.home-highlights-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 80dvw;
  max-width: 1400px;
  align-items: center;
}

/* 1. Mannschaft: Letztes/Nächstes in Grau-Schwarz, Aktuell im
   Original-Ton (siehe MatchHighlights.vue). 2. Mannschaft: Letztes/Nächstes
   in Grau-Weiß, Aktuell im kräftigen Original-Gelb. */
.home-highlights--team-one :deep(.match-card--last),
.home-highlights--team-one :deep(.match-card--next),
.section--matches-one :deep(.match-card--last),
.section--matches-one :deep(.match-card--next) {
  background: linear-gradient(135deg, #4a4a4a, #161616);
}

.home-highlights--team-two :deep(.match-card--last),
.home-highlights--team-two :deep(.match-card--next),
.section--matches-two :deep(.match-card--last),
.section--matches-two :deep(.match-card--next) {
  background: linear-gradient(135deg, #f2f2f2, #d4d4d4);
  color: #1a1a1a;
}

.home-highlights--team-two :deep(.match-card--last) .match-label,
.home-highlights--team-two :deep(.match-card--next) .match-label,
.section--matches-two :deep(.match-card--last) .match-label,
.section--matches-two :deep(.match-card--next) .match-label {
  color: #1a1a1a;
}

.home-highlights--team-two :deep(.match-card--live),
.section--matches-two :deep(.match-card--live) {
  background:
    radial-gradient(
      circle at top right,
      rgba(147, 197, 253, 0.45),
      transparent 35%
    ),
    linear-gradient(135deg, #f7d84a, #e0b420);
  color: #0a1330;
}

.home-highlights--team-two :deep(.match-card--live) .match-label,
.section--matches-two :deep(.match-card--live) .match-label {
  color: #0a1330;
}

/* Zwei gestapelte Streifen brauchen deutlich kompaktere Karten als der
   ursprüngliche Einzel-Streifen, sonst passt der Inhalt nicht in die
   verfügbare Höhe der Hero-Bühne. */
.home-highlights-group :deep(.match-strip) {
  width: 100%;
  height: clamp(88px, 10dvh, 108px);
}

.home-highlights-group :deep(.match-card) {
  padding: 5px 10px;
}

.home-highlights-group :deep(.match-label) {
  font-size: 9px;
}

.home-highlights-group :deep(.team-logo) {
  width: 34px;
  height: 34px;
  flex-basis: 34px;
}

.home-highlights-group :deep(.team-name) {
  font-size: 10px;
}

.home-highlights-group :deep(.match-score) {
  font-size: 22px;
}

.home-highlights-group :deep(.match-center) {
  min-width: 64px;
}

.home-highlights-group :deep(.match-meta) {
  font-size: 9px;
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
  .section--matches-one::before {
    content: "1. MANNSCHAFT";
  }

  .section--matches-two::before {
    content: "2. MANNSCHAFT";
  }

  .section--matches::before {
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: "Marker Felt", "Brush Script MT", "Segoe Print", cursive;
    font-size: 7.4dvh;
    line-height: 0.9;
    font-weight: 800;
    color: var(--sv-secondary-color);
    opacity: 0.42;
    z-index: 3;
    pointer-events: none;
  }

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
  .section {
    height: 100dvh;
    min-height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}
</style>
