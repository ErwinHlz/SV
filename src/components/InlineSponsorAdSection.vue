<template>
  <section v-if="advertisingEnabled" class="inline-sponsor-ad">
    <div class="inline-sponsor-ad__panel">
      <span class="inline-sponsor-ad__eyebrow">Werbung</span>
      <h2 class="inline-sponsor-ad__title">Dein Sponsor hier</h2>
      <p class="inline-sponsor-ad__copy">
        Platzhalter für eine prominente Partnerfläche auf der Website.
      </p>
      <a class="inline-sponsor-ad__cta" href="/sponsor/werden">Sponsor werden</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { advertisingEnabled } from "@/utils/advertising";
</script>

<style scoped>
.inline-sponsor-ad {
  display: none;
}

@media (max-width: 900px) {
  .inline-sponsor-ad {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-sizing: border-box;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    background: linear-gradient(180deg, #ff9f2f 0%, #ff7a00 100%);
  }

  .inline-sponsor-ad__panel {
    width: 100%;
    min-height: 100dvh;
    display: grid;
    align-content: end;
    gap: 0.75rem;
    padding: 1.5rem 1.2rem calc(1.2rem + env(safe-area-inset-bottom, 0px));
    color: #1f1400;
  }

  .inline-sponsor-ad__eyebrow {
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .inline-sponsor-ad__title {
    margin: 0;
    font-size: clamp(2.1rem, 11vw, 3.4rem);
    line-height: 0.92;
    letter-spacing: -0.06em;
    text-wrap: balance;
  }

  .inline-sponsor-ad__copy {
    margin: 0;
    max-width: 24rem;
    font-size: 0.98rem;
    line-height: 1.45;
    color: rgba(31, 20, 0, 0.82);
  }

  .inline-sponsor-ad__cta {
    width: fit-content;
    margin-top: 0.35rem;
    padding: 0.8rem 1rem;
    border-radius: 999px;
    background: rgba(255, 248, 225, 0.9);
    color: #5e2e00;
    font-weight: 800;
    text-decoration: none;
  }
}
</style>
