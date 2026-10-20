<template>
  <!-- Mobil: Vollbild-Hero im neuen Design, ohne Lead-Text. -->
  <section v-if="isMobile && mobilePhoto" class="m-hero-photo">
    <div class="m-hero-photo__text m-title-shrink">
      <p class="m-kicker">{{ kicker }}</p>
      <h1 class="m-display m-hero-photo__title">{{ title }}</h1>
      <slot />
    </div>
    <figure class="m-hero-photo__frame">
      <img class="m-zoom" :src="image" :alt="title" />
    </figure>
  </section>
  <section
    v-else-if="isMobile"
    class="m-hero"
    :class="{ 'm-hero--compact': compact }">
    <img class="m-hero__image m-par" :src="mobileImage" alt="" />
    <div class="m-hero__shade" aria-hidden="true"></div>
    <div class="m-hero__content m-fadeout">
      <p class="m-kicker">{{ kicker }}</p>
      <h1 class="m-display m-hero__title">{{ title }}</h1>
      <slot />
    </div>
  </section>
  <section
    v-else
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
import { computed } from "vue";
import { useIsMobile } from "@/composables/useIsMobile";
import { getGalleryPlaceholder } from "@/utils/galleryPlaceholders";

const props = withDefaults(
  defineProps<{
    title: string;
    lead: string;
    kicker?: string;
    compact?: boolean;
    image?: string;
    /** Nur mobil: Bild unbeschnitten unter dem Titel, z. B. Mannschaftsfotos. */
    mobilePhoto?: boolean;
  }>(),
  {
    kicker: "SV Ottweiler",
    compact: false,
    mobilePhoto: false,
  },
);

const isMobile = useIsMobile();

// Ohne festes Bild: bei jedem Seitenaufruf ein anderes Galeriebild, pro Seite stabil.
const randomImage = computed(() => getGalleryPlaceholder(`hero:${props.title}`));
const image = computed(() => props.image ?? randomImage.value);

// Mobil ist der Hero immer zufaellig; Mannschaftsfotos (mobilePhoto) bleiben,
// die sind Inhalt und keine Deko.
const mobileImage = computed(() => randomImage.value || image.value);
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

.m-hero {
  position: relative;
  height: 420px;
  overflow: hidden;
  background: var(--m-bg);
  color: var(--m-text);
  font-family: var(--m-body);
}

.m-hero--compact {
  height: 340px;
}

.m-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 35%;
}

.m-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.6) 0%,
    rgba(0, 6, 17, 0.05) 25%,
    rgba(0, 6, 17, 0.25) 55%,
    rgba(0, 6, 17, 1) 100%
  );
}

.m-hero__content {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.m-hero__title {
  font-size: 52px;
  overflow-wrap: anywhere;
  hyphens: auto;
}

.m-hero-photo {
  padding-top: var(--m-header);
  background: var(--m-bg);
  color: var(--m-text);
  font-family: var(--m-body);
}

.m-hero-photo__text {
  padding: 20px var(--m-gutter) 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-hero-photo__title {
  font-size: 60px;
}

.m-hero-photo__frame {
  margin: 0;
  aspect-ratio: 3 / 2;
  overflow: hidden;
}

.m-hero-photo__frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero-content :deep(.page-hero-extra) {
  margin-top: 18px;
}
</style>
