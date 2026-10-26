<template>
  <div class="cal" :class="{ 'cal--mobile': mobile }" :style="{ '--hours': hours.length }">
    <div class="cal-toolbar">
      <div class="cal-toolbar__title">
        <span class="cal-toolbar__kicker">{{ view === "week" ? weekKicker : "Monat" }}</span>
        <span class="cal-toolbar__range">{{ view === "week" ? weekRange : monthTitle }}</span>
      </div>
      <div class="cal-toolbar__actions">
        <div class="cal-switch" role="group" aria-label="Ansicht">
          <button type="button" :aria-pressed="view === 'week'" @click="view = 'week'">Woche</button>
          <button type="button" :aria-pressed="view === 'month'" @click="view = 'month'">Monat</button>
        </div>
        <button v-if="!isCurrentPeriod" type="button" class="cal-today" @click="goToday">Heute</button>
        <button
          type="button"
          class="cal-arrow"
          :disabled="!canStep(-1)"
          :aria-label="view === 'week' ? 'Vorherige Woche' : 'Vorheriger Monat'"
          @click="step(-1)">
          <ChevronLeft :size="20" :stroke-width="2.2" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="cal-arrow"
          :disabled="!canStep(1)"
          :aria-label="view === 'week' ? 'Nächste Woche' : 'Nächster Monat'"
          @click="step(1)">
          <ChevronRight :size="20" :stroke-width="2.2" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Wochenansicht -->
    <template v-if="view === 'week'">
      <!-- Mobil: Tag auswählen, darunter die Zeitleiste des Tages. -->
      <div v-if="mobile" class="cal-strip" role="tablist" aria-label="Wochentag wählen">
        <button
          v-for="(day, index) in days"
          :key="day.iso"
          type="button"
          role="tab"
          class="cal-strip__day"
          :class="{ 'is-selected': index === selectedDay, 'is-today': day.isToday }"
          :aria-selected="index === selectedDay"
          :aria-label="`${day.name}, ${formatLong(day.date)}`"
          @click="selectedDay = index">
          <span class="cal-strip__name">{{ day.short }}</span>
          <span class="cal-strip__num">{{ day.date.getDate() }}</span>
          <span class="cal-strip__dots" aria-hidden="true">
            <i v-for="color in day.colors" :key="color" :style="{ background: color }"></i>
          </span>
        </button>
      </div>

      <div class="cal-frame">
        <div v-if="!mobile" class="cal-head">
          <span></span>
          <div v-for="day in days" :key="day.iso" class="cal-head__day" :class="{ 'is-today': day.isToday }">
            <span class="cal-head__name">{{ day.short }}</span>
            <span class="cal-head__num">{{ day.date.getDate() }}</span>
          </div>
        </div>

        <div class="cal-body">
          <div class="cal-axis" aria-hidden="true">
            <span v-for="(hour, index) in hours" :key="hour" :style="{ '--row': index }">
              {{ String(hour).padStart(2, "0") }}:00
            </span>
          </div>

          <div
            v-for="day in visibleDays"
            :key="day.iso"
            class="cal-col"
            :class="{ 'is-today': day.isToday }"
            :aria-label="`${day.name}, ${formatLong(day.date)}`"
            role="list">
            <div
              v-if="day.isToday && nowOffset !== null"
              class="cal-now"
              :style="{ '--at': nowOffset }"
              aria-hidden="true"></div>

            <div
              v-for="entry in day.entries"
              :key="entry.key"
              role="listitem"
              class="cal-slot"
              :style="{
                '--start': (entry.start - rangeStart) / 60,
                '--len': (entry.end - entry.start) / 60,
                '--col': entry.col,
                '--cols': entry.cols,
              }">
              <button
                type="button"
                class="cal-ev"
                :class="{ 'is-match': entry.isMatch }"
                :style="entryStyle(entry)"
                :title="entry.label"
                :aria-label="`${entry.label}. Details anzeigen`"
                @click="openDetail(entry, $event)">
                <span class="cal-ev__time">{{ entry.timeStart }}<span class="cal-ev__long">{{ entry.timeRest }}</span></span>
                <span class="cal-ev__team">
                  <Trophy v-if="entry.isMatch" :size="12" :stroke-width="2.6" aria-hidden="true" />
                  <span class="cal-ev__long">{{ entry.team }}</span>
                  <span class="cal-ev__short">{{ entry.short }}</span>
                </span>
                <span v-if="entry.detail" class="cal-ev__meta">{{ entry.detail }}</span>
              </button>
            </div>

            <p v-if="mobile && !day.entries.length" class="cal-free">Keine Belegung an diesem Tag</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Monatsansicht -->
    <template v-else>
      <div class="cal-frame cal-month">
        <div class="cal-month__head">
          <span v-for="name in weekdays" :key="name">{{ mobile ? name.slice(0, 2) : name }}</span>
        </div>
        <div class="cal-month__grid">
          <template v-for="cell in monthCells" :key="cell.iso">
            <!-- Mobil: Tag mit Punkten, die Termine stehen darunter. -->
            <button
              v-if="mobile"
              type="button"
              class="cal-mday"
              :class="{
                'is-other': !cell.inMonth,
                'is-past': cell.isPast,
                'is-today': cell.isToday,
                'is-selected': cell.iso === selectedIso,
              }"
              :aria-pressed="cell.iso === selectedIso"
              :aria-label="`${formatLong(cell.date)}, ${countLabel(cell.entries.length)}`"
              @click="selectedIso = cell.iso">
              <span class="cal-mday__num">{{ cell.date.getDate() }}</span>
              <span class="cal-strip__dots" aria-hidden="true">
                <i v-for="color in cell.colors.slice(0, 4)" :key="color" :style="{ background: color }"></i>
              </span>
            </button>

            <div
              v-else
              class="cal-mcell"
              :class="{ 'is-other': !cell.inMonth, 'is-past': cell.isPast, 'is-today': cell.isToday }">
              <span class="cal-mcell__num">{{ cell.date.getDate() }}</span>
              <button
                v-for="entry in cell.entries.slice(0, 3)"
                :key="entry.key"
                type="button"
                class="cal-pill"
                :class="{ 'is-match': entry.isMatch }"
                :style="entryStyle(entry)"
                :aria-label="`${entry.label}. Details anzeigen`"
                @click="openDetail(entry, $event)">
                <span class="cal-pill__time">{{ entry.timeStart }}</span>
                <Trophy v-if="entry.isMatch" :size="12" :stroke-width="2.6" aria-hidden="true" />
                <span class="cal-pill__team">{{ entry.isMatch ? entry.short : entry.team }}</span>
              </button>
              <button
                v-if="cell.entries.length > 3"
                type="button"
                class="cal-more"
                @click="openWeekOf(cell.date)">
                + {{ cell.entries.length - 3 }} weitere
              </button>
            </div>
          </template>
        </div>
      </div>

      <div v-if="mobile" class="cal-daylist">
        <h3 class="cal-daylist__title">{{ selectedTitle }}</h3>
        <p v-if="!selectedEntries.length" class="cal-daylist__free">Keine Belegung an diesem Tag</p>
        <button
          v-for="entry in selectedEntries"
          :key="entry.key"
          type="button"
          class="cal-row"
          :class="{ 'is-match': entry.isMatch }"
          :style="entryStyle(entry)"
          :aria-label="`${entry.label}. Details anzeigen`"
          @click="openDetail(entry, $event)">
          <span class="cal-row__time">
            <strong>{{ entry.timeStart }}</strong>
            <span>{{ entry.isMatch ? "Anstoß" : entry.timeEnd }}</span>
          </span>
          <span class="cal-row__text">
            <strong>{{ entry.isMatch ? `Heimspiel ${entry.team}` : entry.team }}</strong>
            <span>{{ entry.isMatch ? entry.detail : "Training" }}</span>
          </span>
        </button>
      </div>
    </template>

    <div class="cal-legend">
      <div class="cal-legend__group">
        <span class="cal-legend__title">Mannschaften</span>
        <ul aria-label="Farben der Mannschaften">
          <li v-for="team in legendTeams" :key="team.name" :style="{ '--team': team.color }">
            <span class="cal-legend__swatch" aria-hidden="true"></span>{{ team.name }}
          </li>
          <li :style="{ '--team': '#9fb0d0' }">
            <span class="cal-legend__swatch cal-legend__swatch--match" aria-hidden="true"></span>Heimspiel
          </li>
        </ul>
      </div>
      <div class="cal-legend__group">
        <span class="cal-legend__title">Plätze · Streifen unten im Termin</span>
        <ul aria-label="Farben der Plätze">
          <li v-for="place in places" :key="place.id" :style="{ '--place': place.color }">
            <span class="cal-legend__stripe" aria-hidden="true"></span>{{ place.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Detailansicht eines Termins -->
    <Teleport to="body">
      <div v-if="detail" class="cal-modal" :class="{ 'cal-modal--mobile': mobile }" @click.self="closeDetail">
        <div
          class="cal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cal-dialog-title"
          :style="{ '--team': detail.color, '--ink': detail.ink, '--place': detail.place.color }">
          <header class="cal-dialog__head" :class="{ 'is-match': detail.isMatch }">
            <span class="cal-dialog__kicker">
              <Trophy v-if="detail.isMatch" :size="14" :stroke-width="2.4" aria-hidden="true" />
              {{ detail.isMatch ? "Heimspiel" : "Training" }}
            </span>
            <h3 id="cal-dialog-title" class="cal-dialog__title">{{ detail.team }}</h3>
            <p v-if="detail.isMatch" class="cal-dialog__sub">{{ detail.detail }}</p>
            <button ref="closeRef" type="button" class="cal-dialog__close" aria-label="Schließen" @click="closeDetail">
              <X :size="20" :stroke-width="2.4" aria-hidden="true" />
            </button>
          </header>

          <dl class="cal-dialog__facts">
            <div>
              <dt><CalendarDays :size="16" :stroke-width="2" aria-hidden="true" /> Datum</dt>
              <dd>{{ formatFull(detail.date) }}</dd>
            </div>
            <div>
              <dt><Clock :size="16" :stroke-width="2" aria-hidden="true" /> {{ detail.isMatch ? "Anstoß" : "Uhrzeit" }}</dt>
              <dd>{{ detail.isMatch ? `${detail.timeStart} Uhr` : `${detail.timeStart}–${detail.timeEnd} Uhr` }}</dd>
            </div>
            <div>
              <dt><MapPin :size="16" :stroke-width="2" aria-hidden="true" /> Platz</dt>
              <dd><span class="cal-dialog__place" aria-hidden="true"></span>{{ detail.place.name }}</dd>
            </div>
            <div v-if="detail.competition">
              <dt><Trophy :size="16" :stroke-width="2" aria-hidden="true" /> Wettbewerb</dt>
              <dd>{{ detail.competition }}</dd>
            </div>
            <div v-if="detailInfo?.ageGroup">
              <dt><Users :size="16" :stroke-width="2" aria-hidden="true" /> Jahrgang</dt>
              <dd>{{ detailInfo.ageGroup }}</dd>
            </div>
            <div v-if="detailInfo?.coaches.length">
              <dt><Users :size="16" :stroke-width="2" aria-hidden="true" /> Trainer</dt>
              <dd>{{ detailInfo.coaches.join(", ") }}</dd>
            </div>
          </dl>

          <div v-if="detailInfo?.schedule.length" class="cal-dialog__schedule">
            <span class="cal-dialog__label">Alle Trainingszeiten</span>
            <ul>
              <li v-for="slot in detailInfo.schedule" :key="slot.key" :style="{ '--place': slot.color }">
                <strong>{{ slot.day }}</strong>
                <span>{{ slot.time }}</span>
                <span class="cal-dialog__slotplace">{{ slot.place }}</span>
              </li>
            </ul>
          </div>

          <a
            v-if="detail.url"
            :href="detail.url"
            target="_blank"
            rel="noopener noreferrer"
            class="cal-dialog__link">
            Spiel auf FuPa <ExternalLink :size="16" :stroke-width="2.2" aria-hidden="true" />
          </a>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  MapPin,
  Trophy,
  Users,
  X,
} from "@lucide/vue";
import rawStadion from "@/content/stadion.json";
import rawJugend from "@/content/jugend.json";
import rawJugendtrainer from "@/content/jugendtrainer.json";
import rawAktive from "@/content/aktive.json";
import rawSpielTermine from "@/content/spiel-termine.json";

const props = withDefaults(defineProps<{ mobile?: boolean }>(), { mobile: false });

type Slot = { day: string; time: string; location: string };
type Team = { name: string; short?: string; ageGroup?: string; training?: Slot[] };
type Place = { id: string; name: string; code: string; color: string; aliases: string[] };
type Entry = {
  key: string;
  date: Date;
  start: number;
  end: number;
  timeStart: string;
  timeEnd: string;
  timeRest: string;
  team: string;
  short: string;
  color: string;
  ink: string;
  detail?: string;
  competition?: string;
  url?: string;
  place: Pick<Place, "name" | "code" | "color">;
  isMatch: boolean;
  label: string;
};
type PlacedEntry = Entry & { col: number; cols: number };

const { places, teamColors, homeTeams, startHour, endHour } = rawStadion.belegungsplan as {
  places: Place[];
  teamColors: Record<string, string>;
  homeTeams: Array<{ match: string; label: string; short: string }>;
  startHour: number;
  endHour: number;
};

// Fester Zeitraum, damit der Kalender jede Woche gleich groß ist.
const rangeStart = startHour * 60;
const rangeEnd = endHour * 60;

const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const weekLimits = { min: -8, max: 8 };
const monthLimits = { min: -2, max: 2 };
// Für Spiele gibt es nur die Anstoßzeit, belegt ist der Platz rund zwei Stunden.
const matchDuration = 120;
const dayMs = 24 * 60 * 60 * 1000;

// Unbekannte Orte bekommen eine neutrale Farbe, damit sie trotzdem auftauchen.
const resolvePlace = (location: string) =>
  places.find((place) => place.aliases.includes(location.trim())) ?? {
    name: location || "Ort offen",
    code: (location || "?").slice(0, 3).toUpperCase(),
    color: "#9fb0d0",
  };

// Mannschaft = Farbe des Termins, Platz = farbiger Streifen unten.
const teamColor = (name: string) => teamColors[name] ?? "#9fb0d0";

// Auf hellen Farben dunkle Schrift, auf dunklen helle.
const inkFor = (hex: string) => {
  const [r = 0, g = 0, b = 0] = (hex.replace("#", "").match(/../g) ?? []).map((part) => parseInt(part, 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0a1530" : "#ffffff";
};

const toMinutes = (value: string) => {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

// "D-Jugend (U13)" -> "D-Jugend", Kurzform "D-Jgd."
const longName = (name: string) => name.replace(/\s*\(.*\)\s*$/, "");
const shortName = (team: Team) => team.short ?? longName(team.name).replace(/-Jugend$/, "-Jgd.");

const teams = [...(rawAktive.teams as Team[]), ...(rawJugend.teams as Team[])];

const parseSlot = (slot: Slot) => {
  const [from, to] = slot.time.match(/\d{1,2}:\d{2}/g) ?? [];
  return from && to ? { start: toMinutes(from), end: toMinutes(to) } : null;
};

const trainingByDay = weekdays.map((weekday) =>
  teams.flatMap((team) =>
    (team.training ?? [])
      .filter((slot) => slot.day === weekday)
      .flatMap((slot) => {
        const time = parseSlot(slot);
        if (!time) return [];
        const teamName = longName(team.name);
        return [{ team, teamName, slot, ...time, place: resolvePlace(slot.location) }];
      }),
  ),
);

// Zusatzinfos für die Detailansicht: Jahrgang, Trainer und alle Trainingszeiten.
const teamInfo = new Map(
  teams.map((team) => {
    const name = longName(team.name);
    return [
      name,
      {
        ageGroup: team.ageGroup,
        coaches: (rawJugendtrainer as Array<{ name: string; role: string }>)
          .filter((coach) => coach.role === name)
          .map((coach) => coach.name),
        schedule: (team.training ?? []).flatMap((slot) => {
          const time = parseSlot(slot);
          if (!time) return [];
          const place = resolvePlace(slot.location);
          return [
            {
              key: `${slot.day}-${slot.time}`,
              day: slot.day,
              time: `${formatTime(time.start)}–${formatTime(time.end)}`,
              place: place.name,
              color: place.color,
            },
          ];
        }),
      },
    ];
  }),
);

const homeMatches = (rawSpielTermine as Array<{
  id: number;
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  competition?: string;
  matchday?: string;
  externalUrl?: string;
}>).flatMap((match) => {
  const team = homeTeams.find((home) => home.match === match.homeTeam.trim());
  return team && /^\d{1,2}:\d{2}$/.test(match.time) ? [{ ...match, team }] : [];
});

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const mondayOf = (date: Date) => {
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

// Alle Termine eines Tages: wiederkehrende Trainings plus Heimspiele.
const entriesForDate = (date: Date): Entry[] => {
  const iso = toIsoDate(date);
  const weekday = (date.getDay() + 6) % 7;

  const matches = homeMatches
    .filter((match) => match.date === iso)
    .map<Entry>((match) => {
      const start = toMinutes(match.time);
      const place = resolvePlace(match.location);
      const color = teamColor(match.team.label);
      return {
        key: `match-${match.id}`,
        date,
        start,
        end: start + matchDuration,
        timeStart: match.time,
        timeEnd: formatTime(start + matchDuration),
        timeRest: " Anstoß",
        team: match.team.label,
        short: match.team.short,
        color,
        ink: inkFor(color),
        detail: `gegen ${match.awayTeam}`,
        competition: [match.competition, match.matchday].filter(Boolean).join(" · ") || undefined,
        url: match.externalUrl || undefined,
        place,
        isMatch: true,
        label: `Heimspiel ${match.team.label} gegen ${match.awayTeam}, Anstoß ${match.time} Uhr, ${place.name}`,
      };
    });

  const trainings = (trainingByDay[weekday] ?? []).map<Entry>((training) => {
    const color = teamColor(training.teamName);
    return {
      key: `${iso}-${training.team.name}-${training.slot.time}`,
      date,
      start: training.start,
      end: training.end,
      timeStart: formatTime(training.start),
      timeEnd: formatTime(training.end),
      timeRest: `–${formatTime(training.end)}`,
      team: training.teamName,
      short: shortName(training.team),
      color,
      ink: inkFor(color),
      place: training.place,
      isMatch: false,
      label: `${training.teamName}, Training ${formatTime(training.start)} bis ${formatTime(training.end)} Uhr, ${training.place.name}`,
    };
  });

  // Ein Heimspiel hat Vorrang: Training auf demselben Platz zur selben Zeit entfällt.
  const remaining = trainings.filter(
    (training) =>
      !matches.some(
        (match) =>
          match.place.name === training.place.name &&
          match.start < training.end &&
          training.start < match.end,
      ),
  );

  return [...remaining, ...matches].sort((a, b) => a.start - b.start || a.team.localeCompare(b.team));
};

// Überlappende Termine nebeneinander legen: jede Gruppe sich überschneidender
// Termine bekommt so viele Spalten, wie gleichzeitig belegt sind.
const layoutDay = (entries: Entry[]): PlacedEntry[] => {
  const sorted = [...entries].sort((a, b) => a.start - b.start || b.end - a.end);
  const placed: PlacedEntry[] = [];
  let group: PlacedEntry[] = [];
  let columnEnds: number[] = [];
  let groupEnd = -1;

  const closeGroup = () => {
    group.forEach((entry) => (entry.cols = columnEnds.length));
    group = [];
    columnEnds = [];
  };

  for (const entry of sorted) {
    if (entry.start >= groupEnd) closeGroup();
    let col = columnEnds.findIndex((end) => end <= entry.start);
    if (col === -1) col = columnEnds.length;
    columnEnds[col] = entry.end;
    groupEnd = Math.max(groupEnd, entry.end);
    const item = { ...entry, col, cols: 1 };
    group.push(item);
    placed.push(item);
  }
  closeGroup();
  return placed;
};

// Nur Mannschaften, die im Kalender auch vorkommen können.
const legendTeams = [
  ...new Set([
    ...homeTeams.map((team) => team.label),
    ...teams.filter((team) => team.training?.length).map((team) => longName(team.name)),
  ]),
].map((name) => ({ name, color: teamColor(name) }));

const entryStyle = (entry: Entry) => ({
  "--team": entry.color,
  "--ink": entry.ink,
  "--place": entry.place.color,
});

const formatLong = (date: Date) => date.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
const formatFull = (date: Date) =>
  date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const countLabel = (count: number) => (count ? `${count} ${count === 1 ? "Termin" : "Termine"}` : "keine Termine");

const now = ref(new Date());
let clock: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  clock = setInterval(() => (now.value = new Date()), 60_000);
});
onBeforeUnmount(() => {
  if (clock) clearInterval(clock);
});

const today = computed(() => startOfDay(now.value));

const view = ref<"week" | "month">("week");
const weekOffset = ref(0);
const monthOffset = ref(0);
const todayIndex = () => (new Date().getDay() + 6) % 7;
const selectedDay = ref(todayIndex());
const selectedIso = ref(toIsoDate(new Date()));

const isCurrentPeriod = computed(() => (view.value === "week" ? weekOffset.value === 0 : monthOffset.value === 0));

const canStep = (direction: number) => {
  if (view.value === "week") {
    const next = weekOffset.value + direction;
    return next >= weekLimits.min && next <= weekLimits.max;
  }
  const next = monthOffset.value + direction;
  return next >= monthLimits.min && next <= monthLimits.max;
};

const step = (direction: number) => {
  if (!canStep(direction)) return;
  if (view.value === "week") {
    weekOffset.value += direction;
    selectedDay.value = weekOffset.value === 0 ? todayIndex() : 0;
  } else {
    monthOffset.value += direction;
    const first = new Date(today.value.getFullYear(), today.value.getMonth() + monthOffset.value, 1);
    selectedIso.value = monthOffset.value === 0 ? toIsoDate(today.value) : toIsoDate(first);
  }
};

const goToday = () => {
  weekOffset.value = 0;
  monthOffset.value = 0;
  selectedDay.value = todayIndex();
  selectedIso.value = toIsoDate(today.value);
};

// "+ x weitere" im Monat springt in die passende Woche.
const openWeekOf = (date: Date) => {
  const offset = Math.round((mondayOf(date).getTime() - mondayOf(today.value).getTime()) / (7 * dayMs));
  weekOffset.value = Math.min(weekLimits.max, Math.max(weekLimits.min, offset));
  selectedDay.value = (date.getDay() + 6) % 7;
  view.value = "week";
};

const days = computed(() => {
  const monday = mondayOf(today.value);
  monday.setDate(monday.getDate() + weekOffset.value * 7);

  return weekdays.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    // Termine am Rand des Zeitraums abschneiden statt den Kalender zu vergrößern.
    const visible = entriesForDate(date)
      .filter((entry) => entry.end > rangeStart && entry.start < rangeEnd)
      .map((entry) => ({
        ...entry,
        start: Math.max(entry.start, rangeStart),
        end: Math.min(entry.end, rangeEnd),
      }));

    const entries = layoutDay(visible);

    return {
      name,
      short: name.slice(0, 2),
      date,
      iso: toIsoDate(date),
      isToday: date.getTime() === today.value.getTime(),
      entries,
      colors: [...new Set(entries.map((entry) => entry.color))],
    };
  });
});

// Mobil passt nur ein Tag sinnvoll in die Breite.
const visibleDays = computed(() =>
  props.mobile ? days.value.slice(selectedDay.value, selectedDay.value + 1) : days.value,
);

const monthStart = computed(
  () => new Date(today.value.getFullYear(), today.value.getMonth() + monthOffset.value, 1),
);

const monthTitle = computed(() =>
  monthStart.value.toLocaleDateString("de-DE", { month: "long", year: "numeric" }),
);

// Volle Wochen von Montag bis Sonntag rund um den Monat.
const monthCells = computed(() => {
  const first = monthStart.value;
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const cursor = mondayOf(first);
  const end = mondayOf(last);
  end.setDate(end.getDate() + 6);

  const cells = [];
  while (cursor <= end) {
    const date = new Date(cursor);
    const entries = entriesForDate(date);
    cells.push({
      date,
      iso: toIsoDate(date),
      inMonth: date.getMonth() === first.getMonth(),
      isToday: date.getTime() === today.value.getTime(),
      isPast: date < today.value,
      entries,
      colors: [...new Set(entries.map((entry) => entry.color))],
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
});

const selectedCell = computed(() => monthCells.value.find((cell) => cell.iso === selectedIso.value));
const selectedEntries = computed(() => selectedCell.value?.entries ?? []);
const selectedTitle = computed(() => {
  const cell = selectedCell.value;
  if (!cell) return "";
  return `${formatFull(cell.date).replace(/ \d{4}$/, "")}${cell.isToday ? " · Heute" : ""}`;
});

const hours = Array.from({ length: endHour - startHour }, (_, index) => startHour + index);

const nowOffset = computed(() => {
  const minutes = now.value.getHours() * 60 + now.value.getMinutes();
  if (minutes < rangeStart || minutes > rangeEnd) return null;
  return (minutes - rangeStart) / 60;
});

const weekKicker = computed(() => {
  const offset = weekOffset.value;
  if (offset === 0) return "Diese Woche";
  if (offset === 1) return "Nächste Woche";
  if (offset === -1) return "Letzte Woche";
  return offset > 0 ? `In ${offset} Wochen` : `Vor ${-offset} Wochen`;
});

const weekRange = computed(() => {
  const first = days.value[0]?.date;
  const last = days.value[days.value.length - 1]?.date;
  if (!first || !last) return "";
  const end = last.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
  const start = first.toLocaleDateString("de-DE", {
    day: "numeric",
    month: first.getMonth() === last.getMonth() ? undefined : "short",
  });
  return `${start} – ${end}`;
});

// Detailansicht
const detail = ref<Entry | null>(null);
const detailInfo = computed(() => (detail.value ? teamInfo.get(detail.value.team) : undefined));
const closeRef = ref<HTMLButtonElement | null>(null);
let lastFocus: HTMLElement | null = null;

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeDetail();
};

const openDetail = async (entry: Entry, event: Event) => {
  lastFocus = event.currentTarget as HTMLElement;
  detail.value = entry;
  document.addEventListener("keydown", onKeydown);
  await nextTick();
  closeRef.value?.focus();
};

const closeDetail = () => {
  detail.value = null;
  document.removeEventListener("keydown", onKeydown);
  lastFocus?.focus();
};

onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
.cal {
  --hour: 54px;
  --axis: 56px;
  --line: rgba(255, 255, 255, 0.08);
  --muted: #9fb0d0;
  --yellow: var(--sv-secondary-color, #f4d047);
  --ink-dark: #0a1530;
  display: grid;
  gap: 16px;
  color: #fff;
}

.cal--mobile {
  --hour: 62px;
  --axis: 46px;
  gap: 14px;
}

/* Kopfzeile mit Zeitraum, Ansicht und Navigation */
.cal-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.cal-toolbar__title {
  display: grid;
  gap: 2px;
}

.cal-toolbar__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--yellow);
}

.cal-toolbar__range {
  font-size: 1.35rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cal--mobile .cal-toolbar__range {
  font-family: var(--m-display, inherit);
  font-size: 24px;
  line-height: 1.05;
}

.cal-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal--mobile .cal-toolbar__actions {
  width: 100%;
}

.cal--mobile .cal-switch {
  margin-right: auto;
}

.cal-switch {
  display: inline-flex;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
}

.cal-switch button {
  height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #c7d3ec;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.cal-switch button[aria-pressed="true"] {
  background: var(--yellow);
  color: var(--ink-dark);
}

.cal-today,
.cal-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.cal-today {
  padding: 0 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.cal-arrow {
  width: 40px;
  padding: 0;
  border-radius: 50%;
}

.cal-today:hover,
.cal-today:focus-visible,
.cal-arrow:hover:not(:disabled),
.cal-arrow:focus-visible {
  border-color: var(--yellow);
  color: var(--yellow);
}

.cal-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Mobile Tagesleiste */
.cal-strip {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.cal-strip__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 0 7px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.cal-strip__name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.cal-strip__num {
  font-family: var(--m-display, inherit);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.cal-strip__dots {
  display: flex;
  justify-content: center;
  gap: 3px;
  height: 6px;
}

.cal-strip__dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.cal-strip__day.is-today .cal-strip__num {
  color: var(--yellow);
}

.cal-strip__day.is-selected {
  border-color: var(--yellow);
  background: var(--yellow);
}

.cal-strip__day.is-selected .cal-strip__name,
.cal-strip__day.is-selected .cal-strip__num {
  color: var(--ink-dark);
}

.cal-strip__day.is-selected .cal-strip__dots i {
  box-shadow: 0 0 0 1.5px var(--ink-dark);
}

/* Kalenderraster */
.cal-frame {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(12, 32, 74, 0.92) 0%, rgba(4, 12, 30, 0.96) 100%);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.cal-head,
.cal-body {
  display: grid;
  grid-template-columns: var(--axis) repeat(7, minmax(0, 1fr));
}

.cal--mobile .cal-body {
  grid-template-columns: var(--axis) minmax(0, 1fr);
}

.cal-head {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cal-head__day {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 4px 12px;
}

.cal-head__name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

.cal-head__num {
  display: inline-grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 1.1rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cal-head__day.is-today .cal-head__name {
  color: var(--yellow);
}

.cal-head__day.is-today .cal-head__num {
  background: var(--yellow);
  color: var(--ink-dark);
}

.cal-body {
  padding: 12px 0;
}

.cal-axis,
.cal-col {
  position: relative;
  height: calc(var(--hours) * var(--hour));
}

.cal-axis span {
  position: absolute;
  top: calc(var(--row) * var(--hour));
  right: 10px;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.cal-col {
  border-left: 1px solid var(--line);
  background-image:
    repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px var(--hour)),
    repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px var(--hour));
  background-position: 0 0, 0 calc(var(--hour) / 2);
}

.cal-col.is-today {
  background-color: rgba(244, 208, 71, 0.05);
}

.cal--mobile .cal-col.is-today {
  background-color: transparent;
}

.cal-now {
  position: absolute;
  top: calc(var(--at) * var(--hour));
  left: 0;
  right: 0;
  z-index: 3;
  height: 2px;
  background: #ff5d5d;
  pointer-events: none;
}

.cal-now::before {
  content: "";
  position: absolute;
  left: -5px;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5d5d;
}

/* Termine: Farbe = Mannschaft, Streifen unten = Platz */
.cal-slot {
  position: absolute;
  top: calc(var(--start) * var(--hour) + 2px);
  left: calc(100% * var(--col) / var(--cols) + 3px);
  width: calc(100% / var(--cols) - 6px);
  height: calc(var(--len) * var(--hour) - 4px);
  container-type: inline-size;
}

.cal-ev {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 6px 8px 13px;
  overflow: hidden;
  border: 0;
  border-left: 4px solid var(--team);
  border-radius: 10px;
  background: color-mix(in srgb, var(--team) 24%, #0a1838);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--team) 38%, transparent);
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

/* Platzstreifen über die ganze Breite unten */
.cal-ev::after,
.cal-pill::after,
.cal-row::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px;
  background: var(--place);
  /* Dunkle Fuge trennt den Platzstreifen sichtbar von der Mannschaftsfarbe. */
  box-shadow: 0 -2px 0 #000611;
}

.cal-ev:hover,
.cal-ev:focus-visible {
  z-index: 2;
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--team) 70%, transparent),
    0 8px 18px rgba(0, 0, 0, 0.35);
}

.cal-ev:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.cal-ev__time {
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--team) 70%, #fff);
}

.cal-ev__team {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
}

.cal-ev__short {
  display: none;
  white-space: nowrap;
}

.cal-ev__meta {
  max-width: 100%;
  overflow: hidden;
  font-size: 11px;
  line-height: 1.3;
  color: #c7d3ec;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cal-ev.is-match {
  border-left-color: #fff;
  background:
    repeating-linear-gradient(135deg, transparent 0 10px, rgba(255, 255, 255, 0.16) 10px 20px),
    var(--team);
  color: var(--ink);
}

.cal-ev.is-match .cal-ev__time,
.cal-ev.is-match .cal-ev__meta {
  color: color-mix(in srgb, var(--ink) 80%, transparent);
}

/* Schmale Termine (viele gleichzeitig): nur Startzeit und Kurzname */
@container (max-width: 76px) {
  .cal-ev {
    padding: 5px 4px 10px 5px;
  }

  .cal-ev__long,
  .cal-ev__meta {
    display: none;
  }

  .cal-ev__short {
    display: inline;
  }

  .cal-ev__team {
    font-size: 12px;
  }

  .cal-ev__time {
    font-size: 10px;
    line-height: 1.25;
  }
}

.cal--mobile .cal-ev {
  gap: 2px;
  padding: 8px 10px 12px;
}

.cal--mobile .cal-ev__team {
  font-size: 15px;
}

.cal-free {
  position: absolute;
  top: 35%;
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

/* Monatsansicht */
.cal-month__head,
.cal-month__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.cal-month__head {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cal-month__head span {
  padding: 12px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.cal--mobile .cal-month__head span {
  padding: 10px 0 6px;
  text-align: center;
}

.cal-mcell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  min-height: 128px;
  box-sizing: border-box;
  padding: 8px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.cal-mcell:nth-child(7n) {
  border-right: 0;
}

.cal-mcell.is-other,
.cal-mcell.is-past {
  opacity: 0.45;
}

.cal-mcell.is-today {
  background: rgba(244, 208, 71, 0.07);
  box-shadow: inset 0 0 0 2px var(--yellow);
}

.cal-mcell__num {
  display: inline-grid;
  place-items: center;
  align-self: flex-start;
  min-width: 28px;
  height: 28px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cal-mcell.is-today .cal-mcell__num {
  background: var(--yellow);
  color: var(--ink-dark);
}

.cal-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 3px 6px 8px;
  overflow: hidden;
  border: 0;
  border-left: 3px solid var(--team);
  border-radius: 6px;
  background: color-mix(in srgb, var(--team) 20%, #0a1838);
  color: #fff;
  font: inherit;
  font-size: 12px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.cal-pill::after {
  height: 4px;
}

.cal-pill.is-match {
  border-left-color: #fff;
  background:
    repeating-linear-gradient(135deg, transparent 0 8px, rgba(255, 255, 255, 0.16) 8px 16px),
    var(--team);
  color: var(--ink);
}

.cal-pill:hover,
.cal-pill:focus-visible {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--team) 70%, transparent);
}

.cal-pill__time {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
}

.cal-pill__team {
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
}

.cal-more {
  align-self: flex-start;
  padding: 2px 4px;
  border: 0;
  background: none;
  color: var(--muted);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cal-more:hover,
.cal-more:focus-visible {
  color: var(--yellow);
}

/* Monat mobil: Tage mit Punkten, Liste darunter */
.cal--mobile .cal-month__grid {
  row-gap: 2px;
  padding: 4px 4px 8px;
}

.cal-mday {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-height: 48px;
  padding: 4px 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.cal-mday.is-other {
  opacity: 0.3;
}

.cal-mday.is-past {
  opacity: 0.55;
}

.cal-mday__num {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 800;
}

.cal-mday.is-today .cal-mday__num {
  background: var(--yellow);
  color: var(--ink-dark);
}

.cal-mday.is-selected {
  background: rgba(244, 208, 71, 0.14);
}

.cal-mday.is-selected:not(.is-today) .cal-mday__num {
  box-shadow: inset 0 0 0 2px var(--yellow);
  color: var(--yellow);
}

.cal-daylist {
  display: grid;
  gap: 8px;
}

.cal-daylist__title {
  margin: 6px 0 2px;
  font-size: 18px;
  font-weight: 800;
}

.cal-daylist__free {
  margin: 0;
  padding: 18px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  color: var(--muted);
}

.cal-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px 15px;
  overflow: hidden;
  border: 0;
  border-left: 4px solid var(--team);
  border-radius: 14px;
  background: color-mix(in srgb, var(--team) 20%, #0a1838);
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.cal-row.is-match {
  border-left-color: #fff;
  background:
    repeating-linear-gradient(135deg, transparent 0 10px, rgba(255, 255, 255, 0.16) 10px 20px),
    var(--team);
  color: var(--ink);
}

.cal-row__time,
.cal-row__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.cal-row__time {
  min-width: 48px;
  font-variant-numeric: tabular-nums;
}

.cal-row__time strong,
.cal-row__text strong {
  font-size: 16px;
  font-weight: 800;
}

.cal-row__time span,
.cal-row__text span {
  font-size: 13px;
  opacity: 0.75;
}

/* Legende */
.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 40px;
  font-size: 0.85rem;
  font-weight: 600;
}

.cal-legend__group {
  display: grid;
  gap: 8px;
}

.cal-legend__title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.cal-legend ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cal-legend li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cal-legend__swatch {
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border-left: 4px solid var(--team);
  border-radius: 4px;
  background: color-mix(in srgb, var(--team) 30%, #0a1838);
}

.cal-legend__swatch--match {
  border-left-color: #fff;
  background:
    repeating-linear-gradient(135deg, transparent 0 4px, rgba(255, 255, 255, 0.35) 4px 8px),
    var(--team);
}

.cal-legend__stripe {
  width: 28px;
  height: 8px;
  border-radius: 3px;
  background: var(--place);
}

/* Detail-Popup */
.cal-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 6, 17, 0.72);
  backdrop-filter: blur(4px);
}

.cal-dialog {
  position: relative;
  width: min(440px, 100%);
  max-height: calc(100dvh - 48px);
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  background: #07122c;
  color: #fff;
  font-family: var(--m-body, inherit);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

/* Mobil als Blatt von unten */
.cal-modal--mobile {
  place-items: end stretch;
  padding: 0;
}

.cal-modal--mobile .cal-dialog {
  width: 100%;
  max-height: 85dvh;
  border-radius: 22px 22px 0 0;
}

.cal-dialog__head {
  position: relative;
  display: grid;
  gap: 4px;
  padding: 22px 64px 20px 22px;
  border-left: 6px solid var(--team);
  background: color-mix(in srgb, var(--team) 22%, #07122c);
}

.cal-dialog__head::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5px;
  background: var(--place);
}

.cal-dialog__head.is-match {
  border-left-color: #fff;
  background:
    repeating-linear-gradient(135deg, transparent 0 12px, rgba(255, 255, 255, 0.16) 12px 24px),
    var(--team);
  color: var(--ink);
}

.cal-dialog__kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
}

.cal-dialog__title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
}

.cal-dialog__sub {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.85;
}

.cal-dialog__close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
  color: inherit;
  cursor: pointer;
}

.cal-dialog__close:hover,
.cal-dialog__close:focus-visible {
  background: rgba(0, 0, 0, 0.45);
}

.cal-dialog__facts {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 8px 22px;
}

.cal-dialog__facts div {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.08));
}

.cal-dialog__facts div:last-child {
  border-bottom: 0;
}

.cal-dialog__facts dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #9fb0d0;
}

.cal-dialog__facts dd {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.cal-dialog__place {
  width: 22px;
  height: 6px;
  border-radius: 3px;
  background: var(--place);
}

.cal-dialog__schedule {
  display: grid;
  gap: 8px;
  padding: 4px 22px 18px;
}

.cal-dialog__label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9fb0d0;
}

.cal-dialog__schedule ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cal-dialog__schedule li {
  position: relative;
  display: grid;
  grid-template-columns: 96px auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  padding: 9px 12px 12px;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
}

.cal-dialog__schedule li::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--place);
}

.cal-dialog__schedule span {
  font-variant-numeric: tabular-nums;
}

.cal-dialog__slotplace {
  justify-self: end;
  color: #c7d3ec;
}

.cal-dialog__link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 22px 22px;
  min-height: 48px;
  border-radius: 999px;
  background: var(--sv-secondary-color, #f4d047);
  color: #0a1530;
  font-weight: 800;
  text-decoration: none;
}
</style>
