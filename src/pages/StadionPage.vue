<template>
  <PageHero
    class="stadion-page-hero"
    :image="stadionHero"
    :title="hero.title"
    :lead="hero.lead" />

  <section class="stadion-mobile-intro" aria-label="Stadion Uebersicht">
    <div class="stadion-mobile-intro-copy">
      <p class="stadion-mobile-kicker">Sportplatz Ottweiler</p>
      <h2 class="stadion-mobile-title">{{ intro.title }}</h2>
      <p class="stadion-mobile-text">{{ intro.text }}</p>
      <p class="stadion-mobile-note">{{ intro.note }}</p>
    </div>

    <header class="stadion-mobile-section-header">
      <h2 class="section-title">{{ facts.title }}</h2>
    </header>

    <div class="stadion-facts-grid">
      <article
        v-for="fact in facts.items"
        :key="fact.label"
        class="stadion-fact-card">
        <span class="stadion-fact-label">{{ fact.label }}</span>
        <strong class="stadion-fact-value">{{ fact.value }}</strong>
      </article>
    </div>
  </section>

  <section class="stadion-section" aria-label="Stadion Impressionen">
    <header class="section-header">
      <h2 class="section-title">{{ gallery.title }}</h2>
    </header>
    <div
      class="slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label="Stadion Diashow"
      @mouseenter="stopTimer"
      @mouseleave="startTimer"
      @focusin="stopTimer"
      @focusout="startTimer">
      <div class="slideshow-stage">
        <template v-if="galleryItems.length">
          <figure
            v-for="(item, index) in galleryItems"
            :key="item.id"
            class="slideshow-slide"
            :class="{ 'is-active': index === activeSlide }">
            <img :src="item.image" :alt="item.imageAlt" loading="lazy" />
          </figure>
        </template>
        <p v-else class="map-placeholder">Keine Bilder vorhanden.</p>
      </div>
      <div class="slideshow-controls">
        <button
          type="button"
          class="slideshow-btn"
          :disabled="galleryItems.length < 2"
          aria-label="Vorheriges Bild"
          @click="prevSlide">
          <span class="chevron"><ChevronLeft :size="22" :stroke-width="2.2" aria-hidden="true" /></span>
        </button>
        <div class="slideshow-dots" aria-label="Diashow Navigation">
          <button
            v-for="(item, index) in galleryItems"
            :key="item.id"
            type="button"
            class="slideshow-dot"
            :class="{ 'is-active': index === activeSlide }"
            :aria-label="`Bild ${index + 1}`"
            :disabled="galleryItems.length < 2"
            @click="setSlide(index)"></button>
        </div>
        <button
          type="button"
          class="slideshow-btn"
          :disabled="galleryItems.length < 2"
          aria-label="Naechstes Bild"
          @click="nextSlide">
          <span class="chevron"><ChevronRight :size="22" :stroke-width="2.2" aria-hidden="true" /></span>
        </button>
      </div>
    </div>
  </section>

  <section class="stadion-section" aria-label="Anfahrt">
    <header class="section-header">
      <h2 class="section-title">{{ map.title }}</h2>
    </header>
    <div class="map-frame">
      <iframe
        v-if="map.embedUrl"
        :src="map.embedUrl"
        :title="map.title"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen></iframe>
      <p v-else class="map-placeholder">Keine Karte hinterlegt.</p>
    </div>
    <a
      v-if="addressLink"
      class="address-link"
      :href="addressLink"
      target="_blank"
      rel="noopener">
      <MapPinned :size="18" :stroke-width="2.2" aria-hidden="true" />
      <span>{{ addressLabel }}</span>
    </a>
  </section>

</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft, ChevronRight, MapPinned } from "@lucide/vue";
import PageHero from "@/components/PageHero.vue";
import stadionHero from "@/assets/header/background.png";
import rawStadion from "@/content/stadion.json";

type StadiumFact = {
  label: string;
  value: string;
  link?: string;
};

type StadionMap = {
  title: string;
  embedUrl?: string;
  linkLabel?: string;
  linkUrl?: string;
};

type StadionGalleryItem = {
  id: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
};

type StadionContent = {
  hero: {
    title: string;
    lead: string;
  };
  intro: {
    title: string;
    text: string;
    note: string;
  };
  facts: {
    title: string;
    items: StadiumFact[];
  };
  gallery: {
    title: string;
    items: StadionGalleryItem[];
  };
  map: StadionMap;
};

const stadionContent = rawStadion as StadionContent;
const { hero, intro, facts, gallery, map } = stadionContent;

const imageMap: Record<string, string> = {
  stadionHero,
};

const galleryItems = gallery.items.map((item, index) => ({
  ...item,
  image: item.image ? imageMap[item.image] ?? item.image : stadionHero,
  imageAlt: item.imageAlt ?? item.caption ?? `Stadion Bild ${index + 1}`,
}));

const activeSlide = ref(0);
const slideCount = galleryItems.length;
let slideshowTimer: ReturnType<typeof setInterval> | null = null;

const addressFact = facts.items.find((item) => item.label === "Adresse");
const addressLabel = addressFact?.value ?? "Adresse in Google Maps oeffnen";
const addressLink = addressFact?.link ?? map.linkUrl;

const clampIndex = (index: number) => {
  if (slideCount === 0) return 0;
  return (index + slideCount) % slideCount;
};

const startTimer = () => {
  if (slideCount <= 1) return;
  stopTimer();
  slideshowTimer = setInterval(() => {
    activeSlide.value = clampIndex(activeSlide.value + 1);
  }, 6000);
};

const stopTimer = () => {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
};

const restartTimer = () => {
  stopTimer();
  startTimer();
};

const nextSlide = () => {
  if (slideCount <= 1) return;
  activeSlide.value = clampIndex(activeSlide.value + 1);
  restartTimer();
};

const prevSlide = () => {
  if (slideCount <= 1) return;
  activeSlide.value = clampIndex(activeSlide.value - 1);
  restartTimer();
};

const setSlide = (index: number) => {
  activeSlide.value = clampIndex(index);
  restartTimer();
};

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<style scoped>
.stadion-mobile-intro {
  display: none;
}

.stadion-section {
  width: min(1120px, calc(100dvw - 48px));
  margin: 0 auto clamp(40px, 7vw, 88px);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.section-title {
  margin: 0;
  font-size: clamp(24px, 3vw, 36px);
  letter-spacing: 0.02em;
}

.slideshow-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.slideshow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.slideshow-btn:hover,
.slideshow-btn:focus-visible {
  color: var(--sv-secondary-color);
  transform: scale(1.08);
}

.slideshow-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}

.slideshow {
  display: grid;
  gap: 12px;
}

.slideshow-stage {
  position: relative;
  width: 100%;
  height: clamp(600px, 80vw, 700px);
  border-radius: 22px;
  overflow: hidden;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.slideshow-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.6s ease, transform 0.6s ease;
  margin: 0;
}

.slideshow-slide.is-active {
  opacity: 1;
  transform: scale(1);
  z-index: 1;
}

.slideshow-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slideshow-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.slideshow-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(244, 208, 71, 0.6);
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.slideshow-dot.is-active {
  background: var(--sv-secondary-color);
}

.slideshow-dot:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.map-frame {
  width: 100%;
  height: clamp(320px, 58vh, 520px);
  border-radius: 22px;
  overflow: hidden;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.map-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.map-placeholder {
  margin: 0;
  padding: 24px;
  text-align: center;
  opacity: 0.8;
}

.address-link {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--sv-secondary-color);
  font-weight: 700;
  text-decoration: none;
}

.address-link:hover,
.address-link:focus-visible {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .stadion-section {
    width: calc(100dvw - 24px);
  }

  .slideshow-stage {
    height: clamp(320px, 58vw, 460px);
  }
}

@media (max-width: 720px) {
  .stadion-page-hero {
    display: none;
  }

  .stadion-mobile-intro {
    display: grid;
    align-content: center;
    gap: 1rem;
    width: calc(100dvw - 24px);
    min-height: 100svh;
    margin: 0 auto;
    padding: 1.25rem 0 1rem;
  }

  .stadion-mobile-intro-copy {
    padding: 1.35rem 1.1rem 1.2rem;
    border-radius: 1.5rem;
    background:
      linear-gradient(180deg, rgba(16, 39, 22, 0.98), rgba(27, 62, 35, 0.96));
    color: #fff;
    box-shadow: 0 1rem 2.6rem rgba(16, 39, 22, 0.24);
  }

  .stadion-mobile-section-header {
    padding: 0 0.15rem;
  }

  .stadion-mobile-kicker {
    margin: 0 0 0.6rem;
    color: #78d982;
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .stadion-mobile-title {
    margin: 0;
    font-size: clamp(2rem, 10vw, 3rem);
    line-height: 0.94;
    letter-spacing: -0.05em;
  }

  .stadion-mobile-text,
  .stadion-mobile-note {
    margin: 0.85rem 0 0;
    line-height: 1.55;
  }

  .stadion-mobile-text {
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.98rem;
  }

  .stadion-mobile-note {
    color: rgba(255, 255, 255, 0.64);
    font-size: 0.82rem;
  }

  .stadion-facts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .stadion-fact-card {
    min-height: 8.8rem;
    display: grid;
    align-content: space-between;
    gap: 0.8rem;
    padding: 1rem;
    border-radius: 1.25rem;
    background: linear-gradient(180deg, #ffffff, #f4f0e6);
    border: 1px solid rgba(16, 39, 22, 0.08);
    box-shadow: 0 0.8rem 2rem rgba(16, 39, 22, 0.1);
  }

  .stadion-fact-label {
    color: #2f7d46;
    font-size: 0.66rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .stadion-fact-value {
    align-self: end;
    color: #111;
    font-size: 1.02rem;
    line-height: 1.2;
  }

  .stadion-section {
    width: calc(100dvw - 24px);
    min-height: 100svh;
    margin-bottom: 0;
    padding: 1.25rem 0 1rem;
    display: grid;
    align-content: center;
  }

  .section-header {
    margin-bottom: 0.9rem;
    padding: 0 0.15rem;
  }

  .section-title {
    font-size: clamp(1.7rem, 8vw, 2.35rem);
    line-height: 0.98;
    letter-spacing: -0.04em;
  }

  .slideshow {
    gap: 0.85rem;
  }

  .slideshow-stage {
    height: 54dvh;
    min-height: 20rem;
    border-radius: 1.5rem;
    box-shadow: 0 1rem 2.4rem rgba(2, 43, 121, 0.18);
  }

  .slideshow-controls {
    gap: 1rem;
  }

  .slideshow-btn {
    min-width: 2.25rem;
    min-height: 2.25rem;
  }

  .slideshow-dots {
    gap: 0.5rem;
  }

  .map-frame {
    height: 54dvh;
    min-height: 20rem;
    border-radius: 1.5rem;
    box-shadow: 0 1rem 2.4rem rgba(2, 43, 121, 0.18);
  }

  .address-link {
    width: 100%;
    justify-content: center;
    margin-top: 0.9rem;
    padding: 0.9rem 1rem;
    border-radius: 999px;
    background: rgba(244, 208, 71, 0.14);
  }
}
</style>
