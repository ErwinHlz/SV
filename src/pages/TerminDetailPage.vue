<template>
  <PageHero
    v-if="terminItem"
    :image="terminItem.image"
    :title="terminItem.title"
    :lead="`${formatDate(terminItem.date)} | ${terminItem.time} | ${terminItem.location}`"
    kicker="Termin"
    compact />
  <section v-if="terminItem" class="termin-detail-layout">
    <article v-if="terminItem.source || terminItem.externalUrl" class="termin-detail-meta">
      <p v-if="terminItem.source"><strong>Quelle:</strong> {{ terminItem.source }}</p>
      <p v-if="terminItem.externalUrl">
        <a :href="terminItem.externalUrl" target="_blank" rel="noreferrer">
          Originalbeitrag oeffnen
        </a>
      </p>
    </article>
    <article
      v-if="terminItem.homeTeam && terminItem.awayTeam"
      class="termin-detail-matchup">
      <div class="termin-detail-team">
        <img
          v-if="terminItem.homeLogo"
          class="termin-detail-logo"
          :src="terminItem.homeLogo"
          :alt="`${terminItem.homeTeam} Logo`"
          loading="lazy" />
        <span class="termin-detail-team-name">{{ terminItem.homeTeam }}</span>
      </div>
      <span class="termin-detail-separator">vs</span>
      <div class="termin-detail-team termin-detail-team--away">
        <img
          v-if="terminItem.awayLogo"
          class="termin-detail-logo"
          :src="terminItem.awayLogo"
          :alt="`${terminItem.awayTeam} Logo`"
          loading="lazy" />
        <span class="termin-detail-team-name">{{ terminItem.awayTeam }}</span>
      </div>
    </article>
    <EntryDetailContent
      :excerpt="terminItem.excerpt"
      :content="terminItem.content" />
    <button
      type="button"
      class="termin-detail-back"
      aria-label="Zurueck"
      @click="goBack">
      <ArrowLeft :size="18" :stroke-width="2.4" />
    </button>
  </section>
  <section v-else class="entry-not-found">
    <h1 class="entry-not-found-title">Termin nicht gefunden</h1>
    <RouterLink class="entry-not-found-link" to="/termine">
      Zur Termin-Uebersicht
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@lucide/vue";
import EntryDetailContent from "@/components/EntryDetailContent.vue";
import PageHero from "@/components/PageHero.vue";
import { findTerminBySlug } from "@/utils/contentEntries";
import { formatDate } from "@/utils/date";

const route = useRoute();
const router = useRouter();

const terminItem = computed(() =>
  findTerminBySlug(String(route.params.slug ?? ""))
);

const goBack = () => {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }

  router.push({ name: "termine" });
};
</script>

<style scoped>
.termin-detail-layout {
  display: grid;
  gap: 24px;
  margin-bottom: clamp(48px, 8vw, 96px);
}

.termin-detail-back {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(244, 208, 71, 0.35);
  border-radius: 999px;
  background: rgba(7, 18, 44, 0.92);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
  color: var(--sv-secondary-color);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  z-index: 30;
}

.termin-detail-meta {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: clamp(24px, 3vw, 32px);
  border-radius: 28px;
  background: var(--sv-card-bg);
  border: 1px solid var(--sv-card-border);
}

.termin-detail-meta p {
  margin: 0;
}

.termin-detail-meta p + p {
  margin-top: 12px;
}

.termin-detail-matchup {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 28px);
  border-radius: 28px;
  background: var(--sv-card-bg-soft);
  border: 1px solid var(--sv-card-border);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
}

.termin-detail-team {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.termin-detail-team--away {
  justify-content: flex-end;
}

.termin-detail-logo {
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  object-fit: contain;
}

.termin-detail-team-name {
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 800;
  line-height: 1.15;
}

.termin-detail-separator {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
}

.entry-not-found {
  width: min(1120px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  padding: clamp(28px, 4vw, 48px);
  border-radius: 28px;
  background: var(--sv-card-bg-soft);
  border: 1px solid var(--sv-card-border);
}

.entry-not-found-title {
  margin: 0 0 16px;
}

.termin-detail-meta a,
.entry-not-found-link {
  color: var(--sv-secondary-color);
  font-weight: 700;
}

@media (max-width: 900px) {
  .termin-detail-meta,
  .termin-detail-matchup,
  .entry-not-found {
    width: calc(100dvw - 24px);
  }
}

@media (max-width: 700px) {
  .termin-detail-back {
    right: 12px;
    bottom: 12px;
    width: 42px;
    height: 42px;
  }

  .termin-detail-matchup {
    grid-template-columns: 1fr;
    gap: 14px;
    text-align: center;
  }

  .termin-detail-team,
  .termin-detail-team--away {
    justify-content: center;
  }
}

</style>
