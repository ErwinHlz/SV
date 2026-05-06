<template>
  <div class="spielberichte-page-flow">
    <PageHero
      class="spielberichte-page-hero"
      :image="spielberichteHero"
      title="Spielberichte"
      lead="Die aktuellen Spielberichte der FSG Ottweiler/Steinbach im Bereich Aktuelles.">
      <p class="spielberichte-mobile-scroll-hint">Nach unten scrollen</p>
    </PageHero>
    <section class="spielberichte-list" aria-label="Alle Spielberichte">
      <article
        v-for="item in spielberichteItems"
        :key="item.id"
        class="spielbericht-entry">
        <RouterLink
          class="spielbericht-entry-link"
          :to="{ name: 'spielbericht-detail', params: { slug: item.slug } }"
          :aria-label="`Zum Spielbericht ${item.title}`">
          <div class="spielbericht-entry-media">
            <img
              class="spielbericht-entry-image"
              :src="item.image"
              :alt="item.imageAlt"
              loading="lazy" />
            <div class="spielbericht-entry-overlay" aria-hidden="true">
              <svg
                class="spielbericht-entry-icon"
                viewBox="0 0 48 48"
                focusable="false"
                aria-hidden="true">
                <path d="M14 18h20M14 24h20M14 30h14" />
                <rect x="10" y="12" width="28" height="24" rx="4" />
              </svg>
            </div>
          </div>
          <div class="spielbericht-entry-body">
            <div class="spielbericht-meta">
              <time :datetime="item.date">{{ formatDate(item.date) }}</time>
              <span>{{ item.time }} Uhr</span>
              <span>{{ item.competition }}</span>
            </div>
            <h3 class="spielbericht-entry-title">{{ item.title }}</h3>
            <p class="spielbericht-entry-match">
              {{ item.homeTeam }} <strong>{{ item.result }}</strong> {{ item.awayTeam }}
            </p>
            <p class="spielbericht-entry-location">
              {{ item.location }}
              <span v-if="item.halfTime"> | Halbzeit {{ item.halfTime }}</span>
            </p>
            <p class="spielbericht-entry-excerpt">{{ item.excerpt }}</p>
          </div>
        </RouterLink>
        <RouterLink
          class="spielberichte-mobile-detail"
          :to="{ name: 'spielbericht-detail', params: { slug: item.slug } }"
          :aria-label="`Spielbericht ${item.title} im Detail ansehen`">
          <ExternalLink :size="22" :stroke-width="2.2" />
        </RouterLink>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted } from "vue";
import { ExternalLink } from "@lucide/vue";
import PageHero from "@/components/PageHero.vue";
import spielberichteHero from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getSpielberichtItems } from "@/utils/contentEntries";

const spielberichteItems = computed(() => getSpielberichtItems());
const spielberichteScrollStorageKey = "sv-spielberichte-scroll-position";

const isMobileSpielberichteLayout = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 700px)").matches;

const getAppScrollContainer = () =>
  typeof document === "undefined"
    ? null
    : (document.querySelector(".app-content") as HTMLElement | null);

const readSpielberichteScrollPosition = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  if (isMobileSpielberichteLayout()) {
    return getAppScrollContainer()?.scrollTop ?? 0;
  }

  return window.scrollY;
};

const persistSpielberichteScrollPosition = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    spielberichteScrollStorageKey,
    String(readSpielberichteScrollPosition()),
  );
};

const restoreSpielberichteScrollPosition = async () => {
  if (typeof window === "undefined") {
    return;
  }

  const storedValue = window.sessionStorage.getItem(spielberichteScrollStorageKey);
  if (!storedValue) {
    return;
  }

  const nextScrollTop = Number(storedValue);
  if (!Number.isFinite(nextScrollTop)) {
    return;
  }

  await nextTick();
  window.requestAnimationFrame(() => {
    if (isMobileSpielberichteLayout()) {
      getAppScrollContainer()?.scrollTo({ top: nextScrollTop, behavior: "auto" });
      return;
    }

    window.scrollTo({ top: nextScrollTop, behavior: "auto" });
  });
};

onMounted(() => {
  restoreSpielberichteScrollPosition();
  getAppScrollContainer()?.addEventListener(
    "scroll",
    persistSpielberichteScrollPosition,
    { passive: true },
  );
  window.addEventListener("scroll", persistSpielberichteScrollPosition, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  persistSpielberichteScrollPosition();
  getAppScrollContainer()?.removeEventListener(
    "scroll",
    persistSpielberichteScrollPosition,
  );
  window.removeEventListener("scroll", persistSpielberichteScrollPosition);
});
</script>

<style scoped>
.spielberichte-page-flow {
  display: block;
}

.spielberichte-mobile-scroll-hint {
  display: none;
}

.spielberichte-list {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: 0 0 clamp(48px, 8vw, 96px);
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.5vw, 26px);
}

.spielbericht-entry {
  position: relative;
  text-decoration: none;
  color: inherit;
}

.spielbericht-entry-link {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: clamp(24px, 4vw, 34px) clamp(18px, 3vw, 28px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.spielbericht-entry:hover .spielbericht-entry-link {
  transform: translateY(-2px);
  border-color: rgba(244, 208, 71, 0.72);
}

.spielbericht-entry-link:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
  border-radius: 12px;
}

.spielberichte-mobile-detail {
  display: none;
  pointer-events: auto;
}

.spielbericht-entry-media {
  display: none;
}

.spielbericht-entry-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
}

.spielbericht-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 14px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.76;
}

.spielbericht-entry-title {
  margin: 0;
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.2;
  max-width: 24ch;
}

.spielbericht-entry-match {
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
  color: #fff2cf;
}

.spielbericht-entry-location,
.spielbericht-entry-excerpt {
  margin: 0;
  opacity: 0.86;
}

@media (max-width: 900px) {
  .spielberichte-list {
    width: calc(100dvw - 24px);
  }
}

@media (max-width: 700px) {
  .spielberichte-page-flow {
    display: block;
  }

  .spielberichte-page-hero {
    height: 100dvh;
    min-height: 100dvh;
    margin-bottom: 0;
    padding: 0 14px 22px;
    box-sizing: border-box;
    overflow: hidden;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    scroll-margin-top: 0;
  }

  .spielberichte-page-hero :deep(.page-hero-content) {
    height: 100%;
    min-height: 100dvh;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
  }

  .spielberichte-page-hero :deep(.page-hero-lead) {
    max-width: 28ch;
  }

  .spielberichte-mobile-scroll-hint {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 18px 0 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--sv-secondary-color);
    opacity: 0.9;
  }

  .spielberichte-mobile-scroll-hint::after {
    content: "";
    width: 20px;
    height: 20px;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
  }

  .spielberichte-list {
    width: 100dvw;
    display: block;
    padding: 0;
    gap: 0;
    margin: 0;
  }

  .spielbericht-entry {
    height: 100dvh;
    min-height: 100dvh;
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    scroll-margin-top: 0;
    overflow: hidden;
    align-items: stretch;
  }

  .spielbericht-entry-link {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 100dvh;
    padding: 0;
    border-bottom: 0;
  }

  .spielbericht-entry:hover .spielbericht-entry-link {
    transform: none;
    border-color: transparent;
  }

  .spielbericht-entry-media {
    position: relative;
    display: block;
    height: 44dvh;
    overflow: hidden;
    background: #dfe6f1;
  }

  .spielbericht-entry-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .spielbericht-entry-overlay {
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

  .spielbericht-entry-icon {
    width: 46px;
    height: 46px;
    stroke: var(--sv-secondary-color);
    stroke-width: 2.5;
    fill: none;
  }

  .spielbericht-entry-body {
    flex: 1;
    align-items: flex-start;
    text-align: left;
    gap: 10px;
    padding: 16px 14px 22px;
    padding-top: 18px;
    background: var(--sv-card-bg);
  }

  .spielbericht-meta {
    justify-content: flex-start;
    gap: 6px 12px;
  }

  .spielbericht-entry-title {
    max-width: none;
    font-size: clamp(24px, 7vw, 34px);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .spielbericht-entry-match {
    font-size: 15px;
    line-height: 1.6;
  }

  .spielbericht-entry-location,
  .spielbericht-entry-excerpt {
    font-size: 15px;
    line-height: 1.55;
  }

  .spielbericht-entry-excerpt {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
  }

  .spielberichte-mobile-detail {
    position: absolute;
    right: 8px;
    bottom: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--sv-secondary-color);
    text-decoration: none;
    background: none;
    border: 0;
    transform: none;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.55));
    z-index: 12;
  }

  .spielberichte-mobile-detail :deep(svg) {
    flex: 0 0 auto;
  }

  .spielbericht-entry:hover .spielbericht-entry-image {
    transform: none;
    filter: none;
  }

  .spielbericht-entry:hover .spielbericht-entry-overlay {
    opacity: 0;
    transform: scale(0.98);
  }
}
</style>
