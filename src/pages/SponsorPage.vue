<template>
  <PageHero
    :image="sponsorHero"
    title="Sponsoren"
    lead="Danke an alle Partner, die unseren Verein unterstuetzen." />
  <div class="sponsor-cta-wrap">
    <RouterLink to="/sponsor/werden" class="sponsor-cta">
      Sponsor werden
    </RouterLink>
  </div>
  <section class="sponsor-grid" aria-label="Sponsoren">
    <a
      v-for="sponsor in sponsors"
      :key="sponsor.id"
      class="sponsor-card"
      :href="sponsor.url"
      target="_blank"
      rel="noopener"
      :aria-label="sponsor.name">
      <div class="sponsor-logo">
        <img
          :src="sponsor.image"
          :alt="sponsor.imageAlt ?? sponsor.name"
          loading="lazy" />
      </div>
      <div class="sponsor-name">{{ sponsor.name }}</div>
    </a>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageHero from "@/components/PageHero.vue";
import sponsorHero from "@/assets/header/background.png";
import rawSponsors from "@/content/sponsor.json";
import sponsorAlpha from "@/assets/sponsor/sponsor-alpha.svg";
import sponsorBeta from "@/assets/sponsor/sponsor-beta.svg";
import sponsorGamma from "@/assets/sponsor/sponsor-gamma.svg";
import sponsorDelta from "@/assets/sponsor/sponsor-delta.svg";
import sponsorEpsilon from "@/assets/sponsor/sponsor-epsilon.svg";
import sponsorZeta from "@/assets/sponsor/sponsor-zeta.svg";

const logoMap: Record<string, string> = {
  sponsorAlpha,
  sponsorBeta,
  sponsorGamma,
  sponsorDelta,
  sponsorEpsilon,
  sponsorZeta,
};

const sponsors = computed(() =>
  rawSponsors.map((sponsor) => ({
    ...sponsor,
    image: logoMap[sponsor.image] ?? sponsor.image,
  }))
);
</script>

<style scoped>
.sponsor-grid {
  width: 80dvw;
  margin: 0 auto;
  padding: 0 clamp(18px, 8vw, 80px) clamp(48px, 8vw, 96px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.sponsor-cta-wrap {
  width: 80dvw;
  margin: 0 auto 3dvh;
  display: flex;
  justify-content: center;
}

.sponsor-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    background 0.25s ease, color 0.25s ease;
}

.sponsor-cta:hover,
.sponsor-cta:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}

.sponsor-card {
  display: grid;
  gap: 12px;
  align-items: center;
  padding: clamp(16px, 2vw, 24px);
  border-radius: 18px;
  text-decoration: none;
  color: var(--sv-text-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  filter: grayscale(1);
}

.sponsor-card:hover,
.sponsor-card:focus-visible {
  transform: translateY(-6px);
  border-color: rgba(244, 208, 71, 0.7);
  filter: none;
}

.sponsor-card:focus-visible {
  outline: 2px solid var(--sv-secondary-color);
  outline-offset: 3px;
}

.sponsor-logo {
  width: 100%;
  aspect-ratio: 3 / 2;
  display: grid;
  place-items: center;
  padding: clamp(12px, 1.8vw, 18px);
  border-radius: 14px;

  overflow: hidden;
}

.sponsor-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sponsor-name {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: clamp(11px, 1.1vw, 14px);
  font-weight: 700;
  color: var(--sv-secondary-color);
}
</style>
