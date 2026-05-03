<template>
  <PageHero
    v-if="spielbericht"
    :image="spielbericht.image"
    :title="spielbericht.title"
    :lead="`${formatDate(spielbericht.date)} | ${spielbericht.time} Uhr | ${spielbericht.competition}`"
    kicker="Spielbericht"
    compact>
    <div class="page-hero-extra" v-if="spielbericht">
      <p class="hero-match">
        {{ spielbericht.homeTeam }} <strong>{{ spielbericht.result }}</strong>
        {{ spielbericht.awayTeam }}
      </p>
    </div>
  </PageHero>
  <section v-if="spielbericht" class="spielbericht-detail-layout">
    <article class="spielbericht-facts">
      <p><strong>Ort:</strong> {{ spielbericht.location }}</p>
      <p v-if="spielbericht.halfTime">
        <strong>Halbzeit:</strong> {{ spielbericht.halfTime }}
      </p>
      <p><strong>Quelle:</strong> {{ spielbericht.author }}</p>
      <p class="spielbericht-links">
        <a :href="spielbericht.sourceUrl" target="_blank" rel="noreferrer">
          Artikel auf FUSSBALL.DE
        </a>
        <a :href="spielbericht.matchUrl" target="_blank" rel="noreferrer">
          Spiel auf FUSSBALL.DE
        </a>
      </p>
    </article>
    <EntryDetailContent
      :title="spielbericht.title"
      :content="spielbericht.content" />
  </section>
  <section v-else class="entry-not-found">
    <h1 class="entry-not-found-title">Spielbericht nicht gefunden</h1>
    <RouterLink class="entry-not-found-link" to="/spielberichte">
      Zur Spielbericht-Uebersicht
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import EntryDetailContent from "@/components/EntryDetailContent.vue";
import PageHero from "@/components/PageHero.vue";
import { formatDate } from "@/utils/date";
import { findSpielberichtBySlug } from "@/utils/contentEntries";

const route = useRoute();

const spielbericht = computed(() =>
  findSpielberichtBySlug(String(route.params.slug ?? "")),
);
</script>

<style scoped>
.spielbericht-detail-layout {
  display: grid;
  gap: 24px;
  margin-bottom: clamp(48px, 8vw, 96px);
}

.spielbericht-facts {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: clamp(24px, 3vw, 32px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    linear-gradient(180deg, rgba(2, 43, 121, 0.4), rgba(2, 43, 121, 0.18)),
    rgba(255, 255, 255, 0.05);
}

.spielbericht-facts p {
  margin: 0;
}

.spielbericht-facts > * + * {
  margin-top: 12px;
}

.spielbericht-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
}

.spielbericht-links a,
.entry-not-found-link {
  color: var(--sv-secondary-color);
  font-weight: 700;
}

.hero-match {
  margin: 0;
  font-size: clamp(18px, 2vw, 24px);
  color: #fff2cf;
}

.entry-not-found {
  width: min(1120px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  padding: clamp(28px, 4vw, 48px);
}

.entry-not-found-title {
  margin: 0 0 16px;
}

@media (max-width: 900px) {
  .spielbericht-facts,
  .entry-not-found {
    width: calc(100dvw - 24px);
  }
}
</style>
