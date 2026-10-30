<template>
  <main class="sponsor-become-page">
    <PageHero :title="hero.title" :lead="hero.lead" kicker="Partner werden">
      <a :href="downloadHref" class="sponsor-download-button" download>
        <Download :size="18" :stroke-width="2.2" aria-hidden="true" />
        {{ download.label }}
      </a>
    </PageHero>

    <section class="sponsor-intro" aria-labelledby="sponsor-intro-title">
      <div class="sponsor-intro__shell">
        <p class="sponsor-intro__kicker">{{ intro.kicker }}</p>
        <h2 id="sponsor-intro-title" class="sponsor-intro__title">{{ intro.title }}</h2>
        <p class="sponsor-intro__text">{{ intro.text }}</p>
      </div>

      <h3 class="sponsor-channels__heading">{{ channelsTitle }}</h3>

      <div class="sponsor-channels">
        <article v-for="channel in channels" :key="channel.title" class="sponsor-channel">
          <h4 class="sponsor-channel__title">{{ channel.title }}</h4>
          <p class="sponsor-channel__text">{{ channel.text }}</p>
        </article>
      </div>

      <h3 class="sponsor-channels__heading">Was du davon hast</h3>

      <div class="sponsor-channels">
        <article v-for="item in benefits" :key="item.title" class="sponsor-channel">
          <h4 class="sponsor-channel__title">{{ item.title }}</h4>
          <p class="sponsor-channel__text">{{ item.text }}</p>
        </article>
      </div>
    </section>

    <header class="sponsor-section-head">
      <p class="sponsor-intro__kicker">{{ packagesIntro.kicker }}</p>
      <h2 class="sponsor-intro__title">{{ packagesIntro.title }}</h2>
    </header>

    <section
      ref="timelineRef"
      class="sponsor-timeline"
      aria-label="Möglichkeiten der Unterstützung">
      <div class="sponsor-timeline__line" aria-hidden="true">
        <div class="sponsor-timeline__line-base"></div>
        <div
          class="sponsor-timeline__line-progress"
          :style="{ transform: `scaleY(${timelineProgress})` }"></div>
      </div>

      <div class="sponsor-timeline__list">
        <article
          v-for="(pkg, index) in packages"
          :key="pkg.id"
          class="sponsor-timeline__item"
          :class="
            index % 2 === 0
              ? 'sponsor-timeline__item--left'
              : 'sponsor-timeline__item--right'
          ">
          <div
            v-for="side in ['left', 'right']"
            :key="side"
            class="sponsor-timeline__side"
            :class="`sponsor-timeline__side--${side}`">
            <div
              v-if="(side === 'left') === (index % 2 === 0)"
              class="sponsor-timeline__content">
              <p v-if="pkg.highlight" class="sponsor-timeline__eyebrow">
                <span class="sponsor-timeline__badge">{{ pkg.highlight }}</span>
              </p>
              <h3 class="sponsor-timeline__title">{{ pkg.title }}</h3>
              <p v-if="pkg.lead" class="sponsor-timeline__lead">{{ pkg.lead }}</p>
              <ul class="sponsor-timeline__points">
                <li
                  v-for="point in pkg.points"
                  :key="point"
                  class="sponsor-timeline__point">
                  <span
                    class="sponsor-timeline__point-dot"
                    aria-hidden="true"></span>
                  <span class="sponsor-timeline__point-detail">{{ point }}</span>
                </li>
                <li v-if="pkg.link" class="sponsor-timeline__point">
                  <span
                    class="sponsor-timeline__point-dot"
                    aria-hidden="true"></span>
                  <a
                    :href="pkg.link.href"
                    class="sponsor-timeline__point-detail sponsor-timeline__link"
                    target="_blank"
                    rel="noopener noreferrer">{{ pkg.link.label }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="sponsor-timeline__center">
            <span class="sponsor-timeline__dot">{{
              String(index + 1).padStart(2, "0")
            }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="sponsor-steps" aria-labelledby="sponsor-steps-title">
      <p class="sponsor-intro__kicker">{{ steps.kicker }}</p>
      <h2 id="sponsor-steps-title" class="sponsor-intro__title">{{ steps.title }}</h2>
      <ol class="sponsor-steps__list">
        <li v-for="(step, index) in steps.items" :key="step.title" class="sponsor-step">
          <span class="sponsor-step__number" aria-hidden="true">{{ index + 1 }}</span>
          <h3 class="sponsor-step__title">{{ step.title }}</h3>
          <p class="sponsor-step__text">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="sponsor-download" aria-labelledby="sponsor-download-title">
      <div class="sponsor-download__text">
        <FileText :size="34" :stroke-width="1.8" aria-hidden="true" />
        <div>
          <h2 id="sponsor-download-title" class="sponsor-download__title">{{ download.title }}</h2>
          <p>{{ download.text }}</p>
        </div>
      </div>
      <a :href="downloadHref" class="sponsor-download-button" download>
        <Download :size="18" :stroke-width="2.2" aria-hidden="true" />
        {{ download.label }}
      </a>
    </section>

    <section
      class="sponsor-contact"
      aria-labelledby="sponsor-contact-title">
      <div class="sponsor-contact__shell">
        <p class="sponsor-contact__kicker">{{ contact.kicker }}</p>
        <h2 id="sponsor-contact-title" class="sponsor-contact__title">
          {{ contact.title }}
        </h2>
        <p class="sponsor-contact__text">{{ contact.text }}</p>
        <ul class="sponsor-contact__details">
          <li>
            <a :href="`mailto:${contact.email}`"><Mail :size="16" :stroke-width="2" aria-hidden="true" /> {{ contact.email }}</a>
          </li>
          <li>
            <a :href="instagramUrl" target="_blank" rel="noopener noreferrer"><AtSign :size="16" :stroke-width="2" aria-hidden="true" /> {{ contact.instagram }}</a>
          </li>
        </ul>

        <form class="sponsor-contact-form" @submit.prevent="handleSponsorSubmit">
          <div class="sponsor-form-row">
            <label>
              Name
              <input
                v-model="sponsorForm.name"
                type="text"
                name="name"
                autocomplete="name"
                required />
            </label>

            <label>
              E-Mail
              <input
                v-model="sponsorForm.email"
                type="email"
                name="email"
                autocomplete="email"
                required />
            </label>
          </div>

          <div class="sponsor-form-row">
            <label>
              Unternehmen
              <input
                v-model="sponsorForm.company"
                type="text"
                name="company"
                autocomplete="organization" />
            </label>

            <label>
              Interesse
              <input
                v-model="sponsorForm.interest"
                type="text"
                name="interest"
                list="sponsor-interest-options"
                placeholder="z. B. Jugend, Trikots, Instagram" />
              <datalist id="sponsor-interest-options">
                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.title"></option>
              </datalist>
            </label>
          </div>

          <label>
            Nachricht
            <textarea
              v-model="sponsorForm.message"
              name="message"
              rows="6"
              required
              placeholder="Deine Nachricht" />
          </label>

          <button type="submit" class="sponsor-submit">Anfrage senden</button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { AtSign, Download, FileText, Mail } from "@lucide/vue";
import PageHero from "@/components/PageHero.vue";
import rawSponsoring from "@/content/sponsoring.json";
import externalLinks from "@/content/external-links.json";
import { resolveScrollContainer } from "@/utils/scrollContainer";

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

// Die Mappe liegt unter public/ und wird mit dem Script src/scripts/sponsoring-pdf.mjs erzeugt.
const downloadHref = `${import.meta.env.BASE_URL}${download.file}`;
const instagramUrl = externalLinks.social.instagram.url;

const sponsorContactEmail = contact.email;

const sponsorForm = ref({
  name: "",
  email: "",
  company: "",
  interest: "",
  message: "",
});

const handleSponsorSubmit = () => {
  const subject = `Sponsoring-Anfrage${sponsorForm.value.interest ? ` - ${sponsorForm.value.interest}` : ""}`;
  const body = [
    `Name: ${sponsorForm.value.name}`,
    `E-Mail: ${sponsorForm.value.email}`,
    `Unternehmen: ${sponsorForm.value.company || "-"}`,
    `Interesse: ${sponsorForm.value.interest || "-"}`,
    "",
    "Nachricht:",
    sponsorForm.value.message,
  ].join("\n");

  window.location.href = `mailto:${sponsorContactEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
};

const timelineRef = ref<HTMLElement | null>(null);
const timelineProgress = ref(0);
let scrollContainer: Window | HTMLElement | null = null;

const getElementTopWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let current: HTMLElement | null = element;
  let offset = 0;

  while (current && current !== ancestor) {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return offset;
};

const updateTimelineProgress = () => {
  const element = timelineRef.value;

  if (!element) {
    return;
  }

  if (!scrollContainer || scrollContainer instanceof Window) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const absoluteTop = window.scrollY + rect.top;
    const start = absoluteTop - viewportHeight * 0.72;
    const end = absoluteTop + element.offsetHeight - viewportHeight * 0.42;
    const range = Math.max(end - start, 1);
    const current = window.scrollY;

    timelineProgress.value = Math.min(1, Math.max(0, (current - start) / range));
    return;
  }

  const viewportHeight = scrollContainer.clientHeight;
  const absoluteTop = getElementTopWithin(element, scrollContainer);
  const start = absoluteTop - viewportHeight * 0.72;
  const end = absoluteTop + element.offsetHeight - viewportHeight * 0.42;
  const range = Math.max(end - start, 1);
  const current = scrollContainer.scrollTop;

  timelineProgress.value = Math.min(1, Math.max(0, (current - start) / range));
};

onMounted(() => {
  scrollContainer = resolveScrollContainer(timelineRef.value);

  updateTimelineProgress();
  scrollContainer.addEventListener("scroll", updateTimelineProgress, {
    passive: true,
  });
  window.addEventListener("resize", updateTimelineProgress);
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener("scroll", updateTimelineProgress);
  window.removeEventListener("resize", updateTimelineProgress);
});
</script>

<style scoped>
.sponsor-become-page {
  padding-bottom: clamp(56px, 8vw, 96px);
  overflow-x: clip;
}

.sponsor-intro,
.sponsor-timeline,
.sponsor-contact {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.sponsor-intro {
  margin-bottom: clamp(30px, 5vw, 60px);
}

.sponsor-intro__shell {
  text-align: center;
}

.sponsor-intro__kicker,
.sponsor-contact__kicker,
.sponsor-timeline__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  color: rgba(242, 208, 82, 0.92);
}

.sponsor-intro__title,
.sponsor-contact__title {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 4.2rem);
  line-height: 0.98;
}

.sponsor-intro__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.sponsor-timeline {
  position: relative;
  padding-top: 8px;
}

.sponsor-timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
  z-index: 0;
}

.sponsor-timeline__line-base,
.sponsor-timeline__line-progress {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  transform-origin: top;
}

.sponsor-timeline__line-base {
  background: rgba(255, 255, 255, 0.12);
}

.sponsor-timeline__line-progress {
  background: linear-gradient(180deg, #f2d052 0%, #e3aa1d 42%, #2d7ff9 100%);
  box-shadow: 0 0 26px rgba(242, 208, 82, 0.28);
}

.sponsor-timeline__list {
  display: grid;
  gap: 28px;
}

.sponsor-timeline__item {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: stretch;
}

.sponsor-timeline__side {
  display: flex;
}

.sponsor-timeline__item--left .sponsor-timeline__side--left {
  justify-content: flex-end;
}

.sponsor-timeline__item--right .sponsor-timeline__side--right {
  justify-content: flex-start;
}

.sponsor-timeline__center {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  align-self: start;
}

.sponsor-timeline__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: #09162f;
  border: 4px solid rgba(242, 208, 82, 0.95);
  box-shadow: 0 0 0 10px rgba(242, 208, 82, 0.08);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--sv-secondary-color);
}

.sponsor-timeline__content {
  width: min(100%, 500px);
  padding: 12px 0;
}

.sponsor-timeline__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.sponsor-timeline__lead {
  margin: 10px 0 0;
  color: rgba(245, 247, 252, 0.78);
  line-height: 1.55;
}

.sponsor-timeline__points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sponsor-timeline__point {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.sponsor-timeline__point-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(242, 208, 82, 0.85);
  margin-top: 8px;
}

.sponsor-timeline__point-detail {
  font-size: 0.9rem;
  color: rgba(245, 247, 252, 0.62);
  line-height: 1.5;
}

.sponsor-timeline__link {
  color: #f2d052;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.sponsor-timeline__item--left .sponsor-timeline__content {
  padding-right: clamp(18px, 3vw, 42px);
  text-align: right;
}

.sponsor-timeline__item--left .sponsor-timeline__point {
  flex-direction: row-reverse;
}

.sponsor-timeline__item--right .sponsor-timeline__content {
  padding-left: clamp(18px, 3vw, 42px);
}

.sponsor-contact {
  margin-top: clamp(52px, 8vw, 96px);
}

.sponsor-contact__shell {
  text-align: center;
}

.sponsor-contact__text {
  width: min(600px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.88);
}

.sponsor-contact-form {
  width: min(720px, 100%);
  margin: clamp(2rem, 4vw, 3rem) auto 0;
  display: grid;
  gap: 1rem;
  text-align: left;
}

.sponsor-form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.sponsor-contact-form label {
  display: grid;
  gap: 0.45rem;
  font-size: 0.84rem;
  font-weight: 800;
  color: rgba(245, 247, 252, 0.72);
}

.sponsor-contact-form input,
.sponsor-contact-form textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--sv-text-color);
  font: inherit;
  box-sizing: border-box;
}

.sponsor-contact-form input::placeholder,
.sponsor-contact-form textarea::placeholder {
  color: rgba(245, 247, 252, 0.34);
}

.sponsor-contact-form input:focus,
.sponsor-contact-form textarea:focus {
  outline: 3px solid rgba(244, 208, 71, 0.14);
  border-color: rgba(244, 208, 71, 0.5);
}

.sponsor-submit {
  justify-self: start;
  border: 0;
  border-radius: 999px;
  padding: 1rem 1.6rem;
  background: var(--sv-secondary-color);
  color: #171a1f;
  font: inherit;
  font-weight: 850;
  cursor: pointer;
  transition: transform 0.22s ease;
}

.sponsor-submit:hover {
  transform: translateY(-2px);
}

/* Beide Seiten stehen im Markup hintereinander, die Mitte gehört dazwischen. */
.sponsor-timeline__side--left {
  order: 1;
}

.sponsor-timeline__center {
  order: 2;
}

.sponsor-timeline__side--right {
  order: 3;
}

.sponsor-timeline__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(242, 208, 82, 0.16);
  color: #f2d052;
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  vertical-align: 1px;
}

.sponsor-intro__text {
  width: min(760px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.8);
}

.sponsor-channels__heading {
  margin: clamp(2rem, 5vw, 3.5rem) 0 0;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  line-height: 1.1;
  text-align: center;
}

.sponsor-channels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;
}

.sponsor-channel {
  padding: 22px 24px;
  border-left: 4px solid var(--sv-secondary-color);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.sponsor-channel__title {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.sponsor-channel__text {
  margin: 0;
  line-height: 1.6;
  color: rgba(245, 247, 252, 0.72);
}

.sponsor-section-head,
.sponsor-steps,
.sponsor-download {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.sponsor-section-head {
  margin-bottom: clamp(24px, 4vw, 40px);
  text-align: center;
}

.sponsor-steps {
  margin-top: clamp(52px, 8vw, 96px);
  text-align: center;
}

.sponsor-steps__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: clamp(1.6rem, 4vw, 2.6rem) 0 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.sponsor-step {
  padding: 22px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
}

.sponsor-step__number {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--sv-secondary-color);
  color: #171a1f;
  font-weight: 850;
}

.sponsor-step__title {
  margin: 14px 0 6px;
  font-size: 1.1rem;
}

.sponsor-step__text {
  margin: 0;
  line-height: 1.55;
  color: rgba(245, 247, 252, 0.72);
}

.sponsor-download {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: clamp(40px, 6vw, 72px);
  padding: clamp(22px, 3vw, 32px);
  border: 1px solid rgba(242, 208, 82, 0.35);
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(242, 208, 82, 0.12), rgba(45, 127, 249, 0.08));
}

.sponsor-download__text {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--sv-secondary-color);
}

.sponsor-download__text p {
  margin: 4px 0 0;
  color: rgba(245, 247, 252, 0.78);
}

.sponsor-download__title {
  margin: 0;
  font-size: 1.4rem;
  color: #fff;
}

.sponsor-download-button {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin-top: 18px;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: #171a1f;
  font-weight: 850;
  text-decoration: none;
  transition: transform 0.22s ease;
}

.sponsor-download .sponsor-download-button {
  margin-top: 0;
}

.sponsor-download-button:hover,
.sponsor-download-button:focus-visible {
  color: #171a1f;
  transform: translateY(-2px);
}

.sponsor-contact__details {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 24px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  color: rgba(245, 247, 252, 0.88);
}

.sponsor-contact__details a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sv-secondary-color);
  text-decoration: none;
}

.sponsor-contact__details a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .sponsor-intro__columns {
    grid-template-columns: 1fr;
  }

  .sponsor-steps__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .sponsor-channels {
    grid-template-columns: 1fr;
  }

  .sponsor-timeline__line {
    left: 22px;
    transform: none;
  }

  .sponsor-timeline__item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 10px 12px;
  }

  .sponsor-timeline__center {
    grid-column: 1;
    grid-row: 1;
    align-self: start;
    padding-top: 8px;
  }

  .sponsor-timeline__dot {
    width: 32px;
    height: 32px;
    font-size: 0.6rem;
  }

  .sponsor-timeline__side,
  .sponsor-timeline__item--left .sponsor-timeline__side--left,
  .sponsor-timeline__item--right .sponsor-timeline__side--right {
    grid-column: 2;
    grid-row: 1;
    justify-content: stretch;
  }

  .sponsor-timeline__item--left .sponsor-timeline__side--right,
  .sponsor-timeline__item--right .sponsor-timeline__side--left {
    display: none;
  }

  .sponsor-timeline__content {
    width: 100%;
  }

  .sponsor-timeline__item--left .sponsor-timeline__content,
  .sponsor-timeline__item--right .sponsor-timeline__content {
    padding: 0 0 0 10px;
    text-align: left;
  }

  .sponsor-timeline__item--left .sponsor-timeline__point {
    flex-direction: row;
  }
}

@media (max-width: 640px) {
  .sponsor-intro,
  .sponsor-timeline,
  .sponsor-contact,
  .sponsor-section-head,
  .sponsor-steps,
  .sponsor-download {
    width: calc(100% - 24px);
  }

  .sponsor-steps__list {
    grid-template-columns: 1fr;
  }

  .sponsor-download-button {
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }

  .sponsor-timeline__list {
    gap: 20px;
  }

  .sponsor-form-row {
    grid-template-columns: 1fr;
  }

  .sponsor-submit {
    width: 100%;
  }
}
</style>
