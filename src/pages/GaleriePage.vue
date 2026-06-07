<template>
  <div class="gallery-page">
    <PageHero
      class="gallery-page-hero"
      :image="galleryHero"
      title="Galerie"
      lead="Ein paar Eindruecke aus dem Vereinsumfeld" />

    <section class="gallery-shell" aria-label="Bildergalerie">
      <div class="gallery-grid">
        <button
          v-for="image in galleryImages"
          :key="image.src"
          class="gallery-card"
          type="button"
          @click="selectedImage = image">
          <img :src="image.src" :alt="image.alt" loading="lazy" />
        </button>
      </div>
    </section>

    <Transition name="gallery-lightbox">
      <div
        v-if="selectedImage"
        class="gallery-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="selectedImage.alt"
        @click="selectedImage = null">
        <button
          type="button"
          class="gallery-lightbox-close"
          aria-label="Galeriebild schliessen"
          @click.stop="selectedImage = null">
          ×
        </button>
        <figure class="gallery-lightbox-figure" @click.stop>
          <img :src="selectedImage.src" :alt="selectedImage.alt" />
        </figure>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import PageHero from "@/components/PageHero.vue";
import galleryHero from "@/assets/spielberichte/stock_spielberichte_3.png";

type GalleryImage = {
  src: string;
  alt: string;
};

const galleryImageModules = import.meta.glob("../assets/galerie/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const toGalleryAlt = (filepath: string) =>
  filepath
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim() ?? "Galeriebild";

const galleryImages: GalleryImage[] = Object.entries(galleryImageModules)
  .sort(([left], [right]) =>
    left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }),
  )
  .map(([filepath, src], index) => ({
    src,
    alt: `${toGalleryAlt(filepath)} ${index + 1}`.trim(),
  }));

const selectedImage = ref<GalleryImage | null>(null);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    selectedImage.value = null;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.gallery-shell {
  width: min(1180px, calc(100dvw - 32px));
  margin: 0 auto;
  padding: 0 0 clamp(48px, 8vw, 88px);
}

.gallery-grid {
  column-count: 3;
  column-gap: 14px;
}

.gallery-card {
  display: block;
  width: 100%;
  margin: 0 0 14px;
  padding: 0;
  border: 0;
  overflow: hidden;
  border-radius: 24px;
  cursor: zoom-in;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(2, 43, 121, 0.18)),
    #07142f;
  box-shadow: 0 18px 40px rgba(1, 12, 35, 0.18);
  break-inside: avoid;
  appearance: none;
}

.gallery-card img {
  width: 100%;
  height: auto;
  display: block;
  transition:
    transform 0.45s ease,
    filter 0.45s ease;
}

.gallery-card:hover img,
.gallery-card:focus-visible img {
  transform: scale(1.04);
  filter: saturate(1.05);
}

.gallery-card:focus-visible {
  outline: 2px solid rgba(242, 208, 82, 0.95);
  outline-offset: 4px;
}

.gallery-card:nth-child(2),
.gallery-card:nth-child(5) {
  margin-top: 36px;
}

.gallery-card:nth-child(3),
.gallery-card:nth-child(7) {
  margin-top: 18px;
}

.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--sv-header-height) + 24px) 24px 24px;
  background: rgba(3, 10, 24, 0.24);
  backdrop-filter: blur(14px);
}

.gallery-lightbox-figure {
  margin: 0;
  width: min(920px, 100%);
  max-height: calc(100dvh - var(--sv-header-height) - 48px);
}

.gallery-lightbox-figure img {
  width: 100%;
  max-height: calc(100dvh - var(--sv-header-height) - 48px);
  display: block;
  object-fit: contain;
}

.gallery-lightbox-close {
  position: absolute;
  top: calc(var(--sv-header-height) + 8px);
  right: 18px;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.gallery-lightbox-enter-active,
.gallery-lightbox-leave-active {
  transition: opacity 0.22s ease;
}

.gallery-lightbox-enter-from,
.gallery-lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .gallery-grid {
    column-count: 2;
  }
}

@media (max-width: 620px) {
  .gallery-grid {
    column-count: 1;
  }

  .gallery-card,
  .gallery-card:nth-child(2),
  .gallery-card:nth-child(3),
  .gallery-card:nth-child(5),
  .gallery-card:nth-child(7) {
    margin-top: 0;
    border-radius: 18px;
  }

  .gallery-lightbox {
    padding: calc(var(--sv-header-height) + 12px) 12px 12px;
  }

  .gallery-lightbox-figure {
    width: min(100%, 760px);
  }
}
</style>
