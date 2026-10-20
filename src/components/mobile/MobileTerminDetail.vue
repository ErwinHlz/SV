<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft, ArrowUpRight, CalendarPlus, MapPin } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import MobileTerminRow from "@/components/mobile/MobileTerminRow.vue";
import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";
import {
  daysUntil,
  formatCountdown,
  formatLongDate,
  getOwnTeam,
  isOwnClub,
  isTodayOrLater,
  ownTeamLabel,
} from "@/utils/mobileFormat";
import { downloadIcs, isMatchTermin, mapsUrl } from "@/utils/mobileTermine";
import { initials } from "@/utils/mobileReports";

const props = defineProps<{ item: TerminEntry }>();

const isMatch = computed(() => isMatchTermin(props.item));
const isHome = computed(() => isMatch.value && isOwnClub(props.item.homeTeam));
const isPast = computed(() => !isTodayOrLater(props.item.date));
const countdown = computed(() => formatCountdown(daysUntil(props.item.date)));
const kicker = computed(() =>
  isMatch.value
    ? `${ownTeamLabel(getOwnTeam(props.item.homeTeam, props.item.awayTeam))} · ${isHome.value ? "Heimspiel" : "Auswärts"}`
    : "Vereinstermin",
);

const paragraphs = computed(() =>
  (props.item.content || props.item.excerpt || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean),
);

// Bei Spielen ist das Bild nur das generierte Plakat - das ersetzt mobil das Scoreboard.
const image = computed(() => (props.item.isMatchTemplate ? undefined : props.item.image));

const next = computed(() =>
  getTerminItems()
    .filter((entry) => entry.slug !== props.item.slug && isTodayOrLater(entry.date))
    .slice(0, 3),
);
</script>

<template>
  <article class="m-page termin">
    <div class="termin__head">
      <RouterLink to="/termine" class="termin__back">
        <ArrowLeft :size="18" :stroke-width="2" /> Alle Termine
      </RouterLink>
      <p class="m-kicker">{{ kicker }}</p>
      <h1 v-if="!isMatch" class="m-display termin__title">{{ item.title }}</h1>
    </div>

    <div v-if="isMatch" class="termin__match">
      <div class="m-box termin-box">
        <CrestMark class="m-box__crest termin-box__crest" />
        <div class="termin-box__head">
          <span class="m-kicker">{{ item.competition || "Spiel" }}<template v-if="item.matchday"> · {{ item.matchday }}</template></span>
          <span v-if="countdown" class="m-kicker">{{ countdown }}</span>
          <span v-else-if="isPast" class="termin-box__past">Vorbei</span>
        </div>
        <div class="termin-box__teams">
          <div class="termin-box__team">
            <span class="m-crest termin-box__logo">
              <img v-if="item.homeLogo" :src="item.homeLogo" :alt="`${item.homeTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(item.homeTeam) }}</span>
            </span>
            <span class="termin-box__name" :class="{ 'is-own': isOwnClub(item.homeTeam) }">{{ item.homeTeam }}</span>
          </div>
          <div class="termin-box__kickoff">
            <span class="termin-box__time">{{ item.time || "–" }}</span>
            <span class="termin-box__date">Uhr</span>
          </div>
          <div class="termin-box__team">
            <span class="m-crest termin-box__logo">
              <img v-if="item.awayLogo" :src="item.awayLogo" :alt="`${item.awayTeam} Wappen`" />
              <span v-else class="m-crest-initials">{{ initials(item.awayTeam) }}</span>
            </span>
            <span class="termin-box__name" :class="{ 'is-own': isOwnClub(item.awayTeam) }">{{ item.awayTeam }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="image" class="termin__image">
      <img class="m-zoom" :src="image" :alt="item.imageAlt" />
    </div>

    <dl class="termin-facts">
      <div>
        <dt>Datum</dt>
        <dd>{{ formatLongDate(item.date) }}</dd>
      </div>
      <div v-if="item.time">
        <dt>Uhrzeit</dt>
        <dd>{{ item.time }} Uhr</dd>
      </div>
      <div v-if="item.location">
        <dt>Ort</dt>
        <dd>{{ item.location }}</dd>
      </div>
    </dl>

    <div v-if="!isPast" class="termin-actions">
      <button type="button" class="m-btn termin-actions__main" @click="downloadIcs(item)">
        <CalendarPlus :size="18" :stroke-width="2" /> In Kalender
      </button>
      <a :href="mapsUrl(item)" target="_blank" rel="noreferrer" class="termin-actions__ghost">
        <MapPin :size="18" :stroke-width="2" /> Anfahrt
      </a>
    </div>

    <div v-if="paragraphs.length && !isMatch" class="termin__body">
      <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
    </div>

    <a
      v-if="item.externalUrl"
      :href="item.externalUrl"
      target="_blank"
      rel="noreferrer"
      class="m-text-link termin__source">
      {{ item.source ? `Auf ${item.source} ansehen` : "Originalbeitrag öffnen" }}
      <ArrowUpRight :size="16" :stroke-width="2" />
    </a>

    <section v-if="next.length" class="termin__next" aria-label="Weitere Termine">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">Termine</p>
          <h2 class="m-section-title">Demnächst</h2>
        </div>
      </div>
      <div class="termin__next-list">
        <MobileTerminRow v-for="entry in next" :key="entry.id" :termin="entry" />
      </div>
    </section>
  </article>
</template>

<style scoped>
.termin {
  padding-top: var(--m-header);
  padding-bottom: 56px;
}

.termin__head {
  padding: 8px var(--m-gutter) 18px;
}

.termin__back {
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

.termin__title {
  margin-top: 8px;
  font-size: 46px;
  overflow-wrap: anywhere;
}

.termin__match {
  padding: 0 var(--m-gutter);
}

.termin-box {
  padding: 20px 16px 22px;
}

.termin-box__crest {
  right: -60px;
  bottom: -70px;
  width: 240px;
  height: 240px;
}

.termin-box__head {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.termin-box__head > :last-child:not(:first-child) {
  flex: none;
  white-space: nowrap;
}

.termin-box__past {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-muted);
}

.termin-box__teams {
  position: relative;
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: start;
  gap: 8px;
}

.termin-box__team {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.termin-box__logo {
  width: 72px;
  height: 72px;
}

.termin-box__name {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.25;
  color: var(--m-text-2);
  overflow-wrap: anywhere;
}

.termin-box__name.is-own {
  color: var(--m-text);
  font-weight: 700;
}

.termin-box__kickoff {
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.termin-box__time {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 44px;
  line-height: 1;
}

.termin-box__date {
  font-size: 12px;
  font-weight: 600;
  color: var(--m-meta);
}

.termin__image {
  margin: 0 var(--m-gutter);
  height: 240px;
  border-radius: 20px;
  overflow: hidden;
}

.termin__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.termin-facts {
  margin: 22px var(--m-gutter) 0;
  border-top: 1px solid var(--m-line);
}

.termin-facts > div {
  padding: 12px 0;
  border-bottom: 1px solid var(--m-line);
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  font-size: 15px;
}

.termin-facts dt {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.termin-facts dd {
  margin: 0;
  font-weight: 600;
}

.termin-actions {
  margin: 20px var(--m-gutter) 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.termin-actions__ghost {
  min-height: 48px;
  border: 1.5px solid var(--m-line);
  border-radius: 14px;
  color: var(--m-text);
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.termin__body {
  padding: 24px var(--m-gutter) 0;
}

.termin__body p {
  margin: 0 0 14px;
  font-size: 16px;
  line-height: 1.65;
  color: #dbe3f3;
}

.termin__source {
  margin: 8px var(--m-gutter) 0;
}

.termin__next {
  padding-top: 48px;
}

.termin__next-list {
  padding: 0 var(--m-gutter);
}
</style>
