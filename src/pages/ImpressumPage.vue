<template>
  <section class="legal-page">
    <div class="legal-content">
      <h1>Impressum</h1>
      <p class="legal-intro">
        Angaben gemäß Paragraf 5 DDG sowie weitere rechtliche Hinweise zu
        diesem Webauftritt.
      </p>

      <section class="legal-section">
        <h2>1. Anbieter</h2>
        <p>
          SV Ottweiler 1919 e. V.<br />
          Im Alten Weiher 13<br />
          66564 Ottweiler
        
        </p>
       
      </section>

      <section class="legal-section">
        <h2>2. Vertreten durch</h2>
        <p>
          Der Verein wird gesetzlich vertreten durch den Vorstand bzw. die
          vertretungsberechtigten Personen gemäß Satzung.
        </p>
        <p>
          Sascha Gutheil<br />

        </p>
      </section>

      <section class="legal-section">
        <h2>3. Kontakt</h2>
        <p>
          Telefon: Bitte Telefonnummer eintragen<br />
          E-Mail:
          <a href="mailto:">
            svottweiler@ottweiler.de
          </a>
        </p>
      </section>

      <section class="legal-section">
        <h2>4. Vereinsregister</h2>
        <p>
          Eingetragen im Vereinsregister.<br />
          Bitte Registergericht und Registernummer ergänzen.
        </p>
      </section>

      <section class="legal-section">
        <h2>5. Verantwortlich für den Inhalt</h2>
        <p>
          Verantwortlich für die redaktionellen Inhalte nach Paragraf 18 Abs. 2
          MStV:
        </p>
        <p>
          Erwin Holzhauser<br />
          Kiefernweg 51<br />
          66557 Illingen
        </p>
      </section>

      <section class="legal-section">
        <h2>6. Haftung für Inhalte</h2>
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
          rechtswidrige Tätigkeit hinweisen.
        </p>
      </section>

      <section class="legal-section">
        <h2>7. Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Websites Dritter. Auf deren
          Inhalte haben wir keinen Einfluss. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </p>
      </section>

      <section class="legal-section">
        <h2>8. Urheberrecht</h2>
        <p>
          Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen
          dem deutschen Urheberrecht. Jede Verwertung ausserhalb der Grenzen des
          Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des
          jeweiligen Rechteinhabers, soweit gesetzlich nichts anderes erlaubt
          ist.
        </p>
      </section>

      <section class="legal-section">
        <h2>9. Hinweis</h2>
        <p>
          Bitte prüfe vor dem Livegang insbesondere Vereinsname, Anschrift,
          Vertretungsregelung, Registergericht, Registernummer und
          Kontaktangaben. Diese Platzhalter müssen durch die tatsächlichen
          Angaben des Vereins ersetzt werden.
        </p>
      </section>
    </div>
  </section>
</template>

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
