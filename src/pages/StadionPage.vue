<template>
  <PageHero :image="stadionHero" :title="hero.title" :lead="hero.lead" />

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

  <section class="stadion-section" aria-label="Team am Stadion">
    <header class="section-header">
      <h2 class="section-title">{{ people.title }}</h2>
    </header>
    <div class="people-grid">
      <article
        v-for="person in personCards"
        :key="person.id"
        class="people-card">
        <div class="people-photo">
          <img
            v-if="person.image"
            :src="person.image"
            :alt="person.imageAlt"
            loading="lazy" />
          <span v-else class="people-photo-fallback">
            {{ getInitials(person.name) }}
          </span>
        </div>
        <div class="people-caption">
          <p class="people-name">{{ person.name }}</p>
          <p class="people-role">{{ person.role }}</p>
        </div>
      </article>
    </div>
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

type StadionPerson = {
  id: string;
  name: string;
  role: string;
  image?: string;
  imageAlt?: string;
};

type StadionContent = {
  hero: {
    title: string;
    lead: string;
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
  people: {
    title: string;
    items: StadionPerson[];
  };
};

const stadionContent = rawStadion as StadionContent;
const { hero, facts, gallery, map, people } = stadionContent;

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

const personCards = people.items.map((person) => ({
  ...person,
  image: person.image ? imageMap[person.image] ?? person.image : undefined,
  imageAlt: person.imageAlt ?? person.name,
}));

const getInitials = (value?: string) =>
  (value ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
</script>

<style scoped>
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

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.people-card {
  background: #f7f1e3;
  color: #1f2a44;
  border: 1px solid rgba(11, 31, 77, 0.2);
  border-radius: 6px;
  padding: 12px;
  display: grid;
  gap: 10px;
  box-shadow: 0 14px 28px rgba(11, 31, 77, 0.18);
}

.people-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  overflow: hidden;
  background: #d7d2c6;
  display: grid;
  place-items: center;
}

.people-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.people-photo-fallback {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(31, 42, 68, 0.7);
}

.people-caption {
  padding: 2px 4px 4px;
  text-align: center;
}

.people-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.people-role {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 10px;
  color: rgba(31, 42, 68, 0.65);
}

@media (max-width: 900px) {
  .stadion-section {
    width: calc(100dvw - 24px);
  }

  .slideshow-stage {
    height: clamp(320px, 58vw, 460px);
  }
}
</style>
