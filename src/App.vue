<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import CookieConsentPopup from "./components/CookieConsentPopup.vue";
import GlobalSponsorAd from "./components/GlobalSponsorAd.vue";
import MobileHeader from "./components/mobile/MobileHeader.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useIsMobile } from "./composables/useIsMobile";

const route = useRoute();
const isMobile = useIsMobile();
const isJugendPage = computed(() => route.path.startsWith("/teams/jugend"));
const isVereinPage = computed(() => route.path === "/verein");
const isMembershipPage = computed(() => route.path === "/mitglied-werden");
const isContactPage = computed(() => route.path === "/contact");
const useInlineFooter = computed(
  () =>
    isJugendPage.value ||
    isVereinPage.value ||
    isContactPage.value ||
    isMembershipPage.value,
);
const keepPageContents = computed(
  () => isJugendPage.value,
);
</script>

<template>
  <MobileHeader v-if="isMobile" />
  <SiteHeader v-else />
  <CookieConsentPopup />
  <GlobalSponsorAd />
  <main
    class="app-content"
    :class="{
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

:global(.app-content.app-content--inline-flow .app-page) {
  display: block;
  flex: 0 0 auto;
}

:global(.app-content.app-content--page-contents .app-page) {
  display: contents;
}
</style>
