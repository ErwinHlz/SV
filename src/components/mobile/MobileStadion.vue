<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpRight, MapPin, Navigation } from "@lucide/vue";
import DummySilhouette from "@/components/DummySilhouette.vue";
import { openCookieSettings, useCookieConsent } from "@/composables/useCookieConsent";
import { getGalleryPlaceholder } from "@/utils/galleryPlaceholders";

type Slide = { id: string; image: string; imageAlt: string; caption?: string };
type Person = { id: string; name: string; role: string; image?: string; imageAlt: string };
type Fact = { label: string; value: string; link?: string };

const props = defineProps<{
  lead: string;
  slides: Slide[];
  people: Person[];
  peopleTitle: string;
  facts: Fact[];
  mapTitle: string;
  mapEmbedUrl?: string;
  addressLabel: string;
  addressLink?: string;
}>();

const { hasExternalMediaConsent } = useCookieConsent();

const railRef = ref<HTMLElement | null>(null);
const activeSlide = ref(0);

const onRailScroll = () => {
  const rail = railRef.value;
  const first = rail?.firstElementChild as HTMLElement | null;
  if (!rail || !first) return;
  const step = first.offsetWidth + 12;
  activeSlide.value = Math.min(props.slides.length - 1, Math.round(rail.scrollLeft / step));
};

// Adresse steht schon im Anfahrt-Block.
const infoFacts = props.facts.filter((fact) => fact.label !== "Adresse");
// Bei jedem Seitenaufruf ein anderes Bild aus der Galerie.
const heroImage = getGalleryPlaceholder("hero:stadion");
</script>

<template>
  <div class="m-page stadion">
    <section class="stadion-hero">
      <img
        v-if="heroImage"
        class="stadion-hero__image m-par"
        :src="heroImage"
        alt="" />
      <div class="stadion-hero__shade" aria-hidden="true"></div>
      <div class="stadion-hero__content m-fadeout">
        <p class="m-kicker">Unser Stadion</p>
        <h1 class="m-display stadion-hero__title">Im Alten<br />Weiher.</h1>
        <p class="stadion-hero__lead">{{ lead }}</p>
      </div>
    </section>

    <section class="stadion-facts" aria-label="Auf einen Blick">
      <div v-for="fact in infoFacts" :key="fact.label" class="stadion-facts__item m-rv">
        <span class="stadion-facts__label">{{ fact.label }}</span>
        <span class="stadion-facts__value">{{ fact.value }}</span>
      </div>
    </section>

    <section class="stadion-gallery" aria-label="Stadion Impressionen">
      <div class="m-section-head m-rv">
        <div>
          <p class="m-kicker">Impressionen</p>
          <h2 class="m-section-title">Der Platz</h2>
        </div>
        <span class="stadion-gallery__count">
          {{ String(activeSlide + 1).padStart(2, "0") }} / {{ String(slides.length).padStart(2, "0") }}
        </span>
      </div>
      <div ref="railRef" class="stadion-gallery__rail" @scroll.passive="onRailScroll">
        <figure v-for="slide in slides" :key="slide.id" class="stadion-gallery__slide">
          <img :src="slide.image" :alt="slide.imageAlt" loading="lazy" />
          <figcaption v-if="slide.caption">{{ slide.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section v-if="people.length" class="stadion-people" aria-label="Team am Stadion">
      <div class="m-section-head m-rv">
        <div>
          <p class="m-kicker">Gastgeber</p>
          <h2 class="m-section-title">{{ peopleTitle }}</h2>
        </div>
      </div>
      <div class="stadion-people__list">
        <article v-for="person in people" :key="person.id" class="m-row stadion-people__row m-rv">
          <span class="stadion-people__photo">
            <img v-if="person.image" :src="person.image" :alt="person.imageAlt" loading="lazy" />
            <DummySilhouette v-else />
          </span>
          <span class="stadion-people__text">
            <span class="stadion-people__role">{{ person.role }}</span>
            <span class="stadion-people__name">{{ person.name }}</span>
          </span>
        </article>
      </div>
    </section>

    <section class="stadion-map" aria-label="Anfahrt">
      <div class="m-section-head m-rv">
        <div>
          <p class="m-kicker">Anfahrt</p>
          <h2 class="m-section-title">{{ mapTitle }}</h2>
        </div>
      </div>
      <div class="stadion-map__body">
        <div class="stadion-map__frame m-rv">
          <iframe
            v-if="mapEmbedUrl && hasExternalMediaConsent"
            :src="mapEmbedUrl"
            :title="mapTitle"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen></iframe>
          <div v-else class="stadion-map__placeholder">
            <MapPin :size="34" :stroke-width="1.6" aria-hidden="true" />
            <p>Die Karte von Google Maps wird erst geladen, wenn du externe Inhalte zulässt.</p>
            <button type="button" class="stadion-map__consent" @click="openCookieSettings">
              Karte anzeigen
            </button>
          </div>
        </div>
        <p class="stadion-map__address">
          <MapPin :size="18" :stroke-width="2" aria-hidden="true" />
          {{ addressLabel }}
        </p>
        <a
          v-if="addressLink"
          :href="addressLink"
          target="_blank"
          rel="noopener"
          class="m-btn stadion-map__cta">
          <Navigation :size="18" :stroke-width="2" /> Route planen
          <ArrowUpRight :size="16" :stroke-width="2" />
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stadion {
  padding-bottom: 56px;
}

.stadion-hero {
  position: relative;
  height: 560px;
  overflow: hidden;
}

.stadion-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stadion-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.6) 0%,
    rgba(0, 6, 17, 0) 22%,
    rgba(0, 6, 17, 0.2) 50%,
    rgba(0, 6, 17, 1) 100%
  );
}

.stadion-hero__content {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stadion-hero__title {
  font-size: 64px;
}

.stadion-hero__lead {
  margin: 0;
  max-width: 330px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.stadion-facts {
  margin: 8px var(--m-gutter) 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.stadion-facts__item {
  padding: 14px;
  border: 1px solid var(--m-line);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stadion-facts__item:first-child:nth-last-child(odd) {
  grid-column: 1 / -1;
}

.stadion-facts__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.stadion-facts__value {
  font-weight: 600;
  font-size: 15px;
  line-height: 1.3;
}

.stadion-gallery,
.stadion-people,
.stadion-map {
  padding-top: 52px;
}

.stadion-gallery__count {
  padding-bottom: 6px;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 18px;
  color: var(--m-meta);
}

.stadion-gallery__rail {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 var(--m-gutter);
  scrollbar-width: none;
  padding: 0 var(--m-gutter) 4px;
}

.stadion-gallery__rail::-webkit-scrollbar {
  display: none;
}

.stadion-gallery__slide {
  flex: none;
  width: 86%;
  margin: 0;
  scroll-snap-align: start;
}

.stadion-gallery__slide img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 20px;
}

.stadion-gallery__slide figcaption {
  padding-top: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--m-text-2);
}

.stadion-people__list {
  padding: 0 var(--m-gutter);
}

.stadion-people__row {
  grid-template-columns: 72px minmax(0, 1fr);
}

.stadion-people__photo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  background: #0b1d45;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.stadion-people__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stadion-people__photo :deep(svg) {
  width: 80%;
  height: 80%;
}

.stadion-people__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stadion-people__role {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.stadion-people__name {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.05;
}

.stadion-map__body {
  padding: 0 var(--m-gutter);
}

.stadion-map__frame {
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  background: #071637;
}

.stadion-map__frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.stadion-map__placeholder {
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: var(--m-yellow);
}

.stadion-map__placeholder p {
  margin: 0;
  max-width: 260px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.stadion-map__consent {
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

.stadion-map__address {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}

.stadion-map__address svg {
  flex: none;
  color: var(--m-yellow);
}

.stadion-map__cta {
  width: 100%;
  box-sizing: border-box;
}
</style>
