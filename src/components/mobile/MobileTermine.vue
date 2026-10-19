<script setup lang="ts">
import { computed, ref } from "vue";
import { CalendarPlus, MapPin } from "@lucide/vue";
import MobileTerminRow from "@/components/mobile/MobileTerminRow.vue";
import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";
import {
  daysUntil,
  formatLongDate,
  formatMonthLabel,
  getOwnTeam,
  isOwnClub,
  isTodayOrLater,
  ownTeamLabel,
} from "@/utils/mobileFormat";

type Filter = "all" | "teamOne" | "teamTwo" | "verein";

const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "Alle" },
  { id: "teamOne", label: "1. Mannschaft" },
  { id: "teamTwo", label: "2. Mannschaft" },
  { id: "verein", label: "Verein" },
];

const activeFilter = ref<Filter>("all");

const isMatch = (item: TerminEntry) => Boolean(item.homeTeam && item.awayTeam);

const categoryOf = (item: TerminEntry): Exclude<Filter, "all"> =>
  isMatch(item) ? (getOwnTeam(item.homeTeam, item.awayTeam) ?? "teamOne") : "verein";

// Vergangene Termine (z. B. das Oktoberfest) werden mobil nicht mehr gezeigt.
const upcoming = getTerminItems().filter((item) => isTodayOrLater(item.date));

const filtered = computed(() =>
  upcoming.filter(
    (item) => activeFilter.value === "all" || categoryOf(item) === activeFilter.value,
  ),
);

const featured = computed(() => filtered.value.find(isMatch) ?? null);

const featuredDays = computed(() => daysUntil(featured.value?.date));

const groups = computed(() => {
  const result: Array<{ label: string; items: TerminEntry[] }> = [];

  filtered.value.forEach((item) => {
    const label = formatMonthLabel(item.date) || "Ohne Datum";
    const group = result.find((entry) => entry.label === label);
    if (group) group.items.push(item);
    else result.push({ label, items: [item] });
  });

  return result;
});

const mapsUrl = (item: TerminEntry) => {
  if (item.mapsUrl) return item.mapsUrl;
  const query = isOwnClub(item.homeTeam)
    ? "Stadion Im Alten Weiher, Ottweiler"
    : `Sportplatz ${item.homeTeam ?? item.location}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const icsText = (value: string) => value.replace(/[\\,;]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");

const downloadIcs = (item: TerminEntry) => {
  const date = item.date.replace(/-/g, "");
  const time = /^\d{1,2}:\d{2}$/.test(item.time) ? item.time.padStart(5, "0").replace(":", "") : "";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = isMatch(item) ? `${item.homeTeam} – ${item.awayTeam}` : item.title;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SV Ottweiler//Termine//DE",
    "BEGIN:VEVENT",
    `UID:${item.slug}@sv-ottweiler`,
    `DTSTAMP:${stamp}`,
    time ? `DTSTART:${date}T${time}00` : `DTSTART;VALUE=DATE:${date}`,
    time ? "DURATION:PT2H" : "",
    `SUMMARY:${icsText(title)}`,
    item.location ? `LOCATION:${icsText(item.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.slug || "termin"}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="m-page termine">
    <div class="termine__intro m-title-shrink">
      <p class="m-kicker">Aktuelles</p>
      <h1 class="m-display termine__title">Termine</h1>
      <p class="termine__lead">Alle Spiele beider Mannschaften und Vereinstermine auf einen Blick.</p>
    </div>

    <article v-if="featured" class="termine-next m-tilt-out">
      <p class="m-kicker">
        Als Nächstes · {{ ownTeamLabel(getOwnTeam(featured.homeTeam, featured.awayTeam)) }}
      </p>
      <div class="termine-next__count">
        <template v-if="featuredDays !== null && featuredDays > 1">
          <span class="termine-next__number">{{ featuredDays }}</span>
          <span class="m-display termine-next__unit">Tage bis<br />Anpfiff</span>
        </template>
        <span v-else class="termine-next__number termine-next__number--word">
          {{ featuredDays === 0 ? "Heute" : "Morgen" }}
        </span>
      </div>
      <div class="termine-next__match">
        <span class="m-crest termine-next__crest"><img :src="featured.homeLogo" alt="" /></span>
        <span class="m-crest termine-next__crest termine-next__crest--overlap">
          <img :src="featured.awayLogo" alt="" />
        </span>
        <span class="termine-next__teams">{{ featured.homeTeam }} – {{ featured.awayTeam }}</span>
      </div>
      <p class="termine-next__info">
        {{ formatLongDate(featured.date) }}<template v-if="featured.time"> · {{ featured.time }} Uhr</template>
        <br />{{ featured.location }}
      </p>
      <div class="termine-next__actions">
        <button type="button" class="m-text-link termine-next__action" @click="downloadIcs(featured)">
          <CalendarPlus :size="18" :stroke-width="2" /> In Kalender
        </button>
        <a :href="mapsUrl(featured)" target="_blank" rel="noreferrer" class="m-text-link">
          <MapPin :size="18" :stroke-width="2" /> Anfahrt
        </a>
      </div>
    </article>

    <div class="m-sticky-bar termine__filter">
      <div class="m-tabs" role="group" aria-label="Termine filtern">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="m-tab"
          :class="{ 'is-active': activeFilter === filter.id }"
          :aria-pressed="activeFilter === filter.id ? 'true' : 'false'"
          @click="activeFilter = filter.id">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <section v-for="group in groups" :key="group.label" class="termine-month" :aria-label="group.label">
      <div class="termine-month__head">
        <span class="termine-month__label">{{ group.label }}</span>
        <span class="termine-month__count">
          {{ group.items.length }} {{ group.items.length === 1 ? "Termin" : "Termine" }}
        </span>
      </div>
      <div class="termine-month__list">
        <MobileTerminRow v-for="item in group.items" :key="item.id" :termin="item" show-crests />
      </div>
    </section>

    <p v-if="!groups.length" class="termine__empty">Aktuell stehen hier keine Termine an.</p>

    <div class="termine__end" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.termine {
  padding-top: var(--m-header);
}

.termine__intro {
  padding: 20px var(--m-gutter) 22px;
}

.termine__title {
  margin: 2px 0 6px;
  font-size: 68px;
}

.termine__lead {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.termine-next {
  margin: 0 var(--m-gutter);
  padding: 18px 0 8px;
  border-top: 2px solid var(--m-yellow);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.termine-next__count {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.termine-next__number {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 150px;
  line-height: 0.78;
  color: transparent;
  -webkit-text-stroke: 2px var(--m-yellow);
}

.termine-next__number--word {
  font-size: 96px;
  text-transform: uppercase;
}

.termine-next__unit {
  padding-bottom: 4px;
  font-size: 30px;
  line-height: 0.95;
}

.termine-next__match {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.termine-next__crest {
  width: 40px;
  height: 40px;
}

.termine-next__crest--overlap {
  margin-left: -18px;
  box-shadow: 0 0 0 3px var(--m-bg);
}

.termine-next__teams {
  flex: 1;
  min-width: 0;
  font-weight: 700;
  font-size: 18px;
}

.termine-next__info {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.termine-next__actions {
  display: flex;
  gap: 24px;
}

.termine-next__action {
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

.termine__filter {
  margin-top: 20px;
  height: 52px;
  box-sizing: border-box;
  padding-top: 5px;
}

.termine-month {
  padding-bottom: 14px;
}

.termine-month__head {
  position: sticky;
  top: calc(var(--m-header) + 52px);
  z-index: 10;
  padding: 12px var(--m-gutter) 10px;
  background: var(--m-bg);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.termine-month__label {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 24px;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.termine-month__count {
  font-size: 12px;
  color: var(--m-meta);
}

.termine-month__list {
  padding: 0 var(--m-gutter);
}

.termine__empty {
  padding: 24px var(--m-gutter);
  color: var(--m-text-2);
}

.termine__end {
  height: 40px;
}
</style>
