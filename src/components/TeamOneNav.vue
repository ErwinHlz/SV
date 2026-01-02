<template>
  <nav class="team-nav" :aria-label="`${teamLabel} Navigation`">
    <div class="team-nav-shell" role="list">
      <RouterLink
        v-for="item in items"
        :key="item.slug"
        class="team-nav-link"
        :to="`${normalizedBase}/${item.slug}`"
        role="listitem">
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    basePath?: string;
    teamLabel?: string;
  }>(),
  {
    basePath: "/teams/one",
    teamLabel: "1. Mannschaft",
  }
);

const normalizedBase = computed(() => props.basePath.replace(/\/$/, ""));

const items = [
  { label: "Kader", slug: "kader" },
  { label: "Spielplan", slug: "spielplan" },
  { label: "Tabelle", slug: "tabelle" },
];
</script>

<style scoped>
.team-nav {
  margin: -3dvh auto 4dvh;
  padding: 0 clamp(16px, 6vw, 48px);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.team-nav-shell {
  width: 80dvw;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  border-radius: 5px;

  background: linear-gradient(
    135deg,
    rgba(2, 43, 121, 0.95),
    rgba(2, 43, 121, 0.65)
  );
  border: 1px solid rgba(244, 208, 71, 0.35);
  box-shadow: 0 18px 32px rgba(2, 43, 121, 0.35);
  position: relative;
  overflow: hidden;
  animation: team-nav-rise 0.6s ease both;
}

.team-nav-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top,
    rgba(244, 208, 71, 0.25),
    transparent 60%
  );
  opacity: 0.6;
  pointer-events: none;
}

.team-nav-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;

  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  font-size: clamp(11px, 1.6vw, 14px);
  color: var(--sv-text-color);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, color 0.25s ease, background 0.25s ease,
    box-shadow 0.25s ease, border-color 0.25s ease;
}

.team-nav-link:hover,
.team-nav-link:focus-visible {
  color: var(--sv-secondary-color);
  background: rgba(2, 43, 121, 0.7);
  border-color: rgba(244, 208, 71, 0.45);
}

.team-nav-link.is-active,
.team-nav-link.is-exact-active {
  color: var(--sv-primary-color);
  background: var(--sv-secondary-color);
  border-color: transparent;
  box-shadow: 0 14px 26px rgba(244, 208, 71, 0.35);
}

@keyframes team-nav-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .team-nav-shell {
    animation: none;
  }

  .team-nav-link {
    transition: none;
  }
}

@media (max-width: 520px) {
  .team-nav-shell {
    border-radius: 24px;
  }
}
</style>
