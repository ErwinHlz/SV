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
const items = [
  {
    id: 1,
    to: "/fakten",
    img: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1600",
    kicker: "SPANNENDE FAKTEN",
    title: "25 beeindruckende Statistiken\nrund um den FC Bayern 2025",
  },
  {
    id: 2,
    to: "/campus-story",
    img: "https://images.unsplash.com/photo-1520975682031-ae2db8a9d4d1?w=1600",
    kicker: "FC BAYERN TV PLUS",
    title: "Campus Story",
  },
  {
    id: 3,
    to: "/store",
    img: "https://images.unsplash.com/photo-1520975958225-00a1f6a8b3ea?w=1600",
    kicker: "ONLINE STORE",
    title: "SALE",
  },
  {
    id: 4,
    to: "/weihnachtsgruss",
    img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1600",
    kicker: "WEIHNACHTSGRUSS",
    title: "Frohe Weihnacht",
  },
];
</script>

<style scoped>
.heroRow {
  display: flex;
  padding: 1rem;
  height: clamp(320px, 52vh, 560px);
  width: 80%;
  justify-self: center;
  transform: translateY(5dvh);
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
  margin: -60px;

  /* “smooth” hover */
  transition: flex 300ms ease, transform 300ms ease, filter 300ms ease;
  filter: saturate(1) brightness(0.95);
}

.panel:first-child {
  clip-path: none;
  margin-left: 0;
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
  background: linear-gradient(
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
  bottom: 18px;
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
    overflow-x: auto;
    height: 360px;
  }
  .panel {
    flex: 0 0 80%;
  }
  .panel:hover {
    flex: 0 0 88%;
  }
}
</style>
