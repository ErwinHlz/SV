<template>
  <div class="external-placeholder">
    <img
      class="external-placeholder__image"
      :src="placeholderImage"
      alt="Externe Inhalte sind derzeit nicht freigegeben" />
    <p class="external-placeholder__eyebrow">Externer Inhalt</p>
    <h3 class="external-placeholder__title">{{ title }}</h3>
    <p class="external-placeholder__copy">{{ description }}</p>
    <div class="external-placeholder__actions">
      <button
        type="button"
        class="external-placeholder__button"
        @click="openCookieSettings">
        Externe Inhalte freigeben
      </button>
      <a
        v-if="fallbackUrl"
        class="external-placeholder__link"
        :href="fallbackUrl"
        target="_blank"
        rel="noopener noreferrer">
        Direkt beim Anbieter öffnen
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openCookieSettings } from "@/composables/useCookieConsent";
import placeholderImage from "@/assets/placeholder/extern_content_not_allowed.png";

defineProps<{
  title: string;
  description: string;
  fallbackUrl?: string;
}>();
</script>

<style scoped>
.external-placeholder {
  display: grid;
  gap: 10px;
  width: min(100%, 860px);
  margin: 0 auto;
  padding: clamp(18px, 3vw, 28px);
  border: 1px solid rgba(244, 208, 71, 0.24);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(9, 22, 54, 0.94), rgba(4, 11, 29, 0.96));
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
}

.external-placeholder__image {
  width: min(100%, 420px);
  justify-self: center;
  object-fit: contain;
}

.external-placeholder__eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--sv-secondary-color);
}

.external-placeholder__title {
  margin: 0;
  font-size: clamp(20px, 2vw, 26px);
}

.external-placeholder__copy {
  margin: 0;
  opacity: 0.84;
  line-height: 1.6;
}

.external-placeholder__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
}

.external-placeholder__button,
.external-placeholder__link {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.external-placeholder__button {
  border: 1px solid transparent;
  background: var(--sv-secondary-color);
  color: #07122c;
  cursor: pointer;
}

.external-placeholder__link {
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: var(--sv-text-color);
}

@media (max-width: 640px) {
  .external-placeholder__actions {
    display: grid;
  }
}
</style>
