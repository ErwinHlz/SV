<template>
  <div class="fotocontest-page">
    <header class="fotocontest-header">
      <p class="fotocontest-eyebrow">SV Ottweiler · Oktoberfest</p>
      <h1 class="fotocontest-title">{{ activeTab === "contest" ? "Fotocontest" : "Spaßgalerie" }}</h1>
      <p v-if="activeTab === 'contest'" class="fotocontest-lead">
        Lade dein schönstes Oktoberfest-Foto hoch und stimme für deine
        Favoriten aus den Einsendungen anderer Besucher ab.
      </p>
      <p v-else class="fotocontest-lead">
        Lustige Schnappschüsse und schöne Momente – teile deine Fotos einfach
        zum Spaß. Hier kannst du mehrere Bilder nacheinander hochladen.
      </p>
    </header>

    <section v-if="activeTab === 'contest'" class="fotocontest-guide" aria-label="Anleitung Fotocontest">
      <ul class="fotocontest-facts">
        <li><Camera :size="16" aria-hidden="true" /> 1 Foto pro Handy</li>
        <li><Clock :size="16" aria-hidden="true" /> Voting 21–24 Uhr</li>
        <li><Heart :size="16" aria-hidden="true" /> 3 Stimmen pro Handy</li>
        <li><Trophy :size="16" aria-hidden="true" /> Gewinner: 1 Frau &amp; 1 Mann</li>
      </ul>

      <details class="fotocontest-howto">
        <summary>So funktioniert's</summary>
        <ol>
          <li>
            <strong>Foto machen.</strong> Dein schönster Moment vom Oktoberfest –
            mit Freunden, in Tracht, am Glücksrad, ganz egal.
          </li>
          <li>
            <strong>Name eingeben.</strong> Gib deinen richtigen Namen an, damit
            wir dich finden, falls du gewinnst.
          </li>
          <li>
            <strong>Foto hochladen.</strong> Wähle, ob du bei den Frauen oder
            Männern teilnimmst. Dann Foto auswählen, der Veröffentlichung
            zustimmen und auf „Foto einreichen“ tippen. Die Erlaubnis für
            Social Media ist freiwillig.
          </li>
          <li>
            <strong>Abstimmen ab 21 Uhr.</strong> Du hast 3 Stimmen und tippst
            dafür auf das Herz unter einem Foto. Für dein eigenes Foto kannst du
            nicht stimmen. Eine Stimme kannst du zurückziehen, indem du noch
            einmal auf das Herz tippst.
          </li>
          <li>
            <strong>Gewinner um 24 Uhr.</strong> Dann endet das Voting. Es gewinnen
            die Frau und der Mann, deren Fotos die meisten Stimmen haben. Die
            Gewinner geben wir vor Ort bekannt und zeigen sie hier auf der Seite.
          </li>
        </ol>
        <p class="fotocontest-howto-note">
          Gut zu wissen: Pro Handy kann nur ein Foto im Contest sein. Wenn du ein
          anderes nehmen willst, entfernst du dein Foto und reichst ein neues ein.
          Die Stimmen für das alte Foto gehen dabei verloren. Weitere Bilder
          kannst du jederzeit in der Spaßgalerie teilen.
        </p>
      </details>
    </section>

    <section class="fotocontest-section" :aria-label="activeTab === 'gallery' ? 'Spaßgalerie' : 'Fotocontest'">
      <PhotoContestSection :key="activeTab" :mode="activeTab" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { Camera, Clock, Heart, Trophy } from "@lucide/vue";

const route = useRoute();
const activeTab = computed(() => route.name === "spassgalerie" ? "gallery" : "contest");

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

.fotocontest-guide {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fotocontest-facts {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.fotocontest-facts li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  font-weight: 600;
}

.fotocontest-facts svg {
  color: var(--sv-secondary-color);
}

.fotocontest-howto {
  border: 1px solid var(--sv-card-border);
  border-radius: 16px;
  background: var(--sv-card-bg-soft);
  padding: 4px 20px;
}

.fotocontest-howto summary {
  cursor: pointer;
  padding: 12px 0;
  font-weight: 700;
  color: var(--sv-secondary-color);
}

.fotocontest-howto ol {
  margin: 0 0 12px;
  padding-left: 1.3em;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fotocontest-howto li {
  opacity: 0.9;
}

.fotocontest-howto-note {
  margin: 0 0 16px;
  font-size: 0.9rem;
  opacity: 0.75;
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
