<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@lucide/vue";
import MobileNewsImage from "@/components/mobile/MobileNewsImage.vue";
import { openCookieSettings, useCookieConsent } from "@/composables/useCookieConsent";
import { getNewsItems, type NewsEntry, type NewsMediaItem } from "@/utils/contentEntries";
import { formatLongDate, formatShortDate } from "@/utils/mobileFormat";
import { toMobileNews } from "@/utils/mobileNews";

const props = defineProps<{
  item: NewsEntry;
  media: NewsMediaItem[];
}>();

const activeIndex = defineModel<number>("activeIndex", { default: 0 });

const { hasExternalMediaConsent } = useCookieConsent();
const railRef = ref<HTMLElement | null>(null);

const news = computed(() => toMobileNews(props.item));
const isInstagram = computed(() => props.item.source === "Instagram");
const needsConsent = computed(() => isInstagram.value && !hasExternalMediaConsent.value);

// Absaetze bleiben erhalten, Emojis und Unicode-Zierschrift fliegen raus.
const paragraphs = computed(() => {
  const lines = (props.item.content ?? props.item.excerpt ?? "")
    .normalize("NFKC")
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  // Bei Instagram ist die erste Caption-Zeile bereits der Titel.
  if (isInstagram.value && lines[0] && news.value.cleanTitle.startsWith(lines[0].slice(0, 20))) {
    lines.shift();
  }

  return lines;
});

const more = computed(() =>
  getNewsItems()
    .filter((entry) => entry.slug !== props.item.slug)
    .slice(0, 3)
    .map(toMobileNews),
);

const onRailScroll = () => {
  const rail = railRef.value;
  if (!rail) return;
  activeIndex.value = Math.round(rail.scrollLeft / rail.clientWidth);
};

watch(
  () => props.item.slug,
  () => {
    activeIndex.value = 0;
    if (railRef.value) railRef.value.scrollLeft = 0;
  },
);
</script>

<template>
  <article class="m-page news-detail">
    <div class="news-detail__head">
      <RouterLink to="/news" class="news-detail__back">
        <ArrowLeft :size="18" :stroke-width="2" /> Alle News
      </RouterLink>
      <p class="m-kicker">{{ isInstagram ? "Instagram" : "News" }} · {{ formatLongDate(item.date) }}</p>
      <h1 class="m-display news-detail__title">{{ news.cleanTitle }}</h1>
    </div>

    <div v-if="needsConsent" class="news-detail__consent">
      <div class="news-detail__fallback">
        <MobileNewsImage :item="item" />
      </div>
      <p>Bilder und Videos von Instagram werden erst geladen, wenn du externe Inhalte zulässt.</p>
      <button type="button" class="news-detail__consent-btn" @click="openCookieSettings">
        Instagram-Inhalte anzeigen
      </button>
    </div>

    <div v-else-if="media.length" class="news-detail__media">
      <div ref="railRef" class="news-detail__rail" @scroll.passive="onRailScroll">
        <figure v-for="entry in media" :key="entry.id" class="news-detail__slide">
          <img v-if="entry.type === 'image'" :src="entry.src" :alt="entry.alt" />
          <blockquote
            v-else-if="entry.type === 'instagram-embed'"
            class="instagram-media news-detail__embed"
            :data-instgrm-permalink="entry.permalink"
            data-instgrm-version="14">
            <a :href="entry.permalink" target="_blank" rel="noreferrer">Beitrag auf Instagram ansehen</a>
          </blockquote>
          <video v-else :poster="entry.poster" controls playsinline preload="metadata">
            <source :src="entry.src" />
          </video>
        </figure>
      </div>
      <div v-if="media.length > 1" class="news-detail__dots" aria-hidden="true">
        <span
          v-for="(entry, index) in media"
          :key="entry.id"
          class="news-detail__dot"
          :class="{ 'is-active': index === activeIndex }"></span>
      </div>
    </div>

    <div class="news-detail__body">
      <p v-for="(paragraph, index) in paragraphs" :key="index" class="news-detail__text">
        {{ paragraph }}
      </p>

      <a
        v-if="item.externalUrl"
        :href="item.externalUrl"
        target="_blank"
        rel="noreferrer"
        class="m-text-link news-detail__source">
        {{ isInstagram ? "Auf Instagram ansehen" : "Zum Originalbeitrag" }}
        <ArrowUpRight :size="16" :stroke-width="2" />
      </a>
    </div>

    <section v-if="more.length" class="news-detail__more" aria-label="Weitere News">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">Weiterlesen</p>
          <h2 class="m-section-title">Mehr News</h2>
        </div>
        <RouterLink to="/news" class="m-more">
          Alle <ArrowRight :size="16" :stroke-width="2" />
        </RouterLink>
      </div>
      <div class="news-detail__more-list">
        <RouterLink
          v-for="entry in more"
          :key="entry.id"
          :to="{ name: 'news-detail', params: { slug: entry.slug } }"
          class="m-row news-detail__more-row">
          <span class="news-detail__more-media">
            <MobileNewsImage :item="entry" />
          </span>
          <span class="news-detail__more-text">
            <span class="news-detail__more-date">{{ formatShortDate(entry.date) }}</span>
            <span class="news-detail__more-title">{{ entry.cleanTitle }}</span>
          </span>
        </RouterLink>
      </div>
    </section>
  </article>
</template>

<style scoped>
.news-detail {
  padding-top: var(--m-header);
  padding-bottom: 56px;
}

.news-detail__head {
  padding: 8px var(--m-gutter) 20px;
}

.news-detail__back {
  min-height: 44px;
  margin-bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--m-text-2);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.news-detail__title {
  margin-top: 8px;
  font-size: 42px;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.news-detail__media {
  margin-bottom: 8px;
}

.news-detail__rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.news-detail__rail::-webkit-scrollbar {
  display: none;
}

.news-detail__slide {
  flex: none;
  width: 100%;
  margin: 0;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  justify-content: center;
  background: #020a1c;
}

.news-detail__slide img,
.news-detail__slide video {
  display: block;
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
}

.news-detail__embed {
  width: 100%;
  margin: 0 !important;
}

.news-detail__dots {
  padding-top: 12px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.news-detail__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  transition: width 0.2s ease, background-color 0.2s ease;
}

.news-detail__dot.is-active {
  width: 18px;
  background: var(--m-yellow);
}

.news-detail__consent {
  margin: 0 var(--m-gutter) 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-detail__fallback {
  height: 220px;
  border-radius: 20px;
  overflow: hidden;
}

.news-detail__consent p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.news-detail__consent-btn {
  align-self: flex-start;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--m-yellow);
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.news-detail__body {
  padding: 16px var(--m-gutter) 0;
}

.news-detail__text {
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 1.65;
  color: #dbe3f3;
}

.news-detail__source {
  margin-top: 4px;
}

.news-detail__more {
  padding-top: 48px;
}

.news-detail__more-list {
  padding: 0 var(--m-gutter);
}

.news-detail__more-row {
  grid-template-columns: 72px minmax(0, 1fr);
}

.news-detail__more-media {
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
}

.news-detail__more-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.news-detail__more-date {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.news-detail__more-title {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
