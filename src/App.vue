<script setup lang="ts">
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
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
const isContentDetailPage = computed(() =>
  ["news-detail", "termine-detail", "spielbericht-detail"].includes(
    String(route.name ?? ""),
  ),
);
const useInlineFooter = computed(
  () => isJugendPage.value || isVereinPage.value,
);
const disablePageSnap = computed(
  () =>
    disableGlobalSnap.value ||
    isJugendPage.value ||
    isStadionPage.value ||
    isVereinPage.value ||
    isSponsorPage.value ||
    isContentDetailPage.value,
);
</script>

<template>
  <SiteHeader />
  <main
    class="app-content"
    :class="{
      'app-content--no-snap': disablePageSnap,
      'app-content--inline-flow': useInlineFooter,
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
  scroll-snap-align: unset;
  scroll-snap-stop: normal;
}

:global(.app-content.app-content--no-snap) {
  scroll-snap-type: none;
}

:global(.app-content.app-content--inline-flow) {
  scroll-snap-type: none;
}

:global(.app-content.app-content--inline-flow .app-page) {
  display: block;
  flex: 0 0 auto;
}
</style>
