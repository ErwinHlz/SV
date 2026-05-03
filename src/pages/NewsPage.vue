<template>
  <PageHero
    :image="newsHero"
    title="News"
    lead="Aktuelle Meldungen rund um den Verein, die Teams und Events." />
  <section class="news-grid" aria-label="Alle News">
    <RouterLink
      v-for="item in newsItems"
      :key="item.id"
      class="news-card"
      :to="{ name: 'news-detail', params: { slug: item.slug } }">
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
        <div class="news-meta">
          <time class="news-date" :datetime="item.date">
            {{ formatDate(item.date) }}
          </time>
          <span v-if="item.source" class="news-source">{{ item.source }}</span>
        </div>
        <h3 class="news-card-title">{{ item.title }}</h3>
        <p class="news-card-excerpt">{{ item.excerpt }}</p>
      </div>
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHero from "@/components/PageHero.vue";
import newsHero from "@/assets/news/stock_news_1.png";
import { formatDate } from "@/utils/date";
import { getNewsItems } from "@/utils/contentEntries";

const newsItems = computed(() => getNewsItems());

const cardHeights = [200, 250, 300];

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
  text-decoration: none;
  color: inherit;
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

.news-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  align-items: center;
}

.news-date {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.news-source {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
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
}
</style>
