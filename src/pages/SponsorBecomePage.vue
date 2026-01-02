<template>
  <PageHero
    :image="sponsorHero"
    title="Sponsor werden"
    lead="Gemeinsam staerken wir den Verein und den Fussball vor Ort." />
  <section class="sponsor-info" aria-label="Sponsoring Informationen">
    <div class="sponsor-info-card">
      <h2>Was wir bieten</h2>
      <ul>
        <li>Sichtbarkeit auf unseren Kanaelen und im Stadion</li>
        <li>Individuelle Praesenz: Banner, Trikots, Website</li>
        <li>Partnerschaftliche Zusammenarbeit auf Augenhoehe</li>
      </ul>
    </div>
    <div class="sponsor-info-card">
      <h2>Was wir suchen</h2>
      <ul>
        <li>Lokale Unternehmen und engagierte Partner</li>
        <li>Langfristige Unterstuetzung der Vereinsarbeit</li>
        <li>Gemeinsame Aktionen und Events</li>
      </ul>
    </div>
    <div class="sponsor-info-card">
      <h2>So wirst du Sponsor</h2>
      <p>
        Schreib uns kurz, welches Paket dich interessiert. Wir melden uns mit
        einem individuellen Vorschlag.
      </p>
      <RouterLink to="/contact" class="sponsor-contact">
        Kontakt aufnehmen
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageHero from "@/components/PageHero.vue";
import sponsorHero from "@/assets/header/background.png";
</script>

<style scoped>
.sponsor-info {
  width: 80dvw;
  margin: 0 auto;
  padding: 0 clamp(18px, 8vw, 80px) clamp(48px, 8vw, 96px);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(16px, 2.5vw, 32px);
}

.sponsor-info-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: clamp(18px, 2.5vw, 28px);
  color: var(--sv-text-color);
  display: grid;
  gap: 12px;
}

.sponsor-info-card h2 {
  margin: 0;
  color: var(--sv-secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: clamp(16px, 2vw, 22px);
}

.sponsor-info-card ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.sponsor-info-card p {
  margin: 0;
  opacity: 0.9;
}

.sponsor-contact {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: var(--sv-primary-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  text-decoration: none;
  border: 2px solid transparent;
  transition: transform 0.25s ease, box-shadow 0.25s ease,
    background 0.25s ease, color 0.25s ease;
}

.sponsor-contact:hover,
.sponsor-contact:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
}
</style>
