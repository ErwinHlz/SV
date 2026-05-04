<template>
  <PageHero
    v-if="newsItem"
    class="news-detail-hero"
    :image="newsDetailHero"
    :title="newsItem.title"
    :lead="formatDate(newsItem.date)"
    kicker="News"
    compact />
  <section v-if="newsItem" class="news-detail-layout">
    <article class="news-detail-body">
      <aside
        v-if="newsMedia.length"
        class="news-inline-media"
        :aria-label="
          newsMedia.length > 1 ? 'Medien zur News' : 'Medium zur News'
        ">
        <div v-if="newsMedia.length > 1" class="news-inline-carousel news-inline-carousel--desktop">
          <img
            v-if="activeMedia?.type === 'image'"
            class="news-inline-image"
            :src="activeMedia.src"
            :alt="activeMedia.alt" />
          <video
            v-else-if="activeMedia"
            class="news-inline-video"
            :poster="activeMedia.poster"
            controls
            playsinline
            preload="metadata">
            <source :src="activeMedia.src" />
          </video>
          <div class="news-inline-caption">
            <div class="news-inline-controls">
              <button
                type="button"
                class="news-inline-carousel-button"
                aria-label="Vorheriges Medium"
                @click="showPreviousMedia">
                <span class="chevron"><ChevronLeft /></span>
              </button>
              <span class="news-inline-status">
                {{ activeMediaIndex + 1 }} / {{ newsMedia.length }}
              </span>
              <button
                type="button"
                class="news-inline-carousel-button"
                aria-label="Naechstes Medium"
                @click="showNextMedia">
                <span class="chevron"><ChevronRight /></span>
              </button>
            </div>

            <a
              v-if="activeMedia?.permalink"
              :href="activeMedia.permalink"
              target="_blank"
              rel="noreferrer"
              class="news-inline-link">
              Instagram <span class="external-link-icon"><ExternalLink /></span>
            </a>
          </div>
        </div>
        <div
          v-if="newsMedia.length > 1"
          ref="mobileSwipeContainer"
          class="news-inline-swipe news-inline-swipe--mobile"
          @scroll.passive="updateActiveMediaFromScroll">
          <div
            v-for="(media, index) in newsMedia"
            :key="media.id"
            :ref="(el) => setMobileSwipeSlideRef(el, index)"
            class="news-inline-swipe-slide"
            :class="{ 'is-active': activeMediaIndex === index }">
            <img
              v-if="media.type === 'image'"
              class="news-inline-image"
              :src="media.src"
              :alt="media.alt" />
            <video
              v-else
              class="news-inline-video"
              :poster="media.poster"
              controls
              playsinline
              preload="metadata">
              <source :src="media.src" />
            </video>
            <a
              v-if="media.permalink"
              :href="media.permalink"
              target="_blank"
              rel="noreferrer"
              class="news-inline-link news-inline-link--mobile">
              Instagram <span class="external-link-icon"><ExternalLink /></span>
            </a>
          </div>
        </div>
        <div
          v-if="newsMedia.length > 1"
          class="news-inline-mobile-status">
          <span class="news-inline-status">
            {{ activeMediaIndex + 1 }} / {{ newsMedia.length }}
          </span>
        </div>
        <div v-else>
          <img
            v-if="newsMedia[0]?.type === 'image'"
            class="news-inline-image"
            :src="newsMedia[0].src"
            :alt="newsMedia[0].alt" />
          <video
            v-else-if="newsMedia[0]"
            class="news-inline-video"
            :poster="newsMedia[0].poster"
            controls
            playsinline
            preload="metadata">
            <source :src="newsMedia[0].src" />
          </video>
        </div>
      </aside>
      <div v-if="newsItem.content" class="news-detail-text">
        {{ newsItem.content }}
      </div>
    </article>
    <article
      v-if="newsItem.source || newsItem.externalUrl"
      class="news-detail-meta">
      <p v-if="newsItem.source"
        ><strong>Quelle:</strong> {{ newsItem.source }}</p
      >
      <p v-if="newsItem.externalUrl">
        <a :href="newsItem.externalUrl" target="_blank" rel="noreferrer">
          <span>zum Originalbeitrag</span>
          <span class="external-link-icon"><ExternalLink /></span>
        </a>
      </p>
    </article>
  </section>
  <section v-else class="entry-not-found">
    <h1 class="entry-not-found-title">News nicht gefunden</h1>
    <RouterLink class="entry-not-found-link" to="/news">
      Zur News-Uebersicht
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PageHero from "@/components/PageHero.vue";
import newsDetailHero from "@/assets/news/stock_news_2.png";
import { findNewsBySlug, type NewsMediaItem } from "@/utils/contentEntries";
import { formatDate } from "@/utils/date";
import { ChevronLeft, ChevronRight, ExternalLink } from "@lucide/vue";

const route = useRoute();

const newsItem = computed(() =>
  findNewsBySlug(String(route.params.slug ?? "")),
);
const activeMediaIndex = ref(0);
const mobileSwipeContainer = ref<HTMLElement | null>(null);
const mobileSwipeSlides = ref<HTMLElement[]>([]);
const newsMedia = computed<NewsMediaItem[]>(() => {
  if (newsItem.value?.media?.length) {
    return newsItem.value.media;
  }

  if (newsItem.value?.image) {
    return [
      {
        id: String(newsItem.value.id),
        type: "image",
        src: newsItem.value.image,
        alt: newsItem.value.imageAlt,
      },
    ];
  }

  return [];
});
const activeMedia = computed(
  () => newsMedia.value[activeMediaIndex.value] ?? null,
);

const showPreviousMedia = () => {
  if (!newsMedia.value.length) {
    return;
  }

  activeMediaIndex.value =
    (activeMediaIndex.value - 1 + newsMedia.value.length) %
    newsMedia.value.length;
};

const showNextMedia = () => {
  if (!newsMedia.value.length) {
    return;
  }

  activeMediaIndex.value =
    (activeMediaIndex.value + 1) % newsMedia.value.length;
};

const setMobileSwipeSlideRef = (
  element: Element | object | null,
  index: number,
) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  mobileSwipeSlides.value[index] = element;
};

const updateActiveMediaFromScroll = () => {
  const container = mobileSwipeContainer.value;
  if (!container || !mobileSwipeSlides.value.length) {
    return;
  }

  const containerCenter = container.scrollLeft + container.clientWidth / 2;
  let nextIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  mobileSwipeSlides.value.forEach((slide, index) => {
    if (!slide) {
      return;
    }

    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(containerCenter - slideCenter);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      nextIndex = index;
    }
  });

  activeMediaIndex.value = nextIndex;
};

watch(
  () => newsItem.value?.id,
  () => {
    activeMediaIndex.value = 0;
    mobileSwipeSlides.value = [];
  },
);
</script>

<style scoped>
.news-detail-layout {
  display: grid;
  gap: 24px;
  margin-bottom: clamp(48px, 8vw, 96px);
}

.news-detail-body {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  font-size: 17px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.9);
}

.news-inline-media {
  float: right;
  width: min(340px, 38%);
  margin: 0 0 20px 28px;
}

.news-inline-carousel {
  position: relative;
}

.news-inline-swipe {
  display: none;
}

.news-inline-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}

.news-inline-image,
.news-inline-video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
}

.news-inline-video {
  background: rgba(0, 0, 0, 0.4);
}

.news-inline-caption {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 13px;
}

.news-inline-status {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.72;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-detail-lead {
  margin: 0 0 18px;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.55;
  font-weight: 600;
  color: #fff2cf;
}

.news-detail-text {
  white-space: pre-line;
}

.news-detail-text::first-line {
  margin: 0 0 18px;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.55;
  font-weight: 600;
  color: #fff2cf;
}

.news-detail-body::after {
  content: "";
  display: block;
  clear: both;
}

.news-inline-caption a,
.news-detail-meta a,
.entry-not-found-link {
  color: var(--sv-secondary-color);
  font-weight: 700;
}

.news-detail-meta a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.external-link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.external-link-icon :deep(svg) {
  width: 16px;
  height: 16px;
  stroke-width: 2.25;
}

.news-detail-meta {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: clamp(24px, 3vw, 32px);
  border-radius: 28px;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
}

.news-detail-meta p {
  margin: 0;
}

.news-detail-meta p + p {
  margin-top: 12px;
}

.entry-not-found {
  width: min(1120px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  padding: clamp(28px, 4vw, 48px);
  border-radius: 28px;
  background: var(--sv-card-bg-soft);
  border: 1px solid var(--sv-card-border);
}

.entry-not-found-title {
  margin: 0 0 16px;
}

.news-inline-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sv-secondary-color);
  font-weight: 700;
}

.news-inline-link--mobile {
  margin-top: 10px;
}

.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.chevron:hover {
  color: var(--sv-secondary-color);
  scale: 1.1;
}

@media (max-width: 900px) {
  .news-detail-body,
  .news-detail-meta,
  .entry-not-found {
    width: calc(100dvw - 24px);
  }

  .news-inline-media {
    float: none;
    width: 100%;
    margin: 0 0 20px;
  }
}

@media (max-width: 700px) {
  .news-detail-hero {
    display: none;
  }

  .news-detail-layout {
    margin-top: 18px;
  }

  .news-detail-body,
  .news-detail-meta,
  .entry-not-found {
    width: 100dvw;
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
  }

  .news-detail-body {
    margin-bottom: 28px;
    font-size: 16px;
    line-height: 1.75;
    padding: 0 14px;
  }

  .news-detail-meta {
    padding: 18px 14px 24px;
  }

  .news-inline-carousel--desktop {
    display: none;
  }

  .news-inline-swipe {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 82%;
    gap: 12px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    padding: 0 18px 6px;
    -webkit-overflow-scrolling: touch;
  }

  .news-inline-swipe::-webkit-scrollbar {
    display: none;
  }

  .news-inline-swipe-slide {
    scroll-snap-align: center;
    scroll-snap-stop: always;
    opacity: 0.38;
    filter: grayscale(0.55) brightness(0.7);
    transform: scale(0.94);
    transition:
      opacity 0.2s ease,
      filter 0.2s ease,
      transform 0.2s ease;
  }

  .news-inline-swipe-slide.is-active {
    opacity: 1;
    filter: none;
    transform: scale(1);
  }

  .news-inline-mobile-status {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .news-inline-image,
  .news-inline-video {
    border-radius: 16px;
  }
}
</style>
