<template>
	<div class="sponsor-become-page">
		<section class="sponsor-become-hero" aria-labelledby="sponsor-hero-title">
			<div class="sponsor-become-hero__media" aria-hidden="true">
				<img :src="sponsorHero" alt="" />
			</div>
			<div class="sponsor-become-hero__overlay" aria-hidden="true"></div>
			<div class="sponsor-become-hero__content">
				<p class="sponsor-become-hero__eyebrow">Partner werden</p>
				<h1 id="sponsor-hero-title" class="sponsor-become-hero__title">
					Sponsor werden
				</h1>
				<p class="sponsor-become-hero__lead">
					Gemeinsam staerken wir den Verein und den Fussball vor Ort.
				</p>
			</div>
			<p class="sponsor-mobile-scroll-hint"><ChevronDown /></p>
		</section>

		<section
			class="sponsor-intro sponsor-intro--offers"
			aria-labelledby="offers-title"
		>
			<div class="sponsor-intro__inner">
				<p class="sponsor-eyebrow">Was wir bieten</p>
				<h2 id="offers-title" class="sponsor-section-title">
					Sichtbarkeit, Naehe zum Verein und eine partnerschaftliche
					Zusammenarbeit.
				</h2>
				<ul class="sponsor-points">
					<li v-for="item in offerPoints" :key="item">{{ item }}</li>
				</ul>
			</div>
		</section>

		<section
			class="sponsor-intro sponsor-intro--needs"
			aria-labelledby="needs-title"
		>
			<div class="sponsor-intro__inner">
				<p class="sponsor-eyebrow">Was wir suchen</p>
				<h2 id="needs-title" class="sponsor-section-title">
					Partner, die lokale Vereinsarbeit mittragen und gemeinsam etwas
					bewegen wollen.
				</h2>
				<ul class="sponsor-points">
					<li v-for="item in searchPoints" :key="item">{{ item }}</li>
				</ul>
			</div>
		</section>

		<section class="sponsor-packages" aria-labelledby="packages-title">
			<div class="sponsor-packages__intro">
				<p
					class="sponsor-eyebrow"
					style="text-align: center; transform: translateX(-3rem)"
				>
					Möglichkeiten
				</p>
				<h2 id="packages-title" class="sponsor-section-title">
					Sechs direkte Wege, wie du unseren Verein sinnvoll unterstuetzen
					kannst.
				</h2>
			</div>

			<article
				v-for="(pkg, index) in sponsorPackages"
				:key="pkg.title"
				class="sponsor-package"
			>
				<div class="sponsor-package__inner">
					<span class="sponsor-package__index" aria-hidden="true">
						{{ String(index + 1).padStart(2, "0") }}
					</span>
					<p class="sponsor-package__label">{{ pkg.label }}</p>
					<h3 class="sponsor-package__title">{{ pkg.title }}</h3>
					<p class="sponsor-package__lead">{{ pkg.lead }}</p>
					<ul class="sponsor-package__points">
						<li v-for="point in pkg.points" :key="point">{{ point }}</li>
					</ul>
				</div>
			</article>
		</section>

		<section
			class="sponsor-contact-section"
			aria-labelledby="sponsor-contact-title"
		>
			<div class="sponsor-contact-panel">
				<div class="sponsor-contact-copy">
					<p class="sponsor-eyebrow">Kontakt</p>
					<h2 id="sponsor-contact-title" class="sponsor-section-title">
						Erzaehl uns kurz, wie du den Verein unterstuetzen moechtest.
					</h2>
					<p class="sponsor-contact-text">
						Ob Ballspende, Jugendunterstuetzung oder eine individuelle Idee: Wir
						melden uns mit einer passenden Rueckmeldung bei dir.
					</p>
				</div>

				<form
					class="sponsor-contact-form"
					@submit.prevent="handleSponsorSubmit"
				>
					<div class="sponsor-form-row">
						<label>
							Name
							<input
								v-model="sponsorForm.name"
								type="text"
								name="name"
								autocomplete="name"
								required
							/>
						</label>

						<label>
							E-Mail
							<input
								v-model="sponsorForm.email"
								type="email"
								name="email"
								autocomplete="email"
								required
							/>
						</label>
					</div>

					<div class="sponsor-form-row">
						<label>
							Unternehmen
							<input
								v-model="sponsorForm.company"
								type="text"
								name="company"
								autocomplete="organization"
							/>
						</label>

						<label>
							Interesse
							<input
								v-model="sponsorForm.interest"
								type="text"
								name="interest"
								placeholder="z. B. Jugendunterstuetzung"
							/>
						</label>
					</div>

					<label>
						Nachricht
						<textarea
							v-model="sponsorForm.message"
							name="message"
							rows="6"
							required
							placeholder="Hallo, ich interessiere mich fuer eine Unterstuetzung des Vereins ..."
						/>
					</label>

					<button type="submit" class="sponsor-submit">Anfrage senden</button>

					<p class="sponsor-form-note">
						Die Anfrage wird aktuell per E-Mail vorbereitet. Die
						Empfaengeradresse kann spaeter noch durch die finale Vereinsadresse
						ersetzt werden.
					</p>
				</form>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import sponsorHero from "@/assets/header/background.png";
	import { ChevronDown } from "@lucide/vue";

	const offerPoints = [
		"Sichtbarkeit auf Website, Social Media und im Stadion",
		"Individuelle Platzierung passend zu deinem Unternehmen",
		"Eine direkte Verbindung zur Region und zu unseren Teams",
	];

	const searchPoints = [
		"Lokale Unternehmen und engagierte Unterstuetzer",
		"Sach- und Geldspenden fuer Vereinsleben und Ausstattung",
		"Partnerschaften, die langfristig zu uns passen",
	];

	const sponsorPackages = [
		{
			label: "Moeglichkeit 01",
			title: "Ballspende",
			lead: "Direkt im Trainings- und Spielalltag sichtbar helfen.",
			points: [
				"Unterstuetzt die Teams bei Training und Spielbetrieb",
				"Einfacher Einstieg in ein lokales Sponsoring",
				"Ideal fuer eine konkrete, direkte Hilfe",
			],
		},
		{
			label: "Moeglichkeit 02",
			title: "Vereinskleidung",
			lead: "Ausstattung fuer Trainer, Jugend oder Mannschaften ermoeglichen.",
			points: [
				"Unterstuetzung fuer Jacken, Shirts oder Trainingsmaterial",
				"Praesenz im direkten Vereinsumfeld",
				"Besonders passend fuer sichtbare Sachspenden",
			],
		},
		{
			label: "Moeglichkeit 03",
			title: "Eventunterstuetzung",
			lead: "Gemeinsam Veranstaltungen, Turniere und Vereinsmomente tragen.",
			points: [
				"Unterstuetzung fuer Feste, Aktionen oder Heimspieltage",
				"Sichtbarkeit bei Veranstaltungen vor Ort",
				"Perfekt fuer regionale Partner mit Community-Bezug",
			],
		},
		{
			label: "Moeglichkeit 04",
			title: "Jugendunterstuetzung",
			lead: "Nachwuchsarbeit gezielt und nachhaltig staerken.",
			points: [
				"Hilfe fuer Trainingsmaterial, Fahrten oder gemeinsame Aktionen",
				"Direkte Unterstuetzung fuer Kinder- und Jugendbereiche",
				"Besonders wertvoll fuer langfristige Vereinsentwicklung",
			],
		},
		{
			label: "Moeglichkeit 05",
			title: "Individuelle Spende",
			lead: "Flexible Hilfe genau dort, wo sie gerade gebraucht wird.",
			points: [
				"Frei anpassbar an deinen Wunschbetrag oder Anlass",
				"Sinnvoll fuer spontane oder projektbezogene Unterstuetzung",
				"Gemeinsam stimmen wir den Einsatz transparent ab",
			],
		},
		{
			label: "Moeglichkeit 06",
			title: "Mannschaftskasse unterstuetzen",
			lead: "Ein Team gezielt im Alltag, auf Reisen oder bei Aktionen begleiten.",
			points: [
				"Direkte Hilfe fuer gemeinsame Teamaktivitaeten",
				"Unterstuetzung fuer Jugend- oder Aktiventeams moeglich",
				"Nahbar, unkompliziert und sehr konkret",
			],
		},
	];

	const sponsorContactEmail = "platzhalter@example.de";

	const sponsorForm = ref({
		name: "",
		email: "",
		company: "",
		interest: "",
		message: "",
	});

	const handleSponsorSubmit = () => {
		const subject = `Sponsoring-Anfrage${sponsorForm.value.interest ? ` - ${sponsorForm.value.interest}` : ""}`;
		const body = [
			`Name: ${sponsorForm.value.name}`,
			`E-Mail: ${sponsorForm.value.email}`,
			`Unternehmen: ${sponsorForm.value.company || "-"}`,
			`Interesse: ${sponsorForm.value.interest || "-"}`,
			"",
			"Nachricht:",
			sponsorForm.value.message,
		].join("\n");

		window.location.href = `mailto:${sponsorContactEmail}?subject=${encodeURIComponent(
			subject,
		)}&body=${encodeURIComponent(body)}`;
	};
</script>

<style scoped>
	.sponsor-become-page {
		--sv-primary-color: #022b79;
		--sv-secondary-color: #f4d047;

		--sponsor-bg: #061123;
		--sponsor-bg-soft: #081a36;
		--sponsor-card: rgba(255, 255, 255, 0.08);
		--sponsor-card-strong: rgba(255, 255, 255, 0.13);
		--sponsor-border: rgba(255, 255, 255, 0.16);
		--sponsor-text: #f8f6ee;
		--sponsor-muted: rgba(248, 246, 238, 0.74);
		--sponsor-primary: var(--sv-primary-color);
		--sponsor-secondary: var(--sv-secondary-color);
		--sponsor-primary-soft: rgba(2, 43, 121, 0.34);
		--sponsor-secondary-soft: rgba(244, 208, 71, 0.22);
		--sponsor-radius: 28px;

		position: relative;
		overflow-x: clip;
		color: var(--sponsor-text);
		background:
			radial-gradient(
				circle at 20% 10%,
				rgba(2, 43, 121, 0.52),
				transparent 30rem
			),
			radial-gradient(
				circle at 82% 38%,
				rgba(244, 208, 71, 0.18),
				transparent 28rem
			),
			linear-gradient(180deg, #030916 0%, var(--sponsor-bg) 45%, #02050b 100%);
	}

	.sponsor-become-page::before {
		content: "";
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
		background-size: 44px 44px;
		mask-image: linear-gradient(to bottom, black, transparent 78%);
	}

	.sponsor-become-page > * {
		position: relative;
		z-index: 1;
	}

	/* HERO */

	.sponsor-become-hero {
		min-height: 100svh;
		isolation: isolate;
		display: grid;
		place-items: center;
		overflow: hidden;
		top: -10dvh;
	}

	.sponsor-become-hero__media {
		position: absolute;
		inset: 0;
	}

	.sponsor-become-hero__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		filter: saturate(0.92) brightness(0.72);
		transform: scale(1.03);
	}

	.sponsor-become-hero__overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				circle at 50% 38%,
				rgba(244, 208, 71, 0.12),
				transparent 24rem
			),
			linear-gradient(
				180deg,
				rgba(3, 9, 22, 0.44) 0%,
				rgba(6, 17, 35, 0.68) 54%,
				var(--sponsor-bg) 100%
			);
		z-index: 1;
	}

	.sponsor-become-hero__content {
		position: relative;
		z-index: 3;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.75rem;
		padding: calc(var(--sv-header-height) + 2.5rem) clamp(1rem, 4vw, 2rem)
			clamp(7rem, 14vw, 9rem);
		box-sizing: border-box;
	}

	.sponsor-become-hero__eyebrow {
		margin: 0;
		color: rgba(244, 208, 71, 0.92);
		font-size: 0.82rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.sponsor-become-hero__title {
		margin: 0;
		max-width: 9ch;
		font-size: clamp(3.1rem, 10vw, 6.2rem);
		line-height: 0.92;
		letter-spacing: -0.08em;
		text-align: center;
	}

	.sponsor-become-hero__lead {
		margin: 0;
		max-width: 28ch;
		font-size: clamp(1rem, 2.8vw, 1.25rem);
		line-height: 1.55;
		color: rgba(248, 246, 238, 0.82);
		text-align: center;
	}

	.sponsor-become-hero::after {
		content: "";
		position: absolute;
		inset: auto 0 0;
		height: 42%;
		pointer-events: none;
		background: linear-gradient(to bottom, transparent, var(--sponsor-bg));
		z-index: 2;
	}

	.sponsor-mobile-scroll-hint {
		position: relative;
		top: -30dvh;

		z-index: 5;
		margin: 0;
		padding: 0.7rem 1rem;
		border-radius: 999px;
		color: var(--sponsor-text);
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;

		animation: sponsorHintFloat 1.7s ease-in-out infinite;
	}

	/* INTRO-SEKTIONEN */

	.sponsor-intro {
		min-height: 82svh;
		display: grid;
		place-items: center;
		padding: clamp(4rem, 14vw, 8rem) 1rem;
	}

	.sponsor-intro__inner,
	.sponsor-packages__intro {
		width: min(100%, 980px);
		margin-inline: auto;
	}

	.sponsor-intro__inner {
		position: relative;
		overflow: hidden;
		padding: clamp(1.4rem, 6vw, 3.5rem);
	}

	.sponsor-eyebrow {
		margin: 0 0 0.9rem;
		color: var(--sponsor-secondary);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.sponsor-section-title {
		max-width: 13ch;
		margin: 0;
		font-size: clamp(2.25rem, 11vw, 5.6rem);
		line-height: 0.94;
		letter-spacing: -0.07em;
		text-align: center;
		margin-inline: auto;
	}

	.sponsor-points {
		display: grid;
		gap: 1rem;
		margin: clamp(1.6rem, 6vw, 2.5rem) 0 0;
		padding: 0;
		list-style: none;
	}

	.sponsor-points li {
		position: relative;
		padding: 1rem 1rem 1rem 3rem;

		color: var(--sponsor-muted);
	}

	.sponsor-points li::before {
		content: "";
		position: absolute;
		left: 1rem;
		top: 1.15rem;
		width: 0.85rem;
		aspect-ratio: 1;
		border-radius: 999px;
		background: var(--sponsor-secondary);
		box-shadow: 0 0 0 7px var(--sponsor-secondary-soft);
		transform: translateY(0.85rem);
	}

	/* PACKAGE-SCROLL */

	.sponsor-packages {
		position: relative;
		padding: 5rem 1rem 7rem;
	}

	.sponsor-packages__intro {
		position: relative;
		z-index: 1;
		min-height: 58svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		pointer-events: auto;
	}

	.sponsor-packages__intro .sponsor-section-title {
		max-width: 10ch;
	}

	.sponsor-packages__intro .sponsor-eyebrow {
		padding-inline: 0.35rem;
	}

	/*
	  Natürlicher Ablauf:
	  1. Erst normal zur ersten Karte scrollen.
	  2. Danach bleiben Karten sticky.
	  3. Jede neue Karte kommt von unten und überdeckt die alte.
	  4. Keine Opacity-Reduzierung bei den Karten.
	*/

	.sponsor-package {
		position: sticky;
		top: 0;
		z-index: 2;
		min-height: 100svh;
		display: flex;
		align-items: center;
		padding-block: 1rem;
	}

	.sponsor-package:nth-of-type(1) {
		z-index: 2;
	}

	.sponsor-package:nth-of-type(2) {
		z-index: 3;
	}

	.sponsor-package:nth-of-type(3) {
		z-index: 4;
	}

	.sponsor-package:nth-of-type(4) {
		z-index: 5;
	}

	.sponsor-package:nth-of-type(5) {
		z-index: 6;
	}

	.sponsor-package:nth-of-type(6) {
		z-index: 7;
	}

	.sponsor-package__inner {
		position: relative;
		overflow: hidden;
		width: min(100%, 760px);
		margin-inline: auto;
		padding: clamp(1.25rem, 6vw, 2.5rem);
		border: 1px solid var(--sv-primary-color);
		border-radius: 32px;
		opacity: 1;
		background:
			linear-gradient(145deg, var(--sv-primary-color), black), #091728;
		box-shadow:
			0 24px 60px rgba(0, 0, 0, 0.34),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(14px);
		transform-origin: center bottom;
	}

	.sponsor-package__inner::before {
		content: none;
	}

	.sponsor-package__index {
		position: absolute;
		right: 1rem;
		top: 0.65rem;
		color: rgba(255, 255, 255, 0.08);
		font-size: clamp(5.5rem, 24vw, 11rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.1em;
	}

	.sponsor-package__label {
		position: relative;
		z-index: 1;
		width: fit-content;
		margin: 0 0 1.2rem;
		padding: 0.5rem 0.75rem;
		color: var(--sponsor-secondary);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.sponsor-package__title {
		position: relative;
		z-index: 1;
		max-width: 8ch;
		margin: 0;
		font-size: clamp(2.6rem, 14vw, 6rem);
		line-height: 0.9;
		letter-spacing: -0.08em;
	}

	.sponsor-package__lead {
		position: relative;
		z-index: 1;
		max-width: 34rem;
		margin: 1.2rem 0 0;
		color: var(--sponsor-muted);
		font-size: clamp(1.05rem, 4.6vw, 1.35rem);
		line-height: 1.45;
	}

	.sponsor-package__points {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.7rem;
		margin: 1.5rem 0 0;
		padding: 0;
		list-style: none;
	}

	.sponsor-package__points li {
		position: relative;
		padding-left: 1.6rem;
		color: rgba(248, 246, 238, 0.82);
		line-height: 1.45;
	}

	.sponsor-package__points li::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 0.55rem;
		aspect-ratio: 1;
		border-radius: 999px;
		background: var(--sponsor-secondary);
	}

	.sponsor-contact-section {
		padding: 2rem 1rem 6rem;
	}

	.sponsor-contact-panel {
		width: min(100%, 1080px);
		margin: 0 auto;
		display: grid;
		gap: 1.5rem;
		padding: clamp(1.4rem, 4vw, 2.6rem);
		border: 1px solid var(--sv-primary-color);
		border-radius: 32px;
		background:
			linear-gradient(145deg, var(--sv-primary-color), black), #091728;
		box-shadow: 0 26px 72px rgba(0, 0, 0, 0.28);
		backdrop-filter: blur(14px);
	}

	.sponsor-contact-copy {
		display: grid;
		gap: 0.9rem;
	}

	.sponsor-contact-text {
		margin: 0;
		max-width: 42rem;
		color: var(--sponsor-muted);
		line-height: 1.6;
	}

	.sponsor-contact-form {
		display: grid;
		gap: 1rem;
	}

	.sponsor-form-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.sponsor-contact-form label {
		display: grid;
		gap: 0.45rem;
		font-size: 0.84rem;
		font-weight: 800;
		color: rgba(248, 246, 238, 0.72);
	}

	.sponsor-contact-form input,
	.sponsor-contact-form textarea {
		width: 100%;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px;
		padding: 0.9rem 1rem;
		background: rgba(255, 255, 255, 0.05);
		color: var(--sponsor-text);
		font: inherit;
	}

	.sponsor-contact-form input::placeholder,
	.sponsor-contact-form textarea::placeholder {
		color: rgba(248, 246, 238, 0.34);
	}

	.sponsor-contact-form input:focus,
	.sponsor-contact-form textarea:focus {
		outline: 3px solid rgba(244, 208, 71, 0.14);
		border-color: rgba(244, 208, 71, 0.34);
	}

	.sponsor-submit {
		border: 0;
		border-radius: 999px;
		padding: 1rem 1.4rem;
		background: rgba(244, 208, 71, 0.9);
		color: #081326;
		font: inherit;
		font-weight: 900;
		cursor: pointer;
		transition:
			transform 180ms ease,
			filter 180ms ease;
	}

	.sponsor-submit:hover {
		transform: translateY(-2px);
		filter: brightness(1.03);
	}

	.sponsor-form-note {
		margin: 0;
		color: rgba(248, 246, 238, 0.54);
		line-height: 1.55;
	}

	/* MODERNE SCROLL-ANIMATION */

	@supports (animation-timeline: view()) {
		.sponsor-intro__inner {
			animation: sponsorReveal both ease-out;
			animation-timeline: view();
			animation-range: entry 10% cover 42%;
		}
	}

	/* TABLET / DESKTOP */

	@media (min-width: 760px) {
		.sponsor-intro .sponsor-section-title {
			font-size: clamp(2.25rem, 4.8vw, 4.2rem);
			line-height: 0.98;
			max-width: 12ch;
			text-align: left;
			margin-inline: 0;
		}

		.sponsor-become-hero__content {
			padding-top: calc(var(--sv-header-height) + 2.5rem);
			padding-bottom: 6rem;
		}

		.sponsor-become-hero__title {
			max-width: 8ch;
		}

		.sponsor-mobile-scroll-hint {
			bottom: 2.5rem;
			padding: 0.65rem 0.95rem;
			font-size: 0.74rem;
			opacity: 0.82;
		}

		.sponsor-intro {
			min-height: auto;
			padding: 5rem 2rem 0;
		}

		.sponsor-intro__inner {
			display: grid;
			grid-template-columns: 1.05fr 0.95fr;
			grid-template-areas:
				"kicker points"
				"title points";
			gap: clamp(2rem, 5vw, 5rem);
			align-items: start;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			backdrop-filter: none;
		}

		.sponsor-intro--needs .sponsor-intro__inner {
			grid-template-columns: 0.95fr 1.05fr;
			grid-template-areas:
				"points kicker"
				"points title";
		}

		.sponsor-intro .sponsor-eyebrow {
			grid-area: kicker;
			margin-bottom: 0.4rem;
		}

		.sponsor-intro .sponsor-section-title {
			grid-area: title;
		}

		.sponsor-points {
			grid-area: points;
			margin-top: 0;
			align-self: center;
		}

		.sponsor-packages {
			width: min(1180px, calc(100dvw - 64px));
			margin: 0 auto;
			padding: 5rem 0 8rem;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.5rem;
			align-items: stretch;
		}

		.sponsor-packages__intro {
			grid-column: 1 / -1;
			min-height: auto;
			text-align: center;
			margin-bottom: 2rem;
		}

		.sponsor-package {
			position: relative;
			top: auto;
			min-height: auto;
			padding-block: 0;
			margin-bottom: 0;
		}

		.sponsor-package__inner {
			width: 100%;
			min-height: 100%;
			display: grid;
			grid-template-columns: 1fr;
			grid-template-areas:
				"label"
				"title"
				"lead"
				"points"
				"cta";
			column-gap: 0;
			row-gap: 1rem;
			align-items: start;
			padding: 2rem;
			border-radius: 32px;
			box-shadow:
				0 30px 72px rgba(0, 0, 0, 0.34),
				inset 0 1px 0 rgba(255, 255, 255, 0.12);
		}

		.sponsor-package:nth-of-type(even) .sponsor-package__inner {
			grid-template-columns: 1fr;
			grid-template-areas:
				"label"
				"title"
				"lead"
				"points"
				"cta";
		}

		.sponsor-package__label {
			grid-area: label;
			margin-bottom: 0;
		}

		.sponsor-package__title {
			grid-area: title;
			max-width: 10ch;
			font-size: clamp(2.4rem, 3.6vw, 3.5rem);
		}

		.sponsor-package__lead {
			grid-area: lead;
			margin-top: 0;
			max-width: 30rem;
			font-size: 1rem;
		}

		.sponsor-package__points {
			grid-area: points;
			margin-top: 0.3rem;
		}

		.sponsor-contact-panel {
			grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
			align-items: start;
			gap: clamp(2rem, 4vw, 4rem);
		}

		.sponsor-contact-copy .sponsor-section-title {
			text-align: left;
			margin-inline: 0;
			max-width: 10ch;
		}

		.sponsor-contact-copy .sponsor-eyebrow {
			margin-bottom: 0;
		}
	}

	@media (min-width: 1080px) {
		.sponsor-packages {
			width: min(1280px, calc(100dvw - 96px));
			padding-bottom: 10rem;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.sponsor-package__inner {
			width: 100%;
			padding: 2.4rem;
		}

		.sponsor-package__title {
			max-width: 9ch;
		}

		.sponsor-package__points {
			grid-template-columns: 1fr;
			gap: 0.85rem;
			margin-top: 0.75rem;
		}

		.sponsor-package__points li {
			padding-left: 1.6rem;
		}

		.sponsor-contact-section {
			padding-inline: 2rem;
		}
	}

	@media (max-width: 759px) {
		.sponsor-contact-panel {
			border-radius: 24px;
			padding: 1.2rem 1rem 1.3rem;
		}

		.sponsor-form-row {
			grid-template-columns: 1fr;
		}
	}

	/* ANIMATIONEN */

	@keyframes sponsorHintFloat {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.82;
		}

		50% {
			transform: translateY(8px);
			opacity: 1;
		}
	}

	@keyframes sponsorReveal {
		from {
			opacity: 0;
			transform: translateY(44px) scale(0.96);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* ACCESSIBILITY */

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			scroll-behavior: auto !important;
			animation-duration: 0.001ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.001ms !important;
		}

		.sponsor-package {
			position: relative;
			top: auto;
			min-height: auto;
		}

		.sponsor-package {
			padding-block: 1rem;
		}
	}
</style>
