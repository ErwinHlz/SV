<template>
  <PageHero :image="youthHero" :title="hero.title" :lead="hero.lead" />

  <section class="youth-intro" aria-label="Jugendintro">
    <div class="intro-card">
      <h2 class="intro-title">{{ intro.title }}</h2>
      <p class="intro-text">{{ intro.text }}</p>
    </div>
  </section>

  <section class="teams-section" aria-label="Jugendmannschaften">
    <header class="teams-header">
      <h2 class="teams-title">{{ teamsSection.title }}</h2>
      <p class="teams-lead">{{ teamsSection.lead }}</p>
    </header>
    <div class="teams-grid">
      <article
        v-for="team in teamCards"
        :key="team.id"
        class="team-card"
        type="button"
        @click="openWidget(team.id)">
        <div class="team-body">
          <div class="team-header">
            <div>
              <p class="team-age">{{ team.ageGroup }}</p>
              <h3 class="team-name">{{ team.name }}</h3>
            </div>
            <span class="team-league">{{ team.league }}</span>
          </div>
          <p class="team-description">{{ team.description }}</p>
        </div>
        <div class="team-media">
          <img :src="team.image" :alt="team.imageAlt" loading="lazy" />
        </div>
      </article>
    </div>
  </section>

  <div v-if="activeTeam" class="widget-overlay" @click.self="closeWidget">
    <div
      class="widget-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`widget-title-${activeTeam.id}`">
      <button
        class="widget-close"
        type="button"
        aria-label="Popup schliessen"
        @click="closeWidget">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <div class="widget-header">
        <p class="widget-kicker">fussball.de</p>
        <h3 class="widget-title" :id="`widget-title-${activeTeam.id}`">
          {{ activeTeam.name }}
        </h3>
        <p class="widget-lead">
          {{
            activeTeam.hasWidget ? activeTeam.widgetTitle : "Widget einrichten"
          }}
        </p>
      </div>
      <div class="widget-frame">
        <div
          v-if="activeTeam.hasWidget"
          :key="activeTeam.widgetId"
          class="fussballde_widget"
          :data-id="activeTeam.widgetId"
          data-type="table"
          style="width: 100%"></div>
        <p v-else class="widget-placeholder">
          Widget-ID fehlt fuer dieses Team.
        </p>
        <div
          class="fussballde_widget flex justify-self-center"
          data-id="acdd744c-fe54-436a-a405-1a43a2b3c12b"
          data-type="table"
          style="width: 30%"></div>
      </div>
    </div>
  </div>

  <section class="coach-section" aria-label="Trainerteam">
    <header class="coach-header">
      <h2 class="coach-title">{{ coachSection.title }}</h2>
      <p class="coach-lead">{{ coachSection.lead }}</p>
    </header>
    <div class="coach-grid">
      <article
        v-for="member in coachSection.members"
        :key="member.id"
        class="coach-card">
        <div class="coach-identity">
          <div class="coach-avatar">{{ getInitials(member.name) }}</div>
          <div>
            <p class="coach-name">{{ member.name }}</p>
            <p class="coach-role">{{ member.role }}</p>
          </div>
        </div>
        <p class="coach-focus">{{ member.focus }}</p>
      </article>
    </div>
  </section>

  <section class="youth-contact" aria-label="Kontakt Jugend">
    <div class="contact-card">
      <h2 class="contact-title">{{ contact.title }}</h2>
      <p class="contact-lead">{{ contact.lead }}</p>
      <dl class="contact-list">
        <div class="contact-item">
          <dt>{{ contact.labels.name }}</dt>
          <dd>{{ contact.name }}</dd>
        </div>
        <div class="contact-item">
          <dt>{{ contact.labels.role }}</dt>
          <dd>{{ contact.role }}</dd>
        </div>
        <div class="contact-item">
          <dt>{{ contact.labels.phone }}</dt>
          <dd>
            <a v-if="phoneHref" :href="phoneHref">{{ contact.phone }}</a>
            <span v-else>{{ contact.phone }}</span>
          </dd>
        </div>
        <div class="contact-item">
          <dt>{{ contact.labels.email }}</dt>
          <dd>
            <a v-if="emailHref" :href="emailHref">{{ contact.email }}</a>
            <span v-else>{{ contact.email }}</span>
          </dd>
        </div>
      </dl>
      <p class="contact-note">{{ contact.note }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import PageHero from "@/components/PageHero.vue";
import youthHero from "@/assets/header/background.png";
import rawYouthContent from "@/content/jugend.json";

type YouthTeamWidget = {
  id?: string;
  type?: string;
  title?: string;
};

type YouthTeam = {
  id: string;
  name: string;
  ageGroup: string;
  league: string;
  description: string;
  image: string;
  imageAlt: string;
  widget?: YouthTeamWidget;
};

type CoachMember = {
  id: string;
  name: string;
  role: string;
  focus: string;
};

type YouthContent = {
  hero: {
    title: string;
    lead: string;
  };
  intro: {
    title: string;
    text: string;
  };
  teamsSection: {
    title: string;
    lead: string;
  };
  teams: YouthTeam[];
  coachSection: {
    title: string;
    lead: string;
    members: CoachMember[];
  };
  contact: {
    title: string;
    lead: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    note: string;
    labels: {
      name: string;
      role: string;
      phone: string;
      email: string;
    };
  };
};

const youthContent = rawYouthContent as YouthContent;
const { hero, intro, teamsSection, coachSection, contact } = youthContent;

const teamImageMap: Record<string, string> = {
  youthHero,
};

type YouthTeamCard = YouthTeam & {
  widgetId: string;
  widgetType: string;
  widgetTitle: string;
  hasWidget: boolean;
};

const teamCards: YouthTeamCard[] = youthContent.teams.map((team) => {
  const widgetId = team.widget?.id?.trim() ?? "";
  return {
    ...team,
    image: teamImageMap[team.image] ?? team.image,
    widgetId,
    widgetType: team.widget?.type ?? "team-matches",
    widgetTitle: team.widget?.title ?? "Spielplan & Ergebnisse",
    hasWidget: widgetId.length > 0,
  };
});

const activeTeamId = ref<string | null>(null);
const activeTeam = computed(
  () => teamCards.find((team) => team.id === activeTeamId.value) ?? null
);

const phoneHref = contact.phone
  ? `tel:${contact.phone.replace(/\s+/g, "")}`
  : "";
const emailHref = contact.email ? `mailto:${contact.email}` : "";

const refreshWidgets = () => {
  const widgetInit =
    (window as any).fussballdeWidgets ||
    (window as any).fussballdeWidget ||
    (window as any).fussballDeWidgets;

  if (typeof widgetInit === "function") {
    widgetInit();
  }
};

const openWidget = async (teamId: string) => {
  activeTeamId.value = teamId;
  await nextTick();
  if (activeTeam.value?.hasWidget) {
    refreshWidgets();
  }
};

const closeWidget = () => {
  activeTeamId.value = null;
};

const getInitials = (value?: string) =>
  (value ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
</script>

<style scoped>
.youth-intro,
.teams-section,
.coach-section,
.youth-contact {
  width: 80dvw;
  margin: 0 auto;
}

.youth-intro {
  margin-bottom: clamp(32px, 6vw, 64px);
}

.intro-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: clamp(20px, 3vw, 36px);
  display: grid;
  gap: 12px;
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.intro-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.intro-text {
  margin: 0;
  max-width: 70ch;
  opacity: 0.9;
}

.teams-section {
  margin-bottom: clamp(40px, 8vw, 96px);
}

.teams-header {
  display: grid;
  gap: 8px;
  margin-bottom: clamp(20px, 3vw, 32px);
}

.teams-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.teams-lead {
  margin: 0;
  max-width: 70ch;
  opacity: 0.9;
}

.teams-grid {
  display: grid;
  grid-template-columns: 40dvw 40dvw;
  gap: clamp(16px, 2.5vw, 32px);
}

.team-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: stretch;
  gap: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-6px);
  border-color: rgba(244, 208, 71, 0.7);
  box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
}

.team-media {
  position: relative;
  min-height: clamp(180px, 25vw, 240px);
  overflow: hidden;
  background: rgba(2, 43, 121, 0.3);
  clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%);
}

.team-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1);
  transition: transform 0.6s ease;
}

.team-card:hover .team-media img {
  transform: scale(1.05);
}

.team-body {
  padding: clamp(16px, 2.4vw, 24px);
  display: grid;
  gap: 10px;
}

.team-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.team-age {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 11px;
  color: var(--sv-secondary-color);
}

.team-name {
  margin: 0;
  font-size: clamp(18px, 2vw, 22px);
}

.team-league {
  align-self: start;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(2, 43, 121, 0.6);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sv-secondary-color);
}

.team-description {
  margin: 0;
  opacity: 0.9;
}

.team-widget-button {
  margin-top: 6px;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 16px;
  border-radius: 16px;
  border: 1px solid rgba(244, 208, 71, 0.45);
  background: rgba(2, 43, 121, 0.45);
  color: var(--sv-secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease,
    color 0.25s ease, border-color 0.25s ease;
}

.team-widget-button:hover,
.team-widget-button:focus-visible {
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 10px 22px rgba(2, 43, 121, 0.22);
  transform: translateY(-2px);
}

.team-widget-kicker {
  font-size: 10px;
  letter-spacing: 0.2em;
  opacity: 0.75;
}

.team-widget-label {
  font-size: 12px;
  letter-spacing: 0.14em;
}

.widget-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 48px);
  background: rgba(2, 43, 121, 0.45);
  backdrop-filter: blur(3px);
}

.widget-modal {
  position: relative;
  width: min(1100px, 100%);
  max-height: 90dvh;
  background-color: #f7f1e3;
  background-image: repeating-linear-gradient(
      90deg,
      rgba(17, 24, 39, 0.03),
      rgba(17, 24, 39, 0.03) 1px,
      transparent 1px,
      transparent 7px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(17, 24, 39, 0.04),
      rgba(17, 24, 39, 0.04) 1px,
      transparent 1px,
      transparent 6px
    ),
    linear-gradient(135deg, #ffd89d 0%, #d8bb90 55%, #e6d8c3 100%);
  border: 1px solid rgba(11, 31, 77, 0.2);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  color: #1f2a44;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 0.01em;
  box-shadow: 0 24px 60px rgba(11, 31, 77, 0.22);
  padding: clamp(16px, 2.5vw, 28px);
}

.widget-close {
  position: absolute;
  z-index: 11;
  top: 12px;
  right: 12px;
  border: 1px solid var(--sv-primary-color);
  background: transparent;
  color: var(--sv-primary-color);
  width: 50px;
  height: 50px;
  border-radius: 25%;
  display: grid;
  justify-content: center;
  align-content: center;
}

.widget-close svg {
  width: 50px;
  height: 50px;
  stroke: currentColor;
  stroke-width: 1.2;
  fill: none;
}

.widget-close:hover {
  background: var(--sv-primary-color);
  color: var(--sv-secondary-color);
}

.widget-header {
  display: grid;
  gap: 6px;
}

.widget-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 11px;
  color: rgba(31, 42, 68, 0.65);
}

.widget-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
}

.widget-lead {
  margin: 0;
  opacity: 0.8;
}

.widget-frame {
  width: min(var(--sv-fupa-width), 100%);
  height: var(--sv-fupa-height);
  border-radius: 16px;
  overflow: hidden;
  background: #faf7ef;
  border: 1px solid rgba(11, 31, 77, 0.15);
  margin: 0 auto;
}

.widget-frame .fussballde_widget {
  width: 100%;
  height: 100%;
}

.widget-placeholder {
  margin: 0;
  padding: 24px;
  text-align: center;
  color: rgba(31, 42, 68, 0.7);
}

.coach-section {
  margin-bottom: clamp(40px, 8vw, 96px);
}

.coach-header {
  display: grid;
  gap: 8px;
  margin-bottom: clamp(20px, 3vw, 32px);
}

.coach-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.coach-lead {
  margin: 0;
  max-width: 70ch;
  opacity: 0.9;
}

.coach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.coach-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: clamp(16px, 2.4vw, 24px);
  display: grid;
  gap: 12px;
  min-height: 160px;
}

.coach-identity {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.coach-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(244, 208, 71, 0.15);
  color: var(--sv-secondary-color);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.coach-name {
  margin: 0;
  font-size: 1rem;
}

.coach-role {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.coach-focus {
  margin: 0;
  opacity: 0.85;
}

.youth-contact {
  margin-bottom: clamp(48px, 8vw, 96px);
}

.contact-card {
  background: linear-gradient(
    135deg,
    rgba(2, 43, 121, 0.65),
    rgba(2, 43, 121, 0.15)
  );
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 24px;
  padding: clamp(22px, 3vw, 36px);
  display: grid;
  gap: 16px;
}

.contact-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
}

.contact-lead {
  margin: 0;
  max-width: 70ch;
  opacity: 0.9;
}

.contact-list {
  margin: 0;
  display: grid;
  gap: 12px;
}

.contact-item {
  display: grid;
  grid-template-columns: minmax(80px, 120px) 1fr;
  gap: 12px;
  align-items: baseline;
}

.contact-item dt {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.contact-item dd {
  margin: 0;
}

.contact-item a {
  color: var(--sv-secondary-color);
  text-decoration: none;
}

.contact-item a:hover,
.contact-item a:focus-visible {
  text-decoration: underline;
}

.contact-note {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.85;
}

@media (max-width: 720px) {
  .team-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .team-card {
    grid-template-columns: 1fr;
  }

  .team-media {
    clip-path: none;
  }

  .widget-modal {
    max-height: 92dvh;
  }

  .coach-identity {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .contact-item {
    grid-template-columns: 1fr;
  }
}
</style>
