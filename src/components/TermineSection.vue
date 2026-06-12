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

    <div class="termine-pinboard">
      <article
        v-for="(item, index) in termineItems.slice(0, 3)"
        :key="`desktop-${item.id}`"
        class="termine-pin-card"
        :style="getTerminCardStyle(item, index)">
        <span class="termine-pin-card__pin" aria-hidden="true">
          <Pin :size="26" :stroke-width="2.1" />
        </span>
        <RouterLink
          class="termine-pin-card__sheet-link"
          :to="{ name: 'termine-detail', params: { slug: item.slug } }"
          :aria-label="`Zum Termin ${item.title}`">
          <div class="termine-pin-card__sheet">
            <div class="termine-pin-card__media">
              <img
                class="termine-pin-card__image"
                :src="item.image"
                :alt="item.imageAlt"
                loading="lazy" />
              <div class="termine-pin-card__overlay" aria-hidden="true">
                <svg
                  class="termine-pin-card__icon"
                  viewBox="0 0 48 48"
                  focusable="false"
                  aria-hidden="true">
                  <rect x="12" y="14" width="24" height="20" rx="3" />
                  <path d="M16 12v6M32 12v6M16 22h16" />
                </svg>
              </div>
            </div>
            <div class="termine-pin-card__body">
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
              <h3 class="termine-pin-card__title">{{ item.title }}</h3>
              <p class="termine-pin-card__excerpt">{{ item.excerpt }}</p>
            </div>
          </div>
        </RouterLink>
      </article>
    </div>

    <div class="termine-grid termine-grid--mobile">
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
    <SponsorLogoStrip class="termine-sponsor-strip termine-sponsor-strip--desktop" />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalendarDays, Pin } from "@lucide/vue";
import SponsorLogoStrip from "@/components/SponsorLogoStrip.vue";
import { formatDate } from "@/utils/date";
import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";

const termineItems = computed(() => getTerminItems());

const getRandomTilt = (seedSource: string, index: number) => {
  let hash = 0;
  const seed = `${seedSource}-${index}`;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }

  const direction = hash % 2 === 0 ? 1 : -1;
  const tilt = 0.75 + (hash % 175) / 100;
  return `${(direction * tilt).toFixed(2)}deg`;
};

const getTerminCardStyle = (item: TerminEntry, index: number) => ({
  "--pin-tilt": getRandomTilt(`${item.id}-${item.title}`, index),
});
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

.termine-pinboard {
  width: 88dvw;
  margin: 0 auto;
  padding: 28px clamp(20px, 5vw, 56px) clamp(56px, 8vw, 104px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(14px, 1.8vw, 22px);
  align-items: start;
  overflow: visible;
}

.termine-grid {
  width: 80dvw;
  height: 55dvh;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 28px);
}

.termine-pin-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  --termine-card-min-height: clamp(450px, 37vw, 580px);
  --termine-card-offset: 0px;
  --termine-card-overlap: -42px;
  --termine-card-overlap-x: 18px;
  --pin-tilt: 0deg;
  --termine-excerpt-lines: 3;
  min-height: var(--termine-card-min-height);
  width: calc(100% + (var(--termine-card-overlap-x) * 2));
  margin-top: var(--termine-card-overlap);
  margin-left: calc(var(--termine-card-overlap-x) * -1);
  transform: translateY(var(--termine-card-offset));
  z-index: 1;
}

.termine-pin-card:hover {
  transform: translateY(calc(var(--termine-card-offset) - 6px));
  z-index: 10;
}

.termine-pin-card__sheet-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.termine-pin-card__pin {
  position: absolute;
  top: 2px;
  left: 50%;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  color: var(--sv-secondary-color);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
  transform: translateX(-50%);
  z-index: 4;
}

.termine-pin-card__pin :deep(svg) {
  overflow: visible;
  fill: var(--sv-secondary-color);
}

.termine-pin-card__sheet {
  display: flex;
  flex-direction: column;
  min-height: var(--termine-card-min-height);
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  border-radius: 18px;
  box-shadow: 0 14px 28px rgba(2, 43, 121, 0.12);
  transform-origin: top center;
  transform: rotate(var(--pin-tilt));
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.termine-pin-card:hover .termine-pin-card__sheet {
  transform: rotate(calc(var(--pin-tilt) * -1));
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.termine-pin-card__media {
  position: relative;
  height: clamp(180px, 15.5vw, 220px);
  overflow: hidden;
  background: #dfe6f1;
  border-radius: 18px 18px 0 0;
}

.termine-pin-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition:
    transform 0.6s ease,
    filter 0.6s ease;
}

.termine-pin-card__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 43, 121, 0.35);
  opacity: 0;
  transform: scale(0.98);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  pointer-events: none;
}

.termine-pin-card__icon {
  width: 46px;
  height: 46px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.termine-pin-card:hover .termine-pin-card__image {
  transform: scale(1.08);
  filter: grayscale(0.15);
}

.termine-pin-card:hover .termine-pin-card__overlay {
  opacity: 1;
  transform: scale(1);
}

.termine-pin-card__body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: clamp(12px, 1.6vw, 18px);
  padding-top: clamp(22px, 2.4vw, 28px);
  flex: 1;
  background: rgb(7, 18, 44);
  border: 1px solid rgb(7, 18, 44);
  border-radius: 0 0 18px 18px;
}

.termine-pin-card__title {
  margin: 0;
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.termine-pin-card__excerpt {
  margin: 0;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--termine-excerpt-lines);
  overflow: hidden;
}

.termine-pin-card:nth-child(3n + 2) {
  --termine-card-min-height: clamp(390px, 32vw, 468px);
  --termine-card-offset: 24px;
  --termine-card-overlap: -68px;
  --termine-card-overlap-x: 28px;
  --termine-excerpt-lines: 2;
}

.termine-pin-card:nth-child(3n + 3) {
  --termine-card-offset: 10px;
  --termine-card-overlap: -54px;
  --termine-card-overlap-x: 24px;
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

.termine-grid--mobile {
  display: none;
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

.termine-sponsor-strip {
  margin-top: auto;
  padding: clamp(12px, 2.2vh, 18px) 0 clamp(28px, 4vh, 36px);
}

.termine-sponsor-mobile-section {
  display: none;
}

@media (max-width: 900px) {
  .termine-pinboard {
    display: none;
  }

  .termine-grid--mobile {
    display: grid;
  }

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

  .termine-sponsor-strip {
    padding-bottom: 24px;
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

  .termine-sponsor-strip--desktop {
    display: none;
  }
}

@media (min-width: 641px) {
  .mobile-section-cta {
    display: none;
  }
}
</style>
