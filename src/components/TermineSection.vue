<template>
  <section class="section section--termine">
    <div class="flex justify-between w-full px-[10dvw]">
      <h2
        class="flex text-(--sv-secondary-color) text-[30px] uppercase font-bold items-center pt-[5dvh] m-0">
        Aktuelle Termine
      </h2>
      <div class="news-cta-wrap flex items-center pt-[5dvh]">
        <RouterLink to="/news" class="news-cta">Mehr Termine</RouterLink>
      </div>
    </div>

    <div class="termine-grid">
      <article
        v-for="item in termineItems.slice(0, 3)"
        :key="item.id"
        class="termine-card"
        role="button"
        tabindex="0"
        aria-haspopup="dialog"
        @click="openTermin(item)"
        @keydown.enter.prevent="openTermin(item)"
        @keydown.space.prevent="openTermin(item)">
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
          <h3 class="termine-title">{{ item.title }}</h3>
          <p class="termine-excerpt">{{ item.excerpt }}</p>
        </div>
      </article>
    </div>
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
              {{ activeTermin.dateLabel }}
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
import { ref, computed } from "vue";
import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import termineBanner from "@/assets/header/background.png";
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

const activeTermin = ref();

const openTermin = (item: any) => {
  activeTermin.value = item;
};

const closeTermin = () => {
  activeTermin.value = null;
};
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
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

.termine-image-frame {
  width: 100%;
  height: clamp(160px, 18vw, 210px);
  position: relative;
  overflow: hidden;
  background: rgba(2, 43, 121, 0.12);
}

.termine-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
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
  transition: opacity 0.35s ease, transform 0.35s ease;
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

.termine-meta--modal {
  opacity: 0.85;
}

.termine-location {
  font-weight: 700;
}

.termine-title {
  margin: 0;
  font-size: clamp(20px, 2vw, 28px);
  line-height: 1.25;
}

.termine-excerpt {
  margin: 0;
  opacity: 0.85;
}

.termine-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.termine-modal {
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

.slogan {
  border-top: 1px solid var(--sv-secondary-color);
  border-bottom: 1px solid var(--sv-secondary-color);
}

@media (max-width: 900px) {
  .section--termine {
    justify-content: flex-start;
  }

  .termine-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .termine-modal-text {
    column-count: 1;
  }
}

@media (max-width: 640px) {
  .termine-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
