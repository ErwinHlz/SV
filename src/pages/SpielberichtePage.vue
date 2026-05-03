<template>
  <PageHero
    :image="spielberichteHero"
    title="Spielberichte"
    lead="Die aktuellen Spielberichte der FSG Ottweiler/Steinbach im Bereich Aktuelles." />
  <section class="spielberichte-list" aria-label="Alle Spielberichte">
    <RouterLink
      v-for="item in spielberichteItems"
      :key="item.id"
      class="spielbericht-entry"
      :to="{ name: 'spielbericht-detail', params: { slug: item.slug } }">
      <div class="spielbericht-entry-body">
        <div class="spielbericht-meta">
          <time :datetime="item.date">{{ formatDate(item.date) }}</time>
          <span>{{ item.time }} Uhr</span>
          <span>{{ item.competition }}</span>
        </div>
        <h3 class="spielbericht-entry-title">{{ item.title }}</h3>
        <p class="spielbericht-entry-match">
          {{ item.homeTeam }} <strong>{{ item.result }}</strong> {{ item.awayTeam }}
        </p>
        <p class="spielbericht-entry-location">
          {{ item.location }}
          <span v-if="item.halfTime"> | Halbzeit {{ item.halfTime }}</span>
        </p>
        <p class="spielbericht-entry-excerpt">{{ item.excerpt }}</p>
      </div>
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHero from "@/components/PageHero.vue";
import spielberichteHero from "@/assets/header/background.png";
import { formatDate } from "@/utils/date";
import { getSpielberichtItems } from "@/utils/contentEntries";

const spielberichteItems = computed(() => getSpielberichtItems());
</script>

<style scoped>
.spielberichte-list {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: 0 0 clamp(48px, 8vw, 96px);
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.5vw, 26px);
}

.spielbericht-entry {
  text-decoration: none;
  color: inherit;
  padding: clamp(24px, 4vw, 34px) clamp(18px, 3vw, 28px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.spielbericht-entry:hover {
  transform: translateY(-2px);
  border-color: rgba(244, 208, 71, 0.72);
}

.spielbericht-entry:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
  border-radius: 12px;
}

.spielbericht-entry-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
}

.spielbericht-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 14px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.76;
}

.spielbericht-entry-title {
  margin: 0;
  font-size: clamp(22px, 2vw, 30px);
  line-height: 1.2;
  max-width: 24ch;
}

.spielbericht-entry-match {
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
  color: #fff2cf;
}

.spielbericht-entry-location,
.spielbericht-entry-excerpt {
  margin: 0;
  opacity: 0.86;
}

@media (max-width: 900px) {
  .spielberichte-list {
    width: calc(100dvw - 24px);
  }
}
</style>
