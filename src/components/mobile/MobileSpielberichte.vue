<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowDown, ArrowRight } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import { getSpielberichtItems } from "@/utils/contentEntries";
import { formatMonthLabel, formatShortDate, isOwnClub, type OwnTeam } from "@/utils/mobileFormat";
import { initials, outcomeLabel, toMobileReport, type MobileReport } from "@/utils/mobileReports";

type Filter = "all" | OwnTeam;

const PAGE_SIZE = 12;

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Alle" },
  { id: "teamOne", label: "1. Mannschaft" },
  { id: "teamTwo", label: "2. Mannschaft" },
];

const activeFilter = ref<Filter>("all");
const visibleCount = ref(PAGE_SIZE);

const reports = getSpielberichtItems().map(toMobileReport);

const filtered = computed(() =>
  reports.filter((item) => activeFilter.value === "all" || item.team === activeFilter.value),
);
const featured = computed(() => filtered.value[0] ?? null);
const rest = computed(() => filtered.value.slice(1, visibleCount.value));
const hasMore = computed(() => filtered.value.length > visibleCount.value);

const groups = computed(() => {
  const result: Array<{ label: string; items: MobileReport[] }> = [];

  rest.value.forEach((item) => {
    const label = formatMonthLabel(item.date) || "Ohne Datum";
    const group = result.find((entry) => entry.label === label);
    if (group) group.items.push(item);
    else result.push({ label, items: [item] });
  });

  return result;
});

const selectFilter = (id: Filter) => {
  activeFilter.value = id;
  visibleCount.value = PAGE_SIZE;
};

const detailLink = (item: MobileReport) => ({
  name: "spielbericht-detail",
  params: { slug: item.slug },
});
</script>

<template>
  <div class="m-page reports">
    <div class="reports__intro m-title-shrink">
      <p class="m-kicker">Aktuelles</p>
      <h1 class="m-display reports__title">Spiel&shy;berichte</h1>
      <p class="reports__lead">Alle Ergebnisse und Berichte unserer Mannschaften.</p>
    </div>

    <div class="m-sticky-bar">
      <div class="m-tabs" role="group" aria-label="Mannschaft filtern">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="m-tab"
          :class="{ 'is-active': activeFilter === filter.id }"
          :aria-pressed="activeFilter === filter.id ? 'true' : 'false'"
          @click="selectFilter(filter.id)">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <RouterLink v-if="featured" :to="detailLink(featured)" class="reports-feature m-rv">
      <div class="m-box reports-feature__box">
        <CrestMark class="m-box__crest reports-feature__crest" />
        <div class="reports-feature__head">
          <span class="m-kicker">Zuletzt · {{ formatShortDate(featured.date) }}</span>
          <span
            v-if="featured.outcome"
            class="reports-outcome"
            :class="`reports-outcome--${featured.outcome}`">
            {{ outcomeLabel[featured.outcome] }}
          </span>
        </div>

        <div class="reports-feature__board">
          <span class="reports-feature__team">
            <span class="m-crest reports-feature__logo">
              <img v-if="featured.homeLogo" :src="featured.homeLogo" :alt="`${featured.homeTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(featured.homeTeam) }}</span>
            </span>
            <span class="reports-feature__name" :class="{ 'is-own': isOwnClub(featured.homeTeam) }">
              {{ featured.homeTeam }}
            </span>
          </span>
          <span class="reports-feature__score">
            <span class="m-display">{{ featured.homeGoals }}<span class="reports-feature__colon">:</span>{{ featured.awayGoals }}</span>
            <span v-if="featured.halfTime" class="reports-feature__half">HZ {{ featured.halfTime }}</span>
          </span>
          <span class="reports-feature__team">
            <span class="m-crest reports-feature__logo">
              <img v-if="featured.awayLogo" :src="featured.awayLogo" :alt="`${featured.awayTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(featured.awayTeam) }}</span>
            </span>
            <span class="reports-feature__name" :class="{ 'is-own': isOwnClub(featured.awayTeam) }">
              {{ featured.awayTeam }}
            </span>
          </span>
        </div>

        <span class="m-display reports-feature__title">{{ featured.title }}</span>
        <span class="reports-feature__meta">{{ featured.competition }}<template v-if="featured.location"> · {{ featured.location }}</template></span>
        <span class="m-text-link">Bericht lesen <ArrowRight :size="18" :stroke-width="2" /></span>
      </div>
    </RouterLink>

    <p v-else class="reports__empty">Noch keine Spielberichte vorhanden.</p>

    <section v-for="group in groups" :key="group.label" class="reports-month" :aria-label="group.label">
      <h2 class="reports-month__head">{{ group.label }}</h2>
      <div class="reports-month__list">
        <RouterLink
          v-for="item in group.items"
          :key="item.id"
          :to="detailLink(item)"
          class="m-row reports-row m-rv">
          <span class="reports-row__meta">
            <span>{{ formatShortDate(item.date) }} · {{ item.competition }}</span>
            <span
              v-if="item.outcome"
              class="reports-outcome reports-outcome--chip"
              :class="`reports-outcome--${item.outcome}`"
              :aria-label="outcomeLabel[item.outcome]">
              {{ item.outcome }}
            </span>
          </span>
          <span class="reports-row__board">
            <span class="reports-row__side reports-row__side--home" :class="{ 'is-own': isOwnClub(item.homeTeam) }">
              <span class="reports-row__team">{{ item.homeTeam }}</span>
              <span class="m-crest reports-row__logo">
                <img v-if="item.homeLogo" :src="item.homeLogo" alt="" />
              <span v-else class="m-crest-initials">{{ initials(item.homeTeam) }}</span>
              </span>
            </span>
            <span class="reports-row__score">{{ item.homeGoals }}:{{ item.awayGoals }}</span>
            <span class="reports-row__side" :class="{ 'is-own': isOwnClub(item.awayTeam) }">
              <span class="m-crest reports-row__logo">
                <img v-if="item.awayLogo" :src="item.awayLogo" alt="" />
              <span v-else class="m-crest-initials">{{ initials(item.awayTeam) }}</span>
              </span>
              <span class="reports-row__team">{{ item.awayTeam }}</span>
            </span>
          </span>
          <span class="reports-row__title">{{ item.title }}</span>
        </RouterLink>
      </div>
    </section>

    <div class="reports__more">
      <button v-if="hasMore" type="button" class="reports__more-btn" @click="visibleCount += PAGE_SIZE">
        Ältere Berichte laden <ArrowDown :size="18" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.reports {
  padding-top: var(--m-header);
}

.reports__intro {
  padding: 20px var(--m-gutter) 18px;
}

.reports__title {
  margin: 2px 0 6px;
  font-size: 60px;
  hyphens: manual;
}

.reports__lead {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.reports__empty {
  margin: 24px var(--m-gutter);
  color: var(--m-text-2);
}

.reports-feature {
  display: block;
  margin: 22px var(--m-gutter) 0;
  color: var(--m-text);
  text-decoration: none;
}

.reports-feature__box {
  padding: 20px 18px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reports-feature__crest {
  right: -60px;
  bottom: -70px;
  width: 240px;
  height: 240px;
}

.reports-feature__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.reports-feature__board {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
  gap: 8px;
  padding: 6px 0 4px;
}

.reports-feature__team {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.reports-feature__logo {
  width: 64px;
  height: 64px;
}

.reports-feature__name {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
  color: var(--m-text-2);
  overflow-wrap: anywhere;
}

.reports-feature__name.is-own {
  color: var(--m-text);
  font-weight: 700;
}

.reports-feature__score {
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.reports-feature__score .m-display {
  font-size: 56px;
  line-height: 0.9;
  white-space: nowrap;
}

.reports-feature__colon {
  margin: 0 2px;
  color: var(--m-yellow);
}

.reports-feature__half {
  font-size: 12px;
  font-weight: 600;
  color: var(--m-meta);
}

.reports-feature__title {
  position: relative;
  font-weight: 700;
  font-size: 28px;
  line-height: 1;
}

.reports-feature__meta {
  position: relative;
  font-size: 13px;
  color: var(--m-meta);
}

.reports-feature .m-text-link {
  position: relative;
}

.reports-outcome {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-muted);
}

.reports-outcome--S {
  color: var(--m-yellow);
}

.reports-outcome--U {
  color: var(--m-text-2);
}

.reports-outcome--chip {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0;
  background: rgba(255, 255, 255, 0.08);
}

.reports-outcome--chip.reports-outcome--S {
  background: var(--m-yellow);
  color: var(--m-navy);
}

.reports-month {
  padding-top: 26px;
}

.reports-month__head {
  position: sticky;
  top: calc(var(--m-header) + 47px);
  z-index: 10;
  margin: 0;
  padding: 12px var(--m-gutter) 8px;
  background: var(--m-bg);
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 24px;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.reports-month__list {
  padding: 0 var(--m-gutter);
}

.reports-row {
  gap: 10px;
}

.reports-row__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.reports-row__board {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.reports-row__side {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--m-text-2);
}

.reports-row__side--home {
  justify-content: flex-end;
  text-align: right;
}

.reports-row__side.is-own {
  color: var(--m-text);
  font-weight: 700;
}

.reports-row__team {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reports-row__logo {
  width: 28px;
  height: 28px;
}

.reports-row__score {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 30px;
  line-height: 1;
}

.reports-row__title {
  font-size: 14px;
  line-height: 1.4;
  color: var(--m-text-2);
}

.reports__more {
  padding: 16px var(--m-gutter) 56px;
}

.reports__more-btn {
  width: 100%;
  min-height: 56px;
  border: 0;
  border-top: 1px solid var(--m-line);
  background: none;
  color: var(--m-yellow);
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}
</style>
