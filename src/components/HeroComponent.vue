<template>
  <section class="heroRow" aria-label="Hero Links">
    <RouterLink
      v-for="item in items"
      :key="item.id"
      class="panel"
      :to="item.to"
      :style="{ '--bg': `url(${item.img})` }">
      <div class="shade"></div>
      <div class="content">
        <div class="kicker">{{ item.kicker }}</div>
        <h2 class="title">{{ item.title }}</h2>
      </div>
    </RouterLink>
  </section>
</template>

<script setup>
import newsImage from "@/assets/news/stock_news_1.png";
import spielberichteImage from "@/assets/spielberichte/stock_spielberichte_2.jpg";
import kaderImage from "@/assets/Kader/1440x810.webp";
import sponsorImage from "@/assets/home/mitglied-werden.svg";

const items = [
  {
    id: 1,
    to: "/news",
    img: newsImage,
    kicker: "AKTUELLES",
    title: "News aus dem Verein\nund rund um die Teams",
  },
  {
    id: 2,
    to: "/spielberichte",
    img: spielberichteImage,
    kicker: "SPIELTAG",
    title: "Aktuelle Spielberichte\nauf einen Blick",
  },
  {
    id: 3,
    to: "/teams/one/kader",
    img: kaderImage,
    kicker: "MANNSCHAFT",
    title: "Zum Kader\nder 1. Mannschaft",
  },
  {
    id: 4,
    to: "/sponsor/werden",
    img: sponsorImage,
    kicker: "PARTNERSCHAFT",
    title: "Sponsor werden\nund den Verein staerken",
  },
];
</script>

<style scoped>
.heroRow {
  display: flex;
  height: 50dvh;
}

/* jedes Tile ist ein Link */
.panel {
  position: relative;
  flex: 1 1 0;
  min-width: 160px;
  overflow: hidden;
  text-decoration: none;
  color: white;

  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  clip-path: polygon(60px 0, 100% 0, 100% 100%, 0 100%);
  margin-left: -60px;
  margin-right: -60px;

  /* “smooth” hover */
  transition:
    flex 300ms ease,
    transform 300ms ease,
    filter 300ms ease;
  filter: saturate(1) brightness(0.95);
}

.panel:first-child {
  clip-path: none;
  margin-left: 0;
}

.panel:last-child {
  margin-right: 0;
}

/* wenn man über die ganze Reihe hovert, dimme leicht alle Panels */
.heroRow:hover .panel {
  filter: saturate(0.95) brightness(0.85);
}

/* das aktuell gehoverte Panel wächst */
.panel:hover {
  flex: 2.3 1 0; /* macht’s breiter */
  filter: saturate(1.05) brightness(1);
}

/* Lesbarkeits-Overlay */
.shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.05) 55%,
      rgba(0, 0, 0, 0) 100%
    );
}

/* Text unten links */
.content {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 20px;
  z-index: 1;
}

.kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  opacity: 0.95;
  text-transform: uppercase;
}

.title {
  margin: 10px 0 0;
  font-size: clamp(18px, 1.9vw, 40px);
  line-height: 1.05;
  font-weight: 800;
  white-space: pre-line;
}

/* Tastatur-Fokus */
.panel:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.9);
  outline-offset: 4px;
}

/* Responsive: auf kleineren Screens lieber untereinander/scrollbar */
@media (max-width: 900px) {
  .heroRow {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    height: auto;
    overflow: visible;
  }
  .panel {
    flex: none;
    min-width: 0;
    min-height: 180px;
    clip-path: none;
    margin: 0;
  }
  .panel:hover {
    flex: none;
  }

  .content {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
</style>
