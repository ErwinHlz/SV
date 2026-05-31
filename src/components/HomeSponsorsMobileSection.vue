<template>
  <section class="home-sponsors-mobile">
    <div class="home-sponsors-mobile__inner">
      <SponsorLogoStrip class="home-sponsors-mobile__grid" :mobile-grid="true" />
    </div>
  </section>
</template>

<script setup lang="ts">
import SponsorLogoStrip from "@/components/SponsorLogoStrip.vue";
</script>

<style scoped>
.home-sponsors-mobile {
  display: none;
}

@media (max-width: 700px) {
  .home-sponsors-mobile {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    overflow: hidden;
  }

  .home-sponsors-mobile::before {
    content: "SPONSOREN";
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    writing-mode: vertical-rl;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-family: "Marker Felt", "Brush Script MT", "Segoe Print", cursive;
    font-size: 8.8dvh;
    line-height: 0.9;
    font-weight: 800;
    color: var(--sv-secondary-color);
    opacity: 0.42;
    z-index: 1;
    pointer-events: none;
  }

  .home-sponsors-mobile__inner {
    width: 100%;
    display: grid;
    padding: 18px 0 72px;
    position: relative;
    z-index: 2;
  }

  .home-sponsors-mobile__grid {
    padding-top: 0;
  }
}
</style>
