<template>
  <PageHero :image="vereinHero" :title="hero.title" :lead="hero.lead" />

  <section class="verein-intro" aria-label="Verein Intro">
    <div class="intro-card">
      <h2 class="intro-title">{{ intro.title }}</h2>
      <p class="intro-text">{{ intro.text }}</p>
    </div>
  </section>

  <section class="verein-people" aria-label="Vereinsleitung">
    <header class="people-header">
      <h2 class="people-title">{{ people.title }}</h2>
    </header>
    <div class="people-grid">
      <article
        v-for="person in personCards"
        :key="person.id"
        class="people-card">
        <div class="people-photo">
          <img
            v-if="person.image"
            :src="person.image"
            :alt="person.imageAlt"
            loading="lazy" />
          <span v-else class="people-photo-fallback">
            {{ getInitials(person.name) }}
          </span>
        </div>
        <div class="people-caption">
          <p class="people-name">{{ person.name }}</p>
          <p class="people-role">{{ person.role }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageHero from "@/components/PageHero.vue";
import vereinHero from "@/assets/header/background.png";
import rawVerein from "@/content/verein.json";

type VereinsPerson = {
  id: string;
  name: string;
  role: string;
  image?: string;
  imageAlt?: string;
};

type VereinContent = {
  hero: {
    title: string;
    lead: string;
  };
  intro: {
    title: string;
    text: string;
  };
  people: {
    title: string;
    items: VereinsPerson[];
  };
};

const vereinContent = rawVerein as VereinContent;
const { hero, intro, people } = vereinContent;

const imageMap: Record<string, string> = {
  vereinHero,
};

const personCards = people.items.map((person) => ({
  ...person,
  image: person.image ? imageMap[person.image] ?? person.image : undefined,
  imageAlt: person.imageAlt ?? person.name,
}));

const getInitials = (value?: string) =>
  (value ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
</script>

<style scoped>
.verein-intro,
.verein-people {
  width: 80dvw;
  margin: 0 auto;
}

.verein-intro {
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

.verein-people {
  margin-bottom: clamp(48px, 8vw, 96px);
}

.people-header {
  margin-bottom: clamp(16px, 2.5vw, 28px);
}

.people-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  letter-spacing: 0.02em;
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.people-card {
  background: #f7f1e3;
  color: #1f2a44;
  border: 1px solid rgba(11, 31, 77, 0.2);
  border-radius: 6px;
  padding: 12px;
  display: grid;
  gap: 10px;
  box-shadow: 0 14px 28px rgba(11, 31, 77, 0.18);
}

.people-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  overflow: hidden;
  background: #d7d2c6;
  display: grid;
  place-items: center;
}

.people-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.people-photo-fallback {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(31, 42, 68, 0.7);
}

.people-caption {
  padding: 2px 4px 4px;
  text-align: center;
}

.people-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.people-role {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 10px;
  color: rgba(31, 42, 68, 0.65);
}
</style>
