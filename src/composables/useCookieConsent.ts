import { computed, ref } from "vue";

export type CookieConsentState = {
  necessary: true;
  externalMedia: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = "sv-cookie-consent";

const consentState = ref<CookieConsentState | null>(null);
const consentLoaded = ref(false);

const parseStoredConsent = (value: string | null): CookieConsentState | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<CookieConsentState>;
    return {
      necessary: true,
      externalMedia: parsed.externalMedia ?? false,
      updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
};

export const readCookieConsent = () => {
  if (typeof window === "undefined") {
    return consentState.value;
  }

  consentState.value = parseStoredConsent(
    window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY),
  );
  consentLoaded.value = true;
  return consentState.value;
};

export const writeCookieConsent = (nextConsent: CookieConsentState) => {
  consentState.value = nextConsent;

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify(nextConsent),
  );
  window.dispatchEvent(
    new CustomEvent("sv-cookie-consent-changed", { detail: nextConsent }),
  );
};

if (typeof window !== "undefined") {
  readCookieConsent();
  window.addEventListener("storage", (event) => {
    if (event.key !== COOKIE_CONSENT_STORAGE_KEY) {
      return;
    }

    consentState.value = parseStoredConsent(event.newValue);
  });
  window.addEventListener("sv-cookie-consent-changed", (event) => {
    const nextConsent = (event as CustomEvent<CookieConsentState>).detail;
    consentState.value = nextConsent;
  });
}

export const openCookieSettings = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent("sv-open-cookie-settings"));
};

export const useCookieConsent = () => {
  const currentConsent = computed(() => {
    if (!consentLoaded.value) {
      readCookieConsent();
    }

    return consentState.value;
  });

  const hasExternalMediaConsent = computed(
    () => currentConsent.value?.externalMedia === true,
  );

  return {
    currentConsent,
    hasExternalMediaConsent,
    readCookieConsent,
    writeCookieConsent,
    openCookieSettings,
  };
};

let externalScriptsPromise: Promise<void> | null = null;

const loadExternalScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[data-consent-src="${src}"]`,
    );

    if (existingScript?.dataset.loaded === "true") {
      resolve();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error(`Script konnte nicht geladen werden: ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.consentSrc = src;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Script konnte nicht geladen werden: ${src}`)),
      { once: true },
    );
    document.head.appendChild(script);
  });

export const ensureExternalMediaScriptsLoaded = () => {
  if (!externalScriptsPromise) {
    externalScriptsPromise = Promise.all([
      loadExternalScript("https://www.fussball.de/widgets.js"),
      loadExternalScript("https://widget-api.fupa.net/vendor/widget.js?v1"),
    ]).then(() => undefined);
  }

  return externalScriptsPromise;
};
