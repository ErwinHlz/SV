<template>
  <main class="verein-page">
    <PageHero
      :image="vereinHero"
      title="Willkommen bei dem SV Ottweiler"
      :lead="hero.lead"
      kicker="Unser Verein" />

    <section class="verein-intro" aria-label="Einleitung zum Verein">
      <div class="verein-intro__shell">
        <p class="verein-intro__kicker">Verein</p>
        <h2 class="verein-intro__title"
          >Gemeinschaft, Ehrenamt und Fussball an einem Ort</h2
        >
        <p class="verein-intro__lead">
          Die Vereinsseite folgt jetzt demselben Zeitstrahl-Prinzip wie die
          Historie und fuehrt durch Selbstverstaendnis, Werte, Vereinsleben und
          die Menschen hinter der FSG.
        </p>
      </div>
    </section>

    <section
      ref="timelineRef"
      class="verein-timeline"
      aria-label="Zeitstrahl zum Verein">
      <div class="verein-timeline__line" aria-hidden="true">
        <div class="verein-timeline__line-base"></div>
        <div
          class="verein-timeline__line-progress"
          :style="{ transform: `scaleY(${timelineProgress})` }"></div>
      </div>

      <div class="verein-timeline__list">
        <article
          v-for="(entry, index) in timelineEntries"
          :key="entry.id"
          class="verein-timeline__item"
          :class="
            index % 2 === 0
              ? 'verein-timeline__item--left'
              : 'verein-timeline__item--right'
          ">
          <div class="verein-timeline__side verein-timeline__side--left">
            <div v-if="index % 2 === 0" class="verein-timeline__content">
              <p class="verein-timeline__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="verein-timeline__title">{{ entry.title }}</h3>
              <p v-if="entry.lead" class="verein-timeline__lead">{{
                entry.lead
              }}</p>
              <ul class="verein-timeline__points">
                <li v-for="point in entry.points" :key="point">{{ point }}</li>
              </ul>
            </div>
            <div v-else class="verein-timeline__counterpart">
              <img
                v-if="entry.imageSrc"
                class="verein-timeline__counterpart-image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.counterpart"
                loading="lazy" />
              <span v-else>{{ entry.counterpart }}</span>
            </div>
          </div>

          <div class="verein-timeline__center">
            <span class="verein-timeline__dot"></span>
          </div>

          <div class="verein-timeline__side verein-timeline__side--right">
            <div v-if="index % 2 === 1" class="verein-timeline__content">
              <p class="verein-timeline__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="verein-timeline__title">{{ entry.title }}</h3>
              <p v-if="entry.lead" class="verein-timeline__lead">{{
                entry.lead
              }}</p>
              <ul class="verein-timeline__points">
                <li v-for="point in entry.points" :key="point">{{ point }}</li>
              </ul>
            </div>
            <div v-else class="verein-timeline__counterpart">
              <img
                v-if="entry.imageSrc"
                class="verein-timeline__counterpart-image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.counterpart"
                loading="lazy" />
              <span v-else>{{ entry.counterpart }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="verein-people" aria-label="Vorstand und Ansprechpartner">
      <div class="verein-people__shell">
        <p class="verein-people__kicker">Ansprechpartner</p>
        <h2 class="verein-people__title">{{ people.title }}</h2>
        <p class="verein-people__lead">{{ people.lead }}</p>

        <div
          ref="peopleGridRef"
          class="verein-people__grid"
          @scroll.passive="handlePeopleGridScroll">
          <article
            v-for="(person, index) in visiblePeopleCards"
            :key="person.id"
            class="verein-people__card"
            :class="{
              'is-active': !isDesktopPeopleLayout && index === activePeoplePage,
            }">
            <div class="verein-people__photo">
              <img
                v-if="person.image"
                :src="person.image"
                :alt="person.imageAlt"
                loading="lazy" />
              <span v-else class="verein-people__photo-fallback">
                <DummySilhouette />
              </span>
            </div>
            <div class="verein-people__caption">
              <p class="verein-people__name">{{ person.name }}</p>
              <p class="verein-people__role">{{ person.role }}</p>
            </div>
          </article>
        </div>

        <div
          v-if="!isDesktopPeopleLayout && peopleMobilePageCount > 1"
          class="verein-people__indicator"
          aria-label="Ansprechpartnerseiten">
          <span
            v-for="page in peopleMobilePageCount"
            :key="page"
            class="verein-people__indicator-dot"
            :class="{ 'is-active': page - 1 === activePeoplePage }"></span>
        </div>

        <div
          v-if="isDesktopPeopleLayout && peopleDesktopPageCount > 1"
          class="verein-people__toolbar">
          <button
            type="button"
            class="verein-people__control"
            @click="goToPreviousPeoplePage"
            :disabled="activeDesktopPeoplePage === 0"
            aria-label="Vorherige Ansprechpartnerseite">
            <ChevronLeft :size="18" :stroke-width="2.4" />
          </button>

          <div
            class="verein-people__indicator"
            aria-label="Ansprechpartnerseiten">
            <span
              v-for="page in peopleDesktopPageCount"
              :key="`desktop-${page}`"
              class="verein-people__indicator-dot"
              :class="{
                'is-active': page - 1 === activeDesktopPeoplePage,
              }"></span>
          </div>

          <button
            type="button"
            class="verein-people__control"
            @click="goToNextPeoplePage"
            :disabled="activeDesktopPeoplePage >= peopleDesktopPageCount - 1"
            aria-label="Naechste Ansprechpartnerseite">
            <ChevronRight :size="18" :stroke-width="2.4" />
          </button>
        </div>
      </div>
    </section>

    <section class="verein-cta" aria-label="Mitglied werden">
      <div class="verein-cta__shell">
        <p class="verein-cta__kicker">Mitmachen</p>
        <h2 class="verein-cta__title">{{ cta.title }}</h2>
        <p class="verein-cta__text">{{ cta.text }}</p>
        <div class="verein-cta__actions">
          <RouterLink
            class="action-btn action-btn--primary"
            to="/mitglied-werden">
            {{ cta.primaryLabel }}
          </RouterLink>
          <RouterLink class="action-btn action-btn--secondary" to="/contact">
            {{ cta.secondaryLabel }}
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import DummySilhouette from "@/components/DummySilhouette.vue";
import PageHero from "@/components/PageHero.vue";
import vereinHero from "@/assets/header/background.png";
import rawAnsprechpartner from "@/content/ansprechpartner.json";
import rawTimelineEntries from "@/content/verein-timeline.json";
import rawVerein from "@/content/verein.json";
import { resolveTimelineImagePath } from "@/utils/timelineImages";

type VereinsPerson = {
  id: string;
  name: string;
  role: string;
  image?: string;
  imageAlt?: string;
};

type VereinValue = {
  id: string;
  title: string;
  text: string;
};

type VereinActivity = {
  id: string;
  title: string;
  text: string;
};

type VereinContent = {
  hero: {
    title: string;
    lead: string;
  };
  intro: {
    title: string;
    text: string;
  };
  values: {
    title: string;
    items: VereinValue[];
  };
  activities: {
    title: string;
    items: VereinActivity[];
  };
  history: {
    title: string;
    text: string;
  };
  people: {
    title: string;
    lead: string;
  };
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

type TimelineEntry = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  counterpart: string;
  imageSrc?: string;
  imageAlt?: string;
  points: string[];
};

const vereinContent = rawVerein as VereinContent;
const { hero, people, cta } = vereinContent;

const imageMap: Record<string, string> = {
  vereinHero,
};

const isPortraitImage = (image?: string) =>
  Boolean(image && image !== "vereinHero");

const personCards = (rawAnsprechpartner as VereinsPerson[]).map((person) => ({
  ...person,
  image:
    person.image && isPortraitImage(person.image)
      ? (imageMap[person.image] ?? person.image)
      : undefined,
  imageAlt: person.imageAlt ?? person.name,
}));

const peopleGridRef = ref<HTMLElement | null>(null);
const activePeoplePage = ref(0);
const activeDesktopPeoplePage = ref(0);
const isDesktopPeopleLayout = ref(false);
let desktopPeopleMediaQuery: MediaQueryList | null = null;

const peopleMobilePageCount = computed(() => personCards.length);
const peopleDesktopPageCount = computed(() =>
  Math.ceil(personCards.length / 5),
);

const visiblePeopleCards = computed(() => {
  if (!isDesktopPeopleLayout.value) {
    return personCards;
  }

  const startIndex = activeDesktopPeoplePage.value * 5;
  return personCards.slice(startIndex, startIndex + 5);
});

const timelineEntries = rawTimelineEntries as TimelineEntry[];

const timelineRef = ref<HTMLElement | null>(null);
const timelineProgress = ref(0);
let scrollContainer: Window | HTMLElement | null = null;

const getElementTopWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let current: HTMLElement | null = element;
  let offset = 0;

  while (current && current !== ancestor) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return offset;
};

const updateTimelineProgress = () => {
  const element = timelineRef.value;

  if (!element) {
    return;
  }

  if (!scrollContainer || scrollContainer instanceof Window) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const absoluteTop = window.scrollY + rect.top;
    const start = absoluteTop - viewportHeight * 0.72;
    const end = absoluteTop + element.offsetHeight - viewportHeight * 0.42;
    const range = Math.max(end - start, 1);
    const current = window.scrollY;

    timelineProgress.value = Math.min(1, Math.max(0, (current - start) / range));
    return;
  }

  const viewportHeight = scrollContainer.clientHeight;
  const absoluteTop = getElementTopWithin(element, scrollContainer);
  const start = absoluteTop - viewportHeight * 0.72;
  const end = absoluteTop + element.offsetHeight - viewportHeight * 0.42;
  const range = Math.max(end - start, 1);
  const current = scrollContainer.scrollTop;

  timelineProgress.value = Math.min(1, Math.max(0, (current - start) / range));
};

const syncDesktopPeopleLayout = () => {
  const matches = desktopPeopleMediaQuery?.matches ?? false;
  isDesktopPeopleLayout.value = matches;

  if (!matches) {
    activeDesktopPeoplePage.value = 0;
    nextTick(() => {
      centerActivePeopleCard();
      updateActivePeoplePage();
    });
    return;
  }

  activeDesktopPeoplePage.value = Math.min(
    activeDesktopPeoplePage.value,
    Math.max(peopleDesktopPageCount.value - 1, 0),
  );
};

const goToPreviousPeoplePage = () => {
  activeDesktopPeoplePage.value = Math.max(
    activeDesktopPeoplePage.value - 1,
    0,
  );
};

const goToNextPeoplePage = () => {
  activeDesktopPeoplePage.value = Math.min(
    activeDesktopPeoplePage.value + 1,
    Math.max(peopleDesktopPageCount.value - 1, 0),
  );
};

const centerActivePeopleCard = () => {
  const element = peopleGridRef.value;

  if (!element || isDesktopPeopleLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".verein-people__card"),
  );
  const activeCard = cards[activePeoplePage.value];

  if (!activeCard) {
    return;
  }

  const targetLeft =
    activeCard.offsetLeft - (element.clientWidth - activeCard.offsetWidth) / 2;

  element.scrollLeft = Math.max(0, targetLeft);
};

const updateActivePeoplePage = () => {
  const element = peopleGridRef.value;

  if (!element || isDesktopPeopleLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".verein-people__card"),
  );

  if (!cards.length) {
    activePeoplePage.value = 0;
    return;
  }

  const viewportCenter = element.scrollLeft + element.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  activePeoplePage.value = closestIndex;
};

const handlePeopleGridScroll = () => {
  updateActivePeoplePage();
};

onMounted(() => {
  const appContent = timelineRef.value?.closest(".app-content");
  scrollContainer =
    appContent instanceof HTMLElement ? appContent : window;

  updateTimelineProgress();
  scrollContainer.addEventListener("scroll", updateTimelineProgress, {
    passive: true,
  });
  window.addEventListener("resize", updateTimelineProgress);
  updateActivePeoplePage();

  if (typeof window !== "undefined") {
    desktopPeopleMediaQuery = window.matchMedia("(min-width: 981px)");
    syncDesktopPeopleLayout();
    desktopPeopleMediaQuery.addEventListener("change", syncDesktopPeopleLayout);
    window.addEventListener("resize", updateActivePeoplePage);
    window.addEventListener("resize", centerActivePeopleCard);
  }

  nextTick(() => {
    centerActivePeopleCard();
    updateActivePeoplePage();
  });
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener("scroll", updateTimelineProgress);
  window.removeEventListener("resize", updateTimelineProgress);
  desktopPeopleMediaQuery?.removeEventListener(
    "change",
    syncDesktopPeopleLayout,
  );
  window.removeEventListener("resize", updateActivePeoplePage);
  window.removeEventListener("resize", centerActivePeopleCard);
});
</script>

<style scoped>
.verein-page {
  padding-bottom: clamp(56px, 8vw, 96px);
  overflow-x: clip;
}

.verein-intro,
.verein-timeline,
.verein-people,
.verein-cta {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.verein-intro {
  margin-bottom: clamp(30px, 5vw, 60px);
}

.verein-intro__shell {
  text-align: center;
}

.verein-intro__kicker,
.verein-people__kicker,
.verein-cta__kicker,
.verein-timeline__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  color: rgba(242, 208, 82, 0.92);
}

.verein-intro__title,
.verein-people__title,
.verein-cta__title {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 4.2rem);
  line-height: 0.95;
}

.verein-intro__lead,
.verein-people__lead,
.verein-cta__text,
.verein-timeline__lead {
  width: min(760px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.88);
}

.verein-timeline {
  position: relative;
  padding-top: 8px;
}

.verein-timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
  z-index: 0;
}

.verein-timeline__line-base,
.verein-timeline__line-progress {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  transform-origin: top;
}

.verein-timeline__line-base {
  background: rgba(255, 255, 255, 0.12);
}

.verein-timeline__line-progress {
  background: linear-gradient(180deg, #f2d052 0%, #e3aa1d 42%, #2d7ff9 100%);
  box-shadow: 0 0 26px rgba(242, 208, 82, 0.28);
}

.verein-timeline__list {
  display: grid;
  gap: 28px;
}

.verein-timeline__item {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: start;
}

.verein-timeline__side {
  display: flex;
}

.verein-timeline__item--left .verein-timeline__side--left {
  justify-content: flex-end;
  /* border-left: 3px solid var(--sv-secondary-color); */
}

.verein-timeline__item--left .verein-timeline__side--right {
  justify-content: flex-start;
}

.verein-timeline__item--right .verein-timeline__side--left {
  justify-content: flex-end;
}

.verein-timeline__item--right .verein-timeline__side--right {
  justify-content: flex-start;
  /* border-right: 3px solid var(--sv-secondary-color); */
}

.verein-timeline__center {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.verein-timeline__dot {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #09162f;
  border: 4px solid rgba(242, 208, 82, 0.95);
  box-shadow: 0 0 0 10px rgba(242, 208, 82, 0.08);
}

.verein-timeline__content,
.verein-timeline__counterpart {
  width: min(100%, 500px);
}

.verein-timeline__content {
  padding: 12px 0;
}

.verein-timeline__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.verein-timeline__points {
  margin: 16px 0 0;
  padding-left: 18px;
  color: rgba(245, 247, 252, 0.92);
}

.verein-timeline__points li + li {
  margin-top: 10px;
}

.verein-timeline__item--left .verein-timeline__content {
  padding-right: clamp(18px, 3vw, 42px);
  text-align: right;
}

.verein-timeline__item--left .verein-timeline__points {
  padding-left: 0;
  padding-right: 18px;
}

.verein-timeline__item--left .verein-timeline__points li {
  direction: rtl;
}

.verein-timeline__item--right .verein-timeline__content {
  padding-left: clamp(18px, 3vw, 42px);
}

.verein-timeline__counterpart {
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 20px;
  border-radius: 26px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(2, 43, 121, 0.16)),
    rgba(8, 20, 45, 0.74);
  color: rgba(245, 247, 252, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
}

.verein-timeline__counterpart-image {
  width: 100%;
  min-height: 220px;
  display: block;
  object-fit: cover;
  border-radius: 26px;
}

.verein-timeline__item--left .verein-timeline__counterpart {
  margin-left: clamp(18px, 3vw, 42px);
}

.verein-timeline__item--right .verein-timeline__counterpart {
  margin-right: clamp(18px, 3vw, 42px);
}

.verein-people {
  margin-top: clamp(48px, 7vw, 84px);
}

.verein-people__shell {
  text-align: center;
}

.verein-people__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: 28px;
  align-items: start;
}

.verein-people__card {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 0.8rem 0.8rem 1.2rem;
  background: rgba(255, 253, 248, 0.94);
  color: #101828;
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

.verein-people__card:nth-child(even) {
  transform: rotate(1.2deg);
}

.verein-people__card:nth-child(3n) {
  transform: rotate(-0.4deg);
}

.verein-people__photo {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 0;
  background: #f0e9d9;
}

.verein-people__photo img,
.verein-people__photo-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.verein-people__photo img {
  object-fit: cover;
}

.verein-people__photo-fallback {
  color: #022b79;
  font-size: 3rem;
  font-weight: 900;
}

.verein-people__caption {
  display: grid;
  gap: 4px;
  padding-top: 0.9rem;
  text-align: center;
}

.verein-people__name,
.verein-people__role {
  margin: 0;
}

.verein-people__name {
  font-weight: 800;
}

.verein-people__role {
  color: rgba(17, 17, 17, 0.6);
  font-size: 0.92rem;
}

.verein-people__indicator {
  display: none;
}

.verein-people__toolbar {
  display: none;
}

.verein-cta {
  margin-top: clamp(52px, 8vw, 96px);
}

.verein-cta__shell {
  text-align: center;
}

.verein-cta__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.35rem;
  padding: 0.95rem 1.55rem;
  border-radius: 999px;
  font-weight: 850;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
}

.action-btn--primary {
  background: var(--sv-secondary-color);
  color: #171a1f;
}

.action-btn--secondary {
  border: 1.5px solid currentColor;
  color: currentColor;
}

@media (max-width: 900px) {
  .verein-timeline__line {
    left: 22px;
    transform: none;
  }

  .verein-timeline__item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 10px 12px;
  }

  .verein-timeline__center {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: stretch;
    padding-top: 28px;
  }

  .verein-timeline__side,
  .verein-timeline__item--left .verein-timeline__side--left,
  .verein-timeline__item--right .verein-timeline__side--right {
    grid-column: 2;
    justify-content: stretch;
  }

  .verein-timeline__item--left .verein-timeline__side--left,
  .verein-timeline__item--right .verein-timeline__side--right {
    grid-row: 1;
  }

  .verein-timeline__item--left .verein-timeline__side--right,
  .verein-timeline__item--right .verein-timeline__side--left {
    grid-column: 2;
    grid-row: 2;
    justify-content: stretch;
  }

  .verein-timeline__content,
  .verein-timeline__counterpart {
    width: 100%;
  }

  .verein-timeline__item--left .verein-timeline__content,
  .verein-timeline__item--right .verein-timeline__content {
    padding: 8px 0 8px 10px;
    text-align: left;
  }

  .verein-timeline__item--left .verein-timeline__points,
  .verein-timeline__item--right .verein-timeline__points {
    padding-left: 18px;
    padding-right: 0;
  }

  .verein-timeline__item--left .verein-timeline__points li {
    direction: ltr;
  }

  .verein-timeline__item--left .verein-timeline__counterpart,
  .verein-timeline__item--right .verein-timeline__counterpart {
    min-height: 200px;
    margin: 0;
    margin-left: 10px;
  }

  .verein-people__grid {
    display: grid;
    grid-auto-flow: column;
    --people-card-width: clamp(248px, 72vw, 292px);
    grid-auto-columns: var(--people-card-width);
    gap: 18px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: calc(50% - (var(--people-card-width) / 2));
    padding: 0 calc(50% - (var(--people-card-width) / 2)) 10px;
    justify-content: start;
    scrollbar-width: none;
  }

  .verein-people__grid::-webkit-scrollbar {
    display: none;
  }

  .verein-people__card {
    scroll-snap-align: center;
    min-height: 100%;
    opacity: 0.38;
    filter: grayscale(1);
    transform: scale(0.9);
    transition:
      opacity 0.24s ease,
      filter 0.24s ease,
      transform 0.24s ease;
  }

  .verein-people__card.is-active {
    opacity: 1;
    filter: grayscale(0);
    transform: scale(1);
  }

  .verein-people__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .verein-people__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .verein-people__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }
}

@media (max-width: 640px) {
  .verein-intro,
  .verein-timeline,
  .verein-people,
  .verein-cta {
    width: calc(100% - 24px);
  }

  .verein-timeline__list {
    gap: 20px;
  }

  .verein-timeline__counterpart {
    min-height: 180px;
    border-radius: 18px;
  }

  .verein-timeline__counterpart-image {
    min-height: 180px;
    border-radius: 18px;
  }

  .verein-people__grid {
    grid-template-columns: 1fr;
    --people-card-width: min(280px, 82vw);
    grid-auto-columns: var(--people-card-width);
  }

  .verein-people__card {
    padding: 0.7rem 0.7rem 1rem;
  }

  .verein-cta__actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

@media (min-width: 981px) {
  .verein-people__toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 22px;
  }

  .verein-people__control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.9rem;
    height: 2.9rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    cursor: pointer;
  }

  .verein-people__control:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .verein-people__control:hover:not(:disabled) {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.38);
  }

  .verein-people__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .verein-people__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .verein-people__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }
}
</style>
