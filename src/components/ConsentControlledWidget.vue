<template>
  <component
    :is="wrapperTag"
    :id="widgetId"
    :class="widgetClass"
    v-bind="widgetAttributes">
    <WidgetFallbackPlaceholder
      v-if="!hasExternalMediaConsent"
      :title="placeholderTitle"
      :description="placeholderDescription"
      :fallback-url="fallbackUrl" />
    <a
      v-else-if="fallbackUrl"
      :href="fallbackUrl"
      target="_blank"
      rel="noopener noreferrer">
      {{ fallbackLabel }}
    </a>
  </component>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from "vue";
import WidgetFallbackPlaceholder from "@/components/WidgetFallbackPlaceholder.vue";
import {
  ensureExternalMediaScriptsLoaded,
  useCookieConsent,
} from "@/composables/useCookieConsent";

const props = defineProps<{
  provider: "fupa" | "fussballde";
  widgetId?: string;
  widgetClass: string;
  dataId?: string;
  dataType?: string;
  fallbackUrl?: string;
  fallbackLabel?: string;
  placeholderTitle: string;
  placeholderDescription: string;
  wrapperTag?: string;
}>();

const { hasExternalMediaConsent } = useCookieConsent();

const widgetAttributes = computed(() => {
  if (props.provider === "fussballde") {
    return {
      "data-id": props.dataId,
      "data-type": props.dataType,
      style: "width: 100%",
    };
  }

  return {};
});

const initializeWidgetScripts = async () => {
  if (!hasExternalMediaConsent.value) {
    return;
  }

  await nextTick();
  await ensureExternalMediaScriptsLoaded();
};

onMounted(() => {
  initializeWidgetScripts();
});

watch(hasExternalMediaConsent, (isAllowed) => {
  if (!isAllowed) {
    return;
  }

  initializeWidgetScripts();
});

const wrapperTag = computed(() => props.wrapperTag ?? "div");
</script>
