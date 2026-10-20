<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@lucide/vue";
import { getSpielberichtItems, type SpielberichtEntry } from "@/utils/contentEntries";
import { formatLongDate, isOwnClub } from "@/utils/mobileFormat";
import { initials, outcomeLabel, toMobileReport } from "@/utils/mobileReports";

const props = defineProps<{ item: SpielberichtEntry }>();

const report = computed(() => toMobileReport(props.item));

// Fussball.de haengt an den Autor einen langen Hinweis in Klammern an.
const source = computed(() => props.item.author.replace(/\s*\(.*\)\s*$/, ""));

const more = computed(() =>
  getSpielberichtItems()
    .filter((entry) => entry.slug !== props.item.slug)
    .slice(0, 3)
    .map(toMobileReport),
);
</script>

<template>
  <article class="m-page report">
    <header class="report-hero">
      <RouterLink to="/spielberichte" class="report-hero__back">
        <ArrowLeft :size="18" :stroke-width="2" /> Alle Spielberichte
      </RouterLink>
      <p class="m-kicker">{{ report.competition }}</p>
      <p class="report-hero__date">{{ formatLongDate(report.date) }}<template v-if="report.time"> · {{ report.time }} Uhr</template></p>

      <div class="report-board">
        <div class="report-board__team">
          <span class="m-crest report-board__logo">
            <img v-if="report.homeLogo" :src="report.homeLogo" :alt="`${report.homeTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(report.homeTeam) }}</span>
          </span>
          <span class="report-board__name" :class="{ 'is-own': isOwnClub(report.homeTeam) }">{{ report.homeTeam }}</span>
        </div>
        <div class="report-board__score">
          <span class="m-display">{{ report.homeGoals }}<span class="report-board__colon">:</span>{{ report.awayGoals }}</span>
          <span v-if="report.halfTime" class="report-board__half">Halbzeit {{ report.halfTime }}</span>
          <span
            v-if="report.outcome"
            class="report-board__outcome"
            :class="`report-board__outcome--${report.outcome}`">
            {{ outcomeLabel[report.outcome] }}
          </span>
        </div>
        <div class="report-board__team">
          <span class="m-crest report-board__logo">
            <img v-if="report.awayLogo" :src="report.awayLogo" :alt="`${report.awayTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(report.awayTeam) }}</span>
          </span>
          <span class="report-board__name" :class="{ 'is-own': isOwnClub(report.awayTeam) }">{{ report.awayTeam }}</span>
        </div>
      </div>
    </header>

    <div class="report-body">
      <h1 class="m-display report-body__title">{{ report.title }}</h1>
      <p v-for="(paragraph, index) in report.paragraphs" :key="index" class="report-body__text">
        {{ paragraph }}
      </p>

      <dl class="report-facts">
        <div v-if="report.location">
          <dt>Ort</dt>
          <dd>{{ report.location }}</dd>
        </div>
        <div v-if="report.halfTime">
          <dt>Halbzeit</dt>
          <dd>{{ report.halfTime }}</dd>
        </div>
        <div>
          <dt>Quelle</dt>
          <dd>{{ source }}</dd>
        </div>
      </dl>

      <div class="report-links">
        <a v-if="report.sourceUrl" :href="report.sourceUrl" target="_blank" rel="noreferrer" class="m-text-link">
          Artikel auf FUSSBALL.DE <ArrowUpRight :size="16" :stroke-width="2" />
        </a>
        <a v-if="report.matchUrl" :href="report.matchUrl" target="_blank" rel="noreferrer" class="m-text-link">
          Spiel auf FUSSBALL.DE <ArrowUpRight :size="16" :stroke-width="2" />
        </a>
      </div>
    </div>

    <section v-if="more.length" class="report-more" aria-label="Weitere Spielberichte">
      <div class="m-section-head report-more__head">
        <div>
          <p class="m-kicker">Weitere</p>
          <h2 class="m-section-title">Berichte</h2>
        </div>
        <RouterLink to="/spielberichte" class="m-more">
          Alle <ArrowRight :size="16" :stroke-width="2" />
        </RouterLink>
      </div>
      <div class="report-more__list">
        <RouterLink
          v-for="entry in more"
          :key="entry.id"
          :to="{ name: 'spielbericht-detail', params: { slug: entry.slug } }"
          class="m-row report-more__row">
          <span class="report-more__score">{{ entry.homeGoals }}:{{ entry.awayGoals }}</span>
          <span class="report-more__text">
            <span class="report-more__teams">{{ entry.homeTeam }} – {{ entry.awayTeam }}</span>
            <span class="report-more__title">{{ entry.title }}</span>
          </span>
          <ArrowRight :size="18" :stroke-width="2" class="report-more__arrow" />
        </RouterLink>
      </div>
    </section>
  </article>
</template>

<style scoped>
.report {
  padding-top: var(--m-header);
  padding-bottom: 56px;
}

.report-hero {
  padding: 8px var(--m-gutter) 28px;
  background: linear-gradient(180deg, #011338 0%, var(--m-bg) 100%);
}

.report-hero__back {
  min-height: 44px;
  margin-bottom: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--m-text-2);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.report-hero__date {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--m-text-2);
}

.report-board {
  margin-top: 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
  gap: 8px;
}

.report-board__team {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.report-board__logo {
  width: 76px;
  height: 76px;
}

.report-board__name {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
  color: var(--m-text-2);
  overflow-wrap: anywhere;
}

.report-board__name.is-own {
  color: var(--m-text);
  font-weight: 700;
}

.report-board__score {
  padding-top: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.report-board__score .m-display {
  font-size: 68px;
  line-height: 0.9;
  white-space: nowrap;
}

.report-board__colon {
  margin: 0 2px;
  color: var(--m-yellow);
}

.report-board__half {
  font-size: 12px;
  font-weight: 600;
  color: var(--m-meta);
}

.report-board__outcome {
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--m-line);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-muted);
}

.report-board__outcome--S {
  border-color: var(--m-yellow);
  color: var(--m-yellow);
}

.report-board__outcome--U {
  color: var(--m-text-2);
}

.report-body {
  padding: 8px var(--m-gutter) 0;
}

.report-body__title {
  margin-bottom: 18px;
  font-size: 38px;
  line-height: 0.95;
}

.report-body__text {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 1.7;
  color: #dbe3f3;
}

.report-facts {
  margin: 26px 0 0;
  border-top: 1px solid var(--m-line);
}

.report-facts > div {
  padding: 12px 0;
  border-bottom: 1px solid var(--m-line);
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  font-size: 14px;
}

.report-facts dt {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.report-facts dd {
  margin: 0;
  color: var(--m-text);
}

.report-links {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}

.report-more {
  padding-top: 48px;
}

.report-more__head {
  margin-bottom: 4px;
}

.report-more__list {
  padding: 0 var(--m-gutter);
}

.report-more__row {
  grid-template-columns: 64px minmax(0, 1fr) 18px;
}

.report-more__score {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 30px;
  color: var(--m-yellow);
}

.report-more__text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.report-more__teams {
  font-weight: 700;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-more__title {
  font-size: 13px;
  color: var(--m-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-more__arrow {
  color: var(--m-yellow);
}
</style>
