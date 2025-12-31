<template>
  <PageHero
    :image="newsHero"
    title="News"
    lead="Aktuelle Meldungen rund um den Verein, die Teams und Events." />
  <section class="news-grid" aria-label="Alle News">
    <article
      v-for="item in newsItems"
      :key="item.id"
      class="news-card"
      role="button"
      tabindex="0"
      aria-haspopup="dialog"
      @click="openNews(item)"
      @keydown.enter.prevent="openNews(item)"
      @keydown.space.prevent="openNews(item)">
      <div
        class="news-card-media"
        :style="{ height: `${getCardHeight(item)}px` }">
        <img
          class="news-card-image"
          :src="item.image"
          :alt="item.imageAlt"
          loading="lazy" />
        <div class="news-card-overlay" aria-hidden="true">
          <svg
            class="news-card-icon"
            viewBox="0 0 48 48"
            focusable="false"
            aria-hidden="true">
            <circle cx="24" cy="24" r="18" />
            <path d="M24 16v16M16 24h16" />
          </svg>
        </div>
      </div>
      <div class="news-card-body">
        <time class="news-date" :datetime="item.date">
          {{ formatDate(item.date) }}
        </time>
        <h3 class="news-card-title">{{ item.title }}</h3>
        <p class="news-card-excerpt">{{ item.excerpt }}</p>
      </div>
    </article>
  </section>

  <div v-if="activeNews" class="news-overlay" @click.self="closeNews">
    <div
      class="news-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`news-modal-title-${activeNews.id}`">
      <button
        class="news-close"
        type="button"
        aria-label="Popup schliessen"
        @click="closeNews">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div class="news-modal-media">
        <img
          class="news-modal-image"
          :src="activeNews.image"
          :alt="activeNews.imageAlt"
          loading="lazy" />
      </div>
      <div class="news-modal-body">
        <time class="news-date" :datetime="activeNews.date">
          {{ formatDate(activeNews.date) }}
        </time>
        <h3 class="news-modal-title" :id="`news-modal-title-${activeNews.id}`">
          {{ activeNews.title }}
        </h3>
        <p class="news-modal-lead">{{ activeNews.excerpt }}</p>
        <p v-if="activeNews.content" class="news-modal-text">
          {{ activeNews.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHero from "@/components/PageHero.vue";
import newsHero from "@/assets/header/background.png";
import { computed, ref } from "vue";
import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import rawNews from "@/content/news.json";
import { formatDate } from "@/utils/date";

const imageMap: Record<string, string> = {
  newsImage,
  termineImage,
  ergebnisseImage,
};

const newsItems = computed(() =>
  [...rawNews]
    .sort((a, b) => b.date.localeCompare(a.date)) // YYYY-MM-DD
    .map((item) => ({
      ...item,
      image: imageMap[item.image] ?? item.image,
    }))
);

const activeNews = ref();

const cardHeights = [200, 250, 300];

const getCardHeight = (item: { id: number | string; title?: string }) => {
  const key = `${item.id}-${item.title ?? ""}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 2147483647;
  }
  return cardHeights[hash % cardHeights.length];
};

const openNews = (item: any) => {
  activeNews.value = item;
};

const closeNews = () => {
  activeNews.value = null;
};
</script>

<style scoped>
.news-grid {
  width: 80dvw;
  margin: 0 auto;
  padding: 0 clamp(18px, 8vw, 80px) clamp(48px, 8vw, 96px);
  columns: 3;
  column-gap: clamp(16px, 2.5vw, 32px);
}

.news-card {
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

.news-card:hover {
  transform: translateY(-6px);
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.news-card:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.news-card-media {
  position: relative;
  height: var(--card-media-height, clamp(160px, 16vw, 220px));
  overflow: hidden;
  background: rgba(2, 43, 121, 0.12);
}

.news-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 0.6s ease, filter 0.6s ease;
}

.news-card-overlay {
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

.news-card-icon {
  width: 46px;
  height: 46px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.news-card:hover .news-card-image {
  transform: scale(1.08);
  filter: grayscale(0.15);
}

.news-card:hover .news-card-overlay {
  opacity: 1;
  transform: scale(1);
}

.news-card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: clamp(14px, 2vw, 22px);
}

.news-date {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.news-card-title {
  margin: 0;
  font-size: clamp(18px, 1.7vw, 24px);
  line-height: 1.25;
}

.news-card-excerpt {
  margin: 0;
  opacity: 0.85;
}

.news-overlay {
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

.news-modal {
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

.news-close {
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

.news-close svg {
  width: 50px;
  height: 50px;
  stroke: currentColor;
  stroke-width: 1.2;
  fill: none;
}

.news-close:hover {
  background: var(--sv-primary-color);
  color: var(--sv-secondary-color);
}

.news-modal-media {
  width: min(900px, 100%);
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  background: #faf7ef;
  box-shadow: 0 10px 28px rgba(11, 31, 77, 0.16);
}

.news-modal-image {
  width: 100%;
  height: clamp(220px, 36vh, 360px);
  object-fit: cover;
  display: block;
  filter: saturate(0.85) contrast(1.05);
}

.news-modal-body {
  width: min(900px, 100%);
  margin: 0 auto;
  padding: clamp(16px, 3vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.news-modal-title {
  margin: 0;
  font-size: clamp(26px, 3vw, 38px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.news-modal-lead {
  margin: 0;
  font-weight: 600;
  font-style: italic;
}

.news-modal-text {
  margin: 0;
  opacity: 0.9;
  white-space: pre-line;
  line-height: 1.6;
  text-align: justify;
  column-count: 2;
  column-gap: clamp(20px, 4vw, 36px);
  column-rule: 1px solid rgba(11, 31, 77, 0.15);
}

.news-modal .news-date {
  opacity: 0.75;
}

@media (max-width: 1100px) {
  .news-grid {
    columns: 2;
  }
}

@media (max-width: 700px) {
  .news-grid {
    columns: 1;
  }

  .news-card-media {
    height: clamp(180px, 45vw, 240px);
  }

  .news-modal-text {
    column-count: 1;
  }
}
</style>
