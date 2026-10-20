<script setup lang="ts">
import DummySilhouette from "@/components/DummySilhouette.vue";
import MobileMemberBox from "@/components/mobile/MobileMemberBox.vue";
import MobileVereinTabs from "@/components/mobile/MobileVereinTabs.vue";
import { getGalleryPlaceholder } from "@/utils/galleryPlaceholders";
import { resolveTimelineImagePath } from "@/utils/timelineImages";

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  imageSrc?: string;
  imageAlt?: string;
  points: Array<{ label: string; detail: string }>;
};

type Person = { id: string; name: string; role: string; image?: string; imageAlt: string };

defineProps<{
  lead: string;
  chapters: Chapter[];
  people: Person[];
  peopleTitle: string;
  peopleLead: string;
  cta: { title: string; text: string; primaryLabel: string; secondaryLabel: string };
}>();

// Bei jedem Seitenaufruf ein anderes Bild aus der Galerie.
const heroImage = getGalleryPlaceholder("hero:verein");
</script>

<template>
  <div class="m-page verein">
    <section class="verein-hero">
      <div class="verein-hero__word m-hero-word" aria-hidden="true">SVO</div>
      <figure class="verein-hero__photo m-hero-photo">
        <img :src="heroImage" alt="Szene aus dem Vereinsleben des SV Ottweiler" />
        <figcaption>Vereinsleben</figcaption>
      </figure>
      <div class="verein-hero__text m-fadeout">
        <p class="m-kicker">Verein · Über uns</p>
        <h1 class="m-display verein-hero__title">Mehr als<br />Fußball.</h1>
        <p class="verein-hero__lead">{{ lead }}</p>
      </div>
    </section>

    <MobileVereinTabs />

    <section class="verein-line" aria-label="Über den Verein">
      <div class="verein-line__track" aria-hidden="true">
        <div class="verein-line__fill"></div>
      </div>

      <article v-for="(chapter, index) in chapters" :key="chapter.id" class="verein-entry">
        <span class="verein-entry__dot" aria-hidden="true"></span>
        <div class="verein-entry__body m-rvx">
          <span class="verein-entry__num">{{ String(index + 1).padStart(2, "0") }}</span>
          <span class="verein-entry__eyebrow">{{ chapter.eyebrow }}</span>
          <h2 class="verein-entry__title">{{ chapter.title }}</h2>
          <p v-if="chapter.lead" class="verein-entry__lead">{{ chapter.lead }}</p>
          <ul class="verein-entry__points">
            <li v-for="point in chapter.points" :key="point.label">
              <strong>{{ point.label }}</strong>
              <span>{{ point.detail }}</span>
            </li>
          </ul>
          <div v-if="chapter.imageSrc" class="verein-entry__photo">
            <img
              class="m-zoom"
              :src="resolveTimelineImagePath(chapter.imageSrc)"
              :alt="chapter.imageAlt ?? chapter.title"
              loading="lazy" />
          </div>
        </div>
      </article>
    </section>

    <section v-if="people.length" class="verein-people" aria-label="Vorstand und Ansprechpartner">
      <div class="m-section-head verein-people__head m-rv">
        <div>
          <p class="m-kicker">Ansprechpartner</p>
          <h2 class="m-section-title">{{ peopleTitle }}</h2>
        </div>
      </div>
      <p class="verein-people__lead">{{ peopleLead }}</p>
      <div class="m-rail">
        <article v-for="person in people" :key="person.id" class="verein-person m-ri">
          <span class="verein-person__photo">
            <img v-if="person.image" :src="person.image" :alt="person.imageAlt" loading="lazy" />
            <DummySilhouette v-else />
          </span>
          <span class="verein-person__role">{{ person.role }}</span>
          <span class="verein-person__name">{{ person.name }}</span>
        </article>
      </div>
    </section>

    <MobileMemberBox kicker="Mitmachen" :text="cta.text" :cta="cta.primaryLabel">
      Werde Teil<br />von Blau-Gelb.
    </MobileMemberBox>
  </div>
</template>

<style scoped>
.verein {
  padding-bottom: 56px;
}

.verein-hero {
  position: relative;
  height: 600px;
  overflow: hidden;
  background: #011338;
}

.verein-hero__word {
  position: absolute;
  left: -8px;
  top: 64px;
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 214px;
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 2px rgba(244, 208, 71, 0.6);
  transform-origin: 20% 50%;
}

.verein-hero__photo {
  position: absolute;
  right: 18px;
  top: 206px;
  width: 214px;
  margin: 0;
  padding: 6px 6px 8px;
  border-radius: 6px;
  background: #f3f1ea;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  transform: rotate(-4deg);
}

.verein-hero__photo img {
  display: block;
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 2px;
}

.verein-hero__photo figcaption {
  padding-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1a2338;
  text-align: center;
}

.verein-hero__text {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.verein-hero__title {
  font-size: 54px;
}

.verein-hero__lead {
  margin: 0;
  max-width: 320px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.verein-line {
  position: relative;
  padding: 40px var(--m-gutter) 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  view-timeline-name: --verein-line;
}

.verein-line__track {
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 40px;
  width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
}

.verein-line__fill {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--m-yellow);
  transform-origin: 50% 0;
}

.verein-entry {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
}

.verein-entry__dot {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  margin: 14px 0 0 9px;
  box-sizing: border-box;
  border: 2px solid var(--m-yellow);
  border-radius: 50%;
  background: var(--m-yellow);
}

.verein-entry__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.verein-entry__num {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 44px;
  line-height: 1;
  color: var(--m-yellow);
}

.verein-entry__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.verein-entry__title {
  margin: 0;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.05;
}

.verein-entry__lead {
  margin: 4px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.verein-entry__points {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.verein-entry__points li {
  padding-left: 12px;
  border-left: 2px solid rgba(244, 208, 71, 0.6);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.verein-entry__points strong {
  color: var(--m-text);
  font-weight: 600;
}

.verein-entry__photo {
  margin-top: 10px;
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
}

.verein-entry__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verein-people {
  padding-top: 40px;
}

.verein-people__head {
  margin-bottom: 8px;
}

.verein-people__lead {
  margin: 0 0 16px;
  padding: 0 var(--m-gutter);
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.verein-person {
  flex: none;
  width: 168px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.verein-person__photo {
  height: 210px;
  margin-bottom: 8px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #0b1d45, #071637);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.verein-person__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verein-person__photo :deep(svg) {
  width: 78%;
  height: 78%;
}

.verein-person__role {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.verein-person__name {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.25;
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .m-hero-word {
      animation: verein-word linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .m-hero-photo {
      animation: verein-photo linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .verein-line__fill {
      animation: verein-grow linear both;
      animation-timeline: --verein-line;
      animation-range: cover 50vh cover calc(100% - 50vh);
    }

    .verein-entry__dot {
      animation: verein-dot linear both;
      animation-timeline: view();
      animation-range: cover 0% cover 50%;
    }
  }
}

@keyframes verein-word {
  to {
    transform: translateY(-90px) scale(1.3);
    opacity: 0.12;
  }
}

@keyframes verein-photo {
  from {
    transform: rotate(-4deg);
  }
  to {
    transform: translateY(110px) rotate(4deg);
  }
}

@keyframes verein-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes verein-dot {
  0%,
  88% {
    background: #16233f;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0 rgba(244, 208, 71, 0);
  }
  100% {
    background: var(--m-yellow);
    border-color: var(--m-yellow);
    box-shadow: 0 0 0 7px rgba(244, 208, 71, 0.22);
  }
}
</style>
