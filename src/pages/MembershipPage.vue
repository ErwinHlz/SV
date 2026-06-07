<template>
  <section class="membership-page">
    <div class="membership-shell">
      <header class="membership-header">
        <p class="membership-header__eyebrow">Sportverein Ottweiler 1919 e.V.</p>
        <h1 class="membership-header__title">
          MITGLIEDSANTRAG / ÄNDERUNGSANTRAG
        </h1>
        <p class="membership-header__lead">
          Bitte den Antrag gut leserlich ausfüllen und an den Sportverein
          Ottweiler 1919 e.V. per eMail oder postalisch zurücksenden.
        </p>
      </header>

      <form
        class="membership-form"
        novalidate
        @submit.prevent="printFilledApplication">
        <section class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">1. Antragsart</h2>
          </div>

          <div class="membership-options membership-options--three">
            <label class="membership-option" v-for="option in requestTypeOptions" :key="option.value">
              <input
                v-model="membershipForm.requestType"
                type="radio"
                name="requestType"
                :value="option.value" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </section>

        <section class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">2. Mitgliedsdaten</h2>
          </div>

          <div class="membership-grid membership-grid--two">
            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Familienname</span>
              <input
                v-model="membershipForm.lastName"
                type="text"
                name="lastName"
                autocomplete="family-name"
                :class="{ 'is-invalid': showValidation && !membershipForm.lastName.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Vorname</span>
              <input
                v-model="membershipForm.firstName"
                type="text"
                name="firstName"
                autocomplete="given-name"
                :class="{ 'is-invalid': showValidation && !membershipForm.firstName.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Geschlecht</span>
              <select
                v-model="membershipForm.gender"
                name="gender"
                :class="{ 'is-invalid': showValidation && !membershipForm.gender }"
                required>
                <option value="" disabled>Bitte waehlen</option>
                <option value="maennlich">Maennlich</option>
                <option value="weiblich">Weiblich</option>
                <option value="divers">Divers</option>
              </select>
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Geburtsdatum</span>
              <input
                v-model="membershipForm.birthDate"
                type="date"
                name="birthDate"
                :class="{ 'is-invalid': showValidation && !membershipForm.birthDate }"
                required />
            </label>

            <label>
              Nationalitaet
              <input
                v-model="membershipForm.nationality"
                type="text"
                name="nationality" />
            </label>

            <label class="membership-label membership-grid__wide">
              <span class="membership-label__text membership-label__text--required">Strasse / Hausnummer</span>
              <input
                v-model="membershipForm.street"
                type="text"
                name="street"
                autocomplete="street-address"
                :class="{ 'is-invalid': showValidation && !membershipForm.street.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">PLZ</span>
              <input
                v-model="membershipForm.postalCode"
                type="text"
                name="postalCode"
                autocomplete="postal-code"
                :class="{ 'is-invalid': showValidation && !membershipForm.postalCode.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Wohnort</span>
              <input
                v-model="membershipForm.city"
                type="text"
                name="city"
                autocomplete="address-level2"
                :class="{ 'is-invalid': showValidation && !membershipForm.city.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">E-Mail</span>
              <input
                v-model="membershipForm.email"
                type="email"
                name="email"
                autocomplete="email"
                :class="{ 'is-invalid': showValidation && !isValidEmail(membershipForm.email) }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Telefon privat / mobil</span>
              <input
                v-model="membershipForm.phone"
                type="tel"
                name="phone"
                autocomplete="tel"
                :class="{ 'is-invalid': showValidation && !membershipForm.phone.trim() }"
                required />
            </label>

            <label class="membership-grid__wide">
              Gesetzlicher Vertreter
              <input
                v-model="membershipForm.guardianName"
                type="text"
                name="guardianName"
                placeholder="bei Minderjaehrigen" />
            </label>
          </div>
        </section>

        <section class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">MEINE MITGLIEDSCHAFT UND JAHRESBEITRAG</h2>
          </div>

          <div class="membership-options membership-options--four">
            <label class="membership-option" v-for="option in membershipTypeOptions" :key="option.value">
              <input
                v-model="membershipForm.membershipType"
                type="radio"
                name="membershipType"
                :value="option.value"
                required />
              <span>{{ option.label }}</span>
            </label>
          </div>

          <div
            v-if="membershipForm.membershipType === 'support'"
            class="membership-grid membership-grid--two membership-subgrid">
            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Foerderbeitrag in EUR</span>
              <input
                v-model="membershipForm.supportAmount"
                type="number"
                min="100"
                step="1"
                name="supportAmount"
                :class="{ 'is-invalid': showValidation && !isValidSupportAmount }"
                placeholder="mindestens 100" />
            </label>
          </div>
        </section>

        <section class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">BEITRAGSZAHLUNG</h2>
          </div>

          <div class="membership-subsection membership-subsection--flush">
            <div class="membership-options membership-options--three">
              <label class="membership-option" v-for="option in paymentFrequencyOptions" :key="option.value">
                <input
                  v-model="membershipForm.paymentFrequency"
                  type="radio"
                  name="paymentFrequency"
                  :value="option.value"
                  required />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>
        </section>

        <section
          v-if="membershipForm.membershipType === 'family'"
          class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">4. Weitere Familienmitglieder</h2>
          </div>

          <div class="membership-family-list">
            <div
              v-for="(member, index) in membershipForm.familyMembers"
              :key="member.id"
              class="membership-family-row">
              <div class="membership-family-row__header">
                <h3 class="membership-subtitle">Familienmitglied {{ index + 1 }}</h3>
                <button
                  v-if="membershipForm.familyMembers.length > 1"
                  type="button"
                  class="membership-link-btn"
                  @click="removeFamilyMember(member.id)">
                  Entfernen
                </button>
              </div>

              <div class="membership-grid membership-grid--three">
                <label class="membership-grid__wide">
                  Name / Vorname
                  <input v-model="member.name" type="text" />
                </label>

                <label>
                  Geburtsdatum
                  <input v-model="member.birthDate" type="date" />
                </label>

                <label>
                  Geschlecht
                  <input v-model="member.gender" type="text" placeholder="m/w/divers" />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="membership-secondary-btn"
            @click="addFamilyMember">
            Familienmitglied hinzufuegen
          </button>
        </section>

        <section class="membership-block">
          <div class="membership-block__header">
            <h2 class="membership-section-title">Einzugsermächtigung u. SEPA-Lastschriftmandat</h2>
          </div>

          <p class="membership-copy">
            Hiermit ermächtige(n) ich/wir den Zahlungsempfänger Sportverein
            Ottweiler 1919 e.V. widerruflich, die von mir/uns zu entrichtenden
            Beiträge bei Fälligkeit durch Lastschrift von meinem/unserem Konto
            einzuziehen.
          </p>

          <p class="membership-copy">
            Ich/Wir ermächtige(n) den Zahlungsempfänger Sportverein Ottweiler
            1919 e.V. Zahlungen von meinem/unserem Konto mittels Lastschrift
            einzuziehen. Zugleich weise(n) ich/wir mein/unser Kreditinstitut an,
            die vom Zahlungsempfänger Sportverein Ottweiler 1919 e.V. auf
            mein/unser Konto gezogene Lastschriften einzulösen.
          </p>

          <div class="membership-grid membership-grid--two">
            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Kontoinhaber</span>
              <input
                v-model="membershipForm.accountHolder"
                type="text"
                name="accountHolder"
                :class="{ 'is-invalid': showValidation && !membershipForm.accountHolder.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Kreditinstitut</span>
              <input
                v-model="membershipForm.bankName"
                type="text"
                name="bankName"
                :class="{ 'is-invalid': showValidation && !membershipForm.bankName.trim() }"
                required />
            </label>

            <label class="membership-label membership-grid__wide">
              <span class="membership-label__text membership-label__text--required">Strasse / Hausnummer</span>
              <input
                v-model="membershipForm.bankStreet"
                type="text"
                name="bankStreet"
                :class="{ 'is-invalid': showValidation && !membershipForm.bankStreet.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">PLZ</span>
              <input
                v-model="membershipForm.bankPostalCode"
                type="text"
                name="bankPostalCode"
                :class="{ 'is-invalid': showValidation && !membershipForm.bankPostalCode.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Wohnort</span>
              <input
                v-model="membershipForm.bankCity"
                type="text"
                name="bankCity"
                :class="{ 'is-invalid': showValidation && !membershipForm.bankCity.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">IBAN</span>
              <input
                v-model="membershipForm.iban"
                type="text"
                name="iban"
                autocomplete="off"
                :class="{ 'is-invalid': showValidation && !membershipForm.iban.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">BIC</span>
              <input
                v-model="membershipForm.bic"
                type="text"
                name="bic"
                autocomplete="off"
                :class="{ 'is-invalid': showValidation && !membershipForm.bic.trim() }"
                required />
            </label>

            <label class="membership-label">
              <span class="membership-label__text membership-label__text--required">Ort / Datum</span>
              <input
                v-model="membershipForm.signaturePlaceDate"
                type="text"
                name="signaturePlaceDate"
                placeholder="z. B. Ottweiler, 25.05.2026"
                :class="{ 'is-invalid': showValidation && !membershipForm.signaturePlaceDate.trim() }"
                required />
            </label>
          </div>
        </section>

        <section class="membership-block membership-block--final">
          <div class="membership-block__header">
            <h2 class="membership-section-title">Mit der Unterschrift dieser Anmeldung wird die Vereinssatzung und die Anmerkungen auf der Rückseite anerkannt.</h2>
          </div>

          <div class="membership-checks">
            <label class="membership-check">
              <input
                v-model="membershipForm.acceptStatutes"
                type="checkbox"
                :class="{ 'is-invalid': showValidation && !membershipForm.acceptStatutes }"
                required />
              <span>Ich erkenne die Vereinssatzung und die Anmerkungen auf der Rückseite an.</span>
            </label>

            <label class="membership-check">
              <input
                v-model="membershipForm.acceptSepa"
                type="checkbox"
                :class="{ 'is-invalid': showValidation && !membershipForm.acceptSepa }"
                required />
              <span>Ich erteile das SEPA-Lastschriftmandat für die angegebenen Kontodaten.</span>
            </label>

            <label class="membership-check">
              <input
                v-model="membershipForm.acceptPrivacy"
                type="checkbox"
                :class="{ 'is-invalid': showValidation && !membershipForm.acceptPrivacy }"
                required />
              <span>Ich stimme der Speicherung und Verarbeitung meiner Daten fuer die Vereinsverwaltung zu.</span>
            </label>
          </div>

          <div class="membership-submit-row">
            <p class="membership-copy membership-submit-row__text">
              Der Antrag wird in einem druckfertigen PDF-Format geöffnet. Im
              Druckdialog kann er als PDF gespeichert oder direkt gedruckt
              werden.
            </p>
            <div class="membership-submit-actions">
              <button type="button" class="membership-secondary-btn" @click="printBlankApplication">
                Leeren Antrag als PDF öffnen
              </button>
              <button type="submit" class="membership-primary-btn">
                Ausgefüllten Antrag als PDF öffnen
              </button>
            </div>
          </div>
          <p v-if="showValidation && !isFormValid" class="membership-error-text">
            Bitte alle Pflichtfelder korrekt ausfüllen.
          </p>
        </section>
      </form>

      <section class="membership-notice" aria-labelledby="membership-notice-title">
        <div class="membership-notice__intro">
          <h2 id="membership-notice-title" class="membership-section-title">
            DER SPORTVEREIN OTTWEILER 1919 e.V. HEISST SIE ALS NEUES
            VEREINSMITGLIED HERZLICH WILLKOMMEN!
          </h2>
          <p class="membership-copy">
            Bitte beachten Sie beim Ausfüllen des Antrages folgende Punkte:
          </p>
        </div>

        <div class="membership-rules">
          <div class="membership-rule-item"><span class="membership-rule-number">1.</span><span>Bei den Beitragszahlungen handelt es sich um Jahresbeiträge. Diese beziehen sich auf ein Kalenderjahr.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">2.</span><span>Der Sportverein Ottweiler 1919 e.V. kassiert seine Mitgliedsbeiträge jährlich im Voraus ein. Dies geschieht im Januar/Februar auf dem Wege des unbaren Zahlungsverkehrs durch das Banklastschriftverfahren. Hierfür wird eine Einzugsermächtigung und ein SEPA-Lastschriftmandat benötigt (siehe Seite 1). Bei den Jugendlichen, die das 18. Lebensjahr noch nicht vollendet haben, verpflichtet sich der den Antrag bestätigende Vertretungsbevollmächtigte neben dem Minderjährigen zur Zahlung des Mitgliedsbeitrages.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">3.</span><span>Die Mindestmitgliedschaft beträgt ein Jahr.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">4.</span><span>Aktive Mitglieder sind alle Erwachsene/Jugendliche, die aktiv am Spiel- und Trainingsbetrieb teilnehmen: Spieler, Trainer, Betreuer, Schiedsrichter</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">5.</span><span>Die Beitragsgruppen: Erwachsene ab vollendeten 18. Lebensjahr, Jugendliche bis zum vollendeten 18. Lebensjahr, Fördermitgliedschaft, Familienmitgliedschaft</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">6.</span><span>Für eine Familienmitgliedschaft gilt folgende Regelung: 1 oder 2 Erziehungsberechtigte UND mindestens 1 Kind, das 18. Lebensjahr noch nicht vollendet hat. Die Familienmitgliedschaft geht für alle Personen ab dem 18. Lebensjahr des jüngsten Kindes automatisch in eine reguläre Mitgliedschaft über.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">7.</span><span>Ehrenmitglieder und Schiedsrichter können gem. Satzung auf eigenen Wunsch beitragsfrei gestellt werden. Wir bitten um entsprechende, schriftliche Mitteilung an den Vorstand des Sportverein Ottweiler 1919 e.V.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">8.</span><span>Für aktive Jugendliche erteilen mit diesem Antrag die Erziehungsberechtigten ihr Einverständnis, dass ihr(e) im Antrage genanntes/n Kind(er) beim Sportverein Ottweiler 1919 e.V. an Sport- und Übungsveranstaltungen des Vereins im Heimatort und außerhalb teilnehmen darf. Diese Einverständniserklärung bleibt gültig bis auf einen schriftlichen Widerruf an den Verein.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">9.</span><span>Wir möchten Sie bitten der Geschäftsstelle alle Änderungen unaufgefordert mitzuteilen: Änderung der Bankverbindung oder Wechsel des Geldinstitutes, Adressänderung, Änderung von Telefon und Email</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">10.</span><span>Eine Kündigung der Mitgliedschaft muss schriftlich mit vierwöchiger Frist zum 31.12 des laufenden Jahres über die Geschäftsstelle an den Vorstand erfolgen. Bei Kündigung, Vereinswechsel oder anderweitigem Vereinsaustritt wird der Jahresbeitrag NICHT anteilig erstattet.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">11.</span><span>Die Abmeldung vom Spielbetrieb bedeutet nicht die Kündigung beim Sportverein Ottweiler 1919 e.V. Die Kündigung muss zusätzlich, wie in Punkt 9. beschrieben, schriftlich an den Vorstand erfolgen.</span></div>
          <div class="membership-rule-item"><span class="membership-rule-number">12.</span><span>Alle personenbezogenen Daten werden grundsätzlich vertraulich behandelt. Die für die Geschäftsabwicklung notwendigen Daten werden gespeichert. Ferner werden Adress- und Bestelldaten für eigene Marketingzwecke erhoben und verarbeitet.</span></div>
        </div>

        <div class="membership-notice__meta">
          <p><strong>SEPA-Glaeubiger-ID:</strong> DE86SVO00000775603</p>
          <p>
            <strong>Hinweis:</strong> Innerhalb von acht Wochen kann ab
            Belastungsdatum die Erstattung des belasteten Betrags verlangt werden.
          </p>
        </div>
      </section>
    </div>

    <div class="membership-print-root" :class="{ 'membership-print-root--active': printMode !== null }">
      <section class="print-page">
        <div class="print-title-row">
          <img class="print-logo" :src="printLogo" alt="SV Ottweiler Logo" />
          <h1 class="print-title">MITGLIEDSANTRAG / ÄNDERUNGSANTRAG</h1>
          <div class="print-page-marker">&gt;&gt;&gt; Seite 1</div>
        </div>
        <p class="print-small-note">Bitte den Antrag gut leserlich ausfüllen und an den Sportverein Ottweiler 1919 e.V. per eMail oder postalisch zurücksenden</p>

        <div class="print-request-header">
          <div class="print-request-lines">
            <div>{{ printableCheckbox(membershipForm.requestType === "new-active") }} Hiermit melde ich mich als aktives Mitglied beim Sportverein Ottweiler 1919 e.V. an.</div>
            <div>{{ printableCheckbox(membershipForm.requestType === "new-passive") }} Hiermit melde ich mich als passives Mitglied beim Sportverein Ottweiler 1919 e.V. an.</div>
            <div>{{ printableCheckbox(membershipForm.requestType === "change-request") }} Hiermit möchte ich eine Änderung meiner Daten melden.</div>
          </div>
          <div class="print-member-box">
            <div class="print-member-box__field"></div>
            <div class="print-member-box__label">Mitgliedsnummer<br />(wird vom Verein ausgefüllt)</div>
          </div>
        </div>

        <div class="print-line-row">
          <div class="print-line-field">
            <span class="print-field-label">Familienname</span>
            <span class="print-field-line">{{ printableValue(membershipForm.lastName) }}</span>
          </div>
          <div class="print-inline-split">
            <div class="print-line-field">
              <span class="print-field-label">{{ printableCheckbox(membershipForm.gender === "maennlich") }} männlich</span>
              <span class="print-field-line">&nbsp;</span>
            </div>
            <div class="print-line-field">
              <span class="print-field-label">{{ printableCheckbox(membershipForm.gender === "weiblich") }} weiblich</span>
              <span class="print-field-line">&nbsp;</span>
            </div>
          </div>
        </div>

        <div class="print-line-row">
          <div class="print-line-field">
            <span class="print-field-label">Vorname</span>
            <span class="print-field-line">{{ printableValue(membershipForm.firstName) }}</span>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">Straße / Hausnummer</span>
            <span class="print-field-line">{{ printableValue(membershipForm.street) }}</span>
          </div>
        </div>

        <div class="print-line-row">
          <div class="print-inline-split">
            <div class="print-line-field">
              <span class="print-field-label">Geburtsdatum</span>
              <span class="print-field-line">{{ printableValue(membershipForm.birthDate) }}</span>
            </div>
            <div class="print-line-field">
              <span class="print-field-label">Nationalität</span>
              <span class="print-field-line">{{ printableValue(membershipForm.nationality) }}</span>
            </div>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">PLZ / Wohnort</span>
            <span class="print-field-line">{{ printableCityLine }}</span>
          </div>
        </div>

        <div class="print-line-row">
          <div class="print-line-field">
            <span class="print-field-label">eMail</span>
            <span class="print-field-line">{{ printableValue(membershipForm.email) }}</span>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">Telefon privat/mobil</span>
            <span class="print-field-line">{{ printableValue(membershipForm.phone) }}</span>
          </div>
        </div>

        <h2 class="print-section-title">MEINE MITGLIEDSCHAFT UND JAHRESBEITRAG</h2>
        <div class="print-checkbox-grid print-checkbox-grid--four">
          <div>{{ printableCheckbox(membershipForm.membershipType === "adult") }} Erwachsener 84,- EUR</div>
          <div>{{ printableCheckbox(membershipForm.membershipType === "youth") }} Jugdl. bis 18 Jahre 72,- EUR</div>
          <div>{{ printableCheckbox(membershipForm.membershipType === "family") }} Familie 132,- EUR</div>
          <div>{{ printableCheckbox(membershipForm.membershipType === "support") }} Fördermitgliedschaft: ab 100,- EUR {{ printableSupportAmount }}</div>
        </div>

        <h2 class="print-section-title">BEITRAGSZAHLUNG</h2>
        <div class="print-checkbox-grid print-checkbox-grid--three">
          <div>{{ printableCheckbox(membershipForm.paymentFrequency === "yearly") }} jährlich</div>
          <div>{{ printableCheckbox(membershipForm.paymentFrequency === "half-yearly") }} halbjährlich</div>
          <div>{{ printableCheckbox(membershipForm.paymentFrequency === "quarterly") }} vierteljährlich</div>
        </div>

        <p class="print-small-note print-small-note--spaced">Bei einer Familienmitgliedschaft bitte die weiteren Familienmitglieder eintragen.</p>
        <div
          v-for="member in printableFamilyMembers"
          :key="member.id"
          class="print-family-row">
          <div class="print-line-field">
            <span class="print-field-label">Name / Vorname</span>
            <span class="print-field-line">{{ printableValue(member.name) }}</span>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">Geburtsdatum</span>
            <span class="print-field-line">{{ printableValue(member.birthDate) }}</span>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">m/w</span>
            <span class="print-field-line">{{ printableValue(member.gender) }}</span>
          </div>
        </div>

        <p class="print-signature-note">Mit der Unterschrift dieser Anmeldung wird die Vereinssatzung und die Anmerkungen auf der Rückseite anerkannt.</p>

        <div class="print-line-row print-line-row--signature">
          <div class="print-line-field">
            <span class="print-field-label">Ort Datum</span>
            <span class="print-field-line">{{ printableValue(membershipForm.signaturePlaceDate) }}</span>
          </div>
          <div class="print-line-field">
            <span class="print-field-label">Unterschrift/ Bei Jugendlichen unter 18 Jahren Unterschrift des gesetzlichen Vertreters</span>
            <span class="print-field-line">&nbsp;</span>
          </div>
        </div>

        <div class="print-sepa-box">
          <div class="print-sepa-copy">
            <p><strong>Einzugsermächtigung u. SEPA-Lastschriftmandat</strong></p>
            <p>Hiermit ermächtige(n) ich/wir den Zahlungsempfänger Sportverein Ottweiler 1919 e.V. widerruflich, die von mir/uns zu entrichtenden Beiträge bei Fälligkeit durch Lastschrift von meinem/unserem Konto einzuziehen.</p>
            <p>Ich/Wir ermächtige(n) den Zahlungsempfänger Sportverein Ottweiler 1919 e.V. Zahlungen von meinem/unserem Konto mittels Lastschrift einzuziehen. Zugleich weise(n) ich/wir mein/unser Kreditinstitut an, die vom Zahlungsempfänger Sportverein Ottweiler 1919 e.V. auf mein/unser Konto gezogene Lastschriften einzulösen.</p>
            <p><strong>Hinweis:</strong> Ich/Wir kann/können innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten dabei die mit meinem/unserem Kreditinstitut vereinbarten Bedingungen.</p>
            <p><strong>Gläubiger ID: DE86SVO00000775603</strong></p>
            <p><strong>MANDATSREFERENZ:</strong><br />(wird vom Zahlungsempfänger ausgefüllt)</p>
          </div>
          <div class="print-sepa-fields">
            <div class="print-line-field"><span class="print-field-label">Kontoinhaber (Vorname, Name)</span><span class="print-field-line">{{ printableValue(membershipForm.accountHolder) }}</span></div>
            <div class="print-line-field print-line-field--spaced"><span class="print-field-label">Straße / Hausnummer</span><span class="print-field-line">{{ printableValue(membershipForm.bankStreet) }}</span></div>
            <div class="print-line-field print-line-field--spaced"><span class="print-field-label">PLZ / Wohnort</span><span class="print-field-line">{{ printableBankCityLine }}</span></div>
            <div class="print-line-row print-line-row--tight">
              <div class="print-line-field"><span class="print-field-label">Kreditinstitut</span><span class="print-field-line">{{ printableValue(membershipForm.bankName) }}</span></div>
              <div class="print-line-field"><span class="print-field-label">BIC</span><span class="print-field-line">{{ printableValue(membershipForm.bic) }}</span></div>
            </div>
            <div class="print-line-field"><span class="print-field-label">IBAN</span><span class="print-field-line">{{ printableValue(membershipForm.iban) }}</span></div>
            <div class="print-line-row print-line-row--signature">
              <div class="print-line-field"><span class="print-field-label">Ort Datum</span><span class="print-field-line">{{ printableValue(membershipForm.signaturePlaceDate) }}</span></div>
              <div class="print-line-field"><span class="print-field-label">Unterschrift</span><span class="print-field-line">&nbsp;</span></div>
            </div>
          </div>
        </div>

        <div class="print-footer-contacts">
          <div><strong>1. Vorsitzender</strong>Sascha Gutheil<br />Marc-Chagall-Str. 14<br />66564 Ottweiler<br />Tel. (06826) 2080032</div>
          <div><strong>2. Vorsitzender</strong>Matthias Thuil<br />Auguste-Renoir-Str. 9<br />66564 Ottweiler<br />Tel. (06824) 5819</div>
          <div><strong>Hauptkasse</strong>Jochen Kranz<br />In den Langen Gärten 48<br />66564 Ottweiler<br />Tel. 06824 1416</div>
          <div><strong>Bankverbindung</strong>Sparkasse Neunkirchen<br />IBAN: DE94 5925 2046 0000 0225 35<br />BIC SALA DE 51 NKS</div>
        </div>
      </section>

      <section class="print-page">
        <div class="print-title-row">
          <img class="print-logo" :src="printLogo" alt="SV Ottweiler Logo" />
          <h1 class="print-title">MITGLIEDSANTRAG / ÄNDERUNGSANTRAG</h1>
          <div class="print-page-marker">&gt;&gt;&gt; Seite 2</div>
        </div>

        <div class="print-rules-title">DER SPORTVEREIN OTTWEILER 1919 e.V. HEISST SIE ALS NEUES VEREINSMITGLIED HERZLICH WILLKOMMEN!</div>
        <div class="print-rules-subtitle">Bitte beachten Sie beim Ausfüllen des Antrages folgende Punkte:</div>

        <div class="print-rules-list">
          <div class="print-rule-item"><span class="print-rule-number">1.</span><span>Bei den Beitragszahlungen handelt es sich um Jahresbeiträge. Diese beziehen sich auf ein Kalenderjahr.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">2.</span><span>Der Sportverein Ottweiler 1919 e.V. kassiert seine Mitgliedsbeiträge jährlich im Voraus ein. Dies geschieht im Januar/Februar auf dem Wege des unbaren Zahlungsverkehrs durch das Banklastschriftverfahren. Hierfür wird eine Einzugsermächtigung und ein SEPA-Lastschriftmandat benötigt (siehe Seite 1). Bei den Jugendlichen, die das 18. Lebensjahr noch nicht vollendet haben, verpflichtet sich der den Antrag bestätigende Vertretungsbevollmächtigte neben dem Minderjährigen zur Zahlung des Mitgliedsbeitrages.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">3.</span><span>Die Mindestmitgliedschaft beträgt ein Jahr.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">4.</span><span>Aktive Mitglieder sind alle Erwachsene/Jugendliche, die aktiv am Spiel- und Trainingsbetrieb teilnehmen: Spieler, Trainer, Betreuer, Schiedsrichter</span></div>
          <div class="print-rule-item"><span class="print-rule-number">5.</span><span>Die Beitragsgruppen: Erwachsene ab vollendeten 18. Lebensjahr, Jugendliche bis zum vollendeten 18. Lebensjahr, Fördermitgliedschaft, Familienmitgliedschaft</span></div>
          <div class="print-rule-item"><span class="print-rule-number">6.</span><span>Für eine Familienmitgliedschaft gilt folgende Regelung: 1 oder 2 Erziehungsberechtigte UND mindestens 1 Kind, das 18. Lebensjahr noch nicht vollendet hat. Die Familienmitgliedschaft geht für alle Personen ab dem 18. Lebensjahr des jüngsten Kindes automatisch in eine reguläre Mitgliedschaft über.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">7.</span><span>Ehrenmitglieder und Schiedsrichter können gem. Satzung auf eigenen Wunsch beitragsfrei gestellt werden. Wir bitten um entsprechende, schriftliche Mitteilung an den Vorstand des Sportverein Ottweiler 1919 e.V.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">8.</span><span>Für aktive Jugendliche erteilen mit diesem Antrag die Erziehungsberechtigten ihr Einverständnis, dass ihr(e) im Antrage genanntes/n Kind(er) beim Sportverein Ottweiler 1919 e.V. an Sport- und Übungsveranstaltungen des Vereins im Heimatort und außerhalb teilnehmen darf. Diese Einverständniserklärung bleibt gültig bis auf einen schriftlichen Widerruf an den Verein.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">9.</span><span>Wir möchten Sie bitten der Geschäftsstelle alle Änderungen unaufgefordert mitzuteilen: Änderung der Bankverbindung oder Wechsel des Geldinstitutes, Adressänderung, Änderung von Telefon und Email</span></div>
          <div class="print-rule-item"><span class="print-rule-number">10.</span><span>Eine Kündigung der Mitgliedschaft muss schriftlich mit vierwöchiger Frist zum 31.12 des laufenden Jahres über die Geschäftsstelle an den Vorstand erfolgen. Bei Kündigung, Vereinswechsel oder anderweitigem Vereinsaustritt wird der Jahresbeitrag NICHT anteilig erstattet.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">11.</span><span>Die Abmeldung vom Spielbetrieb bedeutet nicht die Kündigung beim Sportverein Ottweiler 1919 e.V. Die Kündigung muss zusätzlich, wie in Punkt 9. beschrieben, schriftlich an den Vorstand erfolgen.</span></div>
          <div class="print-rule-item"><span class="print-rule-number">12.</span><span>Alle personenbezogenen Daten werden grundsätzlich vertraulich behandelt. Die für die Geschäftsabwicklung notwendigen Daten werden gespeichert. Ferner werden Adress- und Bestelldaten für eigene Marketingzwecke erhoben und verarbeitet.</span></div>
        </div>

        <div class="print-footer-contacts print-footer-contacts--bottom">
          <div><strong>1. Vorsitzender</strong>Sascha Gutheil<br />Marc-Chagall-Str. 14<br />66564 Ottweiler<br />Tel. (06826) 2080032</div>
          <div><strong>2. Vorsitzender</strong>Matthias Thuil<br />Auguste-Renoir-Str. 9<br />66564 Ottweiler<br />Tel. (06824) 5819</div>
          <div><strong>Hauptkasse</strong>Jochen Kranz<br />In den Langen Gärten 48<br />66564 Ottweiler<br />Tel. (06824) 1416</div>
          <div><strong>Bankverbindung</strong>Sparkasse Neunkirchen<br />IBAN: DE94 5925 2046 0000 0225 35<br />BIC SALA DE 51 NKS</div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import printLogo from "@/assets/sv_logo_farbe.svg";

type FamilyMember = {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
};

const showValidation = ref(false);
const printMode = ref<null | "blank" | "filled">(null);

const requestTypeOptions = [
  {
    value: "new-active",
    label: "Hiermit melde ich mich als aktives Mitglied beim Sportverein Ottweiler 1919 e.V. an.",
  },
  {
    value: "new-passive",
    label: "Hiermit melde ich mich als passives Mitglied beim Sportverein Ottweiler 1919 e.V. an.",
  },
  {
    value: "change-request",
    label: "Hiermit möchte ich eine Änderung meiner Daten melden.",
  },
];

const membershipTypeOptions = [
  { value: "adult", label: "Erwachsener 84,- EUR" },
  { value: "youth", label: "Jugdl. bis 18 Jahre 72,- EUR" },
  { value: "family", label: "Familie 132,- EUR" },
  { value: "support", label: "Fördermitgliedschaft: ab 100,- EUR" },
];

const paymentFrequencyOptions = [
  { value: "yearly", label: "jährlich" },
  { value: "half-yearly", label: "halbjährlich" },
  { value: "quarterly", label: "vierteljährlich" },
];

let nextFamilyMemberId = 2;

const createFamilyMember = (): FamilyMember => ({
  id: nextFamilyMemberId++,
  name: "",
  birthDate: "",
  gender: "",
});

const membershipForm = ref({
  requestType: "new-active",
  lastName: "",
  firstName: "",
  gender: "",
  birthDate: "",
  nationality: "",
  street: "",
  postalCode: "",
  city: "",
  email: "",
  phone: "",
  guardianName: "",
  membershipType: "adult",
  supportAmount: "",
  paymentFrequency: "yearly",
  familyMembers: [
    {
      id: 1,
      name: "",
      birthDate: "",
      gender: "",
    },
  ] as FamilyMember[],
  accountHolder: "",
  bankStreet: "",
  bankPostalCode: "",
  bankCity: "",
  bankName: "",
  iban: "",
  bic: "",
  signaturePlaceDate: "",
  acceptStatutes: false,
  acceptSepa: false,
  acceptPrivacy: false,
});

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidSupportAmount = computed(
  () =>
    membershipForm.value.membershipType !== "support" ||
    Number(membershipForm.value.supportAmount || 0) >= 100,
);

const isFormValid = computed(() => {
  const form = membershipForm.value;

  return (
    !!form.lastName.trim() &&
    !!form.firstName.trim() &&
    !!form.gender &&
    !!form.birthDate &&
    !!form.street.trim() &&
    !!form.postalCode.trim() &&
    !!form.city.trim() &&
    isValidEmail(form.email) &&
    !!form.phone.trim() &&
    isValidSupportAmount.value &&
    !!form.accountHolder.trim() &&
    !!form.bankName.trim() &&
    !!form.bankStreet.trim() &&
    !!form.bankPostalCode.trim() &&
    !!form.bankCity.trim() &&
    !!form.iban.trim() &&
    !!form.bic.trim() &&
    !!form.signaturePlaceDate.trim() &&
    form.acceptStatutes &&
    form.acceptSepa &&
    form.acceptPrivacy
  );
});

const addFamilyMember = () => {
  membershipForm.value.familyMembers.push(createFamilyMember());
};

const removeFamilyMember = (id: number) => {
  membershipForm.value.familyMembers = membershipForm.value.familyMembers.filter(
    (member) => member.id !== id,
  );
};

const printBlankApplication = () => {
  printMode.value = "blank";
  nextTick(() => {
    window.print();
    window.setTimeout(() => {
      printMode.value = null;
    }, 300);
  });
};

const printFilledApplication = () => {
  showValidation.value = true;

  if (!isFormValid.value) {
    return;
  }

  if (
    membershipForm.value.membershipType === "support" &&
    Number(membershipForm.value.supportAmount || 0) < 100
  ) {
    window.alert("Bei der Foerdermitgliedschaft bitte mindestens 100 EUR eintragen.");
    return;
  }
  printMode.value = "filled";
  nextTick(() => {
    window.print();
    window.setTimeout(() => {
      printMode.value = null;
    }, 300);
  });
};

const printableValue = (value: string) => {
  if (printMode.value !== "filled") {
    return "";
  }

  return value.trim();
};

const printableCheckbox = (checked: boolean) =>
  printMode.value === "filled" && checked ? "☒" : "☐";

const printableCityLine = computed(() => {
  if (printMode.value !== "filled") {
    return "";
  }

  return `${membershipForm.value.postalCode.trim()} ${membershipForm.value.city.trim()}`.trim();
});

const printableBankCityLine = computed(() => {
  if (printMode.value !== "filled") {
    return "";
  }

  return `${membershipForm.value.bankPostalCode.trim()} ${membershipForm.value.bankCity.trim()}`.trim();
});

const printableSupportAmount = computed(() => {
  if (
    printMode.value !== "filled" ||
    membershipForm.value.membershipType !== "support"
  ) {
    return "";
  }

  return `${membershipForm.value.supportAmount} EUR`;
});

const printableFamilyMembers = computed(() => {
  if (printMode.value !== "filled") {
    return [{ id: 0, name: "", birthDate: "", gender: "" }];
  }

  const entries = membershipForm.value.familyMembers.filter(
    (member) => member.name.trim() || member.birthDate || member.gender.trim(),
  );

  return entries.length
    ? entries
    : [{ id: 0, name: "", birthDate: "", gender: "" }];
});
</script>

<style scoped>
.membership-page {
  min-height: calc(100dvh - var(--sv-header-height));
  padding: clamp(28px, 4vw, 52px) 18px 72px;
  color: #ffffff;
}

.membership-shell {
  width: min(980px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 22px;
}

.membership-header,
.membership-notice,
.membership-block {
  box-sizing: border-box;
  background: rgba(7, 18, 44, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.18);
}

.membership-header {
  padding: 28px 30px 24px;
}

.membership-header__eyebrow {
  margin: 0 0 0.6rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.membership-header__title {
  margin: 0;
  font-size: clamp(2rem, 4.4vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.03em;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.membership-header__lead,
.membership-copy {
  margin: 0.9rem 0 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.65;
}

.membership-notice,
.membership-block {
  padding: 24px 30px 28px;
}

.membership-notice__intro {
  margin-bottom: 1rem;
}

.membership-section-title {
  margin: 0;
  font-size: clamp(1.35rem, 2.8vw, 2rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.membership-rules {
  margin: 0;
  display: grid;
  gap: 0.8rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.86);
}

.membership-rule-item {
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 10px;
  align-items: start;
}

.membership-rule-number {
  font-weight: 800;
  color: #f4d047;
}

.membership-notice__meta {
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(16, 24, 40, 0.12);
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
}

.membership-notice__meta p {
  margin: 0.35rem 0 0;
}

.membership-form {
  display: grid;
  gap: 18px;
}

.membership-block__header {
  margin-bottom: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(16, 24, 40, 0.1);
}

.membership-grid {
  display: grid;
  gap: 16px 18px;
}

.membership-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.membership-grid--three {
  grid-template-columns: 2fr 1fr 1fr;
}

.membership-grid__wide {
  grid-column: 1 / -1;
}

.membership-form label {
  display: grid;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  min-width: 0;
}

.membership-label__text {
  display: inline-block;
}

.membership-label__text--required::after {
  content: " *";
  color: #ff6b6b;
}

.membership-form input,
.membership-form select {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font: inherit;
}

.membership-form select {
  color: #ffffff;
}

.membership-form select option {
  color: #000000;
}

.membership-form input::placeholder {
  color: rgba(255, 255, 255, 0.52);
}

.membership-form input:focus,
.membership-form select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.64);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.membership-form input.is-invalid,
.membership-form select.is-invalid {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.14);
}

.membership-options {
  display: grid;
  gap: 10px 18px;
}

.membership-options--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.membership-options--four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.membership-option {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-height: 44px;
  padding: 0;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.45;
}

.membership-option input,
.membership-check input {
  width: 18px;
  height: 18px;
  min-height: 18px;
  margin: 0;
  box-shadow: none;
}

.membership-subsection,
.membership-subgrid {
  margin-top: 1rem;
}

.membership-subtitle {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.membership-family-list {
  display: grid;
  gap: 16px;
}

.membership-family-row {
  padding: 16px 0 0;
  border-top: 1px solid rgba(16, 24, 40, 0.1);
}

.membership-family-row:first-child {
  padding-top: 0;
  border-top: 0;
}

.membership-family-row__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 0.9rem;
}

.membership-link-btn {
  padding: 0;
  border: 0;
  background: transparent;
  color: #f4d047;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.membership-secondary-btn,
.membership-primary-btn {
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.membership-secondary-btn {
  margin-top: 1rem;
  background: transparent;
  color: #ffffff;
}

.membership-primary-btn {
  background: #f4d047;
  color: #07122c;
}

.membership-checks {
  display: grid;
  gap: 14px;
}

.membership-check {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 10px;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.55;
}

.membership-check input.is-invalid {
  outline: 2px solid #ff6b6b;
  outline-offset: 2px;
}

.membership-submit-row {
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(16, 24, 40, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.membership-submit-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.membership-submit-row__text {
  margin: 0;
}

.membership-error-text {
  margin: 1rem 0 0;
  color: #ff8f8f;
  font-weight: 700;
}

.membership-print-root {
  display: none;
}

.membership-print-root--active {
  display: block;
}

      .print-page {
        background: #ffffff;
        color: #111111;
        width: auto;
        height: 273mm;
        padding: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        break-after: page;
        page-break-after: always;
      }

      .print-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .print-title-row {
        position: relative;
        display: grid;
        grid-template-columns: 56px 1fr 90px;
        align-items: end;
        gap: 16px;
        border-bottom: 2px solid #1f6da8;
        padding-bottom: 6px;
        margin-bottom: 10px;
      }

      .print-logo {
        width: 42px;
        height: 42px;
        object-fit: contain;
        align-self: start;
      }

      .print-title {
        margin: 0;
        color: #1f6da8;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0.01em;
        text-align: center;
      }

      .print-page-marker {
        font-size: 14px;
        font-weight: 700;
        justify-self: end;
      }

      .print-small-note {
        margin: 0 0 8px;
        font-size: 10.5px;
        line-height: 1.3;
      }

.print-small-note--spaced {
  margin-top: 16px;
}

      .print-request-header {
        display: grid;
        grid-template-columns: 1fr 168px;
        gap: 18px;
        align-items: start;
        margin-bottom: 10px;
      }
      .print-request-lines {
        display: grid;
        gap: 4px;
        font-size: 12px;
      }
      .print-member-box {
        display: grid;
        justify-items: stretch;
        gap: 6px;
      }
      .print-member-box__field {
        height: 40px;
        border: 1px solid #111111;
      }
      .print-member-box__label {
        font-size: 11px;
        line-height: 1.2;
        text-align: center;
      }

      .print-line-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 5px;
      }

.print-line-row--tight {
  margin-top: 10px;
}

.print-line-row--signature {
  margin-top: 20px;
}

.print-inline-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

      .print-line-field {
        display: grid;
        gap: 4px;
      }

.print-line-field--spaced {
  margin-top: 10px;
}

      .print-field-label {
        font-size: 10px;
      }

      .print-field-line {
        min-height: 14px;
        display: block;
        border-bottom: 1px solid #111111;
        padding-bottom: 0;
        font-size: 11px;
      }

      .print-section-title {
        margin: 10px 0 4px;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
      }

      .print-checkbox-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 3px 14px;
        margin-bottom: 3px;
        font-size: 12px;
      }

      .print-checkbox-grid--four {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .print-checkbox-grid--three {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .print-family-row {
        display: grid;
        grid-template-columns: 2fr 1fr 0.7fr;
        gap: 18px;
        margin-bottom: 6px;
      }

      .print-signature-note {
        margin: 8px 0 5px;
        font-size: 11px;
        font-weight: 700;
      }

      .print-sepa-box {
        margin-top: 6px;
        border: 1px solid #111111;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .print-sepa-copy,
      .print-sepa-fields {
        padding: 8px;
      }

.print-sepa-copy {
  border-right: 1px solid #111111;
}

      .print-sepa-copy p {
        margin: 0 0 5px;
        font-size: 9.6px;
        line-height: 1.18;
      }

      .print-footer-contacts {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: auto;
        padding-top: 10px;
        font-size: 9.4px;
        color: #1f6da8;
      }

      .print-footer-contacts--bottom {
        margin-top: auto;
      }

.print-footer-contacts strong {
  display: block;
  margin-bottom: 2px;
}

      .print-rules-title {
        margin: 18px 0 14px;
        font-size: 16px;
        font-weight: 800;
      }

      .print-rules-subtitle {
        margin: 0 0 14px;
        font-size: 15px;
        font-weight: 800;
      }

      .print-rules-list {
        margin: 0;
        display: grid;
        gap: 12px;
        font-size: 13px;
        line-height: 1.35;
      }

      .print-rule-item {
        display: grid;
        grid-template-columns: 24px 1fr;
        gap: 10px;
        align-items: start;
      }

      .print-rule-number {
        font-weight: 700;
      }

@media (max-width: 820px) {
  .membership-options--three,
  .membership-options--four,
  .membership-grid--two,
  .membership-grid--three {
    grid-template-columns: 1fr;
  }

  .membership-submit-row,
  .membership-family-row__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .membership-submit-actions {
    width: 100%;
  }

  .membership-submit-actions .membership-secondary-btn,
  .membership-submit-actions .membership-primary-btn {
    flex: 1 1 100%;
  }
}

@media (max-width: 640px) {
  .membership-page {
    padding: 18px 12px 36px;
  }

  .membership-header,
  .membership-notice,
  .membership-block {
    padding: 18px 16px 20px;
  }

  .membership-header__title {
    font-size: clamp(1.7rem, 9vw, 2.4rem);
  }

  .membership-section-title {
    font-size: clamp(1.1rem, 6vw, 1.5rem);
  }

  .membership-rule-item,
  .membership-check {
    grid-template-columns: 22px 1fr;
    gap: 8px;
  }

  .membership-option {
    min-height: auto;
  }

  .membership-secondary-btn,
  .membership-primary-btn {
    width: 100%;
    padding: 0 16px;
  }
}

@media print {
  @page {
    size: A4;
    margin: 12mm;
  }

  :global(html),
  :global(body),
  :global(#app) {
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
    height: auto !important;
    background: #ffffff !important;
    overflow: hidden !important;
  }

  :global(.header-container),
  :global(.site-footer),
  :global(.global-sponsor-ad),
  :global(.global-sponsor-ad-mobile),
  :global(.cookie-consent-popup),
  :global(.app-footer),
  :global(.app-content > :not(.app-page)),
  :global(.app-page > :not(.membership-page)) {
    display: none !important;
  }

  :global(.app-content),
  :global(.app-page),
  :global(.membership-page) {
    display: block !important;
    min-height: auto !important;
    height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .membership-shell {
    display: none !important;
  }

  .membership-print-root,
  .membership-print-root--active {
    display: block !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .membership-page {
    padding: 0 !important;
    color: #111111;
    background: #ffffff;
  }

  .print-page {
    width: 100%;
    height: 273mm;
  }
}
</style>
