<template>
  <div class="oktoberfest-page">
    <header class="oktoberfest-header">
      <p class="oktoberfest-eyebrow">SV Ottweiler</p>
      <h1 class="oktoberfest-title">Oktoberfest</h1>
    </header>

    <section class="oktoberfest-wheel-section" aria-label="Glücksrad">
      <GlucksradWheel />
    </section>
  </div>
</template>

<script setup lang="ts">
import GlucksradWheel from "@/components/GlucksradWheel.vue";
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
