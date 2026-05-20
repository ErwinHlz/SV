<template>
  <transition name="cookie-fade">
    <aside
      v-if="isVisible"
      class="cookie-popup"
      aria-label="Cookie-Einstellungen"
      role="dialog"
      aria-modal="false">
      <div class="cookie-popup__panel">
        <p class="cookie-popup__eyebrow">Cookie-Einstellungen</p>
        <h2 class="cookie-popup__title">Deine Privatsphäre</h2>
        <p class="cookie-popup__copy">
          Wir verwenden notwendige Cookies für die Grundfunktionen der Website.
          Optionale Cookies helfen uns, eingebundene Inhalte und externe Dienste
          besser bereitzustellen.
        </p>

        <button
          type="button"
          class="cookie-popup__toggle"
          @click="showSettings = !showSettings">
          {{ showSettings ? "Einstellungen ausblenden" : "Einstellungen anpassen" }}
        </button>

        <div v-if="showSettings" class="cookie-popup__settings">
          <label class="cookie-option">
            <span class="cookie-option__text">
              <strong>Notwendig</strong>
              <small>Immer aktiv für Navigation und Grundfunktionen.</small>
            </span>
            <input type="checkbox" checked disabled />
          </label>

          <label class="cookie-option">
            <span class="cookie-option__text">
              <strong>Externe Inhalte</strong>
              <small>Zum Beispiel eingebettete Widgets und externe Dienste.</small>
            </span>
            <input v-model="externalMedia" type="checkbox" />
          </label>
        </div>

        <div class="cookie-popup__actions">
          <button
            type="button"
            class="cookie-popup__button cookie-popup__button--ghost"
            @click="acceptNecessaryOnly">
            Nur notwendige
          </button>
          <button
            type="button"
            class="cookie-popup__button cookie-popup__button--secondary"
            @click="saveCurrentSelection">
            Speichern
          </button>
          <button
            type="button"
            class="cookie-popup__button cookie-popup__button--primary"
            @click="acceptAll">
            Alle akzeptieren
          </button>
        </div>

        <p class="cookie-popup__legal">
          Mehr Informationen findest du in unserer
          <RouterLink to="/datenschutz">Datenschutzerklärung</RouterLink>.
        </p>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentState,
} from "@/composables/useCookieConsent";

const isVisible = ref(false);
const showSettings = ref(false);
const externalMedia = ref(false);
const openSettings = () => {
  isVisible.value = true;
  showSettings.value = true;
};

const persistConsent = (consent: CookieConsentState) => {
  writeCookieConsent(consent);
  isVisible.value = false;
  showSettings.value = false;
};

const acceptNecessaryOnly = () => {
  externalMedia.value = false;
  persistConsent({
    necessary: true,
    externalMedia: false,
    updatedAt: new Date().toISOString(),
  });
};

const saveCurrentSelection = () => {
  persistConsent({
    necessary: true,
    externalMedia: externalMedia.value,
    updatedAt: new Date().toISOString(),
  });
};

const acceptAll = () => {
  externalMedia.value = true;
  persistConsent({
    necessary: true,
    externalMedia: true,
    updatedAt: new Date().toISOString(),
  });
};

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  const storedConsent = readCookieConsent();
  if (!storedConsent) {
    isVisible.value = true;
    return;
  }

  externalMedia.value = storedConsent.externalMedia;
  window.addEventListener("sv-open-cookie-settings", openSettings);
});

onBeforeUnmount(() => {
  if (typeof window === "undefined") {
    return;
  }

  window.removeEventListener("sv-open-cookie-settings", openSettings);
});
</script>

<style scoped>
.cookie-popup {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 120;
  width: min(520px, calc(100vw - 24px));
}

.cookie-popup__panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px 22px 18px;
  border: 1px solid rgba(244, 208, 71, 0.28);
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(8, 20, 50, 0.98), rgba(3, 10, 28, 0.98));
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  backdrop-filter: blur(14px);
}

.cookie-popup__eyebrow {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
}

.cookie-popup__title {
  margin: 0;
  font-size: clamp(22px, 2vw, 28px);
  line-height: 1.05;
}

.cookie-popup__copy,
.cookie-popup__legal {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.88;
}

.cookie-popup__legal a {
  color: var(--sv-secondary-color);
}

.cookie-popup__toggle {
  width: fit-content;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--sv-secondary-color);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.cookie-popup__settings {
  display: grid;
  gap: 10px;
}

.cookie-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.03);
}

.cookie-option__text {
  display: grid;
  gap: 2px;
}

.cookie-option__text strong {
  font-size: 14px;
}

.cookie-option__text small {
  font-size: 12px;
  line-height: 1.45;
  opacity: 0.75;
}

.cookie-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--sv-secondary-color);
}

.cookie-popup__actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.cookie-popup__button {
  width: 100%;
  min-height: 46px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.cookie-popup__button:hover {
  transform: translateY(-1px);
}

.cookie-popup__button--ghost {
  background: transparent;
  color: var(--sv-text-color);
  border-color: rgba(255, 255, 255, 0.16);
}

.cookie-popup__button--secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--sv-text-color);
  border-color: rgba(255, 255, 255, 0.12);
}

.cookie-popup__button--primary {
  background: var(--sv-secondary-color);
  color: #07122c;
}

.cookie-fade-enter-active,
.cookie-fade-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 640px) {
  .cookie-popup {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
  }

  .cookie-popup__panel {
    padding: 16px 16px 14px;
    border-radius: 18px;
  }

  .cookie-popup__actions {
    grid-template-columns: 1fr;
  }
}
</style>
