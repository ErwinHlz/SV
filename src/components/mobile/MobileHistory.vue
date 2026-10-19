<script setup lang="ts">
import rawTimelineEntries from "@/content/history-timeline.json";
import verbandsliga1979 from "@/assets/historie/verbandsliga_1979.jpg";
import { resolveTimelineImagePath } from "@/utils/timelineImages";

type TimelineEntry = {
  year: string;
  eyebrow: string;
  title: string;
  points: Array<{ label: string; detail: string }>;
  photoLabel: string;
  imageSrc?: string;
  imageAlt?: string;
};

const entries = rawTimelineEntries as TimelineEntry[];

// Das Vereinswappen ist kein Foto - dort zeigen wir kein Bild.
const photoOf = (entry: TimelineEntry) =>
  entry.imageSrc && !entry.imageSrc.endsWith(".svg")
    ? resolveTimelineImagePath(entry.imageSrc)
    : undefined;

const subNav = [
  { label: "Verein", to: "/verein" },
  { label: "Historie", to: "/historie" },
  { label: "Mitgliedsantrag", to: "/mitglied-werden" },
];
</script>

<template>
  <div class="m-page history">
    <section class="history-hero">
      <div class="history-hero__year m-hero-year" aria-hidden="true">1919</div>
      <figure class="history-hero__photo m-hero-photo">
        <img :src="verbandsliga1979" alt="Mannschaft des SV Ottweiler in der Verbandsliga 1979" />
        <figcaption>Verbandsliga 1979</figcaption>
      </figure>
      <div class="history-hero__text m-fadeout">
        <p class="m-kicker">Verein · Historie</p>
        <h1 class="m-display history-hero__title">Über 100 Jahre<br />Blau-Gelb.</h1>
        <p class="history-hero__lead">
          Von der Gründung 1919 über die Saarlandliga bis zur FSG Ottweiler/Steinbach.
        </p>
      </div>
    </section>

    <nav class="m-tabs history__subnav" aria-label="Verein">
      <RouterLink
        v-for="item in subNav"
        :key="item.to"
        :to="item.to"
        class="m-tab"
        exact-active-class="is-active">
        {{ item.label }}
      </RouterLink>
    </nav>

    <section class="history-line" aria-label="Zeitstrahl zur Vereinsgeschichte">
      <div class="history-line__track" aria-hidden="true">
        <div class="history-line__fill"></div>
      </div>

      <article v-for="entry in entries" :key="entry.year" class="history-entry">
        <span class="history-entry__dot" aria-hidden="true"></span>
        <div class="history-entry__body m-rvx">
          <span class="history-entry__year">{{ entry.year }}</span>
          <span class="history-entry__eyebrow">{{ entry.eyebrow }}</span>
          <h2 class="history-entry__title">{{ entry.title }}</h2>
          <ul class="history-entry__points">
            <li v-for="point in entry.points" :key="point.label">
              <strong>{{ point.label }}</strong>
              <span>{{ point.detail }}</span>
            </li>
          </ul>
          <div v-if="photoOf(entry)" class="history-entry__photo">
            <img
              class="m-zoom"
              :src="photoOf(entry)"
              :alt="entry.imageAlt ?? entry.photoLabel"
              loading="lazy" />
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.history-hero {
  position: relative;
  height: 600px;
  overflow: hidden;
  background: #011338;
}

.history-hero__year {
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

.history-hero__photo {
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

.history-hero__photo img {
  display: block;
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 2px;
  filter: grayscale(0.2);
}

.history-hero__photo figcaption {
  padding-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1a2338;
  text-align: center;
}

.history-hero__text {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-hero__title {
  font-size: 54px;
}

.history-hero__lead {
  margin: 0;
  max-width: 320px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.history__subnav {
  margin: 14px var(--m-gutter) 0;
  padding: 0;
}

.history-line {
  position: relative;
  padding: 40px var(--m-gutter) 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  view-timeline-name: --history-line;
}

.history-line__track {
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 40px;
  width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
}

.history-line__fill {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--m-yellow);
  transform-origin: 50% 0;
}

.history-entry {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
}

.history-entry__dot {
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

.history-entry__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-entry__year {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 44px;
  line-height: 1;
  color: var(--m-yellow);
}

.history-entry__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.history-entry__title {
  margin: 0;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.05;
}

.history-entry__points {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-entry__points li {
  padding-left: 12px;
  border-left: 2px solid rgba(244, 208, 71, 0.6);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.history-entry__points strong {
  color: var(--m-text);
  font-weight: 600;
}

.history-entry__photo {
  margin-top: 10px;
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
}

.history-entry__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .m-hero-year {
      animation: history-year linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .m-hero-photo {
      animation: history-photo linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .history-line__fill {
      animation: history-grow linear both;
      animation-timeline: --history-line;
      animation-range: cover 50vh cover calc(100% - 50vh);
    }

    .history-entry__dot {
      animation: history-dot linear both;
      animation-timeline: view();
      animation-range: cover 0% cover 50%;
    }
  }
}

@keyframes history-year {
  to {
    transform: translateY(-90px) scale(1.3);
    opacity: 0.12;
  }
}

@keyframes history-photo {
  from {
    transform: rotate(-4deg);
  }
  to {
    transform: translateY(110px) rotate(4deg);
  }
}

@keyframes history-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes history-dot {
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
