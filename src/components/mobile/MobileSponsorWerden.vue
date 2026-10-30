<script setup lang="ts">
import { ref } from "vue";
import { ArrowRight, AtSign, Mail } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import rawSponsoring from "@/content/sponsoring.json";
import externalLinks from "@/content/external-links.json";
import heroImage from "@/assets/stadion/tribuene-blick-platz-1.jpg";
import stadiumPhoto from "@/assets/stadion/laufbahn-platz-training.jpg";
import squadPhoto from "@/assets/Kader/gesamtkader.jpg";
import teamPhoto from "@/assets/Kader/team-1-kader.jpg";
import { buildSponsorMailto } from "@/utils/sponsorMail";

type SponsorPackage = {
  id: string;
  title: string;
  lead?: string;
  highlight?: string;
  points: string[];
  link?: { href: string; label: string };
};

type Entry = {
  id: string;
  eyebrow: string;
  highlighted?: boolean;
  title: string;
  lead?: string;
  points: Array<{ label?: string; detail: string }>;
  link?: { href: string; label: string };
  photo?: { src: string; alt: string; position: string };
};

const { hero, intro, channelsTitle, channels, benefits, packagesIntro, steps, download, contact } = rawSponsoring;
const packages = rawSponsoring.packages as SponsorPackage[];

const subNav = [
  { label: "Sponsoren", to: "/sponsor" },
  { label: "Sponsor werden", to: "/sponsor/werden" },
];

const packagePhotos: Partial<Record<string, Entry["photo"]>> = {
  kleidung: {
    src: teamPhoto,
    alt: "1. Mannschaft in Trikots mit Sponsorenlogo",
    position: "50% 66%",
  },
};

// Wie bei Verein und Historie läuft alles als ein Zeitstrahl durch.
const entries: Entry[] = [
  {
    id: "intro",
    eyebrow: intro.kicker,
    title: intro.title,
    lead: intro.text,
    points: [],
    photo: { src: squadPhoto, alt: "Die Mannschaften des SV Ottweiler", position: "50% 62%" },
  },
  {
    id: "channels",
    eyebrow: "Sichtbarkeit",
    title: channelsTitle,
    points: channels.map((channel) => ({ label: channel.title, detail: channel.text })),
    photo: { src: stadiumPhoto, alt: "Stadion Im Alten Weiher bei Flutlicht", position: "50% 46%" },
  },
  {
    id: "benefits",
    eyebrow: "Dein Vorteil",
    title: "Was du davon hast",
    points: benefits.map((item) => ({ label: item.title, detail: item.text })),
  },
  ...packages.map((pkg) => ({
    id: pkg.id,
    eyebrow: pkg.highlight ?? "Partner-Variante",
    highlighted: Boolean(pkg.highlight),
    title: pkg.title,
    lead: pkg.lead,
    points: pkg.points.map((point) => ({ detail: point })),
    link: pkg.link,
    photo: packagePhotos[pkg.id],
  })),
  {
    id: "steps",
    eyebrow: steps.kicker,
    title: steps.title,
    points: steps.items.map((step) => ({ label: step.title, detail: step.text })),
  },
];

const downloadHref = `${import.meta.env.BASE_URL}${download.file}`;
const instagramUrl = externalLinks.social.instagram.url;

const form = ref({ name: "", email: "", company: "", interest: "", message: "" });

const handleSubmit = () => {
  window.location.href = buildSponsorMailto(contact.email, form.value);
};
</script>

<template>
  <div class="m-page werden">
    <section class="werden-hero">
      <div class="werden-hero__word m-hero-word" aria-hidden="true">SVO</div>
      <figure class="werden-hero__photo m-hero-photo">
        <img :src="heroImage" alt="Stadion Im Alten Weiher bei Flutlicht" />
        <figcaption>Im Alten Weiher</figcaption>
      </figure>
      <div class="werden-hero__text m-fadeout">
        <p class="m-kicker">Sponsoren · {{ packagesIntro.kicker }}</p>
        <h1 class="m-display werden-hero__title">Sponsor<br />werden.</h1>
        <p class="werden-hero__lead">{{ hero.lead }}</p>
      </div>
    </section>

    <nav class="m-tabs werden-tabs" aria-label="Sponsoren">
      <RouterLink
        v-for="item in subNav"
        :key="item.to"
        :to="item.to"
        class="m-tab"
        exact-active-class="is-active">
        {{ item.label }}
      </RouterLink>
    </nav>

    <section class="werden-line" aria-label="Partner werden beim SV Ottweiler">
      <div class="werden-line__track" aria-hidden="true">
        <div class="werden-line__fill"></div>
      </div>

      <article v-for="(entry, index) in entries" :key="entry.id" class="werden-entry">
        <span class="werden-entry__dot" aria-hidden="true"></span>
        <div class="werden-entry__body m-rvx">
          <span class="werden-entry__num">{{ String(index + 1).padStart(2, "0") }}</span>
          <span
            class="werden-entry__eyebrow"
            :class="{ 'werden-entry__eyebrow--hot': entry.highlighted }">{{ entry.eyebrow }}</span>
          <h2 class="werden-entry__title">{{ entry.title }}</h2>
          <p v-if="entry.lead" class="werden-entry__lead">{{ entry.lead }}</p>
          <ul v-if="entry.points.length" class="werden-entry__points">
            <li v-for="point in entry.points" :key="point.detail">
              <strong v-if="point.label">{{ point.label }}</strong>
              <span>{{ point.detail }}</span>
            </li>
          </ul>
          <a
            v-if="entry.link"
            class="m-text-link"
            :href="entry.link.href"
            target="_blank"
            rel="noopener noreferrer">{{ entry.link.label }}</a>
          <div v-if="entry.photo" class="werden-entry__photo">
            <img
              class="m-zoom"
              :src="entry.photo.src"
              :alt="entry.photo.alt"
              :style="{ objectPosition: entry.photo.position }"
              loading="lazy" />
          </div>
        </div>
      </article>

      <article class="werden-entry">
        <span class="werden-entry__dot" aria-hidden="true"></span>
        <div class="werden-entry__body">
          <span class="werden-entry__num">{{ String(entries.length + 1).padStart(2, "0") }}</span>
          <span class="werden-entry__eyebrow">{{ contact.kicker }}</span>
          <h2 class="werden-entry__title">{{ contact.title }}</h2>
          <p class="werden-entry__lead">{{ contact.text }}</p>
          <a class="m-text-link" :href="`mailto:${contact.email}`">
            <Mail :size="18" :stroke-width="2" aria-hidden="true" /> {{ contact.email }}
          </a>
          <a class="m-text-link" :href="instagramUrl" target="_blank" rel="noopener noreferrer">
            <AtSign :size="18" :stroke-width="2" aria-hidden="true" /> {{ contact.instagram }}
          </a>

          <form class="werden-form" @submit.prevent="handleSubmit">
            <label>
              Name
              <input v-model="form.name" type="text" name="name" autocomplete="name" required />
            </label>
            <label>
              E-Mail
              <input v-model="form.email" type="email" name="email" autocomplete="email" required />
            </label>
            <label>
              Unternehmen
              <input v-model="form.company" type="text" name="company" autocomplete="organization" />
            </label>
            <label>
              Interesse
              <input
                v-model="form.interest"
                type="text"
                name="interest"
                list="werden-interest-options"
                placeholder="z. B. Jugend, Trikots" />
              <datalist id="werden-interest-options">
                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.title"></option>
              </datalist>
            </label>
            <label>
              Nachricht
              <textarea
                v-model="form.message"
                name="message"
                rows="5"
                required
                placeholder="Deine Nachricht" />
            </label>
            <button type="submit" class="m-btn">Anfrage senden</button>
          </form>
        </div>
      </article>
    </section>

    <section class="werden-mappe">
      <div class="m-box werden-mappe__box m-rv">
        <CrestMark class="m-box__crest werden-mappe__crest" />
        <p class="m-kicker">Sponsoring-Mappe</p>
        <h2 class="m-display werden-mappe__title">Alle Infos<br />als PDF.</h2>
        <p class="werden-mappe__text">{{ download.text }}</p>
        <a :href="downloadHref" class="m-btn werden-mappe__cta" download>
          Herunterladen <ArrowRight :size="18" :stroke-width="2" />
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.werden {
  padding-bottom: 56px;
}

.werden-hero {
  position: relative;
  height: 600px;
  overflow: hidden;
  background: #011338;
}

.werden-hero__word {
  position: absolute;
  left: -8px;
  top: 64px;
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 214px;
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 2px rgba(244, 208, 71, 0.6);
  transform-origin: 20% 50%;
}

.werden-hero__photo {
  position: absolute;
  right: 18px;
  top: 206px;
  width: 214px;
  margin: 0;
  padding: 6px 6px 8px;
  border-radius: 6px;
  background: #f3f1ea;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  transform: rotate(-4deg);
}

.werden-hero__photo img {
  display: block;
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 2px;
}

.werden-hero__photo figcaption {
  padding-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1a2338;
  text-align: center;
}

.werden-hero__text {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.werden-hero__title {
  font-size: 54px;
}

.werden-hero__lead {
  margin: 0;
  max-width: 320px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.werden-tabs {
  margin: 14px var(--m-gutter) 0;
  padding: 0;
}

.werden-line {
  position: relative;
  padding: 40px var(--m-gutter) 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  view-timeline-name: --werden-line;
}

.werden-line__track {
  position: absolute;
  left: 31px;
  top: 48px;
  bottom: 40px;
  width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
}

.werden-line__fill {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: var(--m-yellow);
  transform-origin: 50% 0;
}

.werden-entry {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
}

.werden-entry__dot {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  margin: 14px 0 0 9px;
  box-sizing: border-box;
  border: 2px solid var(--m-yellow);
  border-radius: 50%;
  background: var(--m-yellow);
}

.werden-entry__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.werden-entry__num {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 44px;
  line-height: 1;
  color: var(--m-yellow);
}

.werden-entry__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.werden-entry__eyebrow--hot {
  color: var(--m-yellow);
}

.werden-entry__title {
  margin: 0;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 26px;
  line-height: 1.05;
}

.werden-entry__lead {
  margin: 4px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.werden-entry__points {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.werden-entry__points li {
  padding-left: 12px;
  border-left: 2px solid rgba(244, 208, 71, 0.6);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.werden-entry__points strong {
  color: var(--m-text);
  font-weight: 600;
}

.werden-entry__photo {
  margin-top: 10px;
  height: 190px;
  border-radius: 16px;
  overflow: hidden;
}

.werden-entry__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.werden-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.werden-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--m-meta);
}

.werden-form input,
.werden-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 14px;
  border: 1px solid var(--m-line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--m-text);
  font-family: var(--m-body);
  font-size: 16px;
  font-weight: 400;
}

.werden-form input::placeholder,
.werden-form textarea::placeholder {
  color: var(--m-muted);
}

.werden-form input:focus,
.werden-form textarea:focus {
  outline: 3px solid rgba(244, 208, 71, 0.14);
  border-color: rgba(244, 208, 71, 0.5);
}

.werden-mappe {
  padding: 40px var(--m-gutter) 0;
}

.werden-mappe__box {
  border-radius: 28px;
  padding: 30px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.werden-mappe__crest {
  right: -70px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  opacity: 0.14;
}

.werden-mappe__title {
  position: relative;
  font-size: 48px;
  line-height: 0.92;
}

.werden-mappe__text {
  position: relative;
  margin: 0;
  max-width: 260px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.werden-mappe__cta {
  position: relative;
  align-self: flex-start;
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .m-hero-word {
      animation: werden-word linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .m-hero-photo {
      animation: werden-photo linear both;
      animation-timeline: scroll(root);
      animation-range: 0 520px;
    }

    .werden-line__fill {
      animation: werden-grow linear both;
      animation-timeline: --werden-line;
      animation-range: cover 50vh cover calc(100% - 50vh);
    }

    .werden-entry__dot {
      animation: werden-dot linear both;
      animation-timeline: view();
      animation-range: cover 0% cover 50%;
    }
  }
}

@keyframes werden-word {
  to {
    transform: translateY(-90px) scale(1.3);
    opacity: 0.12;
  }
}

@keyframes werden-photo {
  from {
    transform: rotate(-4deg);
  }
  to {
    transform: translateY(110px) rotate(4deg);
  }
}

@keyframes werden-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

@keyframes werden-dot {
  0%,
  88% {
    background: #16233f;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0 rgba(244, 208, 71, 0);
  }
  100% {
    background: var(--m-yellow);
    border-color: var(--m-yellow);
    box-shadow: 0 0 0 7px rgba(244, 208, 71, 0.22);
  }
}
</style>
