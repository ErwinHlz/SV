<script setup lang="ts">
import { ref } from "vue";
import logoColor from "@/assets/sv_logo_farbe.svg";
import CrestMark from "@/components/mobile/CrestMark.vue";
import MobileMenu from "@/components/mobile/MobileMenu.vue";

const isMenuOpen = ref(false);
</script>

<template>
  <header class="m-header m-header-bg">
    <RouterLink to="/" class="m-header__brand" aria-label="SV Ottweiler Startseite">
      <!-- Weisses Wappen, darueber das farbige, das sich mit dem
           Scrollfortschritt von unten nach oben einblendet. -->
      <span class="m-header__logo">
        <CrestMark class="m-header__logo-base" />
        <img class="m-header__logo-color m-logo-fill" :src="logoColor" alt="" />
      </span>
      <span class="m-header__title">SV Ottweiler</span>
    </RouterLink>
    <button
      type="button"
      class="m-header__menu"
      aria-label="Menü öffnen"
      aria-controls="m-menu"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      @click="isMenuOpen = true">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path d="M4 7h16M4 12h16M10 17h10" />
      </svg>
    </button>
  </header>
  <MobileMenu v-model:open="isMenuOpen" />
</template>

<style scoped>
.m-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  height: var(--m-header);
  box-sizing: border-box;
  padding: 0 8px 0 var(--m-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 6, 17, 0.97);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  color: var(--m-text);
}

.m-header__brand {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.m-header__logo {
  position: relative;
  width: 38px;
  height: 38px;
  flex: none;
}

.m-header__logo-base,
.m-header__logo-color {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.m-header__logo-base {
  color: #ffffff;
}

.m-header__title {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 21px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.m-header__menu {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 14px;
  background: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.m-header__menu svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
</style>
