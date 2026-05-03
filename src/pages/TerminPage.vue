<template>
  <PageHero
    :image="termineHero"
    title="Termine"
    lead="Alle Spiele, Events und Vereinsaktivitaeten auf einen Blick." />
  <section class="termine-grid" aria-label="Alle Termine">
    <RouterLink
      v-for="item in termineItems"
      :key="item.id"
      class="termine-card"
      :style="{ '--card-media-height': `${getCardHeight(item)}px` }"
      :to="{ name: 'termine-detail', params: { slug: item.slug } }">
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
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHero from "@/components/PageHero.vue";
import termineHero from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getTerminItems } from "@/utils/contentEntries";

const termineItems = computed(() => getTerminItems());

const cardHeights = [180, 200, 220, 240, 260];

const getCardHeight = (item: { id: number | string; title?: string }) => {
  const key = `${item.id}-${item.title ?? ""}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
  }
  return cardHeights[hash % cardHeights.length];
};
</script>

<style scoped>
.termine-grid {
  width: 80dvw;
  margin: 0 auto;
  padding: 0 clamp(18px, 8vw, 80px) clamp(48px, 8vw, 96px);
  columns: 3;
  column-gap: clamp(16px, 2.5vw, 32px);
}

.termine-card {
  display: inline-flex;
  flex-direction: column;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  width: 100%;
  margin: 0 0 clamp(16px, 2.5vw, 32px);
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
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

.termine-card-media {
  position: relative;
  height: var(--card-media-height, clamp(160px, 16vw, 220px));
  overflow: hidden;
  background: rgba(2, 43, 121, 0.12);
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
  gap: 8px;
  padding: clamp(14px, 2vw, 22px);
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
  font-size: clamp(18px, 1.7vw, 24px);
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
}

.termine-source {
  color: var(--sv-secondary-color);
}

@media (max-width: 1100px) {
  .termine-grid {
    columns: 2;
  }
}

@media (max-width: 700px) {
  .termine-grid {
    columns: 1;
  }

  .termine-card-media {
    height: clamp(180px, 45vw, 240px);
  }
}
</style>
