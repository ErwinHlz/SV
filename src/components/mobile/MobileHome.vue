<script setup lang="ts">
import { computed } from "vue";
import { ArrowDown, ArrowRight } from "@lucide/vue";
import heroImage from "@/assets/galerie/galerie_25.jpeg";
import MobileMatchCenter from "@/components/mobile/MobileMatchCenter.vue";
import MobileMemberBox from "@/components/mobile/MobileMemberBox.vue";
import MobileNewsImage from "@/components/mobile/MobileNewsImage.vue";
import MobileTerminRow from "@/components/mobile/MobileTerminRow.vue";
import { getNewsItems, getTerminItems } from "@/utils/contentEntries";
import { formatShortDate, isTodayOrLater } from "@/utils/mobileFormat";
import { toMobileNews } from "@/utils/mobileNews";

const news = computed(() => getNewsItems().slice(0, 6).map(toMobileNews));
const termine = getTerminItems()
  .filter((item) => isTodayOrLater(item.date))
  .slice(0, 3);

const scrollToMatches = () => {
  document.getElementById("spiele")?.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <div class="m-page home">
    <section class="home-hero">
      <img class="home-hero__image m-par" :src="heroImage" alt="Spieler des SV Ottweiler im Zweikampf" />
      <div class="home-hero__shade" aria-hidden="true"></div>
      <div class="home-hero__content m-fadeout">
        <p class="m-kicker">Bezirksliga Blies/Nahe · Saison 26/27</p>
        <h1 class="m-display home-hero__title">Blau-Gelb<br />seit 1919.</h1>
        <div class="home-hero__actions">
          <button type="button" class="m-btn" @click="scrollToMatches">
            Zu den Spielen <ArrowDown :size="18" :stroke-width="2" />
          </button>
          <RouterLink to="/mitglied-werden" class="home-hero__link">Mitglied werden</RouterLink>
        </div>
      </div>
    </section>

    <MobileMatchCenter />

    <div class="home-marquee" aria-hidden="true">
      <div class="home-marquee__line home-marquee__line--outline m-marquee">
        Blau-Gelb · seit 1919 · Blau-Gelb · seit 1919 ·
      </div>
      <div class="home-marquee__line m-marquee m-marquee--reverse">
        Ottweiler · Im Alten Weiher · Ottweiler ·
      </div>
    </div>

    <section v-if="news.length" class="home-news" aria-label="News">
      <div class="m-section-head m-rv">
        <div>
          <p class="m-kicker">Aktuelles</p>
          <h2 class="m-section-title">News</h2>
        </div>
        <RouterLink to="/news" class="m-more">
          Alle News <ArrowRight :size="16" :stroke-width="2" />
        </RouterLink>
      </div>
      <div class="m-rail">
        <RouterLink
          v-for="item in news"
          :key="item.id"
          :to="{ name: 'news-detail', params: { slug: item.slug } }"
          class="home-news__card m-ri">
          <MobileNewsImage :item="item" img-class="home-news__image" />
          <span class="home-news__kicker">{{ formatShortDate(item.date) }}<template v-if="item.isAlbum"> · Album</template></span>
          <span class="home-news__title">{{ item.cleanTitle }}</span>
        </RouterLink>
      </div>
    </section>

    <section v-if="termine.length" class="home-termine" aria-label="Termine">
      <div class="m-section-head home-termine__head m-rv">
        <div>
          <p class="m-kicker">Termine</p>
          <h2 class="m-section-title">Demnächst</h2>
        </div>
        <RouterLink to="/termine" class="m-more">
          Alle Termine <ArrowRight :size="16" :stroke-width="2" />
        </RouterLink>
      </div>
      <div class="home-termine__list">
        <MobileTerminRow v-for="termin in termine" :key="termin.id" :termin="termin" />
      </div>
    </section>

    <MobileMemberBox text="Für alle Altersgruppen – auf dem Platz, am Rand oder im Ehrenamt.">
      Werde Teil<br />von Blau-Gelb.
    </MobileMemberBox>

    <div class="home-end" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.home-hero {
  position: relative;
  height: 580px;
  overflow: hidden;
}

.home-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
}

.home-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.6) 0%,
    rgba(0, 6, 17, 0) 22%,
    rgba(0, 6, 17, 0.15) 50%,
    var(--m-bg) 96%
  );
}

.home-hero__content {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 36px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.home-hero__title {
  font-size: 72px;
  line-height: 0.88;
  letter-spacing: -0.01em;
}

.home-hero__actions {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 22px;
}

.home-hero__link {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  color: var(--m-text);
  font-weight: 600;
  font-size: 15px;
  text-decoration: underline;
  text-decoration-color: var(--m-yellow);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
}

.home-marquee {
  padding: 64px 0 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.home-marquee__line {
  white-space: nowrap;
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 88px;
  line-height: 0.9;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.home-marquee__line--outline {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(244, 208, 71, 0.55);
}

.home-news {
  padding-top: 48px;
}

.home-news__card {
  flex: 0 0 232px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--m-text);
  text-decoration: none;
}

.home-news__card :deep(.home-news__image) {
  width: 232px;
  height: 290px;
  border-radius: 20px;
}

.home-news__kicker {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.home-news__title {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.02;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-termine {
  padding-top: 52px;
}

.home-termine__head {
  margin-bottom: 4px;
}

.home-termine__list {
  margin: 0 var(--m-gutter);
  border-bottom: 1px solid var(--m-line);
}

.home-end {
  height: 56px;
}
</style>
