<template>
  <section class="match-strip" aria-label="Spiel-Highlights">
    <component
      v-for="match in cards"
      :key="match.key"
      :is="match.linkUrl ? 'a' : 'article'"
      class="match-card"
      :class="[
        `match-card--${match.key}`,
        { 'match-card--link': Boolean(match.linkUrl) },
      ]"
      :href="match.linkUrl"
      :target="match.linkUrl ? '_blank' : undefined"
      :rel="match.linkUrl ? 'noreferrer' : undefined">
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
    </component>
  </section>
</template>

<script setup lang="ts">
import rawMatchHighlights from "@/content/match-highlights.json";
import { getClubLogo } from "@/utils/contentEntries";
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
  match_url?: string;
};

type MatchHighlightsContent = {
  last: MatchEntry;
  live: MatchEntry;
  next: MatchEntry;
};

const matchHighlights = rawMatchHighlights as MatchHighlightsContent;

const cards = [
  {
    key: "last",
    label: "Letztes",
    ...matchHighlights.last,
    bild_heim:
      getClubLogo(matchHighlights.last.heimmannschaft) ??
      matchHighlights.last.bild_heim,
    bild_gast:
      getClubLogo(matchHighlights.last.gastmannschaft) ??
      matchHighlights.last.bild_gast,
    linkUrl: matchHighlights.last.match_url,
  },
  {
    key: "live",
    label: "Aktuell",
    ...matchHighlights.live,
    bild_heim:
      getClubLogo(matchHighlights.live.heimmannschaft) ??
      matchHighlights.live.bild_heim,
    bild_gast:
      getClubLogo(matchHighlights.live.gastmannschaft) ??
      matchHighlights.live.bild_gast,
    linkUrl: matchHighlights.live.match_url,
  },
  {
    key: "next",
    label: "Nächstes",
    ...matchHighlights.next,
    bild_heim:
      getClubLogo(matchHighlights.next.heimmannschaft) ??
      matchHighlights.next.bild_heim,
    bild_gast:
      getClubLogo(matchHighlights.next.gastmannschaft) ??
      matchHighlights.next.bild_gast,
    linkUrl: matchHighlights.next.match_url,
  },
];
</script>

<style scoped>
.match-strip {
  width: 80dvw;
  height: clamp(72px, 8dvh, 96px);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  flex: 0 0 auto;
}

.match-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 8px 12px;
  background: var(--sv-card-bg);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: rgb(20, 20, 20);

  overflow: hidden;
  height: 15dvh;
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.match-card--link {
  cursor: pointer;
  transition: all 0.22s ease;
}

.match-card--link:hover,
.match-card--link:focus-visible {
  scale: 1.05;
  border-color: rgba(244, 208, 71, 0.65);
  box-shadow: 0 16px 28px rgba(2, 43, 121, 0.24);
}

.match-card--link:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.match-card--live {
  border-color: rgba(244, 208, 71, 0.45);
  background:
    radial-gradient(
      circle at top right,
      rgba(244, 208, 71, 0.18),
      transparent 35%
    ),
    rgb(2, 16, 46);
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
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.team--away {
  justify-content: flex-end;
}

.team-logo {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  object-fit: contain;
}

.team-name {
  margin: 0;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.15;
  text-align: center;
  white-space: normal;
  overflow: hidden;
  text-wrap: balance;
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

  .team-logo {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
  }

  .match-center {
    min-width: 0;
  }
}
</style>
