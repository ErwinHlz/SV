<script setup lang="ts">
import { computed } from "vue";
import { ChevronRight } from "@lucide/vue";
import type { TerminEntry } from "@/utils/contentEntries";
import {
  getDateParts,
  getOwnTeam,
  isOwnClub,
  ownTeamLabel,
} from "@/utils/mobileFormat";

const props = withDefaults(
  defineProps<{
    termin: TerminEntry;
    showCrests?: boolean;
  }>(),
  { showCrests: false },
);

const parts = computed(() => getDateParts(props.termin.date));
const isMatch = computed(() => Boolean(props.termin.homeTeam && props.termin.awayTeam));
const isHome = computed(() => isMatch.value && isOwnClub(props.termin.homeTeam));
const teamLabel = computed(() =>
  ownTeamLabel(isMatch.value ? getOwnTeam(props.termin.homeTeam, props.termin.awayTeam) : null),
);
</script>

<template>
  <RouterLink
    :to="{ name: 'termine-detail', params: { slug: termin.slug } }"
    class="m-row termin-row m-rv">
    <span class="termin-row__date m-flip" :class="{ 'is-home': isHome, 'is-event': !isMatch }">
      <span class="termin-row__weekday">{{ parts?.weekday }}</span>
      <span class="termin-row__day">{{ parts?.day }}</span>
      <span class="termin-row__month">{{ parts?.month }}</span>
    </span>

    <span class="termin-row__body">
      <span class="termin-row__meta">
        <template v-if="termin.time">{{ termin.time }} · </template>{{ teamLabel }}
        <template v-if="isMatch">
          · <strong :class="{ 'is-home': isHome }">{{ isHome ? "Heim" : "Auswärts" }}</strong>
        </template>
      </span>

      <template v-if="isMatch && showCrests">
        <span class="termin-row__team" :class="{ 'is-own': isOwnClub(termin.homeTeam) }">
          <span class="m-crest termin-row__crest"><img :src="termin.homeLogo" alt="" /></span>
          {{ termin.homeTeam }}
        </span>
        <span class="termin-row__team" :class="{ 'is-own': isOwnClub(termin.awayTeam) }">
          <span class="m-crest termin-row__crest"><img :src="termin.awayLogo" alt="" /></span>
          {{ termin.awayTeam }}
        </span>
      </template>
      <span v-else class="termin-row__title">
        {{ isMatch ? `${termin.homeTeam} – ${termin.awayTeam}` : termin.title }}
      </span>

      <span v-if="showCrests && (termin.competition || !isMatch)" class="termin-row__sub">
        {{ isMatch ? [termin.competition, termin.matchday].filter(Boolean).join(" · ") : termin.location }}
      </span>
    </span>

    <ChevronRight :size="18" :stroke-width="2" class="termin-row__chevron" />
  </RouterLink>
</template>

<style scoped>
.termin-row {
  grid-template-columns: 52px minmax(0, 1fr) 18px;
  padding: 18px 0;
}

.termin-row__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: start;
  padding-top: 2px;
}

.termin-row__weekday,
.termin-row__month {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.termin-row__day {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 38px;
  line-height: 1;
}

.termin-row__date.is-home .termin-row__day,
.termin-row__date.is-event .termin-row__day {
  color: var(--m-yellow);
}

.termin-row__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.termin-row__meta {
  font-size: 12px;
  color: var(--m-meta);
}

.termin-row__meta strong {
  color: var(--m-text-2);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.termin-row__meta strong.is-home {
  color: var(--m-yellow);
}

.termin-row__title {
  font-weight: 600;
  font-size: 16px;
}

.termin-row__team {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: var(--m-text-2);
}

.termin-row__team.is-own {
  color: var(--m-text);
  font-weight: 700;
}

.termin-row__crest {
  width: 24px;
  height: 24px;
}

.termin-row__sub {
  font-size: 12px;
  color: var(--m-meta);
}

.termin-row__chevron {
  color: var(--m-meta);
  align-self: center;
}
</style>
