<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { X } from "@lucide/vue";
import { advertisingEnabled } from "@/utils/advertising";

const route = useRoute();
const isOverlayAdOpen = ref(false);
const touchStartX = ref<number | null>(null);
const touchStartY = ref<number | null>(null);
const swipeOffsetY = ref(0);
const isSwipeGesture = ref(false);
let overlayMediaQuery: MediaQueryList | null = null;
const overlayAdPageviewKey = "sv-overlay-ad-pageviews";
const swipeDismissThreshold = 72;

const usesOverlayAd = () => advertisingEnabled && (overlayMediaQuery?.matches ?? false);
const mobilePanelStyle = computed(() => ({
  transform: `translateY(${swipeOffsetY.value}px)`,
  opacity: String(Math.max(0, 1 - Math.abs(swipeOffsetY.value) / 220)),
}));

const syncOverlayAdState = () => {
  if (!usesOverlayAd()) {
    isOverlayAdOpen.value = false;
    swipeOffsetY.value = 0;
    return;
  }

  if (typeof window === "undefined") {
    isOverlayAdOpen.value = false;
    swipeOffsetY.value = 0;
    return;
  }

  const nextCount =
    Number(window.sessionStorage.getItem(overlayAdPageviewKey) ?? "0") + 1;
  window.sessionStorage.setItem(overlayAdPageviewKey, String(nextCount));
  isOverlayAdOpen.value = nextCount % 4 === 1;
};

const closeOverlayAd = () => {
  isOverlayAdOpen.value = false;
  swipeOffsetY.value = 0;
  isSwipeGesture.value = false;
  touchStartX.value = null;
  touchStartY.value = null;
};

const resetSwipeTracking = () => {
  swipeOffsetY.value = 0;
  isSwipeGesture.value = false;
  touchStartX.value = null;
  touchStartY.value = null;
};

const handleTouchStart = (event: TouchEvent) => {
  const [touch] = event.changedTouches;
  if (!touch) {
    return;
  }

  touchStartX.value = touch.clientX;
  touchStartY.value = touch.clientY;
  swipeOffsetY.value = 0;
  isSwipeGesture.value = false;
};

const handleTouchMove = (event: TouchEvent) => {
  const [touch] = event.changedTouches;
  if (
    !touch ||
    touchStartX.value === null ||
    touchStartY.value === null
  ) {
    return;
  }

  const deltaX = touch.clientX - touchStartX.value;
  const deltaY = touch.clientY - touchStartY.value;

  if (Math.abs(deltaY) <= Math.abs(deltaX) || Math.abs(deltaY) < 8) {
    return;
  }

  isSwipeGesture.value = true;
  swipeOffsetY.value = deltaY;
};

const handleTouchEnd = () => {
  if (!isSwipeGesture.value) {
    resetSwipeTracking();
    return;
  }

  if (Math.abs(swipeOffsetY.value) >= swipeDismissThreshold) {
    closeOverlayAd();
    return;
  }

  resetSwipeTracking();
};

const handlePanelClick = (event: MouseEvent) => {
  if (!isSwipeGesture.value) {
    return;
  }

  event.preventDefault();
  resetSwipeTracking();
};

onMounted(() => {
  if (!advertisingEnabled) {
    return;
  }

  if (typeof window !== "undefined") {
    overlayMediaQuery = window.matchMedia("(max-width: 1240px)");
    syncOverlayAdState();
    overlayMediaQuery.addEventListener("change", syncOverlayAdState);
  }
});

watch(
  () => route.fullPath,
  () => {
    syncOverlayAdState();
  },
);

onBeforeUnmount(() => {
  overlayMediaQuery?.removeEventListener("change", syncOverlayAdState);
});
</script>

<template>
  <aside v-if="advertisingEnabled" class="global-sponsor-ad" aria-label="Werbefläche">
    <a class="global-sponsor-ad__link" href="/sponsor/werden">
      <span class="global-sponsor-ad__eyebrow">Werbung</span>
      <strong class="global-sponsor-ad__title">Dein Sponsor hier</strong>
      <span class="global-sponsor-ad__copy">Platzhalter für eine Partnerfläche</span>
    </a>
  </aside>

  <div
    v-if="advertisingEnabled && isOverlayAdOpen"
    class="global-sponsor-ad-mobile"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
    aria-label="Werbefläche mobil">
    <a
      class="global-sponsor-ad-mobile__panel"
      :style="mobilePanelStyle"
      href="/sponsor/werden"
      @click="handlePanelClick">
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
      @click="closeOverlayAd"
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

@media (max-width: 1240px) {
  .global-sponsor-ad {
    display: none;
  }

  .global-sponsor-ad-mobile {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(7, 18, 44, 0.48);
  }

  .global-sponsor-ad-mobile__panel {
    width: min(560px, calc(100dvw - 48px));
    min-height: min(520px, calc(100dvh - 48px));
    display: grid;
    align-content: end;
    gap: 0.8rem;
    padding: 1.75rem 1.5rem calc(5rem + env(safe-area-inset-bottom, 0px));
    border-radius: 28px;
    background: linear-gradient(180deg, #ff9f2f 0%, #ff7a00 100%);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
    color: #1f1400;
    text-decoration: none;
    touch-action: pan-y;
    transition:
      transform 0.18s ease-out,
      opacity 0.18s ease-out;
    will-change: transform, opacity;
  }

  .global-sponsor-ad-mobile__eyebrow {
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .global-sponsor-ad-mobile__title {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
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
    right: max(18px, calc(50dvw - min(280px, calc((100dvw - 48px) / 2)) + 10px));
    top: max(18px, calc(50dvh - min(260px, calc((100dvh - 48px) / 2)) + 10px));
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

@media (max-width: 900px) {
  .global-sponsor-ad-mobile {
    align-items: stretch;
    justify-content: stretch;
    padding: 0;
    background: linear-gradient(180deg, #ff9f2f 0%, #ff7a00 100%);
  }

  .global-sponsor-ad-mobile__panel {
    width: 100%;
    min-height: 100dvh;
    padding: 1.5rem 1.2rem calc(4.5rem + env(safe-area-inset-bottom, 0px));
    border-radius: 0;
    box-shadow: none;
  }

  .global-sponsor-ad-mobile__title {
    font-size: clamp(2.2rem, 11vw, 3.5rem);
  }

  .global-sponsor-ad-mobile__close {
    right: 14px;
    top: auto;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
  }
}
</style>
