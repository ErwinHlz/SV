<template>
  <svg class="match-termin-poster" viewBox="0 0 1254 1254" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="description">
    <title>{{ description }}</title>
    <image :href="template" width="1254" height="1254" />
    <text x="627" y="160" :font-size="fit(item.competition || 'Spielankündigung', 48, 850)">{{ item.competition || 'Spielankündigung' }}</text>
    <text x="627" y="355" fill="#151515" :font-size="fit(item.matchday || 'Spieltag', 76, 780)">{{ item.matchday || 'Spieltag' }}</text>
    <text x="627" y="500" font-size="46">{{ formatDate(item.date) }}</text>
    <g v-for="(team, index) in teams" :key="index">
      <image v-if="team.logo && !failedLogos[team.logo]" :href="team.logo" :x="team.x - 130" y="645" width="260" height="260" @error="failedLogos[team.logo] = true" />
      <text v-else :x="team.x" y="805" font-size="62">{{ initials(team.name) }}</text>
      <text :x="team.x" y="1010" :font-size="fit(team.name, 38, 475)">{{ team.name }}</text>
    </g>
    <text x="627" y="1148" fill="#151515" font-size="46">{{ item.time ? `${item.time} Uhr` : 'Anstoß offen' }}</text>
    <text x="627" y="1195" fill="#151515" :font-size="fit(item.location || 'Spielort folgt', 27, 430)">{{ item.location || 'Spielort folgt' }}</text>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import template from "@/assets/Spieltag Template.png";
import { formatDate } from "@/utils/date";
import type { TerminEntry } from "@/utils/contentEntries";
const props = defineProps<{ item: TerminEntry }>();
const failedLogos = ref<Record<string, boolean>>({});
const teams = computed(() => [
  { name: props.item.homeTeam || "Heimteam", logo: props.item.homeLogo, x: 368 },
  { name: props.item.awayTeam || "Gastteam", logo: props.item.awayLogo, x: 884 },
]);
const description = computed(() => [props.item.competition, props.item.matchday,
  `${props.item.homeTeam} gegen ${props.item.awayTeam}`, formatDate(props.item.date),
  props.item.time && `${props.item.time} Uhr`, props.item.location].filter(Boolean).join(" · "));
const fit = (text: string, max: number, width: number) => Math.min(max, width / Math.max(text.length * 0.64, 1));
const initials = (name: string) => name.split(/\s+/).map(word => word[0]).join("").slice(0, 4);
</script>

<style scoped>
.match-termin-poster {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  background: #181818;
  font-family: Arial, sans-serif;
  font-weight: 800;
  fill: #fff;
  text-anchor: middle;
}
</style>
