<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import CookieConsentPopup from "./components/CookieConsentPopup.vue";
import GlobalSponsorAd from "./components/GlobalSponsorAd.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const disableGlobalSnap = computed(
  () =>
    route.path.startsWith("/teams/") &&
    !route.path.startsWith("/teams/jugend"),
);
const isJugendPage = computed(() => route.path.startsWith("/teams/jugend"));
const isStadionPage = computed(() => route.path === "/stadion");
const isVereinPage = computed(() => route.path === "/verein");
const isSponsorPage = computed(() => route.path.startsWith("/sponsor"));
const isMembershipPage = computed(() => route.path === "/mitglied-werden");
const isDatenschutzPage = computed(() => route.path === "/datenschutz");
const isContactPage = computed(() => route.path === "/contact");
const isContentDetailPage = computed(() =>
  ["news-detail", "termine-detail", "spielbericht-detail"].includes(
    String(route.name ?? ""),
  ),
);
const useInlineFooter = computed(
  () => isJugendPage.value || isVereinPage.value || isContactPage.value,
);
const keepPageContents = computed(
  () => isJugendPage.value,
);
const disablePageSnap = computed(
  () =>
    disableGlobalSnap.value ||
    isStadionPage.value ||
    isVereinPage.value ||
    isSponsorPage.value ||
    isMembershipPage.value ||
    isContactPage.value ||
    isDatenschutzPage.value ||
    isContentDetailPage.value,
);
</script>

<template>
  <SiteHeader />
  <CookieConsentPopup />
  <GlobalSponsorAd />
  <main
    class="app-content"
    :class="{
      'app-content--no-snap': disablePageSnap,
      'app-content--inline-flow': useInlineFooter,
      'app-content--page-contents': keepPageContents,
    }">
    <div class="app-page">
      <RouterView />
    </div>
    <section
      class="app-footer"
      :class="{ 'app-footer--inline': useInlineFooter }">
      <SiteFooter />
    </section>
  </main>
</template>

<style scoped>
.app-footer {
  width: 100%;
  flex: 0 0 auto;
}

:global(.app-footer.app-footer--inline) {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

:global(.app-content.app-content--no-snap) {
  scroll-snap-type: none;
}

:global(.app-content.app-content--inline-flow .app-page) {
  display: block;
  flex: 0 0 auto;
}

:global(.app-content.app-content--page-contents .app-page) {
  display: contents;
}
</style>
