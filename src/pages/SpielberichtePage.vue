<template>
  <div class="spielberichte-page-flow">
    <PageHero
      class="spielberichte-page-hero"
      :image="spielberichteHero"
      title="Spielberichte"
      lead="Die aktuellen Spielberichte der FSG Ottweiler/Steinbach im Bereich Aktuelles.">
      <p class="spielberichte-mobile-scroll-hint">Nach unten scrollen</p>
    </PageHero>
    <section class="spielberichte-grid" aria-label="Alle Spielberichte">
      <article
        v-for="(item, index) in spielberichteItems"
        :key="item.id"
        class="spielbericht-card"
        :style="getSpielberichtCardStyle(item.id, item.title, index)">
        <span class="spielbericht-card-pin" aria-hidden="true">
          <Pin :size="26" :stroke-width="2.1" />
        </span>
        <RouterLink
          class="spielbericht-card-sheet-link"
          :to="{ name: 'spielbericht-detail', params: { slug: item.slug } }"
          :aria-label="`Zum Spielbericht ${item.title}`">
          <div class="spielbericht-card-sheet">
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
              <p class="spielbericht-entry-match">
                {{ item.homeTeam }} <strong>{{ item.result }}</strong> {{ item.awayTeam }}
              </p>
              <h3 class="spielbericht-entry-title">{{ item.title }}</h3>
              <p class="spielbericht-entry-location">
                {{ item.location }}
                <span v-if="item.halfTime"> | Halbzeit {{ item.halfTime }}</span>
              </p>
              <p class="spielbericht-entry-excerpt">{{ item.excerpt }}</p>
            </div>
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
    <section class="spielberichte-sponsor-band" aria-label="Sponsoren">
      <SponsorLogoStrip class="spielberichte-sponsor-band__strip" />
    </section>
    <HomeSponsorsMobileSection />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted } from "vue";
import { ExternalLink, Pin } from "@lucide/vue";
import HomeSponsorsMobileSection from "@/components/HomeSponsorsMobileSection.vue";
import PageHero from "@/components/PageHero.vue";
import SponsorLogoStrip from "@/components/SponsorLogoStrip.vue";
import spielberichteHero from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getSpielberichtItems } from "@/utils/contentEntries";

const spielberichteItems = computed(() => getSpielberichtItems());
const spielberichteScrollStorageKey = "sv-spielberichte-scroll-position";
const tiltPattern = [-2.8, 1.35, -0.9, 2.45, -1.7, 0.55, 2.1, -2.2];

const getRandomTilt = (seedSource: string, index: number) => {
  const seed = `${seedSource}-${index}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }

  const baseTilt = tiltPattern[index % tiltPattern.length] ?? -1.2;
  const jitter = ((hash % 65) - 32) / 100;
  const drift = ((Math.floor(hash / 97) % 45) - 22) / 100;

  return `${(baseTilt + jitter + drift).toFixed(2)}deg`;
};

const getSpielberichtCardStyle = (
  id: string,
  title: string,
  index: number,
) => ({
  "--pin-tilt": getRandomTilt(`${id}-${title}`, index),
});

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

.spielberichte-grid {
  width: 80dvw;
  margin: 0 auto;
  padding: 20px clamp(24px, 7vw, 80px) clamp(44px, 7vw, 88px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 16px);
  align-items: start;
  overflow: visible;
}

.spielberichte-sponsor-band {
  width: min(80dvw, calc(100% - 48px));
  margin: 0 auto;
  padding: 0 0 52px;
}

.spielbericht-card {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  --spielbericht-card-min-height: clamp(410px, 35vw, 500px);
  --spielbericht-card-offset: 0px;
  --spielbericht-card-overlap: -34px;
  --spielbericht-card-overlap-x: 14px;
  --pin-tilt: 0deg;
  --spielbericht-excerpt-lines: 3;
  min-height: var(--spielbericht-card-min-height);
  width: calc(100% + (var(--spielbericht-card-overlap-x) * 2));
  margin-top: var(--spielbericht-card-overlap);
  margin-left: calc(var(--spielbericht-card-overlap-x) * -1);
  transform: translateY(var(--spielbericht-card-offset));
  z-index: 1;
  background: transparent;
}

.spielbericht-card:hover {
  transform: translateY(calc(var(--spielbericht-card-offset) - 6px));
  z-index: 10;
}

.spielbericht-card-sheet-link {
  display: block;
  color: inherit;
  text-decoration: none;
  pointer-events: none;
}

.spielbericht-card:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.spielbericht-card-pin {
  position: absolute;
  top: 2px;
  left: 50%;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  color: var(--sv-secondary-color);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
  transform: translateX(-50%);
  z-index: 4;
}

.spielbericht-card-pin :deep(svg) {
  overflow: visible;
  fill: var(--sv-secondary-color);
}

.spielberichte-mobile-detail {
  display: none;
  pointer-events: auto;
}

.spielbericht-card-sheet {
  display: flex;
  flex-direction: column;
  min-height: var(--spielbericht-card-min-height);
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  border-radius: 18px;
  box-shadow: 0 14px 28px rgba(2, 43, 121, 0.12);
  transform-origin: top center;
  transform: rotate(var(--pin-tilt));
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  pointer-events: auto;
}

.spielbericht-card:hover .spielbericht-card-sheet {
  transform: rotate(calc(var(--pin-tilt) * -1));
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.spielbericht-entry-media {
  position: relative;
  display: block;
  height: clamp(180px, 15.5vw, 220px);
  overflow: hidden;
  background: #dfe6f1;
  border-radius: 18px 18px 0 0;
}

.spielbericht-entry-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition:
    transform 0.6s ease,
    filter 0.6s ease;
}

.spielbericht-entry-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 43, 121, 0.35);
  opacity: 0;
  transform: scale(0.98);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  pointer-events: none;
}

.spielbericht-entry-icon {
  width: 46px;
  height: 46px;
  stroke: var(--sv-secondary-color);
  stroke-width: 2.5;
  fill: none;
}

.spielbericht-card:hover .spielbericht-entry-image {
  transform: scale(1.08);
  filter: grayscale(0.15);
}

.spielbericht-card:hover .spielbericht-entry-overlay {
  opacity: 1;
  transform: scale(1);
}

.spielbericht-entry-body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: clamp(12px, 1.6vw, 18px);
  padding-top: clamp(22px, 2.4vw, 28px);
  flex: 1;
  background: rgb(7, 18, 44);
  border: 1px solid rgb(7, 18, 44);
  border-radius: 0 0 18px 18px;
}

.spielbericht-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.spielbericht-entry-title {
  margin: 0;
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.spielbericht-entry-match {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #fff2cf;
}

.spielbericht-entry-excerpt {
  margin: 0;
  opacity: 0.86;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--spielbericht-excerpt-lines);
  overflow: hidden;
}

.spielbericht-entry-location {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  opacity: 0.72;
}

.spielbericht-card:nth-child(6n + 2) {
  --spielbericht-card-min-height: clamp(360px, 30vw, 425px);
  --spielbericht-card-offset: 18px;
  --spielbericht-card-overlap: -56px;
  --spielbericht-card-overlap-x: 22px;
  --spielbericht-excerpt-lines: 2;
}

.spielbericht-card:nth-child(6n + 3) {
  --spielbericht-card-offset: 6px;
  --spielbericht-card-overlap: -44px;
  --spielbericht-card-overlap-x: 18px;
}

.spielbericht-card:nth-child(6n + 4) {
  --spielbericht-card-offset: 10px;
  --spielbericht-card-overlap: -48px;
  --spielbericht-card-overlap-x: 20px;
}

.spielbericht-card:nth-child(6n + 5) {
  --spielbericht-card-min-height: clamp(450px, 39vw, 550px);
  --spielbericht-card-offset: -14px;
  --spielbericht-card-overlap: -68px;
  --spielbericht-card-overlap-x: 28px;
  --spielbericht-excerpt-lines: 4;
}

.spielbericht-card:nth-child(6n + 6) {
  --spielbericht-card-offset: -6px;
  --spielbericht-card-overlap: -52px;
  --spielbericht-card-overlap-x: 20px;
}

@media (max-width: 1100px) {
  .spielberichte-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: clamp(20px, 6vw, 48px);
    gap: 12px;
  }

  .spielbericht-card {
    --spielbericht-card-min-height: clamp(380px, 46vw, 450px);
    --spielbericht-card-overlap: -28px;
    --spielbericht-card-overlap-x: 10px;
  }

  .spielbericht-card:nth-child(6n + 2) {
    --spielbericht-card-min-height: clamp(344px, 41vw, 404px);
    --spielbericht-card-offset: 14px;
    --spielbericht-card-overlap: -42px;
    --spielbericht-card-overlap-x: 16px;
  }

  .spielbericht-card:nth-child(6n + 5) {
    --spielbericht-card-min-height: clamp(410px, 49vw, 490px);
    --spielbericht-card-offset: -10px;
    --spielbericht-card-overlap: -52px;
    --spielbericht-card-overlap-x: 20px;
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

  .spielberichte-grid {
    width: 100dvw;
    display: block;
    padding: 0;
    gap: 0;
    margin: 0;
  }

  .spielbericht-card {
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
    transform: none;
  }

  .spielbericht-card:hover {
    transform: none;
  }

  .spielbericht-card-pin {
    display: none;
  }

  .spielbericht-card-sheet-link {
    flex: 1;
  }

  .spielbericht-card-sheet {
    min-height: 100dvh;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    transform: none;
  }

  .spielbericht-card:hover .spielbericht-card-sheet {
    transform: none;
    border-color: var(--sv-card-border);
    box-shadow: none;
  }

  .spielbericht-card-sheet-link {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    min-height: 100dvh;
    padding: 0;
    border-bottom: 0;
  }

  .spielbericht-entry-media {
    height: 44dvh;
    border-radius: 0;
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

  .spielbericht-entry-location {
    opacity: 0.86;
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

  .spielbericht-card:hover .spielbericht-entry-image {
    transform: none;
    filter: none;
  }

  .spielbericht-card:hover .spielbericht-entry-overlay {
    opacity: 0;
    transform: scale(0.98);
  }

  .spielberichte-sponsor-band {
    width: calc(100% - 24px);
    padding: 8px 0 28px;
  }
}
</style>
