<template>
  <section class="legal-page">
    <div class="legal-content">
      <h1>Impressum</h1>
      <p class="legal-intro">Angaben gemaess § 5 TMG.</p>

      <section class="legal-section">
        <h2>Anbieter</h2>
        <p>SV Ottweiler e.V.</p>
        <p>Strasse Hausnummer</p>
        <p>PLZ Ort</p>
      </section>

      <section class="legal-section">
        <h2>Vertreten durch</h2>
        <p>Vorstand: Name(n) eintragen</p>
      </section>

      <section class="legal-section">
        <h2>Kontakt</h2>
        <p>E-Mail: platzhalter@example.de</p>
        <p>Telefon: optional</p>
      </section>

      <section class="legal-section">
        <h2>Registereintrag</h2>
        <p>Vereinsregister: Amtsgericht Ort</p>
        <p>Registernummer: VR 00000</p>
      </section>

      <section class="legal-section">
        <h2>Umsatzsteuer-ID</h2>
        <p>USt-IdNr.: falls vorhanden, sonst entfernen</p>
      </section>

      <section class="legal-section">
        <h2>Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>Erwin Holzhauser</p>
        <p>Adresse wie oben</p>
      </section>

      <section class="legal-section">
        <h2>Haftung fuer Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir fuer eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Fuer Richtigkeit,
          Vollstaendigkeit und Aktualitaet uebernehmen wir keine Gewaehr.
        </p>
      </section>

      <section class="legal-section">
        <h2>Haftung fuer Links</h2>
        <p>
          Diese Website enthaelt Links zu externen Websites Dritter. Auf deren
          Inhalte haben wir keinen Einfluss. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
      </section>

      <section class="legal-section">
        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen
          dem deutschen Urheberrecht. Vervielfaeltigung, Bearbeitung und
          Verbreitung beduerfen der schriftlichen Zustimmung.
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

.legal-section p {
  margin: 0;
  opacity: 0.88;
}
</style>
