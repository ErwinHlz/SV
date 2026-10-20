<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import heroImage from "@/assets/header/background.png";
import DummySilhouette from "@/components/DummySilhouette.vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import MobileVereinTabs from "@/components/mobile/MobileVereinTabs.vue";
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
</script>

<template>
  <div class="m-page verein">
    <section class="verein-hero">
      <img class="verein-hero__image m-par" :src="heroImage" alt="" />
      <div class="verein-hero__shade" aria-hidden="true"></div>
      <div class="verein-hero__content m-fadeout">
        <p class="m-kicker">Unser Verein</p>
        <h1 class="m-display verein-hero__title">Mehr als<br />Fußball.</h1>
        <p class="verein-hero__lead">{{ lead }}</p>
      </div>
    </section>

    <MobileVereinTabs />

    <section class="verein-chapters" aria-label="Über den Verein">
      <article v-for="(chapter, index) in chapters" :key="chapter.id" class="verein-chapter">
        <div class="verein-chapter__head m-rv">
          <span class="verein-chapter__num" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
          <div>
            <p class="m-kicker">{{ chapter.eyebrow }}</p>
            <h2 class="m-section-title verein-chapter__title">{{ chapter.title }}</h2>
          </div>
        </div>
        <p v-if="chapter.lead" class="verein-chapter__lead">{{ chapter.lead }}</p>
        <div v-if="chapter.imageSrc" class="verein-chapter__photo">
          <img
            class="m-wipe"
            :src="resolveTimelineImagePath(chapter.imageSrc)"
            :alt="chapter.imageAlt ?? chapter.title"
            loading="lazy" />
        </div>
        <ul class="verein-chapter__points">
          <li v-for="point in chapter.points" :key="point.label" class="m-rv">
            <strong>{{ point.label }}</strong>
            <span>{{ point.detail }}</span>
          </li>
        </ul>
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
      <div class="m-rail verein-people__rail">
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

    <section class="verein-cta" aria-label="Mitmachen">
      <div class="m-box verein-cta__box m-rv">
        <CrestMark class="m-box__crest verein-cta__crest" />
        <p class="m-kicker">Mitmachen</p>
        <h2 class="m-display verein-cta__title">Werde Teil<br />von Blau-Gelb.</h2>
        <p class="verein-cta__text">{{ cta.text }}</p>
        <div class="verein-cta__actions">
          <RouterLink to="/mitglied-werden" class="m-btn">
            {{ cta.primaryLabel }} <ArrowRight :size="18" :stroke-width="2" />
          </RouterLink>
          <RouterLink to="/contact" class="m-text-link">{{ cta.secondaryLabel }}</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.verein {
  padding-bottom: 56px;
}

.verein-hero {
  position: relative;
  height: 560px;
  overflow: hidden;
}

.verein-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verein-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.6) 0%,
    rgba(0, 6, 17, 0.1) 25%,
    rgba(0, 6, 17, 0.3) 50%,
    rgba(0, 6, 17, 1) 100%
  );
}

.verein-hero__content {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.verein-hero__title {
  font-size: 64px;
}

.verein-hero__lead {
  margin: 0;
  max-width: 340px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.verein-chapters {
  padding: 40px var(--m-gutter) 0;
  display: flex;
  flex-direction: column;
  gap: 52px;
}

.verein-chapter__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: end;
  gap: 14px;
}

.verein-chapter__num {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 72px;
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(244, 208, 71, 0.7);
}

.verein-chapter__title {
  font-size: 32px;
}

.verein-chapter__lead {
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--m-text-2);
}

.verein-chapter__photo {
  margin-top: 18px;
  height: 210px;
  border-radius: 20px;
  overflow: hidden;
  background: #071637;
}

.verein-chapter__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verein-chapter__points {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.verein-chapter__points li {
  padding: 12px 0;
  border-top: 1px solid var(--m-line);
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.verein-chapter__points strong {
  color: var(--m-text);
  font-weight: 700;
  font-size: 15px;
}

.verein-people {
  padding-top: 64px;
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

.verein-cta {
  padding: 64px var(--m-gutter) 0;
}

.verein-cta__box {
  border-radius: 28px;
  padding: 30px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.verein-cta__crest {
  right: -70px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  opacity: 0.14;
}

.verein-cta__title {
  position: relative;
  font-size: 48px;
  line-height: 0.92;
}

.verein-cta__text {
  position: relative;
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.verein-cta__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
}
</style>
