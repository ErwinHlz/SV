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
</script>

<template>
  <SiteHeader />
  <main
    class="app-content"
    :class="{ 'app-content--no-snap': disableGlobalSnap }">
    <div class="app-page">
      <RouterView />
    </div>
    <section
      class="app-footer"
      :class="{ 'app-footer--inline': isJugendPage }">
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
</style>
