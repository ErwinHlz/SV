<script setup lang="ts">
import { reactive } from "vue";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, ShieldCheck } from "@lucide/vue";
import heroImage from "@/assets/header/background.png";
import DummySilhouette from "@/components/DummySilhouette.vue";

type Team = {
  id: string;
  name: string;
  ageGroup: string;
  league: string;
  description: string;
  image: string;
  imageAlt: string;
  tableUrl?: string;
  training?: Array<{ day: string; time: string; location: string }>;
};

type Coach = { id: string; name: string; role: string; image?: string; imageAlt: string };

type Chapter = { id: string; eyebrow: string; title: string; lead?: string; points: string[] };

export type JugendContactForm = { name: string; email: string; team: string; message: string };

defineProps<{
  teams: Team[];
  teamsTitle: string;
  chapters: Chapter[];
  coaches: Coach[];
  coachTitle: string;
  mapsHref: string;
  contact: {
    title: string;
    lead: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    note: string;
  };
}>();

const emit = defineEmits<{ submit: [form: JugendContactForm] }>();

const form = reactive<JugendContactForm>({ name: "", email: "", team: "", message: "" });

const sections = [
  { label: "Teams", href: "#jugendteams" },
  { label: "Konzept", href: "#jugendkonzept" },
  { label: "Trainer", href: "#jugendtrainer" },
  { label: "Kontakt", href: "#jugendkontakt" },
];

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
</script>

<template>
  <div class="m-page youth">
    <section class="youth-hero">
      <img class="youth-hero__image m-par" :src="heroImage" alt="" />
      <div class="youth-hero__shade" aria-hidden="true"></div>
      <div class="youth-hero__content m-fadeout">
        <p class="m-kicker">Jugendfußball</p>
        <h1 class="m-display youth-hero__title">Unser<br />Nachwuchs.</h1>
      </div>
    </section>

    <aside class="youth-notice" aria-label="Hinweis zum Schutz der Kinder">
      <ShieldCheck :size="22" :stroke-width="2" class="youth-notice__icon" aria-hidden="true" />
      <p>
        <strong>Der Schutz unserer Kinder steht an erster Stelle.</strong>
        Deshalb zeigen wir keine Fotos unserer Kinder und Jugendlichen, sondern
        Illustrationen und allgemeine Vereinsbilder.
      </p>
    </aside>

    <div class="m-sticky-bar youth__jump">
      <nav class="m-tabs" aria-label="Bereiche der Jugendseite">
        <a v-for="section in sections" :key="section.href" :href="section.href" class="m-tab">
          {{ section.label }}
        </a>
      </nav>
    </div>

    <section id="jugendteams" class="youth-section" aria-label="Jugendteams">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">{{ teams.length }} Mannschaften</p>
          <h2 class="m-section-title">{{ teamsTitle }}</h2>
        </div>
      </div>

      <div class="youth-teams">
        <article v-for="team in teams" :key="team.id" class="youth-team m-rv">
          <div class="youth-team__media">
            <img :src="team.image" :alt="team.imageAlt" loading="lazy" />
          </div>
          <div class="youth-team__body">
            <p class="youth-team__age">{{ team.ageGroup }}</p>
            <h3 class="m-display youth-team__name">{{ team.name }}</h3>
            <p class="youth-team__league">{{ team.league }}</p>
            <p class="youth-team__text">{{ team.description }}</p>

            <ul v-if="team.training?.length" class="youth-team__training" aria-label="Trainingszeiten">
              <li v-for="slot in team.training" :key="`${slot.day}-${slot.time}-${slot.location}`">
                <Clock :size="16" :stroke-width="2" aria-hidden="true" />
                <span>
                  <strong>{{ slot.day }}</strong> · {{ slot.time }}
                  <span class="youth-team__place">{{ slot.location }}</span>
                </span>
              </li>
            </ul>

            <div class="youth-team__links">
              <a v-if="team.tableUrl" :href="team.tableUrl" target="_blank" rel="noopener noreferrer" class="m-text-link">
                Tabelle <ArrowUpRight :size="16" :stroke-width="2" />
              </a>
              <a v-if="mapsHref" :href="mapsHref" target="_blank" rel="noopener noreferrer" class="m-text-link">
                <MapPin :size="16" :stroke-width="2" /> Spielstätte
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="jugendkonzept" class="youth-section" aria-label="Unser Konzept">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">Konzept</p>
          <h2 class="m-section-title">So arbeiten wir</h2>
        </div>
      </div>
      <div class="youth-chapters">
        <article v-for="(chapter, index) in chapters" :key="chapter.id" class="youth-chapter m-rv">
          <span class="youth-chapter__num" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
          <div class="youth-chapter__body">
            <p class="youth-chapter__eyebrow">{{ chapter.eyebrow }}</p>
            <h3 class="youth-chapter__title">{{ chapter.title }}</h3>
            <p v-if="chapter.lead" class="youth-chapter__lead">{{ chapter.lead }}</p>
            <ul class="youth-chapter__points">
              <li v-for="point in chapter.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section v-if="coaches.length" id="jugendtrainer" class="youth-section" aria-label="Trainerteam">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">Trainerteam</p>
          <h2 class="m-section-title">{{ coachTitle }}</h2>
        </div>
      </div>
      <div class="m-rail">
        <article v-for="coach in coaches" :key="coach.id" class="youth-coach m-ri">
          <span class="youth-coach__photo">
            <img v-if="coach.image" :src="coach.image" :alt="coach.imageAlt" loading="lazy" />
            <DummySilhouette v-else />
          </span>
          <span class="youth-coach__role">{{ coach.role }}</span>
          <span class="youth-coach__name">{{ coach.name }}</span>
        </article>
      </div>
    </section>

    <section id="jugendkontakt" class="youth-section" aria-label="Kontakt Jugend">
      <div class="m-section-head">
        <div>
          <p class="m-kicker">Probetraining</p>
          <h2 class="m-section-title">{{ contact.title }}</h2>
        </div>
      </div>

      <div class="youth-contact">
        <div class="youth-contact__person">
          <span class="youth-contact__role">{{ contact.role }}</span>
          <span class="youth-contact__name">{{ contact.name }}</span>
          <a v-if="contact.phone" :href="telHref(contact.phone)" class="youth-contact__link">
            <Phone :size="18" :stroke-width="2" /> {{ contact.phone }}
          </a>
          <a v-if="contact.email" :href="`mailto:${contact.email}`" class="youth-contact__link">
            <Mail :size="18" :stroke-width="2" /> {{ contact.email }}
          </a>
          <p v-if="contact.note" class="youth-contact__note">{{ contact.note }}</p>
        </div>

        <form class="youth-form" @submit.prevent="emit('submit', { ...form })">
          <label>
            <span>Name</span>
            <input v-model="form.name" type="text" autocomplete="name" required />
          </label>
          <label>
            <span>E-Mail</span>
            <input v-model="form.email" type="email" autocomplete="email" required />
          </label>
          <label>
            <span>Mannschaft / Alter</span>
            <input v-model="form.team" type="text" placeholder="z. B. D-Jugend, 11 Jahre" />
          </label>
          <label>
            <span>Nachricht</span>
            <textarea
              v-model="form.message"
              rows="5"
              required
              placeholder="Hallo, ich interessiere mich für ein Probetraining …"></textarea>
          </label>
          <button type="submit" class="m-btn youth-form__submit">Anfrage senden</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.youth {
  padding-bottom: 56px;
}

.youth-hero {
  position: relative;
  height: 460px;
  overflow: hidden;
}

.youth-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.youth-hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 6, 17, 0.6) 0%,
    rgba(0, 6, 17, 0.1) 25%,
    rgba(0, 6, 17, 0.3) 55%,
    rgba(0, 6, 17, 1) 100%
  );
}

.youth-hero__content {
  position: absolute;
  left: var(--m-gutter);
  right: var(--m-gutter);
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.youth-hero__title {
  font-size: 64px;
}

.youth-notice {
  margin: 8px var(--m-gutter) 0;
  padding: 14px;
  border: 1px solid rgba(244, 208, 71, 0.35);
  border-radius: 16px;
  background: rgba(244, 208, 71, 0.06);
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 12px;
}

.youth-notice__icon {
  color: var(--m-yellow);
}

.youth-notice p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.youth-notice strong {
  display: block;
  margin-bottom: 2px;
  color: var(--m-text);
}

.youth__jump {
  margin-top: 20px;
}

.youth-section {
  padding-top: 44px;
  scroll-margin-top: calc(var(--m-header) + 40px);
}

.youth-teams {
  padding: 0 var(--m-gutter);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.youth-team {
  border: 1px solid var(--m-line);
  border-radius: 22px;
  overflow: hidden;
}

.youth-team__media {
  aspect-ratio: 16 / 10;
  background: linear-gradient(160deg, #0b1d45, #04102a);
  display: flex;
  align-items: center;
  justify-content: center;
}

.youth-team__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.youth-team__body {
  padding: 16px 16px 8px;
}

.youth-team__age {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.youth-team__name {
  margin: 6px 0 2px;
  font-size: 34px;
}

.youth-team__league {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--m-meta);
}

.youth-team__text {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.youth-team__training {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--m-line);
}

.youth-team__training li {
  padding: 10px 0;
  border-bottom: 1px solid var(--m-line);
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  font-size: 14px;
}

.youth-team__training svg {
  margin-top: 2px;
  color: var(--m-yellow);
}

.youth-team__place {
  display: block;
  font-size: 12px;
  color: var(--m-meta);
}

.youth-team__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 22px;
}

.youth-chapters {
  padding: 0 var(--m-gutter);
}

.youth-chapter {
  padding: 18px 0;
  border-top: 1px solid var(--m-line);
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
}

.youth-chapter__num {
  font-family: var(--m-display);
  font-weight: 800;
  font-size: 40px;
  line-height: 0.9;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(244, 208, 71, 0.7);
}

.youth-chapter__body {
  min-width: 0;
}

.youth-chapter__eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-meta);
}

.youth-chapter__title {
  margin: 4px 0 0;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 24px;
  line-height: 1.05;
  text-transform: uppercase;
}

.youth-chapter__lead {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.youth-chapter__points {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.youth-chapter__points li {
  padding-left: 12px;
  border-left: 2px solid rgba(244, 208, 71, 0.6);
  font-size: 14px;
  line-height: 1.45;
  color: var(--m-text-2);
}

.youth-coach {
  flex: none;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.youth-coach__photo {
  height: 180px;
  margin-bottom: 8px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #0b1d45, #071637);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.youth-coach__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.youth-coach__photo :deep(svg) {
  width: 78%;
  height: 78%;
}

.youth-coach__role {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.youth-coach__name {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.25;
}

.youth-contact {
  padding: 0 var(--m-gutter);
}

.youth-contact__person {
  padding: 18px;
  border: 1.5px solid var(--m-yellow);
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.youth-contact__role {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--m-yellow);
}

.youth-contact__name {
  margin-bottom: 6px;
  font-family: var(--m-display);
  font-weight: 700;
  font-size: 28px;
  text-transform: uppercase;
}

.youth-contact__link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--m-text);
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.youth-contact__link svg {
  flex: none;
  color: var(--m-yellow);
}

.youth-contact__note {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.youth-form {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.youth-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--m-text-2);
}

/* 16px verhindert das automatische Zoomen von iOS beim Fokussieren. */
.youth-form input,
.youth-form textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 50px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--m-text);
  font-family: var(--m-body);
  font-size: 16px;
}

.youth-form textarea {
  resize: vertical;
}

.youth-form input:focus,
.youth-form textarea:focus {
  outline: none;
  border-color: var(--m-yellow);
  box-shadow: 0 0 0 3px rgba(244, 208, 71, 0.18);
}

.youth-form input::placeholder,
.youth-form textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.youth-form__submit {
  width: 100%;
  margin-top: 4px;
}
</style>
