<template>
  <PageHero
    :image="termineHero"
    title="Termine"
    lead="Alle Spiele, Events und Vereinsaktivitaeten auf einen Blick." />
  <section class="termine-grid" aria-label="Alle Termine">
    <RouterLink
      v-for="(item, index) in termineItems"
      :key="item.id"
      class="termine-card"
      :to="{ name: 'termine-detail', params: { slug: item.slug } }"
      :style="getTerminCardStyle(item, index)">
      <span class="termine-card-pin" aria-hidden="true">
        <Pin :size="26" :stroke-width="2.1" />
      </span>
      <div class="termine-card-sheet">
        <div class="termine-card-media">
          <img
            class="termine-card-image"
            :src="item.image"
            :alt="item.imageAlt"
            loading="lazy" />
          <div class="termine-card-overlay" aria-hidden="true">
            <svg
              class="termine-card-icon"
              viewBox="0 0 48 48"
              focusable="false"
              aria-hidden="true">
              <rect x="12" y="14" width="24" height="20" rx="3" />
              <path d="M16 12v6M32 12v6M16 22h16" />
            </svg>
          </div>
        </div>
        <div class="termine-card-body">
          <div class="termine-meta">
            <time class="termine-date" :datetime="item.date">
              {{ formatDate(item.date) }}
            </time>
            <span class="termine-time">{{ item.time }}</span>
            <span class="termine-location">{{ item.location }}</span>
            <span v-if="item.source" class="termine-source">{{ item.source }}</span>
          </div>
          <div
            v-if="item.homeTeam && item.awayTeam"
            class="termine-matchup">
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
          <h3 class="termine-card-title">{{ item.title }}</h3>
          <p class="termine-card-excerpt">{{ item.excerpt }}</p>
        </div>
      </div>
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Pin } from "@lucide/vue";
import PageHero from "@/components/PageHero.vue";
import termineHero from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";

const termineItems = computed(() => getTerminItems());

const getRandomTilt = (seedSource: string, index: number) => {
  const seed = `${seedSource}-${index}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }

  const direction = hash % 2 === 0 ? 1 : -1;
  const tilt = 0.75 + ((hash % 175) / 100);
  return `${(direction * tilt).toFixed(2)}deg`;
};

const getTerminCardStyle = (item: TerminEntry, index: number) => ({
  "--pin-tilt": getRandomTilt(`${item.id}-${item.title}`, index),
});
</script>

<style scoped>
.termine-grid {
  width: 80dvw;
  margin: 0 auto;
  padding: 20px clamp(24px, 7vw, 80px) clamp(44px, 7vw, 88px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 16px);
  align-items: start;
  overflow: visible;
}

.termine-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  --termine-card-min-height: clamp(410px, 35vw, 500px);
  --termine-card-offset: 0px;
  --termine-card-overlap: -34px;
  --termine-card-overlap-x: 14px;
  --pin-tilt: 0deg;
  --termine-excerpt-lines: 3;
  min-height: var(--termine-card-min-height);
  width: calc(100% + (var(--termine-card-overlap-x) * 2));
  margin-top: var(--termine-card-overlap);
  margin-left: calc(var(--termine-card-overlap-x) * -1);
  transform: translateY(var(--termine-card-offset));
  z-index: 1;
}

.termine-card:hover {
  transform: translateY(calc(var(--termine-card-offset) - 6px));
  z-index: 10;
}

.termine-card:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.termine-card-pin {
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

.termine-card-pin :deep(svg) {
  overflow: visible;
  fill: var(--sv-secondary-color);
}

.termine-card-sheet {
  display: flex;
  flex-direction: column;
  min-height: var(--termine-card-min-height);
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  border-radius: 18px;
  box-shadow: 0 14px 28px rgba(2, 43, 121, 0.12);
  transform-origin: top center;
  transform: rotate(var(--pin-tilt));
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.termine-card:hover .termine-card-sheet {
  transform: rotate(calc(var(--pin-tilt) * -1));
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.termine-card-media {
  position: relative;
  height: clamp(180px, 15.5vw, 220px);
  overflow: hidden;
  background: #dfe6f1;
  border-radius: 18px 18px 0 0;
}

.termine-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 0.6s ease, filter 0.6s ease;
}

.termine-card-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 43, 121, 0.35);
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}

.termine-card-icon {
  width: 46px;
  height: 46px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.termine-card:hover .termine-card-image {
  transform: scale(1.08);
  filter: grayscale(0.15);
}

.termine-card:hover .termine-card-overlay {
  opacity: 1;
  transform: scale(1);
}

.termine-card-body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: clamp(12px, 1.6vw, 18px);
  padding-top: clamp(22px, 2.4vw, 28px);
  flex: 1;
}

.termine-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.termine-card-title {
  margin: 0;
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
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
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
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

.termine-card-excerpt {
  margin: 0;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--termine-excerpt-lines);
  overflow: hidden;
}

.termine-source {
  color: var(--sv-secondary-color);
}

.termine-card:nth-child(6n + 2) {
  --termine-card-min-height: clamp(360px, 30vw, 425px);
  --termine-card-offset: 18px;
  --termine-card-overlap: -56px;
  --termine-card-overlap-x: 22px;
  --termine-excerpt-lines: 2;
}

.termine-card:nth-child(6n + 3) {
  --termine-card-offset: 6px;
  --termine-card-overlap: -44px;
  --termine-card-overlap-x: 18px;
}

.termine-card:nth-child(6n + 4) {
  --termine-card-offset: 10px;
  --termine-card-overlap: -48px;
  --termine-card-overlap-x: 20px;
}

.termine-card:nth-child(6n + 5) {
  --termine-card-min-height: clamp(450px, 39vw, 550px);
  --termine-card-offset: -14px;
  --termine-card-overlap: -68px;
  --termine-card-overlap-x: 28px;
  --termine-excerpt-lines: 4;
}

.termine-card:nth-child(6n + 6) {
  --termine-card-offset: -6px;
  --termine-card-overlap: -52px;
  --termine-card-overlap-x: 20px;
}

@media (max-width: 1100px) {
  .termine-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: clamp(20px, 6vw, 48px);
    gap: 12px;
  }

  .termine-card {
    --termine-card-min-height: clamp(380px, 46vw, 450px);
    --termine-card-overlap: -28px;
    --termine-card-overlap-x: 10px;
  }

  .termine-card:nth-child(6n + 2) {
    --termine-card-min-height: clamp(344px, 41vw, 404px);
    --termine-card-offset: 14px;
    --termine-card-overlap: -42px;
    --termine-card-overlap-x: 16px;
  }

  .termine-card:nth-child(6n + 5) {
    --termine-card-min-height: clamp(410px, 49vw, 490px);
    --termine-card-offset: -10px;
    --termine-card-overlap: -52px;
    --termine-card-overlap-x: 20px;
  }
}

@media (max-width: 700px) {
  .termine-grid {
    grid-template-columns: 1fr;
  }

  .termine-card {
    min-height: auto;
    --termine-card-offset: 0px;
    --termine-card-overlap: 0px;
    --termine-card-overlap-x: 0px;
    width: 100%;
    transform: none;
  }

  .termine-card:hover {
    transform: translateY(-6px);
  }

  .termine-card-sheet {
    min-height: auto;
    transform: none;
  }

  .termine-card:hover .termine-card-sheet {
    transform: none;
  }

  .termine-card-media {
    height: clamp(200px, 45vw, 240px);
  }
}
</style>
