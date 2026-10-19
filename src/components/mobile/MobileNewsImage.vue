<script setup lang="ts">
import { computed } from "vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import { useCookieConsent } from "@/composables/useCookieConsent";
import type { NewsEntry } from "@/utils/contentEntries";

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
</script>

<template>
  <img
    v-if="showImage"
    :src="item.image"
    :alt="item.imageAlt"
    :class="imgClass"
    class="news-image"
    loading="lazy" />
  <span v-else class="news-image news-image--fallback" :class="imgClass" aria-hidden="true">
    <CrestMark class="news-image__crest" />
  </span>
</template>

<style scoped>
.news-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-image--fallback {
  position: relative;
  overflow: hidden;
  background: #071637;
}

.news-image__crest {
  position: absolute;
  right: -18%;
  bottom: -22%;
  width: 85%;
  aspect-ratio: 1;
  color: var(--m-yellow);
  opacity: 0.16;
}
</style>
