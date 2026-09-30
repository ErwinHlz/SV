<template>
  <div class="oktoberfest-page">
    <header class="oktoberfest-header">
      <p class="oktoberfest-eyebrow">SV Ottweiler</p>
      <h1 class="oktoberfest-title">Oktoberfest</h1>
    </header>

    <section class="oktoberfest-prices" aria-labelledby="prices-title">
      <h2 id="prices-title">Preisliste</h2>
      <dl>
        <div><dt>Longdrink</dt><dd>{{ formatPrice(OKTOBERFEST_PRICES.longdrink) }}</dd></div>
        <div><dt>Shot</dt><dd>{{ formatPrice(OKTOBERFEST_PRICES.shot) }}</dd></div>
        <div><dt>Glücksrad · pro Dreh</dt><dd>{{ formatPrice(OKTOBERFEST_PRICES.spin) }}</dd></div>
      </dl>
    </section>

    <section class="oktoberfest-wheel-section" aria-label="Glücksrad">
      <GlucksradWheel />
    </section>
  </div>
</template>

<script setup lang="ts">
import GlucksradWheel from "@/components/GlucksradWheel.vue";
import { OKTOBERFEST_PRICES, formatPrice } from "@/utils/oktoberfestPrices";
</script>

<style scoped>
.oktoberfest-page {
  min-height: calc(100dvh - var(--sv-header-height));
  padding: clamp(28px, 6vw, 72px) clamp(18px, 8vw, 80px) clamp(48px, 8vw, 88px);
  color: var(--sv-text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(28px, 5vw, 48px);
}

.oktoberfest-header {
  max-width: 640px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.oktoberfest-eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  color: var(--sv-secondary-color);
}

.oktoberfest-title {
  margin: 0;
  font-size: clamp(28px, 4.2vw, 48px);
  font-weight: 800;
}

.oktoberfest-prices {
  width: min(480px, 100%);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.oktoberfest-prices h2 {
  margin: 0 0 14px;
  text-align: center;
  font-size: 1.2rem;
  color: var(--sv-secondary-color);
}

.oktoberfest-prices dl {
  margin: 0;
  display: grid;
  gap: 12px;
}

.oktoberfest-prices dl > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.oktoberfest-prices dd {
  margin: 0;
  font-weight: 700;
  white-space: nowrap;
}

.oktoberfest-wheel-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .oktoberfest-page {
    min-height: auto;
    padding: calc(var(--sv-header-height) + 28px) 16px 40px;
  }
}
</style>
