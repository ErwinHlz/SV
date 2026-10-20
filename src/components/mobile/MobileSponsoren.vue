<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import type { SponsorEntry } from "@/utils/sponsors";

defineProps<{ sponsors: SponsorEntry[] }>();

const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
</script>

<template>
  <div class="m-page sponsors">
    <div class="sponsors__intro m-title-shrink">
      <p class="m-kicker">Danke an unsere Partner</p>
      <h1 class="m-display sponsors__title">Sponsoren</h1>
    </div>

    <ul class="sponsors__list">
      <li v-for="sponsor in sponsors" :key="sponsor.id" class="m-rv">
        <a :href="sponsor.url" target="_blank" rel="noopener" class="sponsor-card">
          <span class="sponsor-card__logo">
            <img :src="sponsor.image" :alt="sponsor.imageAlt ?? sponsor.name" loading="lazy" />
          </span>
          <span class="sponsor-card__text">
            <span class="sponsor-card__name">{{ sponsor.name }}</span>
            <span class="sponsor-card__url">{{ domainOf(sponsor.url) }}</span>
          </span>
          <ArrowUpRight :size="20" :stroke-width="2" class="sponsor-card__arrow" />
        </a>
      </li>
    </ul>

    <section class="sponsors__cta" aria-label="Sponsor werden">
      <div class="m-box sponsors__box m-rv">
        <CrestMark class="m-box__crest sponsors__crest" />
        <p class="m-kicker">Partner werden</p>
        <h2 class="m-display sponsors__box-title">Ihr Logo<br />an unserem Platz.</h2>
        <RouterLink to="/sponsor/werden" class="m-btn sponsors__btn">
          Sponsor werden <ArrowRight :size="18" :stroke-width="2" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sponsors {
  padding-top: var(--m-header);
  padding-bottom: 56px;
}

.sponsors__intro {
  padding: 20px var(--m-gutter) 22px;
}

.sponsors__title {
  margin-top: 2px;
  font-size: 68px;
}

.sponsors__list {
  margin: 0;
  padding: 0 var(--m-gutter);
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sponsor-card {
  padding: 12px;
  border: 1px solid var(--m-line);
  border-radius: 20px;
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 14px;
  color: var(--m-text);
  text-decoration: none;
}

.sponsor-card__logo {
  height: 80px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 14px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sponsor-card__logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.sponsor-card__text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sponsor-card__name {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.05;
  text-transform: uppercase;
}

.sponsor-card__url {
  font-size: 13px;
  color: var(--m-meta);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sponsor-card__arrow {
  color: var(--m-yellow);
}

.sponsors__cta {
  padding: 56px var(--m-gutter) 0;
}

.sponsors__box {
  border-radius: 28px;
  padding: 30px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sponsors__crest {
  right: -70px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  opacity: 0.14;
}

.sponsors__box-title {
  position: relative;
  font-size: 44px;
  line-height: 0.92;
}

.sponsors__btn {
  position: relative;
  align-self: flex-start;
}
</style>
