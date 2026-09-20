<template>
  <svg class="match-spielbericht-poster" viewBox="0 0 1254 1254" role="img" :aria-label="description">
    <title>{{ description }}</title>
    <image :href="template" width="1254" height="1254" />
    <g v-for="(team, index) in teams" :key="index">
      <image v-if="team.logo && !failedLogos[team.logo]" :href="team.logo" :x="team.x - 150" y="587" width="300" height="300" @error="failedLogos[team.logo] = true" />
      <text v-else :x="team.x" y="765" font-size="68">{{ initials(team.name) }}</text>
    </g>
    <text x="529" y="799" :font-size="fit(homeScore, 130, 85)">{{ homeScore }}</text>
    <text x="723" y="799" :font-size="fit(awayScore, 130, 85)">{{ awayScore }}</text>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import template from "@/assets/Spielberichte_template.png";
import { formatDate } from "@/utils/date";
import type { SpielberichtEntry } from "@/utils/contentEntries";

type PosterEntry = SpielberichtEntry & { homeLogo?: string; awayLogo?: string };

const props = defineProps<{ item: PosterEntry }>();
const failedLogos = ref<Record<string, boolean>>({});
const teams = computed(() => [
  { name: props.item.homeTeam || "Heimteam", logo: props.item.homeLogo, x: 247 },
  { name: props.item.awayTeam || "Gastteam", logo: props.item.awayLogo, x: 1007 },
]);
const scoreParts = computed(() => {
  const parts = (props.item.result || "-:-").split(":");
  return { home: parts[0]?.trim() || "-", away: parts[1]?.trim() || "-" };
});
const homeScore = computed(() => scoreParts.value.home);
const awayScore = computed(() => scoreParts.value.away);
const description = computed(() => [
  "Spielbericht",
  `${props.item.homeTeam} ${props.item.result || ""} ${props.item.awayTeam}`.trim(),
  formatDate(props.item.date),
  props.item.location,
].filter(Boolean).join(" · "));
const fit = (text: string, max: number, width: number) => Math.min(max, width / Math.max(text.length * 0.64, 1));
const initials = (name: string) => name.split(/\s+/).map(word => word[0]).join("").slice(0, 4);
</script>

<style scoped>
.match-spielbericht-poster {
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
