<template>
  <section class="section section--termine">
    <div class="section-header">
      <h2 class="section-title">
        Aktuelle Termine
      </h2>
      <div class="section-cta-wrap">
        <RouterLink to="/termine" class="news-cta" aria-label="Alle Termine">
          <CalendarDays :size="22" :stroke-width="2.2" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
    <RouterLink to="/termine" class="mobile-section-cta">
      <CalendarDays :size="16" :stroke-width="2.2" aria-hidden="true" />
    </RouterLink>

    <div class="termine-grid">
      <RouterLink
        v-for="item in termineItems.slice(0, 3)"
        :key="item.id"
        class="termine-card"
        :to="{ name: 'termine-detail', params: { slug: item.slug } }">
        <div class="termine-image-frame">
          <img
            class="termine-image"
            :src="item.image"
            :alt="item.imageAlt"
            loading="lazy" />
          <div class="termine-image-overlay" aria-hidden="true">
            <svg
              class="termine-overlay-icon"
              viewBox="0 0 48 48"
              focusable="false"
              aria-hidden="true">
              <rect x="12" y="14" width="24" height="20" rx="3" />
              <path d="M16 12v6M32 12v6M16 22h16" />
            </svg>
          </div>
        </div>
        <div class="termine-text">
          <div class="termine-meta">
            <time class="termine-date" :datetime="item.date">
              {{ formatDate(item.date) }}
            </time>
            <span class="termine-time">{{ item.time }}</span>
            <span class="termine-location">{{ item.location }}</span>
          </div>
          <div v-if="item.homeTeam && item.awayTeam" class="termine-matchup">
            <div class="termine-team">
              <img
                v-if="item.homeLogo"
                class="termine-team-logo"
                :src="item.homeLogo"
                :alt="`${item.homeTeam} Logo`"
                loading="lazy" />
              <span class="termine-team-name">{{ item.homeTeam }}</span>
            </div>
            <span class="termine-matchup-separator">vs</span>
            <div class="termine-team termine-team--away">
              <img
                v-if="item.awayLogo"
                class="termine-team-logo"
                :src="item.awayLogo"
                :alt="`${item.awayTeam} Logo`"
                loading="lazy" />
              <span class="termine-team-name">{{ item.awayTeam }}</span>
            </div>
          </div>
          <h3 class="termine-title">{{ item.title }}</h3>
          <p class="termine-excerpt">{{ item.excerpt }}</p>
        </div>
      </RouterLink>
    </div>
    <div
      class="slogan relative w-full h-[15dvh] flex items-center justify-center overflow-hidden text-(--sv-primary-color) text-2xl font-bold"
      aria-hidden="true">
      <div
        class="absolute inset-0 bg-center bg-cover bg-no-repeat blur-[3px] scale-110"
        :style="{ backgroundImage: `url(${termineBanner})` }"></div>

      <div
        class="slogan-text relative z-10 bg-(--sv-secondary-color) p-1.5 pb-2.5">
        WAHRE LIEBE IST BLAU-GELB
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalendarDays } from "@lucide/vue";
import termineBanner from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getTerminItems } from "@/utils/contentEntries";

const termineItems = computed(() => getTerminItems());
</script>

<style scoped>
.section {
  min-height: calc(100dvh - var(--sv-header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.section--termine {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 2.5vw;
  position: relative;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 5dvh 10dvw 0;
}

.section-title {
  margin: 0;
  display: flex;
  align-items: center;
  color: var(--sv-secondary-color);
  font-size: clamp(28px, 2.5vw, 30px);
  font-weight: 700;
  text-transform: uppercase;
}

.section-cta-wrap {
  display: flex;
  align-items: center;
}

.termine-grid {
  width: 80dvw;
  height: 55dvh;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
}

.termine-card {
  display: flex;
  flex-direction: column;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.termine-card:hover {
  transform: translateY(-6px);
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.termine-card:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.termine-image-frame {
  width: 100%;
  height: 60%;
  position: relative;
  overflow: hidden;
  background: rgba(2, 43, 121, 0.12);
}

.termine-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition:
    transform 1.6s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.4s ease;
  will-change: transform;
}

.termine-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 43, 121, 0.35);
  opacity: 0;
  transform: scale(0.98);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  pointer-events: none;
}

.termine-overlay-icon {
  width: 56px;
  height: 56px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.termine-card:hover .termine-image {
  transform: scale(1.12);
  filter: grayscale(1);
}

.termine-card:hover .termine-image-overlay {
  opacity: 1;
  transform: scale(1);
}

.termine-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(16px, 2.4vw, 24px);
}

.termine-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.termine-location {
  font-weight: 700;
}

.termine-title {
  margin: 0;
  font-size: clamp(20px, 2vw, 28px);
  line-height: 1.25;
}

.termine-matchup {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.termine-team {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.termine-team--away {
  justify-content: flex-end;
}

.termine-team-logo {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  object-fit: contain;
}

.termine-team-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.termine-matchup-separator {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
}

.termine-excerpt {
  margin: 0;
  opacity: 0.85;
}

.news-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  text-decoration: none;
  border: 2px solid transparent;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    color 0.25s ease;
}

.news-cta:hover,
.news-cta:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}

.slogan {
  border-top: 1px solid var(--sv-secondary-color);
  border-bottom: 1px solid var(--sv-secondary-color);
}

@media (max-width: 900px) {
  .section--termine {
    justify-content: flex-start;
  }

  .section-header {
    padding: 38px 12px 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-title {
    font-size: 24px;
  }

  .termine-grid {
    width: calc(100dvw - 32px);
    height: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .slogan {
    height: 110px;
  }
}

@media (max-width: 640px) {
  .section {
    height: calc(100dvh - var(--sv-header-height));
    min-height: calc(100dvh - var(--sv-header-height));
    padding-top: 0;
    box-sizing: border-box;
    padding-left: 0;
  }

  .section--termine {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0;
    position: relative;
  }

  .section--termine::before {
    content: "TERMINE";
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: "Marker Felt", "Brush Script MT", "Segoe Print", cursive;
    font-size: 9.5dvh;
    line-height: 0.9;
    font-weight: 800;
    color: var(--sv-secondary-color);
    opacity: 0.42;
    z-index: 3;
    pointer-events: none;
  }

  .section-header {
    display: none;
  }

  .mobile-section-cta {
    position: absolute;
    right: 14px;
    bottom: 26px;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    background: rgba(2, 43, 121, 0.82);
    border: 1px solid rgba(244, 208, 71, 0.72);
    border-radius: 999px;
    color: var(--sv-secondary-color);
    text-decoration: none;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
  }

  .termine-grid {
    width: 100dvw;
    flex: 1 1 0;
    height: 100%;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 0;
  }

  .termine-card {
    position: relative;
    display: block;
    min-height: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .termine-image-frame {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: auto;
    background: rgba(2, 43, 121, 0.12);
    z-index: 0;
  }

  .termine-text {
    position: relative;
    z-index: 2;
    justify-content: flex-end;
    min-height: 100%;
    gap: 8px;
    padding: 18px 16px 18px 20px;
    background:
      linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.38) 52%,
        rgba(0, 0, 0, 0.08) 100%
      );
  }

  .termine-meta {
    order: 1;
    color: var(--sv-secondary-color);
    opacity: 1;
  }

  .termine-title {
    order: 2;
    font-size: 20px;
    line-height: 1.12;
  }

  .termine-matchup {
    display: none;
  }

  .termine-team-logo {
    width: 28px;
    height: 28px;
    flex-basis: 28px;
  }

  .termine-team-name {
    font-size: 12px;
    color: var(--sv-text-color);
  }

  .termine-excerpt {
    display: none;
  }

  .termine-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.03);
  }

  .termine-image-overlay {
    display: none;
  }

  .termine-card:hover {
    transform: none;
    border-color: transparent;
    box-shadow: none;
  }

  .termine-card:hover .termine-image {
    transform: scale(1.03);
    filter: none;
  }

  .slogan {
    display: none;
  }
}

@media (min-width: 641px) {
  .mobile-section-cta {
    display: none;
  }
}
</style>
