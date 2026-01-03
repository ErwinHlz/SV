<template>
  <PageHero :image="stadionHero" :title="hero.title" :lead="hero.lead" />

  <section class="stadion-intro" aria-label="Stadion Intro">
    <div class="intro-card">
      <h2 class="intro-title">{{ intro.title }}</h2>
      <p class="intro-text">{{ intro.text }}</p>
      <p v-if="intro.note" class="intro-note">{{ intro.note }}</p>
    </div>
  </section>

  <section class="stadion-facts" aria-label="Stadion Infos">
    <header class="facts-header">
      <h2 class="facts-title">{{ facts.title }}</h2>
    </header>
    <div class="facts-grid">
      <article v-for="item in facts.items" :key="item.label" class="fact">
        <p class="fact-label">{{ item.label }}</p>
        <p class="fact-value">
          <a v-if="item.link" :href="item.link" target="_blank" rel="noopener">
            {{ item.value }}
          </a>
          <span v-else>{{ item.value }}</span>
        </p>
      </article>
    </div>
  </section>

  <section class="stadion-gallery" aria-label="Stadion Bilder">
    <header class="gallery-header">
      <h2 class="gallery-title">{{ gallery.title }}</h2>
      <div class="slideshow-controls">
        <button
          type="button"
          class="slideshow-btn"
          :disabled="galleryItems.length < 2"
          aria-label="Vorheriges Bild"
          @click="prevSlide">
          Zurueck
        </button>
        <button
          type="button"
          class="slideshow-btn"
          :disabled="galleryItems.length < 2"
          aria-label="Naechstes Bild"
          @click="nextSlide">
          Weiter
        </button>
      </div>
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
        <p v-else class="slideshow-empty">Keine Bilder vorhanden.</p>
      </div>
      <p v-if="activeCaption" class="slideshow-caption" aria-live="polite">
        {{ activeCaption }}
      </p>
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
    </div>
  </section>

  <section class="stadion-map" aria-label="Anfahrt und Parken">
    <header class="map-header">
      <h2 class="map-title">{{ map.title }}</h2>
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
      v-if="map.linkUrl"
      class="map-cta"
      :href="map.linkUrl"
      target="_blank"
      rel="noopener">
      {{ map.linkLabel }}
    </a>
  </section>

  <section class="stadion-people" aria-label="Team am Stadion">
    <header class="people-header">
      <h2 class="people-title">{{ people.title }}</h2>
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
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

type StadionPeople = {
  title: string;
  items: StadionPerson[];
};

type StadionContent = {
  hero: {
    title: string;
    lead: string;
  };
  intro: {
    title: string;
    text: string;
    note?: string;
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
  people: StadionPeople;
};

const stadionContent = rawStadion as StadionContent;
const { hero, intro, facts, gallery, map, people } = stadionContent;

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

const activeCaption = computed(
  () => galleryItems[activeSlide.value]?.caption ?? ""
);

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
.stadion-intro,
.stadion-facts,
.stadion-gallery,
.stadion-map,
.stadion-people {
  width: 80dvw;
  margin: 0 auto;
}

.stadion-intro {
  margin-bottom: clamp(32px, 6vw, 64px);
}

.intro-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: clamp(20px, 3vw, 36px);
  display: grid;
  gap: 12px;
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.intro-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.intro-text {
  margin: 0;
  max-width: 70ch;
  opacity: 0.9;
}

.intro-note {
  margin: 0;
  color: var(--sv-secondary-color);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
}

.stadion-facts {
  margin-bottom: clamp(40px, 8vw, 96px);
}

.facts-header {
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.facts-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.fact {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: clamp(16px, 2.4vw, 24px);
  display: grid;
  gap: 8px;
}

.fact-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.fact-value {
  margin: 0;
  font-size: 1rem;
}

.fact-value a {
  color: var(--sv-secondary-color);
  text-decoration: none;
}

.fact-value a:hover,
.fact-value a:focus-visible {
  text-decoration: underline;
}

.stadion-gallery {
  margin-bottom: clamp(40px, 8vw, 96px);
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.gallery-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.slideshow-controls {
  display: flex;
  gap: 10px;
}

.slideshow-btn {
  border-radius: 999px;
  padding: 8px 18px;
  background: rgba(2, 43, 121, 0.6);
  color: var(--sv-secondary-color);
  border: 1px solid rgba(244, 208, 71, 0.45);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease,
    color 0.25s ease;
}

.slideshow-btn:hover,
.slideshow-btn:focus-visible {
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  box-shadow: 0 10px 22px rgba(2, 43, 121, 0.22);
  transform: translateY(-1px);
}

.slideshow-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.slideshow {
  display: grid;
  gap: 12px;
}

.slideshow-stage {
  position: relative;
  width: 100%;
  height: clamp(600px, 80vw, 700px);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
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

.slideshow-empty {
  margin: 0;
  padding: 24px;
  text-align: center;
  opacity: 0.8;
}

.slideshow-caption {
  margin: 0;
  padding: 0 2px;
  font-size: 0.9rem;
  opacity: 0.85;
}

.slideshow-dots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.stadion-map {
  margin-bottom: clamp(40px, 8vw, 96px);
}

.map-header {
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.map-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.map-frame {
  width: 100%;
  height: clamp(320px, 60vh, 520px);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
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

.map-cta {
  margin-top: 16px;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease,
    color 0.25s ease;
}

.map-cta:hover,
.map-cta:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}

.stadion-people {
  margin-bottom: clamp(48px, 8vw, 96px);
}

.people-header {
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.people-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.people-card {
  width: 20dvw;
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

@media (max-width: 720px) {
  .facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
