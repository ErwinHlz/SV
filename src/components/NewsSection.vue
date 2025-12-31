<template>
  <section class="section section--news">
    <div class="flex justify-between w-full px-[10dvw] mb-10">
      <h2
        class="flex text-(--sv-secondary-color) text-[30px] pt-20 uppercase font-bold items-center">
        Neuste News
      </h2>
      <div class="news-cta-wrap flex items-center pt-20">
        <RouterLink to="/news" class="news-cta">ALLE NEWS</RouterLink>
      </div>
    </div>
    <article
      v-for="(item, index) in newsItems.slice(0, 3)"
      :key="item.id"
      class="news-item"
      :class="{ 'news-item--reverse': index % 2 === 1 }"
      role="button"
      tabindex="0"
      aria-haspopup="dialog">
      <div class="news-text" @click="openNews(item)">
        <time class="news-date" :datetime="item.date">
          {{ formatDate(item.date) }}
        </time>
        <h3 class="news-item-title">{{ item.title }}</h3>
        <p class="news-excerpt">{{ item.excerpt }}</p>
      </div>
      <div class="news-image-frame" @click="openNews(item)">
        <img
          class="news-image"
          :src="item.image"
          :alt="item.imageAlt"
          loading="lazy" />
        <div class="news-image-overlay" aria-hidden="true">
          <svg
            class="news-overlay-icon"
            viewBox="0 0 48 48"
            focusable="false"
            aria-hidden="true">
            <circle cx="24" cy="24" r="18" />
            <path d="M24 16v16M16 24h16" />
          </svg>
        </div>
      </div>
    </article>

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
          <h3
            class="news-modal-title"
            :id="`news-modal-title-${activeNews.id}`">
            {{ activeNews.title }}
          </h3>
          <p class="news-modal-lead">{{ activeNews.excerpt }}</p>
          <p v-if="activeNews.content" class="news-modal-text">
            {{ activeNews.content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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

const openNews = (item: any) => {
  activeNews.value = item;
};

const closeNews = () => {
  activeNews.value = null;
};
</script>

<style scoped>
.section {
  min-height: calc(100dvh - var(--sv-header-height));
  display: flex;
  align-items: center;

  position: relative;
  scroll-margin-top: var(--sv-header-height);

  scroll-snap-align: start;
  scroll-snap-stop: normal;
}

.section--news {
  flex-direction: column;
}

.news-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease,
    color 0.25s ease;
}

.news-cta:hover,
.news-cta:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}

.news-item {
  flex: 1 1 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  grid-template-areas: "text image";
  align-items: center;
  gap: clamp(16px, 3vw, 36px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: clamp(180px, 22vh, 260px);
  overflow: hidden;
  width: 100dvw;
}

.news-item--reverse {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  grid-template-areas: "image text";
}

.news-item--reverse .news-image {
  transform-origin: left center;
}

.news-text {
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(16px, 2.5vw, 28px);
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  cursor: pointer;
}

.news-item:nth-child(even) .news-text {
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.news-text:hover {
  background-color: #f4d147b7;
  color: var(--sv-primary-color);
}

.news-image-frame {
  grid-area: image;
  width: 100%;
  height: 100%;
  min-height: 160px;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  clip-path: polygon(0 100%, 0 0, 85% 0, 100% 100%);
  cursor: pointer;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: all 3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  transform-origin: right center;
}

.news-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 43, 121, 0.35);
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.35s ease, transform 0.35s ease;
  pointer-events: none;
}

.news-overlay-icon {
  width: 56px;
  height: 56px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.news-image-frame:hover .news-image {
  transform: scale(1.2);
  filter: grayscale(1);
}

.news-image-frame:hover .news-image-overlay {
  opacity: 1;
  transform: scale(1);
}

.news-item:nth-child(even) .news-image-frame {
  clip-path: polygon(0 100%, 15% 0, 100% 0, 100% 100%);
}

.news-item:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.news-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-modal {
  position: relative;
  width: 90dvw;
  height: 85dvh;
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

.news-date {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.news-modal .news-date {
  opacity: 0.75;
}

.news-item-title {
  margin: 0;
  font-size: clamp(20px, 2vw, 28px);
  line-height: 1.25;
}

.news-excerpt {
  margin: 0;
  opacity: 0.85;
}

@media (max-width: 900px) {
  .section--news {
    justify-content: flex-start;
  }

  .news-item,
  .news-item--reverse {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "image"
      "text";
  }

  .news-image-frame {
    height: clamp(180px, 40vw, 240px);
  }

  .news-modal-text {
    column-count: 1;
  }
}
</style>
