<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { X } from "@lucide/vue";

type GalleryImage = { src: string; alt: string };

const props = defineProps<{ images: GalleryImage[] }>();

const openIndex = ref<number | null>(null);
const currentIndex = ref(0);
const viewerRef = ref<HTMLElement | null>(null);

// Zwei Spalten, abwechselnd befuellt, damit die Reihenfolge erhalten bleibt.
const columns = computed(() => [
  props.images.map((image, index) => ({ image, index })).filter((_, index) => index % 2 === 0),
  props.images.map((image, index) => ({ image, index })).filter((_, index) => index % 2 === 1),
]);

const open = (index: number) => {
  openIndex.value = index;
  currentIndex.value = index;
};

const close = () => {
  openIndex.value = null;
};

const onViewerScroll = () => {
  const viewer = viewerRef.value;
  if (!viewer) return;
  currentIndex.value = Math.round(viewer.scrollLeft / viewer.clientWidth);
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
};

const setScrollLocked = (locked: boolean) => {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
};

watch(openIndex, async (index) => {
  setScrollLocked(index !== null);

  if (index === null) {
    document.removeEventListener("keydown", onKeydown);
    return;
  }

  document.addEventListener("keydown", onKeydown);
  await nextTick();
  const viewer = viewerRef.value;
  if (viewer) viewer.scrollLeft = index * viewer.clientWidth;
  viewer?.focus();
});

onBeforeUnmount(() => {
  setScrollLocked(false);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="m-page gallery">
    <div class="gallery__intro m-title-shrink">
      <p class="m-kicker">Vereinsleben</p>
      <h1 class="m-display gallery__title">Galerie</h1>
      <p class="gallery__lead">Eindrücke vom Platz, vom Rand und aus dem Vereinsheim.</p>
      <p class="gallery__count">{{ images.length }} Bilder</p>
    </div>

    <div class="gallery__grid">
      <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="gallery__column">
        <button
          v-for="entry in column"
          :key="entry.image.src"
          type="button"
          class="gallery__tile m-rv"
          :aria-label="`Bild ${entry.index + 1} groß anzeigen`"
          @click="open(entry.index)">
          <img :src="entry.image.src" :alt="entry.image.alt" loading="lazy" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="gallery-viewer">
        <div
          v-if="openIndex !== null"
          class="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht">
          <div class="gallery-viewer__bar">
            <span class="gallery-viewer__count">
              {{ currentIndex + 1 }} / {{ images.length }}
            </span>
            <button type="button" class="gallery-viewer__close" aria-label="Bildansicht schließen" @click="close">
              <X :size="26" :stroke-width="2" />
            </button>
          </div>
          <div
            ref="viewerRef"
            class="gallery-viewer__track"
            tabindex="-1"
            @scroll.passive="onViewerScroll">
            <figure v-for="image in images" :key="image.src" class="gallery-viewer__slide">
              <img :src="image.src" :alt="image.alt" loading="lazy" />
            </figure>
          </div>
          <p class="gallery-viewer__hint">Wischen für weitere Bilder</p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery {
  padding-top: var(--m-header);
  padding-bottom: 56px;
}

.gallery__intro {
  padding: 20px var(--m-gutter) 22px;
}

.gallery__title {
  margin: 2px 0 6px;
  font-size: 68px;
}

.gallery__lead {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.gallery__count {
  margin: 10px 0 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.gallery__grid {
  padding: 0 var(--m-gutter);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
}

.gallery__column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gallery__column:nth-child(2) {
  padding-top: 40px;
}

.gallery__tile {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 16px;
  overflow: hidden;
  background: #071637;
  cursor: zoom-in;
}

.gallery__tile img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-viewer {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  background: var(--m-bg);
  color: var(--m-text);
  font-family: var(--m-body);
}

.gallery-viewer__bar {
  height: var(--m-header);
  padding: 0 8px 0 var(--m-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gallery-viewer__count {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 20px;
  color: var(--m-yellow);
}

.gallery-viewer__close {
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  color: var(--m-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.gallery-viewer__track {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  outline: none;
}

.gallery-viewer__track::-webkit-scrollbar {
  display: none;
}

.gallery-viewer__slide {
  flex: none;
  width: 100%;
  height: 100%;
  margin: 0;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-viewer__slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gallery-viewer__hint {
  margin: 0;
  padding: 14px var(--m-gutter) calc(14px + env(safe-area-inset-bottom));
  text-align: center;
  font-size: 13px;
  color: var(--m-meta);
}

.gallery-viewer-enter-active,
.gallery-viewer-leave-active {
  transition: opacity 0.2s ease;
}

.gallery-viewer-enter-from,
.gallery-viewer-leave-to {
  opacity: 0;
}
</style>
