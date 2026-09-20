<template>
  <div class="fotocontest-page">
    <header class="fotocontest-header">
      <p class="fotocontest-eyebrow">SV Ottweiler · Oktoberfest</p>
      <h1 class="fotocontest-title">Fotocontest</h1>
      <p class="fotocontest-lead">
        Lade dein schönstes Oktoberfest-Foto hoch und stimme für deine
        Favoriten aus den Einsendungen anderer Besucher ab.
      </p>
    </header>

    <section class="fotocontest-section" aria-label="Fotocontest">
      <PhotoContestSection />
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Lazy-loaded: pulls in the Firebase SDK, which only visitors of this page
// should have to download.
const PhotoContestSection = defineAsyncComponent(
  () => import("@/components/PhotoContestSection.vue"),
);
</script>

<style scoped>
.fotocontest-page {
  min-height: calc(100dvh - var(--sv-header-height));
  padding: clamp(28px, 6vw, 72px) clamp(18px, 8vw, 80px) clamp(48px, 8vw, 88px);
  color: var(--sv-text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(28px, 5vw, 48px);
}

.fotocontest-header {
  max-width: 640px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fotocontest-eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  color: var(--sv-secondary-color);
}

.fotocontest-title {
  margin: 0;
  font-size: clamp(28px, 4.2vw, 48px);
  font-weight: 800;
}

.fotocontest-lead {
  margin: 0;
  max-width: 56ch;
  margin-inline: auto;
  opacity: 0.85;
}

.fotocontest-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .fotocontest-page {
    min-height: auto;
    padding: calc(var(--sv-header-height) + 28px) 16px 40px;
  }
}
</style>
