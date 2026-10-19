import { readonly, ref } from "vue";

// Gleiche Grenze wie das bisherige Mobile-Layout (Hamburger "md:hidden").
const MOBILE_QUERY = "(max-width: 767px)";

const mediaQuery =
  typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY) : null;

const isMobile = ref(mediaQuery?.matches ?? false);

mediaQuery?.addEventListener("change", (event) => {
  isMobile.value = event.matches;
});

export const useIsMobile = () => readonly(isMobile);
