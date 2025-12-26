<template>
  <main class="home">
    <section class="hero">
      <div class="image-wrapper" aria-label="Hauptthemen">
        <figure
          v-for="tile in tiles"
          :key="tile.title"
          class="tile"
          :style="{ '--accent': tile.accent }"
        >
          <img :src="tile.image" :alt="tile.title" loading="lazy" />
          <figcaption class="tile-caption">
            <span class="tile-title">{{ tile.title }}</span>
            <span class="tile-subtitle">{{ tile.subtitle }}</span>
          </figcaption>
        </figure>
      </div>
      <div class="hero-copy">
        <p class="eyebrow">SV Ottweiler 1919</p>
        <h1>Vereinsspielseite</h1>
        <p>
          News, Termine, Ergebnisse und Mitglied werden - alles direkt auf einen
          Blick.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import mitgliedImage from "@/assets/home/mitglied-werden.svg";

const tiles = [
  {
    title: "News",
    subtitle: "Aktuelles aus dem Verein",
    image: newsImage,
    accent: "#f4d047",
  },
  {
    title: "Termine",
    subtitle: "Spiele und Events",
    image: termineImage,
    accent: "#5eead4",
  },
  {
    title: "Ergebnisse",
    subtitle: "Letzte Resultate",
    image: ergebnisseImage,
    accent: "#34d399",
  },
  {
    title: "Mitglied werden",
    subtitle: "Teil der Familie werden",
    image: mitgliedImage,
    accent: "#fb923c",
  },
];
</script>

<style scoped>
.home {
  min-height: 100vh;
  color: var(--sv-text-color);
  background: radial-gradient(
      1200px 700px at 20% -10%,
      rgba(244, 208, 71, 0.18),
      transparent 60%
    ),
    radial-gradient(
      900px 500px at 90% 10%,
      rgba(255, 236, 194, 0.12),
      transparent 60%
    ),
    linear-gradient(180deg, #021b46 0%, #022b79 45%, #021a3f 100%);
  font-family: "Trebuchet MS", "Verdana", sans-serif;
}

.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 4vw, 3rem) 4rem;
  display: grid;
  gap: clamp(1.5rem, 3vw, 3rem);
}

.image-wrapper {
  position: relative;
  display: grid;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  grid-template-columns: 1fr;
}

.image-wrapper::before {
  content: "";
  position: absolute;
  inset: -12px;
  border-radius: 26px;
  border: 1px dashed rgba(255, 236, 194, 0.2);
  pointer-events: none;
}

.tile {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  aspect-ratio: 4 / 3;
  border: 1px solid rgba(255, 236, 194, 0.12);
  box-shadow: 0 18px 40px rgba(2, 43, 121, 0.45);
  background: #022b79;
  z-index: 1;
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
  transition: transform 0.5s ease;
}

.tile::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 43, 121, 0) 45%,
    rgba(2, 43, 121, 0.85) 100%
  );
}

.tile:hover img {
  transform: scale(1.08);
}

.tile-caption {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  padding: 0.75rem 0.9rem;
  background: rgba(2, 43, 121, 0.78);
  border-radius: 12px;
  border-left: 4px solid var(--accent);
  display: grid;
  gap: 0.2rem;
  z-index: 2;
}

.tile-title {
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.tile-subtitle {
  font-size: 0.85rem;
  opacity: 0.85;
}

.hero-copy {
  max-width: 60ch;
}

.hero-copy h1 {
  margin: 0.4rem 0 0.6rem;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  letter-spacing: 0.02em;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.28em;
  font-size: 0.75rem;
  color: rgba(255, 236, 194, 0.7);
}

@media (min-width: 640px) {
  .image-wrapper {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .image-wrapper {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
