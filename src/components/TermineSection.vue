<template>
  <div class="termine-stage">
    <div class="section-header">
      <h2 class="section-title">
        <span class="section-title-desktop">Nächste Termine</span>
        <span class="section-title-mobile">Termine</span>
      </h2>
      <RouterLink to="/termine" class="section-cta" aria-label="Alle Termine">
        <CalendarDays :size="22" :stroke-width="2.2" aria-hidden="true" />
      </RouterLink>
    </div>
    <HomeTileRow class="termine-row" :items="rowItems" aria-label="Nächste Termine">
      <template #default="{ item }">
        <MatchTerminPoster
          v-if="terminOf(item).isMatchTemplate"
          :item="terminOf(item)"
          class="panel-poster" />
        <template v-else>
          <div class="shade"></div>
          <div class="content">
            <div class="kicker">{{ item.kicker }}</div>
            <h2 class="title">{{ item.title }}</h2>
          </div>
        </template>
      </template>
    </HomeTileRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalendarDays } from "@lucide/vue";
import HomeTileRow from "@/components/HomeTileRow.vue";
import MatchTerminPoster from "@/components/MatchTerminPoster.vue";
import { formatDate } from "@/utils/date";
import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";
import type { HomeTileRowItem } from "@/components/HomeTileRow.vue";

const termineItems = computed(() => getTerminItems());

const terminOf = (item: HomeTileRowItem) => item.raw as TerminEntry;

const rowItems = computed(() =>
  termineItems.value.slice(0, 3).map((item: TerminEntry) => ({
    id: item.id,
    to: { name: "termine-detail", params: { slug: item.slug } },
    img: item.isMatchTemplate ? undefined : item.image,
    kicker: `${formatDate(item.date)}${item.time ? ` · ${item.time} Uhr` : ""}`,
    title: item.title,
    raw: item,
  })),
);
</script>

<style scoped>
.termine-stage {
  width: 100%;
}

.section-header {
  width: 88dvw;
  max-width: 1400px;
  margin: 0 auto clamp(16px, 2.4vw, 28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  margin: 0;
  color: var(--sv-secondary-color);
  font-size: clamp(24px, 2.5vw, 30px);
  font-weight: 700;
  text-transform: uppercase;
}

.section-title-mobile {
  display: none;
}

.section-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  padding: 0;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  text-decoration: none;
  border: 2px solid transparent;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.section-cta:hover,
.section-cta:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}

:deep(.termine-row) {
  height: clamp(360px, 58dvh, 560px);
}

.panel-poster {
  display: block;
  width: 100%;
  height: 100%;
}

/* Für Termine ohne Spiel-Poster (z.B. Vereinsfeste): gleiche
   Shade/Content-Optik wie der Standard-Slot in HomeTileRow, hier
   dupliziert, weil Scoped-Slot-Inhalt den Scope der aufrufenden
   Komponente (hier) trägt, nicht den von HomeTileRow. */
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
  color: white;
}

.title {
  margin: 10px 0 0;
  font-size: clamp(18px, 1.9vw, 40px);
  line-height: 1.05;
  font-weight: 800;
  white-space: pre-line;
  color: white;
}

@media (max-width: 900px) {
  .termine-stage {
    position: relative;
    height: 100%;
  }

  .section-header {
    position: absolute;
    top: calc(var(--sv-header-height) + 18px);
    left: 16px;
    right: 16px;
    z-index: 2;
    width: auto;
    margin: 0;
    pointer-events: none;
  }

  .section-title {
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  }

  .section-cta {
    pointer-events: auto;
  }

  :deep(.termine-row) {
    width: 100%;
    max-width: none;
    height: 100%;
    min-height: 0;
  }
}

@media (max-width: 640px) {
  .section-header {
    display: contents;
  }

  .section-title {
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    letter-spacing: 0.04em;
    font-family: "Marker Felt", "Brush Script MT", "Segoe Print", cursive;
    font-size: 7.4dvh;
    line-height: 0.9;
    font-weight: 800;
    opacity: 0.42;
    z-index: 3;
    text-shadow: none;
    pointer-events: none;
  }

  .section-title-desktop {
    display: none;
  }

  .section-title-mobile {
    display: inline;
  }

  .section-cta {
    position: absolute;
    top: calc(var(--sv-header-height) + 14px);
    right: 14px;
    z-index: 2;
  }

  .kicker {
    font-size: 11px;
    letter-spacing: 0.12em;
  }

  .title {
    margin-top: 6px;
    font-size: clamp(18px, 5.6vw, 24px);
    line-height: 1.08;
  }
}
</style>
