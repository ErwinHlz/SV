<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowDown, ArrowRight, Layers } from "@lucide/vue";
import MobileNewsImage from "@/components/mobile/MobileNewsImage.vue";
import { openCookieSettings, useCookieConsent } from "@/composables/useCookieConsent";
import { getNewsItems } from "@/utils/contentEntries";
import { formatShortDate, getWeekInfo } from "@/utils/mobileFormat";
import { toMobileNews, type MobileNewsItem } from "@/utils/mobileNews";

const PAGE_SIZE = 12;

const { hasExternalMediaConsent } = useCookieConsent();
const visibleCount = ref(PAGE_SIZE);

const allNews = computed(() => getNewsItems().map(toMobileNews));
const featured = computed(() => allNews.value[0] ?? null);
const rest = computed(() => allNews.value.slice(1, visibleCount.value));
const hasMore = computed(() => allNews.value.length > visibleCount.value);
const hasInstagram = computed(() =>
  allNews.value.some((item) => item.source === "Instagram"),
);

type WeekGroup = {
  key: string;
  week: number;
  rangeLabel: string;
  items: Array<MobileNewsItem & { large: boolean }>;
};

// Gruppiert nach Kalenderwoche; jeder dritte Beitrag wird gross gezeigt.
const groups = computed(() => {
  const result: WeekGroup[] = [];

  rest.value.forEach((item, index) => {
    const info = getWeekInfo(item.date);
    const key = info?.key ?? "ohne-datum";
    let group = result.find((entry) => entry.key === key);

    if (!group) {
      group = {
        key,
        week: info?.week ?? 0,
        rangeLabel: info?.rangeLabel ?? "",
        items: [],
      };
      result.push(group);
    }

    group.items.push({ ...item, large: index % 3 === 0 });
  });

  return result;
});

const detailLink = (item: MobileNewsItem) => ({
  name: "news-detail",
  params: { slug: item.slug },
});
</script>

<template>
  <div class="m-page news">
    <div class="news__intro m-title-shrink">
      <p class="m-kicker">Aktuelles</p>
      <h1 class="m-display news__title">News</h1>
      <p class="news__lead">Neues aus dem Verein – direkt von unserem Instagram-Kanal.</p>
      <button
        v-if="hasInstagram && !hasExternalMediaConsent"
        type="button"
        class="news__consent"
        @click="openCookieSettings">
        Instagram-Bilder anzeigen
      </button>
    </div>

    <RouterLink v-if="featured" :to="detailLink(featured)" class="news-feature m-rv">
      <MobileNewsImage :item="featured" img-class="news-feature__image m-ipar" />
      <span class="news-feature__shade" aria-hidden="true"></span>
      <span class="news-feature__text">
        <span class="m-kicker">Neu · {{ formatShortDate(featured.date) }}</span>
        <span class="m-display news-feature__title">{{ featured.cleanTitle }}</span>
        <span class="news-feature__excerpt">{{ featured.cleanExcerpt }}</span>
        <span class="m-text-link">Weiterlesen <ArrowRight :size="18" :stroke-width="2" /></span>
      </span>
    </RouterLink>

    <section
      v-for="group in groups"
      :key="group.key"
      class="news-week"
      :aria-label="group.week ? `Kalenderwoche ${group.week}` : 'Weitere News'">
      <div class="news-week__head">
        <span class="news-week__label">
          <span class="news-week__kw">{{ group.week ? `KW ${group.week}` : "Weitere" }}</span>
          <span class="news-week__range">{{ group.rangeLabel }}</span>
        </span>
        <span class="news-week__count">
          {{ group.items.length }} {{ group.items.length === 1 ? "Beitrag" : "Beiträge" }}
        </span>
      </div>

      <div class="news-week__list">
        <template v-for="item in group.items" :key="item.id">
          <RouterLink v-if="item.large" :to="detailLink(item)" class="news-large m-rv">
            <span class="news-large__media">
              <MobileNewsImage :item="item" img-class="m-wipe" />
              <span v-if="item.isAlbum" class="news-large__album">
                <Layers :size="14" :stroke-width="2" /> Album
              </span>
            </span>
            <span class="news-large__text">
              <span class="news-meta">{{ formatShortDate(item.date) }}</span>
              <span class="m-display news-large__title">{{ item.cleanTitle }}</span>
              <span class="news-large__excerpt">{{ item.cleanExcerpt }}</span>
              <span class="m-text-link news-large__more">
                Weiterlesen <ArrowRight :size="16" :stroke-width="2" />
              </span>
            </span>
          </RouterLink>

          <RouterLink v-else :to="detailLink(item)" class="m-row news-compact m-rv">
            <span class="news-compact__media">
              <MobileNewsImage :item="item" />
            </span>
            <span class="news-compact__text">
              <span class="news-meta">
                {{ formatShortDate(item.date) }}<template v-if="item.isAlbum"> · Album</template>
              </span>
              <span class="news-compact__title">{{ item.cleanTitle }}</span>
              <span class="news-compact__excerpt">{{ item.cleanExcerpt }}</span>
            </span>
          </RouterLink>
        </template>
      </div>
    </section>

    <div class="news__more">
      <button v-if="hasMore" type="button" class="news__more-btn" @click="visibleCount += PAGE_SIZE">
        Ältere News laden <ArrowDown :size="18" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.news {
  padding-top: var(--m-header);
}

.news__intro {
  padding: 20px var(--m-gutter) 22px;
}

.news__title {
  margin: 2px 0 6px;
  font-size: 68px;
}

.news__lead {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.news__consent {
  margin-top: 8px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--m-yellow);
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.news-feature {
  position: relative;
  display: block;
  margin: 0 var(--m-gutter);
  height: 470px;
  border-radius: 28px;
  overflow: hidden;
  color: var(--m-text);
  text-decoration: none;
}

.news-feature :deep(.news-feature__image) {
  position: absolute;
  inset: 0;
  object-position: 50% 30%;
}

.news-feature__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.35) 0%,
    rgba(0, 6, 17, 0) 25%,
    rgba(0, 6, 17, 0.2) 45%,
    rgba(0, 6, 17, 0.95) 100%
  );
}

.news-feature__text {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-feature__title {
  font-size: 40px;
  line-height: 0.95;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-feature__excerpt {
  font-size: 15px;
  line-height: 1.45;
  color: #dbe3f3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-week {
  padding-top: 20px;
}

.news-week__head {
  position: sticky;
  top: var(--m-header);
  z-index: 10;
  padding: 12px var(--m-gutter) 10px;
  background: var(--m-bg);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.news-week__label {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.news-week__kw {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 24px;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.news-week__range {
  font-size: 14px;
  color: var(--m-text-2);
}

.news-week__count {
  font-size: 12px;
  color: var(--m-meta);
}

.news-week__list {
  padding: 4px var(--m-gutter) 0;
}

.news-meta {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.news-large {
  display: block;
  padding: 8px 0 22px;
  color: var(--m-text);
  text-decoration: none;
}

.news-large__media {
  position: relative;
  display: block;
  height: 230px;
  border-radius: 20px;
  overflow: hidden;
}

.news-large__album {
  position: absolute;
  right: 14px;
  top: 14px;
  padding: 4px 9px;
  border-radius: 8px;
  background: rgba(0, 6, 17, 0.7);
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.news-large__text {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-large__title {
  font-weight: 700;
  font-size: 27px;
  line-height: 1.02;
}

.news-large__excerpt {
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-large__more {
  min-height: 32px;
  font-size: 14px;
}

.news-compact {
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: start;
}

.news-compact__media {
  display: block;
  width: 96px;
  height: 120px;
  border-radius: 14px;
  overflow: hidden;
}

.news-compact__text {
  min-width: 0;
  padding-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-compact__title {
  font-weight: 700;
  font-size: 17px;
  line-height: 1.2;
}

.news-compact__excerpt {
  font-size: 13px;
  line-height: 1.45;
  color: var(--m-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news__more {
  padding: 16px var(--m-gutter) 56px;
}

.news__more-btn {
  width: 100%;
  min-height: 56px;
  border: 0;
  border-top: 1px solid var(--m-line);
  background: none;
  color: var(--m-yellow);
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}
</style>
