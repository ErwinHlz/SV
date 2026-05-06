<template>
	<div class="sponsor-become-page">
		<PageHero
			class="sponsor-become-hero"
			:image="sponsorHero"
			title="Sponsor werden"
			lead="Gemeinsam staerken wir den Verein und den Fussball vor Ort."
		>
			<p class="sponsor-mobile-scroll-hint">Nach unten scrollen</p>
		</PageHero>

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
					<RouterLink to="/contact" class="sponsor-contact">
						Interesse melden
					</RouterLink>
				</div>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	import PageHero from "@/components/PageHero.vue";
	import sponsorHero from "@/assets/header/background.png";

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
	}

	.sponsor-become-hero :deep(.page-hero-content) {
		position: relative;
		z-index: 3;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.9rem;
		padding: calc(var(--sv-header-height) + 2.5rem) clamp(1rem, 4vw, 2rem)
			clamp(7rem, 14vw, 9rem);
		box-sizing: border-box;
	}

	.sponsor-become-hero :deep(.page-hero-title) {
		max-width: 9ch;
		width: 100%;
		margin-inline: auto;
		text-align: center;
	}

	.sponsor-become-hero :deep(.page-hero-lead) {
		max-width: 28ch;
		width: 100%;
		margin-inline: auto;
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
		position: absolute;
		left: 50%;
		bottom: clamp(3rem, 9vw, 4.75rem);
		z-index: 5;
		translate: -50% 0;
		margin: 0;
		padding: 0.7rem 1rem;
		border: 1px solid var(--sponsor-border);
		border-radius: 999px;
		color: var(--sponsor-text);
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: rgba(6, 17, 35, 0.62);
		backdrop-filter: blur(14px);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
		animation: sponsorHintFloat 1.7s ease-in-out infinite;
	}

	.sponsor-mobile-scroll-hint::after {
		content: "";
		display: inline-block;
		width: 0.45rem;
		height: 0.45rem;
		margin-left: 0.55rem;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		rotate: 45deg;
		translate: 0 -0.15rem;
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
		border: 1px solid var(--sponsor-border);
		border-radius: 32px;
		opacity: 1;
		background:
			radial-gradient(
				circle at 90% 0%,
				rgba(244, 208, 71, 0.26),
				transparent 13rem
			),
			radial-gradient(
				circle at 0% 100%,
				rgba(2, 43, 121, 0.42),
				transparent 15rem
			),
			linear-gradient(
				145deg,
				rgba(255, 255, 255, 0.16),
				rgba(255, 255, 255, 0.055)
			),
			#07142b;
		box-shadow:
			0 36px 100px rgba(0, 0, 0, 0.48),
			inset 0 1px 0 rgba(255, 255, 255, 0.16);
		backdrop-filter: blur(18px);
		transform-origin: center bottom;
	}

	.sponsor-package:nth-of-type(even) .sponsor-package__inner {
		background:
			radial-gradient(
				circle at 0% 0%,
				rgba(244, 208, 71, 0.28),
				transparent 13rem
			),
			radial-gradient(
				circle at 100% 100%,
				rgba(2, 43, 121, 0.52),
				transparent 16rem
			),
			linear-gradient(
				145deg,
				rgba(255, 255, 255, 0.15),
				rgba(255, 255, 255, 0.05)
			),
			#081831;
	}

	.sponsor-package__inner::before {
		content: "";
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			120deg,
			transparent 0 35%,
			rgba(255, 255, 255, 0.13) 50%,
			transparent 65% 100%
		);
		translate: -120% 0;
		animation: sponsorCardShine 7s ease-in-out infinite;
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
		border: 1px solid var(--sponsor-border);
		border-radius: 999px;
		color: var(--sponsor-secondary);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		background: rgba(0, 0, 0, 0.22);
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

	.sponsor-contact {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		width: 100%;
		min-height: 3.35rem;
		margin-top: 1.8rem;
		padding: 0.95rem 1.1rem;
		border-radius: 999px;
		color: var(--sv-primary-color);
		font-weight: 900;
		text-decoration: none;
		background: var(--sponsor-secondary);
		box-shadow: 0 18px 44px rgba(244, 208, 71, 0.26);
		transition:
			transform 180ms ease,
			box-shadow 180ms ease,
			filter 180ms ease;
	}

	.sponsor-contact::after {
		content: "→";
		font-size: 1.15rem;
		transition: transform 180ms ease;
	}

	.sponsor-contact:hover {
		transform: translateY(-2px);
		filter: saturate(1.08);
		box-shadow: 0 24px 58px rgba(244, 208, 71, 0.34);
	}

	.sponsor-contact:hover::after {
		transform: translateX(4px);
	}

	/* MODERNE SCROLL-ANIMATION */

	@supports (animation-timeline: view()) {
		.sponsor-intro__inner {
			animation: sponsorReveal both ease-out;
			animation-timeline: view();
			animation-range: entry 10% cover 42%;
		}

		.sponsor-package__inner {
			animation: sponsorCardRise both linear;
			animation-timeline: view();
			animation-range: entry 0% cover 38%;
		}
	}

	/* TABLET / DESKTOP */

	@media (min-width: 760px) {
		.sponsor-mobile-scroll-hint {
			display: none;
		}

		.sponsor-become-hero :deep(.page-hero-content) {
			padding-top: calc(var(--sv-header-height) + 2.5rem);
			padding-bottom: 6rem;
		}

		.sponsor-intro {
			min-height: 76vh;
			padding-inline: 2rem;
		}

		.sponsor-intro__inner {
			display: grid;
			grid-template-columns: 1.05fr 0.95fr;
			gap: clamp(2rem, 5vw, 5rem);
			align-items: end;
		}

		.sponsor-points {
			margin-top: 0;
		}

		.sponsor-packages {
			padding-inline: 2rem;
		}

		.sponsor-packages__intro {
			min-height: 56vh;
		}

		.sponsor-package {
			min-height: 88vh;
			top: 6vh;
		}

		.sponsor-package__inner {
			min-height: 520px;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}

		.sponsor-contact {
			width: fit-content;
			min-width: 13rem;
		}
	}

	@media (min-width: 1080px) {
		.sponsor-packages {
			padding-bottom: 10rem;
		}

		.sponsor-package {
			min-height: 86vh;
			top: 7vh;
		}

		.sponsor-package__inner {
			width: min(100%, 980px);
			padding: 3.2rem;
		}

		.sponsor-package__title {
			max-width: 12ch;
		}

		.sponsor-package__points {
			grid-template-columns: repeat(3, 1fr);
			gap: 1rem;
			margin-top: 2rem;
		}

		.sponsor-package__points li {
			padding: 1rem;
			border: 1px solid var(--sponsor-border);
			border-radius: 18px;
			background: rgba(0, 0, 0, 0.18);
		}

		.sponsor-package__points li::before {
			position: static;
			display: block;
			margin-bottom: 0.8rem;
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

	@keyframes sponsorCardRise {
		from {
			transform: translateY(34px) scale(0.985);
		}

		to {
			transform: translateY(0) scale(1);
		}
	}

	@keyframes sponsorCardShine {
		0%,
		72% {
			translate: -120% 0;
		}

		100% {
			translate: 120% 0;
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
