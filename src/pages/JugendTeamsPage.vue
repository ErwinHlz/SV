<template>
  <main class="youth-page">
    <PageHero
      :image="youthHero"
      :title="hero.title"
      :lead="hero.lead"
      kicker="Jugendfussball"
    />

    <section class="youth-intro" aria-label="Einleitung zur Jugendabteilung">
      <div class="youth-intro__shell">
        <p class="youth-intro__kicker">Nachwuchs</p>
        <h2 class="youth-intro__title">Ausbildung, Teamgeist und Freude am Spiel</h2>
        <p class="youth-intro__lead">
          Die Jugendabteilung der FSG fuehrt vom ersten Ballkontakt bis zum
          Uebergang in den Aktivenbereich. Im Mittelpunkt stehen altersgerechte
          Entwicklung, klare Werte und ein starkes Miteinander.
        </p>
      </div>
    </section>

    <section
      ref="timelineRef"
      class="youth-timeline"
      aria-label="Zeitstrahl der Jugendabteilung"
    >
      <div class="youth-timeline__line" aria-hidden="true">
        <div class="youth-timeline__line-base"></div>
        <div
          class="youth-timeline__line-progress"
          :style="{ transform: `scaleY(${timelineProgress})` }"
        ></div>
      </div>

      <div class="youth-timeline__list">
        <article
          v-for="(entry, index) in timelineEntries"
          :key="entry.id"
          class="youth-timeline__item"
          :class="index % 2 === 0 ? 'youth-timeline__item--left' : 'youth-timeline__item--right'"
        >
          <div class="youth-timeline__side youth-timeline__side--left">
            <div v-if="index % 2 === 0" class="youth-timeline__content">
              <p class="youth-timeline__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="youth-timeline__title">{{ entry.title }}</h3>
              <p v-if="entry.lead" class="youth-timeline__lead">{{ entry.lead }}</p>
              <ul class="youth-timeline__points">
                <li v-for="point in entry.points" :key="point" class="youth-timeline__point">
                  <span class="youth-timeline__point-dot" aria-hidden="true"></span>
                  <span class="youth-timeline__point-body">{{ point }}</span>
                </li>
              </ul>
            </div>
            <div v-else class="youth-timeline__counterpart">
              <img
                v-if="entry.imageSrc"
                class="youth-timeline__counterpart-image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.counterpart"
                loading="lazy"
              />
              <span v-else>{{ entry.counterpart }}</span>
            </div>
          </div>

          <div class="youth-timeline__center">
            <span class="youth-timeline__dot"></span>
          </div>

          <div class="youth-timeline__side youth-timeline__side--right">
            <div v-if="index % 2 === 1" class="youth-timeline__content">
              <p class="youth-timeline__eyebrow">{{ entry.eyebrow }}</p>
              <h3 class="youth-timeline__title">{{ entry.title }}</h3>
              <p v-if="entry.lead" class="youth-timeline__lead">{{ entry.lead }}</p>
              <ul class="youth-timeline__points">
                <li v-for="point in entry.points" :key="point" class="youth-timeline__point">
                  <span class="youth-timeline__point-dot" aria-hidden="true"></span>
                  <span class="youth-timeline__point-body">{{ point }}</span>
                </li>
              </ul>
            </div>
            <div v-else class="youth-timeline__counterpart">
              <img
                v-if="entry.imageSrc"
                class="youth-timeline__counterpart-image"
                :src="resolveTimelineImagePath(entry.imageSrc)"
                :alt="entry.imageAlt ?? entry.counterpart"
                loading="lazy"
              />
              <span v-else>{{ entry.counterpart }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="jugendteams" class="youth-teams" aria-label="Jugendteams">
      <div class="youth-section-shell">
        <p class="youth-section-kicker">Teams</p>
        <h2 class="youth-section-title">{{ teamsSection.title }}</h2>
        <p class="youth-section-lead">{{ teamsSection.lead }}</p>

        <div
          ref="teamsGridRef"
          class="youth-teams__grid"
          @scroll.passive="handleTeamsGridScroll"
        >
          <article
            v-for="(team, index) in visibleTeamCards"
            :key="team.id"
            class="youth-team-card"
            :class="{ 'is-active': !isDesktopTeamLayout && index === activeTeamPage }"
          >
            <div class="youth-team-card__media">
              <img :src="team.image" :alt="team.imageAlt" loading="lazy" />
            </div>
            <div class="youth-team-card__body">
              <p class="youth-team-card__age">{{ team.ageGroup }}</p>
              <h3 class="youth-team-card__name">{{ team.name }}</h3>
              <p class="youth-team-card__league">{{ team.league }}</p>

              <ul v-if="team.training?.length" class="youth-team-card__training">
                <li
                  v-for="slot in team.training"
                  :key="`${team.id}-${slot.day}-${slot.time}-${slot.location}`"
                >
                  {{ slot.day }} · {{ slot.time }} · {{ slot.location }}
                </li>
              </ul>

              <div class="youth-team-card__links">
                <a
                  v-if="mapsHref"
                  :href="mapsHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="youth-link youth-link--secondary"
                >
                  Spielstaette
                </a>
                <a
                  :href="team.tableUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="youth-link youth-link--primary"
                >
                  Tabelle
                </a>
              </div>
            </div>
          </article>
        </div>

        <div
          v-if="!isDesktopTeamLayout && teamMobilePageCount > 1"
          class="youth-teams__indicator"
          aria-label="Teamseiten"
        >
          <span
            v-for="page in teamMobilePageCount"
            :key="page"
            class="youth-teams__indicator-dot"
            :class="{ 'is-active': page - 1 === activeTeamPage }"
          ></span>
        </div>

        <div
          v-if="isDesktopTeamLayout && teamDesktopPageCount > 1"
          class="youth-teams__toolbar"
        >
          <button
            type="button"
            class="youth-teams__control"
            @click="goToPreviousTeamPage"
            :disabled="activeDesktopTeamPage === 0"
            aria-label="Vorherige Teamseite"
          >
            <ChevronLeft :size="18" :stroke-width="2.4" />
          </button>

          <div class="youth-teams__indicator" aria-label="Teamseiten">
            <span
              v-for="page in teamDesktopPageCount"
              :key="`desktop-team-${page}`"
              class="youth-teams__indicator-dot"
              :class="{ 'is-active': page - 1 === activeDesktopTeamPage }"
            ></span>
          </div>

          <button
            type="button"
            class="youth-teams__control"
            @click="goToNextTeamPage"
            :disabled="activeDesktopTeamPage >= teamDesktopPageCount - 1"
            aria-label="Naechste Teamseite"
          >
            <ChevronRight :size="18" :stroke-width="2.4" />
          </button>
        </div>
      </div>
    </section>

    <section id="jugendtrainer" class="youth-coaches" aria-label="Trainerteam">
      <div class="youth-section-shell">
        <p class="youth-section-kicker">Trainerteam</p>
        <h2 class="youth-section-title">{{ coachSection.title }}</h2>
        <p v-if="coachSection.lead" class="youth-section-lead">{{ coachSection.lead }}</p>

        <div
          ref="coachGridRef"
          class="youth-coaches__grid"
          @scroll.passive="handleCoachGridScroll"
        >
          <article
            v-for="(member, index) in visibleCoachCards"
            :key="member.id"
            class="youth-coach-card"
            :class="{ 'is-active': !isDesktopCoachLayout && index === activeCoachPage }"
          >
            <div class="youth-coach-card__photo">
              <img
                v-if="member.image"
                :src="member.image"
                :alt="member.imageAlt"
                loading="lazy"
              />
              <span v-else class="youth-coach-card__fallback">
                <DummySilhouette />
              </span>
            </div>
            <div class="youth-coach-card__caption">
              <p class="youth-coach-card__name">{{ member.name }}</p>
              <p class="youth-coach-card__role">{{ member.role }}</p>
            </div>
          </article>
        </div>

        <div
          v-if="!isDesktopCoachLayout && coachMobilePageCount > 1"
          class="youth-coaches__indicator"
          aria-label="Trainerseiten"
        >
          <span
            v-for="page in coachMobilePageCount"
            :key="page"
            class="youth-coaches__indicator-dot"
            :class="{ 'is-active': page - 1 === activeCoachPage }"
          ></span>
        </div>

        <div
          v-if="isDesktopCoachLayout && coachDesktopPageCount > 1"
          class="youth-coaches__toolbar"
        >
          <button
            type="button"
            class="youth-coaches__control"
            @click="goToPreviousCoachPage"
            :disabled="activeDesktopCoachPage === 0"
            aria-label="Vorherige Trainerseite"
          >
            <ChevronLeft :size="18" :stroke-width="2.4" />
          </button>

          <div class="youth-coaches__indicator" aria-label="Trainerseiten">
            <span
              v-for="page in coachDesktopPageCount"
              :key="`desktop-${page}`"
              class="youth-coaches__indicator-dot"
              :class="{ 'is-active': page - 1 === activeDesktopCoachPage }"
            ></span>
          </div>

          <button
            type="button"
            class="youth-coaches__control"
            @click="goToNextCoachPage"
            :disabled="activeDesktopCoachPage >= coachDesktopPageCount - 1"
            aria-label="Naechste Trainerseite"
          >
            <ChevronRight :size="18" :stroke-width="2.4" />
          </button>
        </div>
      </div>
    </section>

    <section class="youth-contact" aria-label="Kontakt Jugend">
      <div class="youth-section-shell youth-contact__layout">
        <div>
          <p class="youth-section-kicker">Kontakt</p>
          <h2 class="youth-section-title">{{ contact.title }}</h2>
          <p class="youth-section-lead">{{ contact.lead }}</p>

          <div class="youth-contact__details">
            <p><strong>{{ contact.labels.name }}:</strong> {{ contact.name }}</p>
            <p><strong>{{ contact.labels.role }}:</strong> {{ contact.role }}</p>
            <p><strong>{{ contact.labels.phone }}:</strong> {{ contact.phone }}</p>
            <p><strong>{{ contact.labels.email }}:</strong> {{ contact.email }}</p>
            <p>{{ contact.note }}</p>
          </div>
        </div>

        <form class="youth-contact__form" @submit.prevent="handleContactSubmit">
          <label>
            Name
            <input v-model="contactForm.name" type="text" autocomplete="name" required />
          </label>
          <label>
            E-Mail
            <input v-model="contactForm.email" type="email" autocomplete="email" required />
          </label>
          <label>
            Mannschaft / Alter
            <input v-model="contactForm.team" type="text" placeholder="z. B. D-Jugend, 11 Jahre" />
          </label>
          <label>
            Nachricht
            <textarea
              v-model="contactForm.message"
              rows="6"
              required
              placeholder="Hallo, ich interessiere mich fuer ein Probetraining ..."
            />
          </label>
          <button type="submit" class="youth-contact__submit">Anfrage senden</button>
        </form>
      </div>
    </section>

    <HomeSponsorsMobileSection />
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import DummySilhouette from "@/components/DummySilhouette.vue";
import HomeSponsorsMobileSection from "@/components/HomeSponsorsMobileSection.vue";
import PageHero from "@/components/PageHero.vue";
import youthHero from "@/assets/header/background.png";
import rawJugendtrainer from "@/content/jugendtrainer.json";
import rawTimelineEntries from "@/content/jugend-timeline.json";
import rawYouthContent from "@/content/jugend.json";
import { resolveTimelineImagePath } from "@/utils/timelineImages";
import { resolveScrollContainer } from "@/utils/scrollContainer";

type YouthTraining = {
  day: string;
  time: string;
  location: string;
};

type TrainingLocation = {
  name: string;
  address: string;
  mapsUrl: string;
};

type YouthTeam = {
  id: string;
  name: string;
  ageGroup: string;
  league: string;
  description: string;
  image: string;
  imageAlt: string;
  tableUrl?: string;
  training?: YouthTraining[];
};

type CoachMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  imageAlt?: string;
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
  trainingLocation?: TrainingLocation;
  teams: YouthTeam[];
  coachSection: {
    title: string;
    lead: string;
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

type TimelineEntry = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  counterpart: string;
  imageSrc?: string;
  imageAlt?: string;
  points: string[];
};

const youthContent = rawYouthContent as YouthContent;
const { hero, teamsSection, coachSection, contact } = youthContent;

const teamImageMap: Record<string, string> = {
  youthHero,
};

const coachImageMap: Record<string, string> = {
  youthHero,
};

const isCoachPortraitImage = (image?: string) =>
  Boolean(image && image !== "youthHero");

const teamCards = youthContent.teams.map((team) => ({
  ...team,
  image: team.image ? (teamImageMap[team.image] ?? team.image) : "",
  tableUrl: team.tableUrl?.trim() || "https://next.fussball.de/",
}));

const teamsGridRef = ref<HTMLElement | null>(null);
const activeTeamPage = ref(0);
const activeDesktopTeamPage = ref(0);
const isDesktopTeamLayout = ref(false);
let desktopTeamMediaQuery: MediaQueryList | null = null;

const teamMobilePageCount = computed(() => teamCards.length);
const teamDesktopPageCount = computed(() => Math.ceil(teamCards.length / 3));

const visibleTeamCards = computed(() => {
  if (!isDesktopTeamLayout.value) {
    return teamCards;
  }

  const startIndex = activeDesktopTeamPage.value * 3;
  return teamCards.slice(startIndex, startIndex + 3);
});

const coachCards = (rawJugendtrainer as CoachMember[]).map((member) => ({
  ...member,
  image:
    member.image && isCoachPortraitImage(member.image)
      ? (coachImageMap[member.image] ?? member.image)
      : undefined,
  imageAlt: member.imageAlt ?? member.name,
}));

const coachGridRef = ref<HTMLElement | null>(null);
const activeCoachPage = ref(0);
const activeDesktopCoachPage = ref(0);
const isDesktopCoachLayout = ref(false);
let desktopCoachMediaQuery: MediaQueryList | null = null;

const coachMobilePageCount = computed(() => coachCards.length);
const coachDesktopPageCount = computed(() => Math.ceil(coachCards.length / 5));

const visibleCoachCards = computed(() => {
  if (!isDesktopCoachLayout.value) {
    return coachCards;
  }

  const startIndex = activeDesktopCoachPage.value * 5;
  return coachCards.slice(startIndex, startIndex + 5);
});

const trainingLocation = youthContent.trainingLocation;

const mapsHref =
  trainingLocation?.mapsUrl ??
  (trainingLocation?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        trainingLocation.address,
      )}`
    : "");

const timelineEntries = rawTimelineEntries as TimelineEntry[];

const contactForm = ref({
  name: "",
  email: "",
  team: "",
  message: "",
});

const handleContactSubmit = () => {
  if (!contact.email) {
    return;
  }

  const subject = `Jugend-Anfrage${contactForm.value.team ? ` - ${contactForm.value.team}` : ""}`;
  const body = [
    `Name: ${contactForm.value.name}`,
    `E-Mail: ${contactForm.value.email}`,
    `Mannschaft / Alter: ${contactForm.value.team || "-"}`,
    "",
    "Nachricht:",
    contactForm.value.message,
  ].join("\n");

  window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const syncDesktopTeamLayout = () => {
  const matches = desktopTeamMediaQuery?.matches ?? false;
  isDesktopTeamLayout.value = matches;

  if (!matches) {
    activeDesktopTeamPage.value = 0;
    nextTick(() => {
      centerActiveTeamCard();
      updateActiveTeamPage();
    });
    return;
  }

  activeDesktopTeamPage.value = Math.min(
    activeDesktopTeamPage.value,
    Math.max(teamDesktopPageCount.value - 1, 0),
  );
};

const goToPreviousTeamPage = () => {
  activeDesktopTeamPage.value = Math.max(activeDesktopTeamPage.value - 1, 0);
};

const goToNextTeamPage = () => {
  activeDesktopTeamPage.value = Math.min(
    activeDesktopTeamPage.value + 1,
    Math.max(teamDesktopPageCount.value - 1, 0),
  );
};

const centerActiveTeamCard = () => {
  const element = teamsGridRef.value;

  if (!element || isDesktopTeamLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".youth-team-card"),
  );
  const activeCard = cards[activeTeamPage.value];

  if (!activeCard) {
    return;
  }

  const targetLeft =
    activeCard.offsetLeft - (element.clientWidth - activeCard.offsetWidth) / 2;

  element.scrollLeft = Math.max(0, targetLeft);
};

const updateActiveTeamPage = () => {
  const element = teamsGridRef.value;

  if (!element || isDesktopTeamLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".youth-team-card"),
  );

  if (!cards.length) {
    activeTeamPage.value = 0;
    return;
  }

  const viewportCenter = element.scrollLeft + element.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  activeTeamPage.value = closestIndex;
};

const handleTeamsGridScroll = () => {
  updateActiveTeamPage();
};

const syncDesktopCoachLayout = () => {
  const matches = desktopCoachMediaQuery?.matches ?? false;
  isDesktopCoachLayout.value = matches;

  if (!matches) {
    activeDesktopCoachPage.value = 0;
    nextTick(() => {
      centerActiveCoachCard();
      updateActiveCoachPage();
    });
    return;
  }

  activeDesktopCoachPage.value = Math.min(
    activeDesktopCoachPage.value,
    Math.max(coachDesktopPageCount.value - 1, 0),
  );
};

const goToPreviousCoachPage = () => {
  activeDesktopCoachPage.value = Math.max(activeDesktopCoachPage.value - 1, 0);
};

const goToNextCoachPage = () => {
  activeDesktopCoachPage.value = Math.min(
    activeDesktopCoachPage.value + 1,
    Math.max(coachDesktopPageCount.value - 1, 0),
  );
};

const centerActiveCoachCard = () => {
  const element = coachGridRef.value;

  if (!element || isDesktopCoachLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".youth-coach-card"),
  );
  const activeCard = cards[activeCoachPage.value];

  if (!activeCard) {
    return;
  }

  const targetLeft =
    activeCard.offsetLeft - (element.clientWidth - activeCard.offsetWidth) / 2;

  element.scrollLeft = Math.max(0, targetLeft);
};

const updateActiveCoachPage = () => {
  const element = coachGridRef.value;

  if (!element || isDesktopCoachLayout.value) {
    return;
  }

  const cards = Array.from(
    element.querySelectorAll<HTMLElement>(".youth-coach-card"),
  );

  if (!cards.length) {
    activeCoachPage.value = 0;
    return;
  }

  const viewportCenter = element.scrollLeft + element.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  activeCoachPage.value = closestIndex;
};

const handleCoachGridScroll = () => {
  updateActiveCoachPage();
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
  updateActiveTeamPage();
  updateActiveCoachPage();

  if (typeof window !== "undefined") {
    desktopTeamMediaQuery = window.matchMedia("(min-width: 981px)");
    syncDesktopTeamLayout();
    desktopTeamMediaQuery.addEventListener("change", syncDesktopTeamLayout);
    desktopCoachMediaQuery = window.matchMedia("(min-width: 981px)");
    syncDesktopCoachLayout();
    desktopCoachMediaQuery.addEventListener("change", syncDesktopCoachLayout);
    window.addEventListener("resize", updateActiveTeamPage);
    window.addEventListener("resize", updateActiveCoachPage);
    window.addEventListener("resize", centerActiveTeamCard);
    window.addEventListener("resize", centerActiveCoachCard);
  }

  nextTick(() => {
    centerActiveTeamCard();
    centerActiveCoachCard();
    updateActiveTeamPage();
    updateActiveCoachPage();
  });
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener("scroll", updateTimelineProgress);
  window.removeEventListener("resize", updateTimelineProgress);
  desktopTeamMediaQuery?.removeEventListener("change", syncDesktopTeamLayout);
  desktopCoachMediaQuery?.removeEventListener("change", syncDesktopCoachLayout);
  window.removeEventListener("resize", updateActiveTeamPage);
  window.removeEventListener("resize", updateActiveCoachPage);
  window.removeEventListener("resize", centerActiveTeamCard);
  window.removeEventListener("resize", centerActiveCoachCard);
});
</script>

<style scoped>
.youth-page {
  padding-bottom: clamp(56px, 8vw, 96px);
  overflow-x: clip;
}

.youth-intro,
.youth-timeline,
.youth-teams,
.youth-coaches,
.youth-contact {
  width: min(1240px, calc(100% - 32px));
  margin: 0 auto;
}

.youth-intro {
  margin-bottom: clamp(30px, 5vw, 60px);
}

.youth-intro__shell,
.youth-section-shell {
  text-align: center;
}

.youth-intro__kicker,
.youth-section-kicker,
.youth-timeline__eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  color: rgba(242, 208, 82, 0.92);
}

.youth-intro__title,
.youth-section-title {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 4.2rem);
  line-height: 0.95;
}

.youth-intro__lead,
.youth-section-lead,
.youth-timeline__lead {
  width: min(760px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(245, 247, 252, 0.88);
}

.youth-timeline {
  position: relative;
  padding-top: 8px;
}

.youth-timeline__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
  z-index: 0;
}

.youth-timeline__line-base,
.youth-timeline__line-progress {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  transform-origin: top;
}

.youth-timeline__line-base {
  background: rgba(255, 255, 255, 0.12);
}

.youth-timeline__line-progress {
  background: linear-gradient(180deg, #f2d052 0%, #e3aa1d 42%, #2d7ff9 100%);
  box-shadow: 0 0 26px rgba(242, 208, 82, 0.28);
}

.youth-timeline__list {
  display: grid;
  gap: 28px;
}

.youth-timeline__item {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  align-items: start;
}

.youth-timeline__side {
  display: flex;
}

.youth-timeline__item--left .youth-timeline__side--left,
.youth-timeline__item--right .youth-timeline__side--left {
  justify-content: flex-end;
}

.youth-timeline__item--left .youth-timeline__side--right,
.youth-timeline__item--right .youth-timeline__side--right {
  justify-content: flex-start;
}

.youth-timeline__center {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.youth-timeline__dot {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #09162f;
  border: 4px solid rgba(242, 208, 82, 0.95);
  box-shadow: 0 0 0 10px rgba(242, 208, 82, 0.08);
}

.youth-timeline__content,
.youth-timeline__counterpart {
  width: min(100%, 500px);
}

.youth-timeline__content {
  padding: 12px 0;
}

.youth-timeline__title {
  margin: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.youth-timeline__points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.youth-timeline__point {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.youth-timeline__point-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(242, 208, 82, 0.85);
  margin-top: 8px;
}

.youth-timeline__point-body {
  line-height: 1.5;
  color: rgba(245, 247, 252, 0.78);
}

.youth-timeline__item--left .youth-timeline__content {
  padding-right: clamp(18px, 3vw, 42px);
  text-align: right;
}

.youth-timeline__item--left .youth-timeline__points {
  align-items: flex-end;
}

.youth-timeline__item--left .youth-timeline__point {
  flex-direction: row-reverse;
}

.youth-timeline__item--left .youth-timeline__point-body {
  text-align: right;
}

.youth-timeline__item--right .youth-timeline__content {
  padding-left: clamp(18px, 3vw, 42px);
}

.youth-timeline__counterpart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  color: rgba(245, 247, 252, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
}

.youth-timeline__counterpart-image {
  width: 100%;
  flex: 1;
  min-height: 220px;
  max-height: clamp(260px, 36vw, 380px);
  display: block;
  object-fit: cover;
  border-radius: 26px;
}

.youth-timeline__item--left .youth-timeline__counterpart {
  margin-left: clamp(18px, 3vw, 42px);
}

.youth-timeline__item--right .youth-timeline__counterpart {
  margin-right: clamp(18px, 3vw, 42px);
}

.youth-teams,
.youth-coaches,
.youth-contact {
  margin-top: clamp(48px, 7vw, 84px);
}

.youth-teams__grid,
.youth-coaches__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: 28px;
  align-items: start;
}

.youth-team-card,
.youth-coach-card {
  display: grid;
  box-sizing: border-box;
  gap: 12px;
  width: 100%;
  padding: 0.8rem 0.8rem 1.2rem;
  background: rgba(255, 253, 248, 0.94);
  color: #101828;
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

.youth-team-card:nth-child(even),
.youth-coach-card:nth-child(even) {
  transform: rotate(1.2deg);
}

.youth-team-card:nth-child(3n),
.youth-coach-card:nth-child(3n) {
  transform: rotate(-0.4deg);
}

.youth-team-card__media,
.youth-coach-card__photo {
  overflow: hidden;
  border-radius: 0;
  background: #f0e9d9;
}

.youth-team-card__media {
  aspect-ratio: 4 / 5;
}

.youth-team-card__media img,
.youth-coach-card__photo img,
.youth-coach-card__fallback {
  width: 100%;
  height: 100%;
  display: block;
}

.youth-team-card__media img,
.youth-coach-card__photo img {
  object-fit: cover;
}

.youth-coach-card__fallback {
  display: grid;
  place-items: center;
}

.youth-team-card__body,
.youth-coach-card__caption {
  display: grid;
  gap: 4px;
  padding-top: 0.9rem;
  text-align: center;
}

.youth-team-card__age,
.youth-team-card__league {
  margin: 0;
  color: rgba(17, 17, 17, 0.6);
}

.youth-team-card__name,
.youth-coach-card__name {
  margin: 0;
  font-weight: 800;
}

.youth-team-card__name {
  font-size: clamp(1.25rem, 2vw, 1.6rem);
}

.youth-coaches {
  background: transparent;
  padding: clamp(4rem, 7vw, 7rem) 0;
}

.youth-coaches__grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
}

.youth-coaches__indicator {
  display: none;
}

.youth-coaches__toolbar {
  display: none;
}

.youth-teams__indicator {
  display: none;
}

.youth-teams__toolbar {
  display: none;
}

.youth-coach-card__photo {
  aspect-ratio: 4 / 5;
}

.youth-coach-card__fallback {
  color: #022b79;
  font-size: 3rem;
  font-weight: 900;
}

.youth-coach-card__role {
  margin: 0.25rem 0 0;
  color: rgba(17, 17, 17, 0.6);
  font-size: 0.92rem;
}

.youth-team-card__body {
  text-align: left;
}

.youth-team-card__training {
  margin: 6px 0 0;
  padding-left: 18px;
  line-height: 1.6;
  text-align: left;
}

.youth-team-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.youth-link,
.youth-contact__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
}

.youth-link--primary,
.youth-contact__submit {
  background: var(--sv-secondary-color);
  color: #171a1f;
}

.youth-link--secondary {
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: inherit;
}

.youth-contact__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 28px;
  text-align: left;
  align-items: start;
}

.youth-contact__details {
  display: grid;
  gap: 10px;
  margin-top: 20px;
  padding: 24px;
  border-radius: 26px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(2, 43, 121, 0.16)),
    rgba(8, 20, 45, 0.74);
}

.youth-contact__details p {
  margin: 0;
}

.youth-contact__form {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 26px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(2, 43, 121, 0.16)),
    rgba(8, 20, 45, 0.74);
}

.youth-contact__form label {
  display: grid;
  gap: 8px;
}

.youth-contact__form input,
.youth-contact__form textarea {
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
}

@media (max-width: 900px) {
  .youth-timeline__line {
    left: 22px;
    transform: none;
  }

  .youth-timeline__item {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 10px 12px;
  }

  .youth-timeline__center {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: stretch;
    padding-top: 28px;
  }

  .youth-timeline__side,
  .youth-timeline__item--left .youth-timeline__side--left,
  .youth-timeline__item--right .youth-timeline__side--right {
    grid-column: 2;
    justify-content: stretch;
  }

  .youth-timeline__item--left .youth-timeline__side--left,
  .youth-timeline__item--right .youth-timeline__side--right {
    grid-row: 1;
  }

  .youth-timeline__item--left .youth-timeline__side--right,
  .youth-timeline__item--right .youth-timeline__side--left {
    grid-column: 2;
    grid-row: 2;
    justify-content: stretch;
  }

  .youth-timeline__content,
  .youth-timeline__counterpart {
    width: 100%;
  }

  .youth-timeline__item--left .youth-timeline__content,
  .youth-timeline__item--right .youth-timeline__content {
    padding: 8px 0 8px 10px;
    text-align: left;
  }

  .youth-timeline__item--left .youth-timeline__points,
  .youth-timeline__item--right .youth-timeline__points {
    align-items: stretch;
  }

  .youth-timeline__item--left .youth-timeline__point {
    flex-direction: row;
  }

  .youth-timeline__item--left .youth-timeline__point-body {
    text-align: left;
  }

  .youth-timeline__item--left .youth-timeline__counterpart,
  .youth-timeline__item--right .youth-timeline__counterpart {
    min-height: 200px;
    margin: 0;
    margin-left: 10px;
  }

  .youth-contact__layout {
    grid-template-columns: 1fr;
  }

  .youth-teams__grid {
    display: grid;
    grid-auto-flow: column;
    --team-card-width: clamp(248px, 72vw, 292px);
    grid-auto-columns: var(--team-card-width);
    gap: 18px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: calc(50% - (var(--team-card-width) / 2));
    padding: 0 calc(50% - (var(--team-card-width) / 2)) 10px;
    justify-content: start;
    scrollbar-width: none;
  }

  .youth-team-card {
    scroll-snap-align: center;
    min-height: 100%;
    height: 100%;
    width: 70dvw;
    max-width: var(--team-card-width);
    opacity: 0.38;
    filter: grayscale(1);
    transform: none;
    transition:
      opacity 0.24s ease,
      filter 0.24s ease,
      box-shadow 0.24s ease;
  }

  .youth-team-card:nth-child(even),
  .youth-team-card:nth-child(3n),
  .youth-coach-card:nth-child(even),
  .youth-coach-card:nth-child(3n) {
    transform: none;
  }

  .youth-team-card.is-active {
    opacity: 1;
    filter: grayscale(0);
    box-shadow: 0 1.15rem 2.8rem rgba(0, 0, 0, 0.26);
  }

  .youth-teams__grid::-webkit-scrollbar {
    display: none;
  }

  .youth-teams__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .youth-teams__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .youth-teams__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }

  .youth-coaches__grid {
    display: grid;
    grid-auto-flow: column;
    --coach-card-width: clamp(248px, 72vw, 292px);
    grid-auto-columns: var(--coach-card-width);
    gap: 18px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: calc(50% - (var(--coach-card-width) / 2));
    padding: 0 calc(50% - (var(--coach-card-width) / 2)) 10px;
    justify-content: start;
    scrollbar-width: none;
  }

  .youth-coach-card {
    scroll-snap-align: center;
    min-height: 100%;
    height: 100%;
    width: 70dvw;
    max-width: var(--coach-card-width);
    opacity: 0.38;
    filter: grayscale(1);
    transform: none;
    transition:
      opacity 0.24s ease,
      filter 0.24s ease,
      box-shadow 0.24s ease;
  }

  .youth-coach-card:nth-child(even),
  .youth-coach-card:nth-child(3n) {
    transform: none;
  }

  .youth-coach-card.is-active {
    opacity: 1;
    filter: grayscale(0);
    box-shadow: 0 1.15rem 2.8rem rgba(0, 0, 0, 0.26);
  }

  .youth-coaches__grid::-webkit-scrollbar {
    display: none;
  }

  .youth-coaches__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }

  .youth-coaches__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .youth-coaches__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }
}

@media (max-width: 640px) {
  .youth-intro,
  .youth-timeline,
  .youth-teams,
  .youth-coaches,
  .youth-contact {
    width: calc(100% - 24px);
  }

  .youth-timeline__list {
    gap: 20px;
  }

  .youth-timeline__counterpart {
    min-height: 180px;
  }

  .youth-timeline__counterpart-image {
    min-height: 180px;
    border-radius: 18px;
  }

  .youth-teams__grid,
  .youth-coaches__grid {
    grid-template-columns: 1fr;
  }

  .youth-teams__grid {
    --team-card-width: min(280px, 82vw);
    grid-auto-columns: var(--team-card-width);
  }

  .youth-coaches__grid {
    --coach-card-width: min(280px, 82vw);
    grid-auto-columns: var(--coach-card-width);
  }
}

@media (min-width: 981px) {
  .youth-teams__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .youth-teams__toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 22px;
  }

  .youth-teams__control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.9rem;
    height: 2.9rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    cursor: pointer;
  }

  .youth-teams__control:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .youth-teams__control:hover:not(:disabled) {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.38);
  }

  .youth-teams__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .youth-teams__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .youth-teams__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }

  .youth-coaches__toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-top: 22px;
  }

  .youth-coaches__control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.9rem;
    height: 2.9rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: transparent;
    color: #fff;
    cursor: pointer;
  }

  .youth-coaches__control:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .youth-coaches__control:hover:not(:disabled) {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.38);
  }

  .youth-coaches__indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .youth-coaches__indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
  }

  .youth-coaches__indicator-dot.is-active {
    background: var(--sv-secondary-color);
  }
}
</style>
