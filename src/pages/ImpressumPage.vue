<template>
  <section class="legal-page">
    <div class="legal-content">
      <h1>Impressum</h1>
      <p class="legal-intro">
        Angaben gemäß § 5 DDG sowie weitere rechtliche Hinweise zu diesem
        Webauftritt.
      </p>

      <section class="legal-section">
        <h2>1. Anbieter</h2>
        <p>
          Sportverein Ottweiler 1919 e. V.<br />
          Im Alten Weiher 13<br />
          66564 Ottweiler
        </p>
      </section>

      <section class="legal-section">
        <h2>2. Vertreten durch</h2>
        <p>Sascha Gutheil (1. Vorsitzender)</p>
      </section>

      <section class="legal-section">
        <h2>3. Kontakt</h2>
        <p>
          Telefon: 06824 1499<br />
          E-Mail:
          <a href="mailto:info@svottweiler.de">info@svottweiler.de</a>
        </p>
      </section>

      <section v-if="vereinsregister.nummer" class="legal-section">
        <h2>4. Registereintrag</h2>
        <p>
          Eingetragen im Vereinsregister.<br />
          Registergericht: {{ vereinsregister.gericht }}<br />
          Registernummer: {{ vereinsregister.nummer }}
        </p>
      </section>

      <section class="legal-section">
        <h2>{{ n(5) }}. Verantwortlich für den Inhalt</h2>
        <p>Verantwortlich für die redaktionellen Inhalte nach § 18 Abs. 2 MStV:</p>
        <p>
          Erwin Holzhauser<br />
          c/o SV Ottweiler 1919 e. V.<br />
          Im Alten Weiher 13<br />
          66564 Ottweiler
        </p>
      </section>

      <section class="legal-section">
        <h2>{{ n(6) }}. Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt
          erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der
          Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
        <p>
          Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Sobald uns eine konkrete
          Rechtsverletzung bekannt wird, entfernen wir die betreffenden Inhalte
          umgehend.
        </p>
      </section>

      <section class="legal-section">
        <h2>{{ n(7) }}. Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites Dritter. Auf deren
          Inhalte haben wir keinen Einfluss. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </p>
      </section>

      <section class="legal-section">
        <h2>{{ n(8) }}. Urheberrecht und Bildrechte</h2>
        <p>
          Die auf dieser Website veröffentlichten Inhalte, Texte und Fotos
          unterliegen dem deutschen Urheberrecht. Jede Verwertung außerhalb der
          Grenzen des Urheberrechts bedarf der vorherigen schriftlichen
          Zustimmung des jeweiligen Rechteinhabers, soweit gesetzlich nichts
          anderes erlaubt ist.
        </p>
        <p>
          Wenn Sie auf einem Foto zu sehen sind und dessen Entfernung wünschen,
          genügt eine kurze Nachricht an
          <a href="mailto:info@svottweiler.de">info@svottweiler.de</a>.
        </p>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
// Registernummer eintragen, sobald bekannt (z. B. "VR 1234").
// Solange sie leer ist, wird der Abschnitt "Registereintrag" nicht angezeigt.
const vereinsregister = {
  gericht: "Amtsgericht Ottweiler",
  nummer: "VR 398",
};

// Abschnittsnummern verschieben sich, je nachdem ob der Registereintrag sichtbar ist.
const n = (num: number) => (vereinsregister.nummer ? num : num - 1);
</script>

<style scoped>
.legal-page {
  min-height: calc(100dvh - var(--sv-header-height));
  padding: clamp(28px, 6vw, 72px) clamp(18px, 8vw, 80px);
  color: var(--sv-text-color);
}

.legal-content {
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.legal-content h1 {
  margin: 0;
  font-size: clamp(28px, 4vw, 42px);
}

.legal-intro {
  margin: 0;
  opacity: 0.85;
}

.legal-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legal-section h2 {
  margin: 0;
  font-size: clamp(18px, 2.2vw, 24px);
}

.legal-section h3 {
  margin: 12px 0 0;
  font-size: 16px;
}

.legal-section p {
  margin: 0;
  opacity: 0.88;
  line-height: 1.7;
}

.legal-section ul {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  opacity: 0.88;
}

.legal-section a {
  color: var(--sv-secondary-color);
}

@media (max-width: 700px) {
  .legal-page {
    min-height: auto;
    padding: calc(var(--sv-header-height) + 32px) 16px 40px;
    scroll-snap-align: unset;
    scroll-snap-stop: normal;
    scroll-margin-top: 0;
  }

  .legal-content {
    max-width: none;
    gap: 22px;
  }

  .legal-content h1 {
    font-size: 32px;
    line-height: 1.08;
  }

  .legal-intro {
    font-size: 15px;
    line-height: 1.65;
  }

  .legal-section {
    gap: 12px;
    padding-top: 2px;
  }

  .legal-section h2 {
    font-size: 20px;
    line-height: 1.2;
  }

  .legal-section h3 {
    margin-top: 8px;
    font-size: 15px;
    line-height: 1.35;
  }

  .legal-section p,
  .legal-section li {
    font-size: 15px;
    line-height: 1.65;
  }

  .legal-section ul {
    padding-left: 20px;
    gap: 8px;
  }
}
</style>
