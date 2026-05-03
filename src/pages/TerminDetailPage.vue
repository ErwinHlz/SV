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
    <EntryDetailContent
      :excerpt="terminItem.excerpt"
      :content="terminItem.content" />
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
import { useRoute } from "vue-router";
import EntryDetailContent from "@/components/EntryDetailContent.vue";
import PageHero from "@/components/PageHero.vue";
import { findTerminBySlug } from "@/utils/contentEntries";
import { formatDate } from "@/utils/date";

const route = useRoute();

const terminItem = computed(() =>
  findTerminBySlug(String(route.params.slug ?? ""))
);
</script>

<style scoped>
.termin-detail-layout {
  display: grid;
  gap: 24px;
  margin-bottom: clamp(48px, 8vw, 96px);
}

.termin-detail-meta {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto;
  padding: clamp(24px, 3vw, 32px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.termin-detail-meta p {
  margin: 0;
}

.termin-detail-meta p + p {
  margin-top: 12px;
}

.entry-not-found {
  width: min(1120px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  padding: clamp(28px, 4vw, 48px);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
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
  .entry-not-found {
    width: calc(100dvw - 24px);
  }
}

</style>
