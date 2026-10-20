<script setup lang="ts">
import { computed } from "vue";
import { useCookieConsent } from "@/composables/useCookieConsent";
import type { NewsEntry } from "@/utils/contentEntries";
import { getGalleryPlaceholder } from "@/utils/galleryPlaceholders";

const props = defineProps<{
  item: NewsEntry;
  imgClass?: string;
}>();

const { hasExternalMediaConsent } = useCookieConsent();

// Instagram-Bilder gibt es erst nach Zustimmung zu externen Inhalten.
const showImage = computed(
  () =>
    Boolean(props.item.image) &&
    (props.item.source !== "Instagram" || hasExternalMediaConsent.value),
);

// Sonst ein zufaelliges Galeriebild, pro Beitrag stabil.
const src = computed(() =>
  showImage.value ? props.item.image : getGalleryPlaceholder(`news:${props.item.id}`),
);
</script>

<template>
  <img
    :src="src"
    :alt="showImage ? item.imageAlt : ''"
    :class="imgClass"
    class="news-image"
    loading="lazy" />
</template>

<style scoped>
.news-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #071637;
}
</style>
