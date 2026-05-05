<template>
  <section class="section section--news">
    <div class="section-header">
      <h2 class="section-title">
        Neuste News
      </h2>
      <div class="section-cta-wrap">
        <RouterLink to="/news" class="news-cta" aria-label="Alle News">
          <Newspaper :size="22" :stroke-width="2.2" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
    <RouterLink to="/news" class="mobile-section-cta">
      <Newspaper :size="16" :stroke-width="2.2" aria-hidden="true" />
    </RouterLink>
    <article
      v-for="(item, index) in newsItems.slice(0, 3)"
      :key="item.id"
      class="news-item"
      :class="{ 'news-item--reverse': index % 2 === 1 }">
      <RouterLink
        class="news-text"
        :to="{ name: 'news-detail', params: { slug: item.slug } }">
        <time class="news-date" :datetime="item.date">
          {{ formatDate(item.date) }}
        </time>
        <h3 class="news-item-title">{{ item.title }}</h3>
        <p class="news-excerpt">{{ item.excerpt }}</p>
      </RouterLink>
      <RouterLink
        class="news-image-frame"
        :to="{ name: 'news-detail', params: { slug: item.slug } }">
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
      </RouterLink>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Newspaper } from "@lucide/vue";
import { formatDate } from "@/utils/date";
import { getNewsItems } from "@/utils/contentEntries";

const newsItems = computed(() => getNewsItems());
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
  position: relative;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 5rem 10dvw 0;
  margin-bottom: 2.5rem;
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

.news-item {
  flex: 1 1 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  grid-template-areas: "text image";
  align-items: center;
  gap: clamp(16px, 3vw, 36px);
  background: rgba(255, 255, 255, 0.89);
  color: black;
  border: 1px solid var(--sv-card-border);
  min-height: clamp(180px, 22vh, 260px);
  overflow: hidden;
  width: 100dvw;
  transition:
    background-color 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
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
  text-decoration: none;
  color: inherit;
  transition: color 0.35s ease;
}

.news-item:nth-child(even) .news-text {
  border-top-right-radius: 40px;
  border-bottom-right-radius: 40px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.news-item:hover,
.news-item:focus-within {
  background-color: var(--sv-secondary-color);
  border-color: rgba(244, 208, 71, 0.72);
}

.news-item:hover .news-text,
.news-item:focus-within .news-text {
  color: var(--sv-primary-color);
}

.news-item:hover .news-image,
.news-item:focus-within .news-image {
  transform: scale(1.2);
}

.news-item:hover .news-image-overlay,
.news-item:focus-within .news-image-overlay {
  opacity: 1;
  transform: scale(1);
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
  text-decoration: none;
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
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  pointer-events: none;
}

.news-overlay-icon {
  width: 56px;
  height: 56px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.news-item:nth-child(even) .news-image-frame {
  clip-path: polygon(0 100%, 15% 0, 100% 0, 100% 100%);
}

.news-date {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
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

  .section-header {
    padding: 38px 12px 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-title {
    font-size: 24px;
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
    clip-path: none;
  }

  .news-text,
  .news-item:nth-child(even) .news-text {
    border-radius: 0;
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

  .section--news {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
  }

  .section--news::before {
    content: "NEWS";
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

  .news-item,
  .news-item--reverse {
    position: relative;
    display: block;
    width: 100dvw;
    min-height: 0;
    flex: 1 1 0;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: var(--sv-text-color);
    gap: 0;
  }

  .news-image-frame {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: auto;
    min-height: 0;
    clip-path: none;
    z-index: 0;
  }

  .news-text {
    position: relative;
    z-index: 2;
    justify-content: flex-end;
    min-height: 100%;
    gap: 8px;
    padding: 18px 16px 18px 20px;
    color: var(--sv-text-color);
    background:
      linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.78) 0%,
        rgba(0, 0, 0, 0.36) 52%,
        rgba(0, 0, 0, 0.08) 100%
      );
    border-radius: 0;
  }

  .news-item-title {
    font-size: 20px;
    line-height: 1.12;
  }

  .news-excerpt {
    display: none;
  }

  .news-date {
    color: var(--sv-secondary-color);
    opacity: 1;
  }

  .news-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }

  .news-image-overlay {
    display: none;
  }

  .news-item:hover,
  .news-item:focus-within {
    background: transparent;
    border-color: transparent;
  }

  .news-item:hover .news-text,
  .news-item:focus-within .news-text {
    color: var(--sv-text-color);
  }

  .news-item:hover .news-image,
  .news-item:focus-within .news-image {
    transform: scale(1.02);
  }

  .section--news > .news-item {
    flex: 1 1 0;
  }
}

@media (min-width: 641px) {
  .mobile-section-cta {
    display: none;
  }
}
</style>
