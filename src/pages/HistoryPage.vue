<template>
  <main class="history-page">
    <PageHero
      class="history-hero"
      :image="historyHero"
      title="Historie"
      lead="Die Geschichte des SV Ottweiler 1919 als Zeitstrahl mit den wichtigsten Stationen des Vereins."
      kicker="SV Ottweiler 1919" />

    <section
      class="history-intro"
      aria-label="Einleitung zur Vereinsgeschichte">
      <div class="history-intro__shell">
        <p class="history-intro__kicker">Zeitstrahl</p>
        <h2 class="history-intro__title"
          >Meilensteine aus ueber 100 Jahren Vereinsgeschichte</h2
        >
        <p class="history-intro__lead">
          Die wichtigsten Kapitel des SV Ottweiler werden hier kompakt und klar
          entlang einer zentralen Timeline erzaehlt.
        </p>
      </div>
    </section>

    <section
      ref="timelineRef"
      class="timeline-section"
      aria-label="Zeitstrahl zur Vereinsgeschichte">
      <div class="timeline-center-line" aria-hidden="true">
        <div class="timeline-center-line__base"></div>
        <div
          class="timeline-center-line__progress"
          :style="{ transform: `scaleY(${timelineProgress})` }"></div>
      </div>

      <div class="timeline-list">
        <article
          v-for="(entry, index) in timelineEntries"
          :key="entry.year"
          class="timeline-item"
          :class="
            index % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'
          ">
          <div class="timeline-item__side timeline-item__side--left">
            <div v-if="index % 2 === 0" class="timeline-card">
              <p class="timeline-card__year">{{ entry.year }}</p>
              <p class="timeline-card__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="timeline-card__title">{{ entry.title }}</h3>
              <ul class="timeline-card__list">
                <li v-for="point in entry.points" :key="point">{{ point }}</li>
              </ul>
            </div>
            <figure v-else class="timeline-photo">
              <img
                v-if="entry.imageSrc"
                class="timeline-photo__image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.photoLabel"
                loading="lazy" />
              <div v-else class="timeline-photo__placeholder">
                <span>{{ entry.photoLabel }}</span>
              </div>
            </figure>
          </div>

          <div class="timeline-item__center">
            <span class="timeline-item__dot"></span>
          </div>

          <div class="timeline-item__side timeline-item__side--right">
            <div v-if="index % 2 === 1" class="timeline-card">
              <p class="timeline-card__year">{{ entry.year }}</p>
              <p class="timeline-card__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="timeline-card__title">{{ entry.title }}</h3>
              <ul class="timeline-card__list">
                <li v-for="point in entry.points" :key="point">{{ point }}</li>
              </ul>
            </div>
            <figure v-else class="timeline-photo">
              <img
                v-if="entry.imageSrc"
                class="timeline-photo__image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.photoLabel"
                loading="lazy" />
              <div v-else class="timeline-photo__placeholder">
                <span>{{ entry.photoLabel }}</span>
              </div>
            </figure>
          </div>
        </article>
      </div>
    </section>

    <section class="history-gallery" aria-label="Historische Bilder">
      <div class="history-gallery__shell">
        <p class="history-gallery__eyebrow">Erinnerungen</p>
        <h3 class="history-gallery__title">historische Bilder</h3>

        <div class="history-gallery__grid">
          <button
            v-for="item in galleryImages"
            :key="item.imageSrc"
            class="history-gallery__item"
            type="button"
            @click="selectedGalleryImage = item">
            <img
              class="history-gallery__image"
              :src="resolveTimelineImagePath(item.imageSrc)"
              :alt="item.imageAlt"
              loading="lazy" />
          </button>
        </div>
      </div>
    </section>

    <Transition name="history-lightbox">
      <div
        v-if="selectedGalleryImage"
        class="history-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="selectedGalleryImage.imageAlt"
        @click="selectedGalleryImage = null">
        <button
          type="button"
          class="history-lightbox__close"
          aria-label="Bild schliessen"
          @click.stop="selectedGalleryImage = null">
          ×
        </button>
        <figure class="history-lightbox__figure" @click.stop>
          <img
            :src="resolveTimelineImagePath(selectedGalleryImage.imageSrc)"
            :alt="selectedGalleryImage.imageAlt" />
        </figure>
      </div>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import PageHero from "@/components/PageHero.vue";
import historyHero from "@/assets/header/background.png";
import rawTimelineEntries from "@/content/history-timeline.json";
import { resolveTimelineImagePath } from "@/utils/timelineImages";

type TimelineEntry = {
  year: string;
  eyebrow: string;
  title: string;
  points: string[];
  photoLabel: string;
  imageSrc?: string;
  imageAlt?: string;
};

const timelineEntries = rawTimelineEntries as TimelineEntry[];

const galleryImages = [
  {
    imageSrc: "/historie/verbandsliga_1979.jpg",
    imageAlt: "Historisches Erinnerungsfoto Verbandsliga 1979",
  },
  {
    imageSrc: "/historie/djk_vs_sv.jpg",
    imageAlt: "Historisches Erinnerungsfoto DJK gegen SV",
  },
  {
    imageSrc: "/historie/historie_3.jpg",
    imageAlt: "Historisches Erinnerungsfoto 3",
  },
  {
    imageSrc: "/historie/historie_4.jpg",
    imageAlt: "Historisches Erinnerungsfoto 4",
  },
  {
    imageSrc: "/historie/historie_5.jpg",
    imageAlt: "Historisches Erinnerungsfoto 5",
  },
  {
    imageSrc: "/historie/historie_6.jpg",
    imageAlt: "Historisches Erinnerungsfoto 6",
  },
  {
    imageSrc: "/historie/historie_7.jpg",
    imageAlt: "Historisches Erinnerungsfoto 7",
  },
  {
    imageSrc: "/historie/historie_8.jpg",
    imageAlt: "Historisches Erinnerungsfoto 8",
  },
  {
    imageSrc: "/historie/historie_10.jpg",
    imageAlt: "Historisches Erinnerungsfoto 10",
  },
  {
    imageSrc: "/historie/historie_11.jpg",
    imageAlt: "Historisches Erinnerungsfoto 11",
  },
  {
    imageSrc: "/historie/historie_12.jpg",
    imageAlt: "Historisches Erinnerungsfoto 12",
  },
  {
    imageSrc: "/historie/historie_13.jpg",
    imageAlt: "Historisches Erinnerungsfoto 13",
  },
  {
    imageSrc: "/historie/historie_14.jpg",
    imageAlt: "Historisches Erinnerungsfoto 14",
  },
  {
    imageSrc: "/historie/historie_15.jpg",
    imageAlt: "Historisches Erinnerungsfoto 15",
  },
  {
    imageSrc: "/historie/historie_16.jpg",
    imageAlt: "Historisches Erinnerungsfoto 16",
  },
  {
    imageSrc: "/historie/historie_18.jpg",
    imageAlt: "Historisches Erinnerungsfoto 18",
  },
  {
    imageSrc: "/historie/historie_19.jpg",
    imageAlt: "Historisches Erinnerungsfoto 19",
  },
] as const;

const selectedGalleryImage = ref<(typeof galleryImages)[number] | null>(null);

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

onMounted(() => {
  const appContent = timelineRef.value?.closest(".app-content");
  scrollContainer =
    appContent instanceof HTMLElement ? appContent : window;

  updateTimelineProgress();
  scrollContainer.addEventListener("scroll", updateTimelineProgress, {
    passive: true,
  });
  window.addEventListener("resize", updateTimelineProgress);
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener("scroll", updateTimelineProgress);
  window.removeEventListener("resize", updateTimelineProgress);
});
</script>

<style scoped>
.history-page {
  padding-bottom: clamp(56px, 8vw, 96px);
}

.history-intro,
.timeline-section {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.history-intro {
  margin-bottom: clamp(30px, 5vw, 60px);
}

.history-intro__shell {
  text-align: center;
}

.history-intro__kicker {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  color: var(--sv-secondary-color);
}

.history-intro__title {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 4.2rem);
  line-height: 0.95;
}

.history-intro__lead {
  width: min(760px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.88);
}

.timeline-section {
  position: relative;
  padding: 8px 0 0;
}

.timeline-center-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
}

.timeline-center-line__base,
.timeline-center-line__progress {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  transform-origin: top;
}

.timeline-center-line__base {
  background: rgba(255, 255, 255, 0.12);
}

.timeline-center-line__progress {
  background: linear-gradient(180deg, #f2d052 0%, #e3aa1d 40%, #2d7ff9 100%);
  box-shadow: 0 0 26px rgba(242, 208, 82, 0.28);
}

.timeline-list {
  display: grid;
  gap: 28px;
  padding-bottom: 24px;
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: start;
}

.timeline-item__center {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 32px;
}

.timeline-item__dot {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #09162f;
  border: 4px solid rgba(242, 208, 82, 0.95);
  box-shadow: 0 0 0 10px rgba(242, 208, 82, 0.08);
}

.timeline-item__side {
  display: flex;
}

.timeline-item--left .timeline-item__side--left {
  justify-content: flex-end;
}

.timeline-item--right .timeline-item__side--right {
  justify-content: flex-start;
}

.timeline-item--left .timeline-item__side--right {
  justify-content: flex-start;
}

.timeline-item--right .timeline-item__side--left {
  justify-content: flex-end;
}

.timeline-card {
  width: min(100%, 500px);
  padding: 12px 0;
}

.timeline-photo {
  width: min(100%, 500px);
  margin: 0;
}

.timeline-photo__placeholder {
  display: grid;
  place-items: center;
  min-height: 260px;
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

.timeline-photo__image {
  width: 100%;
  min-height: 260px;
  display: block;
  object-fit: cover;
  border-radius: 26px;
}

.timeline-photo__image[src$=".svg"] {
  object-fit: contain;
  padding: 56px;
}

.timeline-card__year {
  margin: 0 0 10px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--sv-secondary-color);
}

.timeline-card__eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  color: rgba(242, 208, 82, 0.9);
}

.timeline-card__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.timeline-card__list {
  margin: 16px 0 0;
  padding-left: 18px;
  color: rgba(245, 247, 252, 0.92);
}

.timeline-card__list li + li {
  margin-top: 10px;
}

.timeline-item--left .timeline-card {
  padding-right: clamp(18px, 3vw, 42px);
  text-align: right;
}

.timeline-item--left .timeline-card__list {
  padding-left: 0;
  padding-right: 18px;
  list-style-position: outside;
}

.timeline-item--left .timeline-card__list li {
  direction: rtl;
}

.timeline-item--left .timeline-card__list li > * {
  direction: ltr;
}

.timeline-item--right .timeline-card {
  padding-left: clamp(18px, 3vw, 42px);
}

.timeline-item--left .timeline-photo {
  padding-left: clamp(18px, 3vw, 42px);
}

.timeline-item--right .timeline-photo {
  padding-right: clamp(18px, 3vw, 42px);
}

.history-gallery {
  width: min(1240px, calc(100% - 32px));
  margin: clamp(28px, 5vw, 56px) auto 0;
}

.history-gallery__shell {
  width: min(1040px, 100%);
  margin: 0 auto;
  text-align: center;
}

.history-gallery__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  color: rgba(242, 208, 82, 0.9);
}

.history-gallery__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  line-height: 1.04;
}

.history-gallery__lead {
  width: min(620px, 100%);
  margin: 14px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.84);
}

.history-gallery__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.history-gallery__item {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: zoom-in;
}

.history-gallery__image {
  width: 100%;
  min-height: 220px;
  display: block;
  border-radius: 24px;
  object-fit: cover;
}

.history-lightbox {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--sv-header-height) + 24px) 24px 24px;
  background: rgba(3, 10, 24, 0.24);
  backdrop-filter: blur(14px);
}

.history-lightbox__figure {
  margin: 0;
  width: min(920px, 100%);
  max-height: calc(100dvh - var(--sv-header-height) - 48px);
}

.history-lightbox__figure img {
  width: 100%;
  max-height: calc(100dvh - var(--sv-header-height) - 48px);
  display: block;
  object-fit: contain;
}

.history-lightbox__close {
  position: absolute;
  top: calc(var(--sv-header-height) + 8px);
  right: 18px;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.history-lightbox-enter-active,
.history-lightbox-leave-active {
  transition: opacity 0.22s ease;
}

.history-lightbox-enter-from,
.history-lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .timeline-center-line {
    left: 22px;
    transform: none;
  }

  .timeline-item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 10px 12px;
  }

  .timeline-item__center {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: stretch;
    padding-top: 28px;
  }

  .timeline-item__side,
  .timeline-item--left .timeline-item__side--left,
  .timeline-item--right .timeline-item__side--right {
    grid-column: 2;
    justify-content: stretch;
  }

  .timeline-item--left .timeline-item__side--left,
  .timeline-item--right .timeline-item__side--right {
    grid-row: 1;
  }

  .timeline-item--left .timeline-item__side--right,
  .timeline-item--right .timeline-item__side--left {
    grid-column: 2;
    grid-row: 2;
    justify-content: stretch;
  }

  .timeline-card {
    width: 100%;
  }

  .timeline-photo {
    width: 100%;
    padding: 0 0 0 10px;
  }

  .timeline-item--left .timeline-card,
  .timeline-item--right .timeline-card {
    padding: 8px 0 8px 10px;
    text-align: left;
  }

  .timeline-item--left .timeline-card__list,
  .timeline-item--right .timeline-card__list {
    padding-left: 18px;
    padding-right: 0;
  }

  .timeline-item--left .timeline-card__list li {
    direction: ltr;
  }

  .timeline-photo__placeholder,
  .timeline-photo__image {
    min-height: 220px;
  }

  .history-gallery {
    width: calc(100% - 32px);
  }

  .history-gallery__shell {
    text-align: left;
  }

  .history-gallery__lead {
    margin-left: 0;
  }

  .history-gallery__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .history-intro,
  .timeline-section {
    width: calc(100% - 24px);
  }

  .timeline-list {
    gap: 20px;
  }

  .timeline-card {
    padding: 6px 0 6px 8px;
  }

  .timeline-photo {
    padding-left: 8px;
  }

  .timeline-photo__placeholder {
    min-height: 180px;
    border-radius: 18px;
  }

  .timeline-photo__image {
    min-height: 180px;
    border-radius: 18px;
  }

  .timeline-photo__image[src$=".svg"] {
    padding: 32px;
  }

  .history-gallery {
    width: calc(100% - 24px);
  }

  .history-gallery__grid {
    grid-template-columns: 1fr;
  }

  .history-gallery__image {
    min-height: 180px;
    border-radius: 18px;
  }

  .history-lightbox {
    padding: calc(var(--sv-header-height) + 12px) 12px 12px;
  }

  .history-lightbox__figure {
    width: min(100%, 760px);
  }
}
</style>
