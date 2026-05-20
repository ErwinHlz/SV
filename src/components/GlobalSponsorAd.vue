<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { X } from "@lucide/vue";

const route = useRoute();
const isMobileAdOpen = ref(false);
let mobileMediaQuery: MediaQueryList | null = null;
const mobileAdPageviewKey = "sv-mobile-ad-pageviews";

const isMobileLayout = () => mobileMediaQuery?.matches ?? false;

const syncMobileAdState = () => {
  if (!isMobileLayout()) {
    isMobileAdOpen.value = false;
    return;
  }

  if (typeof window === "undefined") {
    isMobileAdOpen.value = false;
    return;
  }

  const nextCount =
    Number(window.sessionStorage.getItem(mobileAdPageviewKey) ?? "0") + 1;
  window.sessionStorage.setItem(mobileAdPageviewKey, String(nextCount));
  isMobileAdOpen.value = nextCount % 4 === 1;
};

const closeMobileAd = () => {
  isMobileAdOpen.value = false;
};

onMounted(() => {
  if (typeof window !== "undefined") {
    mobileMediaQuery = window.matchMedia("(max-width: 900px)");
    syncMobileAdState();
    mobileMediaQuery.addEventListener("change", syncMobileAdState);
  }
});

watch(
  () => route.fullPath,
  () => {
    syncMobileAdState();
  },
);

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener("change", syncMobileAdState);
});
</script>

<template>
  <aside class="global-sponsor-ad" aria-label="Werbefläche">
    <a class="global-sponsor-ad__link" href="/sponsor/werden">
      <span class="global-sponsor-ad__eyebrow">Werbung</span>
      <strong class="global-sponsor-ad__title">Dein Sponsor hier</strong>
      <span class="global-sponsor-ad__copy">Platzhalter für eine Partnerfläche</span>
    </a>
  </aside>

  <div
    v-if="isMobileAdOpen"
    class="global-sponsor-ad-mobile"
    aria-label="Werbefläche mobil">
    <a class="global-sponsor-ad-mobile__panel" href="/sponsor/werden">
      <span class="global-sponsor-ad-mobile__eyebrow">Werbung</span>
      <strong class="global-sponsor-ad-mobile__title">Dein Sponsor hier</strong>
      <span class="global-sponsor-ad-mobile__copy">
        Platzhalter für eine prominente Partnerfläche auf der Website.
      </span>
      <span class="global-sponsor-ad-mobile__cta">Sponsor werden</span>
    </a>

    <button
      type="button"
      class="global-sponsor-ad-mobile__close"
      @click="closeMobileAd"
      aria-label="Werbung schließen">
      <X :size="20" :stroke-width="2.4" />
    </button>
  </div>
</template>

<style scoped>
.global-sponsor-ad {
  position: fixed;
  left: clamp(14px, 1.6vw, 22px);
  top: 50%;
  z-index: 70;
  transform: translateY(-50%);
  pointer-events: none;
}

.global-sponsor-ad__link {
  width: clamp(120px, 10vw, 156px);
  min-height: clamp(360px, 50vh, 520px);
  display: grid;
  align-content: end;
  gap: 0.65rem;
  padding: 1rem 0.95rem 1.1rem;
  border-radius: 20px;
  background: linear-gradient(180deg, #ff9f2f 0%, #ff7a00 100%);
  color: #1f1400;
  text-decoration: none;
  box-shadow: 0 22px 42px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(120, 54, 0, 0.16);
  pointer-events: auto;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.global-sponsor-ad__link:hover,
.global-sponsor-ad__link:focus-visible {
  transform: translateX(4px);
  box-shadow: 0 26px 48px rgba(0, 0, 0, 0.26);
  filter: saturate(1.05);
}

.global-sponsor-ad__link:focus-visible {
  outline: 2px solid #fff5da;
  outline-offset: 4px;
}

.global-sponsor-ad__eyebrow {
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.global-sponsor-ad__title {
  font-size: clamp(1.25rem, 1.8vw, 1.65rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  text-wrap: balance;
}

.global-sponsor-ad__copy {
  font-size: 0.82rem;
  line-height: 1.35;
  color: rgba(31, 20, 0, 0.8);
}

.global-sponsor-ad-mobile {
  display: none;
}

@media (max-width: 900px) {
  .global-sponsor-ad {
    display: none;
  }

  .global-sponsor-ad-mobile {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background: linear-gradient(180deg, #ff9f2f 0%, #ff7a00 100%);
  }

  .global-sponsor-ad-mobile__panel {
    width: 100%;
    min-height: 100dvh;
    display: grid;
    align-content: end;
    gap: 0.8rem;
    padding: 1.5rem 1.2rem calc(4.5rem + env(safe-area-inset-bottom, 0px));
    color: #1f1400;
    text-decoration: none;
  }

  .global-sponsor-ad-mobile__eyebrow {
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .global-sponsor-ad-mobile__title {
    font-size: clamp(2.2rem, 11vw, 3.5rem);
    line-height: 0.92;
    letter-spacing: -0.06em;
    text-wrap: balance;
  }

  .global-sponsor-ad-mobile__copy {
    max-width: 24rem;
    font-size: 1rem;
    line-height: 1.45;
    color: rgba(31, 20, 0, 0.82);
  }

  .global-sponsor-ad-mobile__cta {
    width: fit-content;
    margin-top: 0.25rem;
    padding: 0.82rem 1rem;
    border-radius: 999px;
    background: rgba(255, 248, 225, 0.9);
    color: #5e2e00;
    font-weight: 800;
  }

  .global-sponsor-ad-mobile__close {
    position: absolute;
    right: 14px;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
    width: 46px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba(31, 20, 0, 0.88);
    color: #fff7df;
    cursor: pointer;
  }
}
</style>
