<script setup lang="ts">
import { ref } from "vue";
import { AtSign, Download, Mail } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";
import rawSponsoring from "@/content/sponsoring.json";
import externalLinks from "@/content/external-links.json";
import heroImage from "@/assets/stadion/tribuene-blick-platz-1.jpg";
import { buildSponsorMailto } from "@/utils/sponsorMail";

type SponsorPackage = {
  id: string;
  title: string;
  lead?: string;
  highlight?: string;
  points: string[];
  link?: { href: string; label: string };
};

const { hero, intro, channelsTitle, channels, benefits, packagesIntro, steps, download, contact } = rawSponsoring;
const packages = rawSponsoring.packages as SponsorPackage[];

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
        <p class="m-kicker">Sponsoren · Partner werden</p>
        <h1 class="m-display werden-hero__title">Sponsor<br />werden.</h1>
        <p class="werden-hero__lead">{{ hero.lead }}</p>
      </div>
    </section>

    <section class="werden-intro m-rv" aria-labelledby="werden-intro-title">
      <p class="m-kicker">{{ intro.kicker }}</p>
      <h2 id="werden-intro-title" class="m-section-title">{{ intro.title }}</h2>
      <p class="werden-text">{{ intro.text }}</p>
    </section>

    <section class="werden-section" aria-labelledby="werden-channels-title">
      <h2 id="werden-channels-title" class="m-section-title werden-section__title m-rv">
        {{ channelsTitle }}
      </h2>
      <ul class="werden-rows">
        <li v-for="channel in channels" :key="channel.title" class="werden-row m-rv">
          <strong>{{ channel.title }}</strong>
          <span>{{ channel.text }}</span>
        </li>
      </ul>
    </section>

    <section class="werden-section" aria-labelledby="werden-benefits-title">
      <h2 id="werden-benefits-title" class="m-section-title werden-section__title m-rv">
        Was du davon hast
      </h2>
      <ul class="werden-tiles">
        <li v-for="item in benefits" :key="item.title" class="werden-tile m-rv">
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </section>

    <section class="werden-section" aria-labelledby="werden-packages-title">
      <div class="werden-section__head m-rv">
        <p class="m-kicker">{{ packagesIntro.kicker }}</p>
        <h2 id="werden-packages-title" class="m-section-title">{{ packagesIntro.title }}</h2>
      </div>

      <div class="werden-line">
        <div class="werden-line__track" aria-hidden="true">
          <div class="werden-line__fill"></div>
        </div>

        <article v-for="(pkg, index) in packages" :key="pkg.id" class="werden-entry">
          <span class="werden-entry__dot" aria-hidden="true"></span>
          <div class="werden-entry__body m-rvx">
            <span class="werden-entry__num">{{ String(index + 1).padStart(2, "0") }}</span>
            <span v-if="pkg.highlight" class="werden-entry__eyebrow">{{ pkg.highlight }}</span>
            <h3 class="werden-entry__title">{{ pkg.title }}</h3>
            <p v-if="pkg.lead" class="werden-entry__lead">{{ pkg.lead }}</p>
            <ul v-if="pkg.points.length" class="werden-entry__points">
              <li v-for="point in pkg.points" :key="point">{{ point }}</li>
            </ul>
            <a
              v-if="pkg.link"
              class="m-text-link"
              :href="pkg.link.href"
              target="_blank"
              rel="noopener noreferrer">{{ pkg.link.label }}</a>
          </div>
        </article>
      </div>
    </section>

    <section class="werden-section" aria-labelledby="werden-steps-title">
      <div class="m-section-head m-rv">
        <div>
          <p class="m-kicker">{{ steps.kicker }}</p>
          <h2 id="werden-steps-title" class="m-section-title">{{ steps.title }}</h2>
        </div>
      </div>
      <ol class="m-rail werden-steps">
        <li v-for="(step, index) in steps.items" :key="step.title" class="werden-step m-ri">
          <span class="werden-step__num" aria-hidden="true">{{ index + 1 }}</span>
          <strong>{{ step.title }}</strong>
          <span>{{ step.text }}</span>
        </li>
      </ol>
    </section>

    <section class="werden-section werden-pad" aria-labelledby="werden-download-title">
      <div class="m-box werden-box m-rv">
        <CrestMark class="m-box__crest werden-box__crest" />
        <h2 id="werden-download-title" class="m-display werden-box__title">{{ download.title }}</h2>
        <p class="werden-box__text">{{ download.text }}</p>
        <a :href="downloadHref" class="m-btn werden-box__btn" download>
          <Download :size="18" :stroke-width="2" aria-hidden="true" /> {{ download.label }}
        </a>
      </div>
    </section>

    <section class="werden-section werden-pad" aria-labelledby="werden-contact-title">
      <div class="m-rv">
        <p class="m-kicker">{{ contact.kicker }}</p>
        <h2 id="werden-contact-title" class="m-section-title">{{ contact.title }}</h2>
        <p class="werden-text">{{ contact.text }}</p>
        <div class="werden-links">
          <a class="m-text-link" :href="`mailto:${contact.email}`">
            <Mail :size="18" :stroke-width="2" aria-hidden="true" /> {{ contact.email }}
          </a>
          <a class="m-text-link" :href="instagramUrl" target="_blank" rel="noopener noreferrer">
            <AtSign :size="18" :stroke-width="2" aria-hidden="true" /> {{ contact.instagram }}
          </a>
        </div>
      </div>

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
            placeholder="z. B. Jugend, Trikots, Instagram" />
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

.werden-intro {
  padding: 40px var(--m-gutter) 0;
}

.werden-text {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.werden-section {
  padding-top: 48px;
}

.werden-pad {
  padding-left: var(--m-gutter);
  padding-right: var(--m-gutter);
}

.werden-section__title {
  margin: 0 0 14px;
  padding: 0 var(--m-gutter);
}

.werden-section__head {
  padding: 0 var(--m-gutter);
}

.werden-rows {
  margin: 0;
  padding: 0 var(--m-gutter);
  list-style: none;
}

.werden-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 0;
  border-top: 1px solid var(--m-line);
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.werden-row strong {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.werden-tiles {
  margin: 0;
  padding: 0 var(--m-gutter);
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.werden-tile {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 14px;
  border: 1px solid var(--m-line);
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--m-text-2);
}

.werden-tile strong {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 20px;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--m-text);
}

.werden-line {
  position: relative;
  padding: 24px var(--m-gutter) 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
  view-timeline-name: --werden-line;
}

.werden-line__track {
  position: absolute;
  left: 31px;
  top: 32px;
  bottom: 16px;
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
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.werden-steps {
  margin: 0;
  list-style: none;
}

.werden-step {
  flex: none;
  width: 220px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, #0b1d45, #071637);
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.werden-step__num {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 44px;
  line-height: 1;
  color: var(--m-yellow);
}

.werden-step strong {
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 22px;
  line-height: 1.1;
  text-transform: uppercase;
  color: var(--m-text);
}

.werden-box {
  border-radius: 28px;
  padding: 30px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.werden-box__crest {
  right: -70px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  opacity: 0.14;
}

.werden-box__title {
  position: relative;
  font-size: 44px;
  line-height: 0.92;
}

.werden-box__text {
  position: relative;
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.werden-box__btn {
  position: relative;
  align-self: flex-start;
}

.werden-links {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.werden-form {
  margin-top: 20px;
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
