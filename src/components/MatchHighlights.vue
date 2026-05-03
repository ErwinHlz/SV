<template>
  <section class="match-strip" aria-label="Spiel-Highlights">
    <article
      v-for="match in cards"
      :key="match.key"
      class="match-card"
      :class="`match-card--${match.key}`">
      <p class="match-label">{{ match.label }}</p>

      <div class="match-main">
        <div class="team team--home">
          <img
            class="team-logo"
            :src="match.bild_heim"
            :alt="`${match.heimmannschaft} Logo`"
            loading="lazy" />
          <p class="team-name">{{ match.heimmannschaft }}</p>
        </div>

        <div class="match-center">
          <p class="match-score">{{ match.ergebnis }}</p>
        </div>

        <div class="team team--away">
          <img
            class="team-logo"
            :src="match.bild_gast"
            :alt="`${match.gastmannschaft} Logo`"
            loading="lazy" />
          <p class="team-name">{{ match.gastmannschaft }}</p>
        </div>
      </div>

      <div class="match-footer">
        <p class="match-meta">
          {{ formatDate(match.datum) }} | {{ match.uhrzeit }} | {{ match.ort }}
        </p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import rawMatchHighlights from "@/content/match-highlights.json";
import { formatDate } from "@/utils/date";

type MatchEntry = {
  heimmannschaft: string;
  gastmannschaft: string;
  ergebnis: string;
  bild_heim: string;
  bild_gast: string;
  ort: string;
  datum: string;
  uhrzeit: string;
};

type MatchHighlightsContent = {
  last: MatchEntry;
  live: MatchEntry;
  next: MatchEntry;
};

const matchHighlights = rawMatchHighlights as MatchHighlightsContent;

const cards = [
  { key: "last", label: "Letztes", ...matchHighlights.last },
  { key: "live", label: "Aktuell", ...matchHighlights.live },
  { key: "next", label: "Naechstes", ...matchHighlights.next },
];
</script>

<style scoped>
.match-strip {
  width: 80dvw;
  height: clamp(72px, 8dvh, 96px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  flex: 0 0 auto;
}

.match-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
  padding: 8px 12px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 16, 46, 0.72);
  overflow: hidden;
  height: 15dvh;
}

.match-card--live {
  border-color: rgba(244, 208, 71, 0.45);
  background:
    radial-gradient(
      circle at top right,
      rgba(244, 208, 71, 0.18),
      transparent 35%
    ),
    rgba(2, 16, 46, 0.84);
}

.match-label {
  margin: 0;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
}

.match-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}

.team {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.team--away {
  justify-content: flex-end;
}

.team-logo {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  object-fit: contain;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.team-name {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.match-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 104px;
}

.match-score {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: 0.02em;
}

.match-footer {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.match-meta {
  margin: 0;
  font-size: 9px;
  line-height: 1.15;
  text-align: center;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

@media (max-width: 1180px) {
  .match-strip {
    width: calc(100dvw - 24px);
    grid-template-columns: 1fr;
    height: auto;
  }

  .match-card {
    min-height: 72px;
  }
}

@media (max-width: 640px) {
  .match-strip {
    gap: 10px;
  }

  .match-card {
    min-height: 0;
    height: auto;
  }

  .match-main {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .team,
  .team--away {
    justify-content: center;
  }

  .match-center {
    min-width: 0;
  }
}
</style>
