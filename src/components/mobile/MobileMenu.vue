<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ArrowRight, ChevronDown, X } from "@lucide/vue";
import logoColor from "@/assets/sv_logo_farbe.svg";
import CrestMark from "@/components/mobile/CrestMark.vue";
import externalLinks from "@/content/external-links.json";
import { NAV, type NavItem } from "@/utils/nav";
import { getNextOwnMatch } from "@/utils/mobileMatches";
import { formatShortDate } from "@/utils/mobileFormat";

const open = defineModel<boolean>("open", { required: true });

const route = useRoute();
const panelRef = ref<HTMLElement | null>(null);
const expanded = ref<string | null>(null);

const normalizePath = (path: string) =>
  (path.split("#")[0] ?? "").replace(/\/+$/, "") || "/";

const isItemActive = (item: NavItem): boolean => {
  if (item.to && normalizePath(item.to) === normalizePath(route.path)) {
    return true;
  }
  return item.children?.some((child) => isItemActive(child)) ?? false;
};

const items = computed(() =>
  NAV.map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, "0"),
    active: isItemActive(item),
  })),
);

const nextMatch = getNextOwnMatch();

const toggle = (label: string) => {
  expanded.value = expanded.value === label ? null : label;
};

const close = () => {
  open.value = false;
};

const setScrollLocked = (locked: boolean) => {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close();
};

watch(open, async (isOpen) => {
  setScrollLocked(isOpen);

  if (isOpen) {
    // Die Gruppe der aktuellen Seite ist beim Oeffnen schon aufgeklappt.
    expanded.value =
      NAV.find((item) => item.children?.length && isItemActive(item))?.label ?? null;
    document.addEventListener("keydown", onKeydown);
    await nextTick();
    panelRef.value?.focus();
  } else {
    document.removeEventListener("keydown", onKeydown);
  }
});

watch(
  () => route.fullPath,
  () => close(),
);

onBeforeUnmount(() => {
  setScrollLocked(false);
  document.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="m-menu">
      <div
        v-if="open"
        id="m-menu"
        ref="panelRef"
        class="m-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        tabindex="-1">
        <CrestMark class="m-menu__backdrop" />
        <div class="m-menu__bar">
          <RouterLink to="/" class="m-menu__brand" aria-label="SV Ottweiler Startseite">
            <img :src="logoColor" alt="" class="m-menu__logo" />
            <span class="m-menu__title">SV Ottweiler</span>
          </RouterLink>
          <button type="button" class="m-menu__close" aria-label="Menü schließen" @click="close">
            <X :size="26" :stroke-width="2" />
          </button>
        </div>

        <nav class="m-menu__nav" aria-label="Hauptmenü">
          <ul class="m-menu__list">
            <li
              v-for="(item, index) in items"
              :key="item.label"
              class="m-menu__item"
              :style="{ '--i': index }">
              <template v-if="item.children?.length">
                <button
                  type="button"
                  class="m-menu__row"
                  :aria-expanded="expanded === item.label ? 'true' : 'false'"
                  @click="toggle(item.label)">
                  <span class="m-menu__num">{{ item.number }}</span>
                  <span
                    class="m-menu__label"
                    :class="{ 'is-highlight': item.active || expanded === item.label }">
                    {{ item.label }}
                  </span>
                  <ChevronDown
                    class="m-menu__chevron"
                    :class="{ 'is-open': expanded === item.label }"
                    :size="24"
                    :stroke-width="2" />
                </button>
                <ul v-if="expanded === item.label" class="m-menu__sub">
                  <li v-for="child in item.children" :key="child.label">
                    <RouterLink v-if="child.to" :to="child.to" class="m-menu__sublink">
                      {{ child.label }}
                      <ArrowRight :size="18" :stroke-width="2" />
                    </RouterLink>
                  </li>
                </ul>
              </template>
              <RouterLink v-else :to="item.to ?? '/'" class="m-menu__row">
                <span class="m-menu__num">{{ item.number }}</span>
                <span class="m-menu__label" :class="{ 'is-highlight': item.active }">
                  {{ item.label }}
                </span>
                <ArrowRight class="m-menu__arrow" :size="22" :stroke-width="2" />
              </RouterLink>
            </li>
          </ul>

          <RouterLink v-if="nextMatch" to="/termine" class="m-menu__next">
            <span class="m-crest m-menu__next-crest">
              <img
                :src="nextMatch.isHome ? nextMatch.awayLogo : nextMatch.homeLogo"
                alt="" />
            </span>
            <span class="m-menu__next-text">
              <span class="m-kicker">
                Nächstes Spiel · {{ formatShortDate(nextMatch.date) }} · {{ nextMatch.time }}
              </span>
              <span class="m-menu__next-teams">
                {{ nextMatch.homeTeam }} – {{ nextMatch.awayTeam }}
              </span>
            </span>
            <ArrowRight :size="20" :stroke-width="2" class="m-menu__next-arrow" />
          </RouterLink>

          <div class="m-menu__footer">
            <div class="m-menu__social">
              <a :href="externalLinks.social.instagram.url">Instagram</a>
              <a :href="externalLinks.social.facebook.url">Facebook</a>
            </div>
            <div class="m-menu__legal">
              <RouterLink to="/contact">Kontakt</RouterLink>
              <RouterLink to="/impressum">Impressum</RouterLink>
              <RouterLink to="/datenschutz">Datenschutz</RouterLink>
            </div>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.m-menu {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  background: var(--m-bg);
  color: var(--m-text);
  font-family: var(--m-body);
  overflow: hidden;
  outline: none;
}

.m-menu :deep(.m-menu__backdrop) {
  position: absolute;
  right: -150px;
  bottom: -120px;
  width: 460px;
  height: 460px;
  color: var(--m-yellow);
  opacity: 0.05;
  pointer-events: none;
}

.m-menu__bar {
  position: relative;
  flex: none;
  height: var(--m-header);
  box-sizing: border-box;
  padding: 0 8px 0 var(--m-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-menu__brand {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
}

.m-menu__logo {
  width: 38px;
  height: 38px;
}

.m-menu__title {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 21px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.m-menu__close {
  width: 48px;
  height: 48px;
  border: 0;
  background: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.m-menu__nav {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px 20px 0;
}

.m-menu__list,
.m-menu__sub {
  margin: 0;
  padding: 0;
  list-style: none;
}

.m-menu__row {
  width: 100%;
  min-height: 68px;
  padding: 0;
  border: 0;
  border-top: 1px solid var(--m-line);
  background: none;
  color: var(--m-text);
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 28px;
  align-items: center;
  cursor: pointer;
}

.m-menu__num {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--m-meta);
}

.m-menu__label {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 40px;
  line-height: 1;
  text-transform: uppercase;
}

.m-menu__label.is-highlight {
  color: var(--m-yellow);
}

.m-menu__chevron,
.m-menu__arrow {
  color: var(--m-meta);
  transition: transform 0.25s ease;
}

.m-menu__chevron.is-open {
  color: var(--m-yellow);
  transform: rotate(180deg);
}

.m-menu__sub {
  padding: 0 0 14px;
}

.m-menu__sublink {
  min-height: 46px;
  padding-left: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--m-text-2);
  font-size: 17px;
  font-weight: 500;
  text-decoration: none;
}

.m-menu__sublink:hover,
.m-menu__sublink.is-exact-active {
  color: var(--m-yellow);
}

.m-menu__next {
  margin-top: 28px;
  padding: 16px 0;
  border-top: 2px solid var(--m-yellow);
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--m-text);
  text-decoration: none;
}

.m-menu__next-crest {
  width: 44px;
  height: 44px;
}

.m-menu__next-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.m-menu__next-teams {
  font-weight: 600;
  font-size: 16px;
}

.m-menu__next-arrow {
  color: var(--m-yellow);
}

.m-menu__footer {
  padding: 18px 0 32px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-menu__social,
.m-menu__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
}

.m-menu__social a,
.m-menu__legal a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.m-menu__social a {
  color: var(--m-text);
  font-weight: 600;
  font-size: 16px;
}

.m-menu__legal a {
  color: var(--m-meta);
  font-size: 14px;
}

.m-menu-enter-active,
.m-menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.m-menu-enter-from,
.m-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: no-preference) {
  .m-menu__item {
    animation: m-menu-item 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i) * 40ms + 30ms);
  }

  .m-menu__sub {
    animation: m-menu-sub 0.3s ease both;
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-menu-enter-active,
  .m-menu-leave-active {
    transition: none;
  }
}

@keyframes m-menu-item {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes m-menu-sub {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
