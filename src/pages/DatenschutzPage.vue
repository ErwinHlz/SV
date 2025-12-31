<template>
  <section class="legal-page">
    <div class="legal-content">
      <h1>Datenschutz</h1>
      <p class="legal-intro">
        Diese Datenschutzerklaerung informiert dich darueber, welche
        personenbezogenen Daten beim Besuch dieser Website verarbeitet werden.
      </p>

      <section class="legal-section">
        <h2>Verantwortlicher</h2>
        <p>
          SV Ottweiler e.V., vertreten durch Erwin Holzhauser (bitte bei Bedarf
          anpassen)
        </p>
        <p>E-Mail: platzhalter@example.de</p>
      </section>

      <section class="legal-section">
        <h2>Kontaktaufnahme</h2>
        <p>
          Wenn du uns kontaktierst, verarbeiten wir die von dir mitgeteilten
          Daten (z. B. Name, E-Mail, Nachricht), um dein Anliegen zu bearbeiten.
          Die Kontaktmoeglichkeiten findest du auf der
          <RouterLink to="/contact">Kontaktseite</RouterLink>.
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Anbahnung) oder
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung
          von Anfragen).
        </p>
      </section>

      <section class="legal-section">
        <h2>Hosting und Server-Logfiles</h2>
        <p>
          Die Website wird ueber GitHub Pages (GitHub, Inc., USA) gehostet. Die
          Domain und das DNS werden ueber IONOS SE (Deutschland) verwaltet. Beim
          Hosting ueber GitHub Pages werden sogenannte Server-Logfiles
          verarbeitet, die dein Browser automatisch uebermittelt.
        </p>
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>aufgerufene Seite/Datei</li>
          <li>Referrer-URL</li>
          <li>Browsertyp und -version</li>
          <li>Betriebssystem</li>
        </ul>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (sicherer und stabiler
          Betrieb der Website). Die Speicherdauer richtet sich nach den
          Vorgaben des Hosting-Anbieters.
        </p>
        <p>
          Hinweis zu Drittlanduebermittlungen: Bei GitHub Pages kann eine
          Uebermittlung in die USA stattfinden. GitHub setzt
          Standardvertragsklauseln ein.
        </p>
      </section>

      <section class="legal-section">
        <h2>Externe Dienste und Inhalte</h2>
        <h3>Widgets von fussball.de</h3>
        <p>
          Auf der Website sind Widgets von fussball.de eingebunden. Beim Laden
          der Widgets koennen personenbezogene Daten (z. B. IP-Adresse) an
          fussball.de uebermittelt werden. Es koennen dabei Cookies oder
          aehnliche Technologien eingesetzt werden.
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          der Darstellung von Spiel- und Vereinsinformationen).
        </p>

        <h3>Widgets von FuPa</h3>
        <p>
          Zudem sind Widgets von FuPa (fupa.net) eingebunden. Auch hier kann es
          zur Uebermittlung von Daten an den jeweiligen Anbieter kommen.
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          der Darstellung von Spiel- und Vereinsinformationen).
        </p>
      </section>

      <section class="legal-section">
        <h2>Keine eigenen Tracking- oder Werbedienste</h2>
        <p>
          Wir nutzen selbst keine Tracking-, Analyse- oder Werbedienste und
          versenden keinen Newsletter. Sponsoren werden nur genannt/verlinkt.
        </p>
      </section>

      <section class="legal-section">
        <h2>Externe Links</h2>
        <p>
          Unsere Website enthaelt Links zu externen Websites. Fuer deren Inhalte
          und Datenschutzpraktiken sind die jeweiligen Anbieter verantwortlich.
        </p>
      </section>

      <section class="legal-section">
        <h2>Deine Rechte</h2>
        <ul>
          <li>Auskunft ueber deine Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Loeschung deiner Daten (Art. 17 DSGVO)</li>
          <li>Einschraenkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenuebertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen Verarbeitung (Art. 21 DSGVO)</li>
          <li>Widerruf erteilter Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>Beschwerderecht bei der Aufsichtsbehoerde</h2>
        <p>
          Zustaendige Aufsichtsbehoerde: Unabhaengiges Datenschutzzentrum
          Saarland. Adresse und Kontakt bitte ergaenzen.
        </p>
      </section>

      <section class="legal-section">
        <h2>Stand</h2>
        <p>Bitte Datum eintragen (z. B. 03/2025).</p>
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
}

.legal-section ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  opacity: 0.88;
}
</style>
