<template>
  <section class="heroRow" :aria-label="ariaLabel">
    <component
      v-for="item in items"
      :key="item.id"
      :is="item.external ? 'a' : 'RouterLink'"
      class="panel"
      v-bind="item.external ? { href: item.to } : { to: item.to }"
      :style='item.img ? { "--bg": `url("${item.img}")` } : undefined'>
      <slot :item="item">
        <div class="shade"></div>
        <div class="content">
          <div class="kicker">{{ item.kicker }}</div>
          <h2 class="title">{{ item.title }}</h2>
        </div>
      </slot>
    </component>
  </section>
</template>

<script setup lang="ts">
export type HomeTileRowItem = {
  id: string | number;
  to: string | Record<string, unknown>;
  external?: boolean;
  img?: string;
  kicker?: string;
  title?: string;
  [key: string]: unknown;
};

withDefaults(
  defineProps<{
    items: HomeTileRowItem[];
    ariaLabel?: string;
  }>(),
  { ariaLabel: "" },
);

defineSlots<{
  default?: (props: { item: HomeTileRowItem }) => unknown;
}>();
</script>

<style scoped>
.heroRow {
  display: flex;
  width: 88dvw;
  max-width: 1400px;
  height: 50dvh;
  margin: 0 auto;
}

/* jedes Tile ist ein Link */
.panel {
  position: relative;
  flex: 1 1 0;
  min-width: 160px;
  overflow: hidden;
  text-decoration: none;
  color: white;

  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  clip-path: polygon(60px 0, 100% 0, 100% 100%, 0 100%);
  margin-left: -60px;
  margin-right: -60px;

  /* “smooth” hover */
  transition:
    flex 300ms ease,
    transform 300ms ease,
    filter 300ms ease;
  filter: saturate(1) brightness(0.95);
}

.panel:first-child {
  clip-path: none;
  margin-left: 0;
}

.panel:last-child {
  margin-right: 0;
}

/* wenn man über die ganze Reihe hovert, dimme leicht alle Panels */
.heroRow:hover .panel {
  filter: saturate(0.95) brightness(0.85);
}

/* das aktuell gehoverte Panel wächst */
.panel:hover {
  flex: 2.3 1 0; /* macht’s breiter */
  filter: saturate(1.05) brightness(1);
}

/* Lesbarkeits-Overlay */
.shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.2) 60%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.05) 55%,
      rgba(0, 0, 0, 0) 100%
    );
}

/* Text unten links */
.content {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 20px;
  z-index: 1;
}

.kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  opacity: 0.95;
  text-transform: uppercase;
}

.title {
  margin: 10px 0 0;
  font-size: clamp(18px, 1.9vw, 40px);
  line-height: 1.05;
  font-weight: 800;
  white-space: pre-line;
}

/* Tastatur-Fokus */
.panel:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.9);
  outline-offset: 4px;
}

/* Responsive: auf kleineren Screens lieber untereinander/scrollbar */
@media (max-width: 900px) {
  .heroRow {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(0, 1fr);
    gap: 0;
    height: 100%;
    overflow: hidden;
  }
  .panel {
    flex: none;
    min-width: 0;
    min-height: 0;
    clip-path: none;
    margin: 0;
    border-radius: 0;
    background-position: center;
  }
  .panel:hover {
    flex: none;
  }

  .content {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}

@media (max-width: 640px) {
  .heroRow {
    gap: 0;
  }

  .panel {
    border-radius: 0;
  }

  .kicker {
    font-size: 11px;
    letter-spacing: 0.12em;
  }

  .title {
    margin-top: 6px;
    font-size: clamp(18px, 5.6vw, 24px);
    line-height: 1.08;
  }
}
</style>
