<template>
  <PageHero
    :image="termineHero"
    title="Termine"
    lead="Alle Spiele, Events und Vereinsaktivitaeten auf einen Blick." />
  <section class="termine-grid" aria-label="Alle Termine">
    <article
      v-for="item in termineItems"
      :key="item.id"
      class="termine-card"
      :style="{ '--card-media-height': `${getCardHeight(item)}px` }"
      role="button"
      tabindex="0"
      aria-haspopup="dialog"
      @click="openTermin(item)"
      @keydown.enter.prevent="openTermin(item)"
      @keydown.space.prevent="openTermin(item)">
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
        </div>
        <h3 class="termine-card-title">{{ item.title }}</h3>
        <p class="termine-card-excerpt">{{ item.excerpt }}</p>
      </div>
    </article>
  </section>

  <div v-if="activeTermin" class="termine-overlay" @click.self="closeTermin">
    <div
      class="termine-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`termine-modal-title-${activeTermin.id}`">
      <button
        class="termine-close"
        type="button"
        aria-label="Popup schliessen"
        @click="closeTermin">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div class="termine-modal-media">
        <img
          class="termine-modal-image"
          :src="activeTermin.image"
          :alt="activeTermin.imageAlt"
          loading="lazy" />
      </div>
      <div class="termine-modal-body">
        <div class="termine-meta termine-meta--modal">
          <time class="termine-date" :datetime="activeTermin.date">
            {{ formatDate(activeTermin.date) }}
          </time>
          <span class="termine-time">{{ activeTermin.time }}</span>
          <span class="termine-location">{{ activeTermin.location }}</span>
        </div>
        <h3
          class="termine-modal-title"
          :id="`termine-modal-title-${activeTermin.id}`">
          {{ activeTermin.title }}
        </h3>
        <p class="termine-modal-lead">{{ activeTermin.excerpt }}</p>
        <p v-if="activeTermin.content" class="termine-modal-text">
          {{ activeTermin.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from "@/components/PageHero.vue";
import { computed, ref } from "vue";
import termineHero from "@/assets/header/background.png";
import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import rawTermine from "@/content/termine.json";
import { formatDate } from "@/utils/date";

const imageMap: Record<string, string> = {
  newsImage,
  termineImage,
  ergebnisseImage,
};

const termineItems = computed(() =>
  [...rawTermine]
    .sort((a, b) => b.date.localeCompare(a.date)) // YYYY-MM-DD
    .map((item) => ({
      ...item,
      image: imageMap[item.image] ?? item.image,
    }))
);

const cardHeights = [180, 200, 220, 240, 260];

const getCardHeight = (item: { id: number | string; title?: string }) => {
  const key = `${item.id}-${item.title ?? ""}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
  }
  return cardHeights[hash % cardHeights.length];
};

const activeTermin = ref();

const openTermin = (item: any) => {
  activeTermin.value = item;
};

const closeTermin = () => {
  activeTermin.value = null;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
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

.termine-card-excerpt {
  margin: 0;
  opacity: 0.85;
}

.termine-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(2, 43, 121, 0.45);
  backdrop-filter: blur(3px);
}

.termine-modal {
  position: relative;
  width: min(980px, 100%);
  max-height: 90dvh;
  background-color: #f7f1e3;
  background-image: repeating-linear-gradient(
      90deg,
      rgba(17, 24, 39, 0.03),
      rgba(17, 24, 39, 0.03) 1px,
      transparent 1px,
      transparent 7px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(17, 24, 39, 0.04),
      rgba(17, 24, 39, 0.04) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(135deg, #ffd89d 0%, #d8bb90 55%, #e6d8c3 100%);
  border: 1px solid rgba(11, 31, 77, 0.2);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #1f2a44;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 0.01em;
  box-shadow: 0 24px 60px rgba(11, 31, 77, 0.22);
  padding: clamp(16px, 2.5vw, 28px);
  gap: clamp(12px, 2vw, 20px);
}

.termine-close {
  position: absolute;
  z-index: 11;
  top: 12px;
  right: 12px;
  border: 1px solid var(--sv-primary-color);
  background: transparent;
  color: var(--sv-primary-color);
  width: 50px;
  height: 50px;
  border-radius: 25%;
  display: grid;
  justify-content: center;
  align-content: center;
}

.termine-close svg {
  width: 50px;
  height: 50px;
  stroke: currentColor;
  stroke-width: 1.2;
  fill: none;
}

.termine-close:hover {
  background: var(--sv-primary-color);
  color: var(--sv-secondary-color);
}

.termine-modal-media {
  width: min(900px, 100%);
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  background: #faf7ef;
  box-shadow: 0 10px 28px rgba(11, 31, 77, 0.16);
}

.termine-modal-image {
  width: 100%;
  height: clamp(220px, 36vh, 360px);
  object-fit: cover;
  display: block;
  filter: saturate(0.85) contrast(1.05);
}

.termine-modal-body {
  width: min(900px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.termine-modal-title {
  margin: 0;
  font-size: clamp(26px, 3vw, 38px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.termine-modal-lead {
  margin: 0;
  font-weight: 600;
  font-style: italic;
}

.termine-modal-text {
  margin: 0;
  opacity: 0.9;
  white-space: pre-line;
  line-height: 1.6;
  text-align: justify;
  column-count: 2;
  column-gap: clamp(20px, 4vw, 36px);
  column-rule: 1px solid rgba(11, 31, 77, 0.15);
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

  .termine-modal-text {
    column-count: 1;
  }
}
</style>
