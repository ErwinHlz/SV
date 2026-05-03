<template>
  <section
    class="page-hero"
    :class="{ compact }"
    :style="{ backgroundImage: `url(${image})` }">
    <div class="page-hero-content" :data-compact="compact ? 'true' : 'false'">
      <p class="page-hero-kicker">{{ kicker }}</p>
      <h1 class="page-hero-title">{{ title }}</h1>
      <p class="page-hero-lead">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string;
    title: string;
    lead: string;
    kicker?: string;
    compact?: boolean;
  }>(),
  {
    kicker: "FSG Ottweiler-Steinbach",
    compact: false,
  },
);
</script>

<style scoped>
.page-hero {
  position: relative;
  min-height: clamp(280px, 20vh, 500px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: clamp(24px, 6vw, 72px) clamp(18px, 8vw, 80px);
  color: var(--sv-text-color);
  background-size: cover;
  background-position: center;
  overflow: hidden;
  scroll-snap-align: start;
  margin-bottom: 5dvh;
}

.page-hero.compact {
  min-height: clamp(210px, 30vh, 320px);
}

.page-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(2, 43, 121, 0.2) 0%,
    rgba(2, 43, 121, 0.78) 70%,
    rgba(2, 43, 121, 0.92) 100%
  );
  box-shadow: inset 0 -20px 30px rgba(0, 0, 0, 0.719);
}

.page-hero-content {
  position: relative;
  z-index: 1;
  width: min(900px, 100%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-hero-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  color: var(--sv-secondary-color);
}

.page-hero-title {
  margin: 0;
  font-size: clamp(24px, 4.2vw, 58px);
  font-weight: 800;
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1;
}

.page-hero-lead {
  margin: 0;
  max-width: 60ch;
  opacity: 0.9;
}

.page-hero-content :deep(.page-hero-extra) {
  margin-top: 18px;
}
</style>
