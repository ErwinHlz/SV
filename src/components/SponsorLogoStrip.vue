<template>
  <div
    v-if="advertisingEnabled"
    class="sponsor-strip"
    :class="{ 'sponsor-strip--mobile-grid': mobileGrid }"
    aria-label="Unsere Sponsoren">
    <a
      v-for="sponsor in sponsors"
      :key="sponsor.id"
      class="sponsor-strip__item"
      :href="sponsor.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`${sponsor.name} Website öffnen`">
      <img
        class="sponsor-strip__logo"
        :src="sponsor.image"
        :alt="sponsor.imageAlt ?? sponsor.name"
        loading="lazy" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSponsors } from "@/utils/sponsors";
import { advertisingEnabled } from "@/utils/advertising";

withDefaults(
  defineProps<{
    mobileGrid?: boolean;
  }>(),
  {
    mobileGrid: false,
  },
);

const sponsors = computed(() => getSponsors());
</script>

<style scoped>
.sponsor-strip {
  width: min(80dvw, 1200px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(18px, 3vw, 42px);
  flex-wrap: wrap;
}

.sponsor-strip__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  text-decoration: none;
  transition: transform 0.28s ease;
}

.sponsor-strip__item:hover,
.sponsor-strip__item:focus-visible {
  transform: translateY(-3px);
}

.sponsor-strip__item:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 4px;
}

.sponsor-strip__logo {
  width: auto;
  height: clamp(34px, 4vw, 56px);
  max-width: clamp(110px, 12vw, 180px);
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.92;
  transition:
    filter 0.28s ease,
    opacity 0.28s ease,
    transform 0.28s ease;
}

.sponsor-strip__item:hover .sponsor-strip__logo,
.sponsor-strip__item:focus-visible .sponsor-strip__logo {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.03);
}

@media (max-width: 700px) {
  .sponsor-strip:not(.sponsor-strip--mobile-grid) {
    width: calc(100% - 2rem);
    justify-content: flex-start;
    gap: 18px;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
  }

  .sponsor-strip:not(.sponsor-strip--mobile-grid)::-webkit-scrollbar {
    display: none;
  }

  .sponsor-strip:not(.sponsor-strip--mobile-grid) .sponsor-strip__item {
    flex: 0 0 auto;
  }

  .sponsor-strip:not(.sponsor-strip--mobile-grid) .sponsor-strip__logo {
    height: 32px;
    max-width: 120px;
  }

  .sponsor-strip--mobile-grid {
    width: calc(100% - 2.4rem);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 20px;
    justify-items: center;
  }

  .sponsor-strip--mobile-grid .sponsor-strip__item {
    width: 100%;
    min-height: 96px;
  }

  .sponsor-strip--mobile-grid .sponsor-strip__logo {
    height: 48px;
    max-width: 160px;
  }
}
</style>
