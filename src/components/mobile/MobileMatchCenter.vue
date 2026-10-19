<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowUpRight, ArrowRight } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import { getMatchCenter, type MobileMatch } from "@/utils/mobileMatches";
import {
  daysUntil,
  formatCountdown,
  formatShortDate,
  isOwnClub,
  type OwnTeam,
} from "@/utils/mobileFormat";

const teams: Array<{ id: OwnTeam; label: string }> = [
  { id: "teamOne", label: "1. Mannschaft" },
  { id: "teamTwo", label: "2. Mannschaft" },
];

const activeTeam = ref<OwnTeam>("teamOne");
const centers = {
  teamOne: getMatchCenter("teamOne"),
  teamTwo: getMatchCenter("teamTwo"),
};
const center = computed(() => centers[activeTeam.value]);

const countdown = computed(() =>
  formatCountdown(daysUntil(center.value.primary?.date)),
);

const venue = (match: MobileMatch) => (match.isHome ? "Heim" : "Auswärts");

const terminLink = (match: MobileMatch) =>
  match.slug
    ? { name: "termine-detail", params: { slug: match.slug } }
    : { name: "termine" };
</script>

<template>
  <section id="spiele" class="mc" aria-label="Spielzentrale">
    <div class="mc__head m-rv">
      <p class="m-kicker">Spielzentrale</p>
      <h2 class="m-section-title">Letztes · Aktuell · Nächstes</h2>
    </div>

    <div class="mc__tabs" role="group" aria-label="Mannschaft wählen">
      <button
        v-for="team in teams"
        :key="team.id"
        type="button"
        class="mc__tab"
        :class="{ 'is-active': activeTeam === team.id }"
        :aria-pressed="activeTeam === team.id ? 'true' : 'false'"
        @click="activeTeam = team.id">
        {{ team.label }}
      </button>
    </div>

    <div class="mc__line">
      <div class="mc__rail" aria-hidden="true"></div>

      <article v-if="center.last" class="mc__last m-rv">
        <span class="mc__dot mc__dot--past" aria-hidden="true"></span>
        <div class="mc__meta">
          <span><strong>Letztes</strong> · {{ formatShortDate(center.last.date) }}</span>
          <span
            v-if="center.last.result"
            class="mc__result"
            :class="`mc__result--${center.last.result.toLowerCase()}`">
            {{ center.last.result }}
          </span>
        </div>
        <component
          :is="center.last.url ? 'a' : 'div'"
          :href="center.last.url"
          class="mc__score-row"
          :target="center.last.url ? '_blank' : undefined"
          :rel="center.last.url ? 'noreferrer' : undefined">
          <span class="mc__side mc__side--home" :class="{ 'is-own': isOwnClub(center.last.homeTeam) }">
            {{ center.last.homeTeam }}
            <span class="m-crest mc__crest-sm"><img :src="center.last.homeLogo" alt="" /></span>
          </span>
          <span class="mc__score">{{ center.last.score ?? "–:–" }}</span>
          <span class="mc__side" :class="{ 'is-own': isOwnClub(center.last.awayTeam) }">
            <span class="m-crest mc__crest-sm"><img :src="center.last.awayLogo" alt="" /></span>
            {{ center.last.awayTeam }}
          </span>
        </component>
      </article>

      <article v-if="center.primary" class="mc__primary m-rv">
        <span class="mc__dot mc__dot--now m-pulse" aria-hidden="true"></span>
        <div class="m-box mc__box">
          <CrestMark class="m-box__crest mc__box-crest" />
          <div class="mc__box-head">
            <span class="m-kicker">{{ center.primaryLabel }}</span>
            <span v-if="countdown" class="m-kicker">{{ countdown }}</span>
          </div>
          <div class="mc__teams">
            <div class="mc__team">
              <span class="m-crest mc__crest-lg">
                <img :src="center.primary.homeLogo" :alt="`${center.primary.homeTeam} Wappen`" />
              </span>
              <span class="mc__team-name">{{ center.primary.homeTeam }}</span>
            </div>
            <div class="mc__kickoff">
              <span class="mc__time">{{ center.primary.time || "–" }}</span>
              <span class="mc__date">{{ formatShortDate(center.primary.date) }}</span>
            </div>
            <div class="mc__team">
              <span class="m-crest mc__crest-lg">
                <img :src="center.primary.awayLogo" :alt="`${center.primary.awayTeam} Wappen`" />
              </span>
              <span class="mc__team-name">{{ center.primary.awayTeam }}</span>
            </div>
          </div>
          <div class="mc__info">
            <span>{{ center.primary.place }} · {{ venue(center.primary) }}</span>
            <span v-if="center.primary.competition">
              {{ center.primary.competition }}<template v-if="center.primary.matchday"> · {{ center.primary.matchday }}</template>
            </span>
          </div>
          <div v-if="center.primary.url" class="mc__cta">
            <a :href="center.primary.url" target="_blank" rel="noreferrer" class="m-text-link">
              Spiel auf FuPa <ArrowUpRight :size="16" :stroke-width="2" />
            </a>
          </div>
        </div>
      </article>

      <RouterLink
        v-if="center.secondary"
        :to="terminLink(center.secondary)"
        class="mc__next m-rv">
        <span class="mc__dot mc__dot--future" aria-hidden="true"></span>
        <div class="mc__meta">
          <span><strong>{{ center.secondaryLabel }}</strong> · {{ formatShortDate(center.secondary.date) }}</span>
          <span class="mc__venue" :class="{ 'is-home': center.secondary.isHome }">
            {{ venue(center.secondary) }}
          </span>
        </div>
        <div class="mc__next-row">
          <span class="mc__next-teams">
            {{ center.secondary.homeTeam }} – {{ center.secondary.awayTeam }}
          </span>
          <span class="mc__next-time">{{ center.secondary.time }}</span>
          <ArrowRight :size="18" :stroke-width="2" class="mc__next-arrow" />
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.mc {
  padding: 28px var(--m-gutter) 0;
}

.mc__tabs {
  margin-top: 14px;
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--m-line);
}

.mc__tab {
  min-height: 44px;
  padding: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: none;
  color: var(--m-muted);
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 22px;
  text-transform: uppercase;
  cursor: pointer;
}

.mc__tab.is-active {
  color: var(--m-text);
  border-bottom-color: var(--m-yellow);
}

.mc__line {
  position: relative;
  margin-top: 22px;
  padding-left: 28px;
}

.mc__rail {
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 30px;
  width: 2px;
  background: rgba(255, 255, 255, 0.14);
}

.mc__last,
.mc__primary,
.mc__next {
  position: relative;
  display: block;
}

.mc__last {
  padding-bottom: 20px;
}

.mc__primary {
  padding: 4px 0 6px;
}

.mc__next {
  padding-top: 20px;
  color: var(--m-text);
  text-decoration: none;
}

.mc__dot {
  position: absolute;
  left: -28px;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border-radius: 50%;
}

.mc__dot--past {
  top: 2px;
  background: #3a4866;
  border: 2px solid var(--m-bg);
}

.mc__dot--now {
  top: 28px;
  background: var(--m-yellow);
}

.mc__dot--future {
  top: 22px;
  background: var(--m-bg);
  border: 2px solid var(--m-yellow);
}

.mc__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.mc__meta strong {
  color: var(--m-text);
}

.mc__result,
.mc__venue {
  font-weight: 700;
}

.mc__result--sieg,
.mc__venue.is-home {
  color: var(--m-yellow);
}

.mc__result--remis {
  color: var(--m-text-2);
}

.mc__score-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.mc__side {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 15px;
  color: var(--m-text-2);
}

.mc__side--home {
  justify-content: flex-end;
  text-align: right;
}

.mc__side.is-own {
  color: var(--m-text);
  font-weight: 600;
}

.mc__crest-sm {
  width: 30px;
  height: 30px;
}

.mc__score {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 34px;
  line-height: 1;
}

.mc__box {
  padding: 20px 16px 12px;
}

.mc__box-crest {
  right: -70px;
  top: -50px;
  width: 240px;
  height: 240px;
  opacity: 0.1;
}

.mc__box-head {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.mc__teams {
  position: relative;
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
}

.mc__team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.mc__crest-lg {
  width: 70px;
  height: 70px;
}

.mc__team-name {
  font-weight: 600;
  font-size: 15px;
}

.mc__kickoff {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mc__time {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 52px;
  line-height: 0.9;
}

.mc__date {
  font-size: 13px;
  color: var(--m-text-2);
}

.mc__info {
  position: relative;
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--m-text-2);
  text-align: center;
}

.mc__cta {
  position: relative;
  margin-top: 8px;
  display: flex;
  justify-content: center;
}

.mc__next-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mc__next-teams {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 16px;
}

.mc__next-time {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 24px;
}

.mc__next-arrow {
  color: var(--m-meta);
}
</style>
