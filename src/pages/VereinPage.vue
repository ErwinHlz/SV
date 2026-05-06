<template>
	<main class="verein-story-page">
		<PageHero
			class="verein-page-hero"
			:image="vereinHero"
			:title="hero.title"
			:lead="hero.lead"
		/>

		<section class="verein-welcome" aria-label="Willkommen beim Verein">
			<div class="welcome-card">
				<div class="welcome-copy">
					<p class="section-kicker">Unser Verein</p>
					<h2 class="section-title">{{ hero.title }}</h2>
					<p class="section-text">{{ hero.lead }}</p>
				</div>

				<div class="welcome-actions">
					<RouterLink class="action-btn primary" to="/contact">
						{{ cta.primaryLabel }}
					</RouterLink>
					<RouterLink class="action-btn secondary" to="/contact">
						{{ cta.secondaryLabel }}
					</RouterLink>
				</div>
			</div>
		</section>

		<section
			class="verein-section verein-section--intro"
			aria-label="Kurzvorstellung"
		>
			<div class="section-shell intro-shell">
				<div class="intro-panel">
					<p class="section-kicker">Ueber Uns</p>
					<h2 class="section-title">{{ intro.title }}</h2>
					<p class="section-text">{{ intro.text }}</p>
				</div>
			</div>
		</section>

		<section
			class="verein-section verein-section--values"
			aria-label="Was uns ausmacht"
		>
			<div class="section-shell">
				<header class="section-heading">
					<p class="section-kicker">Werte</p>
					<h2 class="section-title">{{ values.title }}</h2>
				</header>

				<div class="values-grid">
					<article
						v-for="item in values.items"
						:key="item.id"
						class="value-card"
					>
						<h3 class="card-title">{{ item.title }}</h3>
						<p class="card-text">{{ item.text }}</p>
					</article>
				</div>
			</div>
		</section>

		<section
			class="verein-section verein-section--light"
			aria-label="Unsere Aktivitaeten"
		>
			<div class="section-shell">
				<header class="section-heading">
					<p class="section-kicker">Vereinsleben</p>
					<h2 class="section-title">{{ activities.title }}</h2>
				</header>

				<div class="activities-grid">
					<article
						v-for="item in activities.items"
						:key="item.id"
						class="activity-card"
					>
						<h3 class="card-title">{{ item.title }}</h3>
						<p class="card-text">{{ item.text }}</p>
					</article>
				</div>
			</div>
		</section>

		<section
			class="verein-section verein-section--history"
			aria-label="Vereinsgeschichte"
		>
			<div class="section-shell history-shell">
				<div class="history-copy">
					<p class="section-kicker">Geschichte</p>
					<h2 class="section-title" style="font-size: 40px">
						{{ history.title }}
					</h2>
					<p class="section-text">{{ history.text }}</p>
				</div>
			</div>
		</section>

		<section
			class="verein-section verein-section--people"
			aria-label="Vorstand und Ansprechpartner"
		>
			<div class="section-shell">
				<header class="section-heading">
					<p class="section-kicker">Ansprechpartner</p>
					<h2 class="section-title" style="font-size: 40px">
						{{ people.title }}
					</h2>
					<p class="section-text section-text--narrow">{{ people.lead }}</p>
				</header>

				<div class="people-grid">
					<article
						v-for="person in personCards"
						:key="person.id"
						class="people-card"
					>
						<div class="people-photo">
							<img
								v-if="person.image"
								:src="person.image"
								:alt="person.imageAlt"
								loading="lazy"
							/>
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
			</div>
		</section>

		<section
			class="verein-section verein-section--cta"
			aria-label="Mitglied werden"
		>
			<div class="section-shell">
				<div class="cta-panel">
					<p class="section-kicker">Mitmachen</p>
					<h2 class="section-title">{{ cta.title }}</h2>
					<p class="section-text section-text--narrow">{{ cta.text }}</p>

					<div class="cta-actions">
						<RouterLink class="action-btn primary" to="/contact">
							{{ cta.primaryLabel }}
						</RouterLink>
						<RouterLink class="action-btn secondary" to="/contact">
							{{ cta.secondaryLabel }}
						</RouterLink>
					</div>
				</div>
			</div>
		</section>
	</main>
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

	type VereinValue = {
		id: string;
		title: string;
		text: string;
	};

	type VereinActivity = {
		id: string;
		title: string;
		text: string;
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
		values: {
			title: string;
			items: VereinValue[];
		};
		activities: {
			title: string;
			items: VereinActivity[];
		};
		history: {
			title: string;
			text: string;
		};
		people: {
			title: string;
			lead: string;
			items: VereinsPerson[];
		};
		cta: {
			title: string;
			text: string;
			primaryLabel: string;
			secondaryLabel: string;
		};
	};

	const vereinContent = rawVerein as VereinContent;
	const { hero, intro, values, activities, history, people, cta } =
		vereinContent;

	const imageMap: Record<string, string> = {
		vereinHero,
	};

	const personCards = people.items.map((person) => ({
		...person,
		image: person.image ? (imageMap[person.image] ?? person.image) : undefined,
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
	.verein-story-page {
		--sv-primary-color: #022b79;
		--sv-secondary-color: #f4d047;

		--primary: var(--sv-primary-color);
		--secondary: var(--sv-secondary-color);

		--primary-soft: #edf3fb;
		--primary-muted: #6f7f9d;

		--cream: #f7f6f2;
		--sand: #ece8dd;
		--white: #ffffff;

		--ink: #171a1f;
		--muted: rgba(23, 26, 31, 0.68);
		--line: rgba(23, 26, 31, 0.14);

		background: var(--cream);
		color: var(--ink);
		overflow-x: hidden;
	}

	/* Hero Desktop sichtbar, Mobile weg */
	.verein-page-hero {
		position: relative;
		z-index: 1;
	}

	@media (max-width: 760px) {
		.verein-page-hero {
			display: none;
		}
	}

	/* Mobile fühlt sich wie einzelne Screens an */
	@media (max-width: 760px) {
		:global(html) {
			scroll-snap-type: y proximity;
			scroll-behavior: smooth;
		}
	}

	/* Jede Section als eigene Bühne */
	.verein-welcome,
	.verein-section {
		position: relative;
		min-height: 100svh;
		padding: clamp(4rem, 7vw, 7rem) clamp(1.1rem, 5vw, 4rem);
		display: flex;
		align-items: center;
		overflow: hidden;
		scroll-snap-align: start;
	}

	/* Einheitliche, ruhige Hintergründe */
	.verein-welcome {
		background:
			linear-gradient(135deg, rgba(2, 43, 121, 0.08), transparent 45%),
			var(--cream);
	}

	.verein-section--intro {
		background: var(--primary-soft);
	}

	.verein-section--values {
		background: var(--white);
		color: var(--ink);
	}

	.verein-section--light {
		background: var(--cream);
	}

	.verein-section--history {
		background: var(--primary);
		color: #ffffff;
	}

	.verein-section--people {
		background: var(--primary-soft);
	}

	.verein-section--cta {
		background: var(--ink);
		color: #ffffff;
	}

	/* Dezente große Hintergrundformen statt bunter Orbs */
	.verein-section::before,
	.verein-welcome::before {
		content: "";
		position: absolute;
		z-index: 0;
		pointer-events: none;
		border-radius: 999px;
		border: 1px solid rgba(23, 26, 31, 0.08);
	}

	.verein-welcome::before {
		width: clamp(18rem, 42vw, 38rem);
		height: clamp(18rem, 42vw, 38rem);
		right: -12rem;
		top: 8vh;
		background: rgba(2, 43, 121, 0.05);
	}

	.verein-section::before {
		width: clamp(14rem, 34vw, 30rem);
		height: clamp(14rem, 34vw, 30rem);
		left: -10rem;
		bottom: 8vh;
		background: rgba(255, 255, 255, 0.18);
	}

	.verein-section--history::before,
	.verein-section--cta::before {
		border-color: rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
	}

	/* Inhalt über Hintergrund */
	.section-shell,
	.welcome-card {
		position: relative;
		z-index: 1;
		width: min(1120px, 100%);
		margin: 0 auto;
	}

	/* Kein klassischer Card-Look */
	.welcome-card,
	.intro-panel,
	.cta-panel,
	.value-card,
	.activity-card,
	.people-card {
		background: transparent;
		border: 0;
		box-shadow: none;
		padding: 0;
	}

	/* Typografie */
	.section-kicker {
		margin: 0 0 1rem;
		font-size: 0.82rem;
		font-weight: 850;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.verein-section--history .section-kicker,
	.verein-section--cta .section-kicker {
		color: rgba(255, 255, 255, 0.72);
	}

	.section-title {
		margin: 0;
		max-width: 920px;
		font-size: clamp(2.6rem, 8vw, 6.4rem);
		line-height: 0.92;
		font-weight: 900;
		letter-spacing: -0.065em;
		text-wrap: balance;
		color: currentColor;
	}

	.section-text {
		max-width: 680px;
		margin: 1.35rem 0 0;
		font-size: clamp(1.05rem, 2vw, 1.28rem);
		line-height: 1.65;
		color: var(--muted);
	}

	.verein-section--history .section-text,
	.verein-section--cta .section-text {
		color: rgba(255, 255, 255, 0.76);
	}

	.section-heading {
		max-width: 900px;
	}

	/* Welcome */
	.welcome-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 3rem;
		align-items: end;
	}

	.welcome-copy {
		max-width: 860px;
	}

	.welcome-actions,
	.cta-actions,
	.people-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2.2rem;
	}

	/* Buttons ruhig, aber modern */
	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 3.35rem;
		padding: 0.95rem 1.55rem;
		border-radius: 999px;
		font-weight: 850;
		text-decoration: none;
		transition:
			transform 0.22s ease,
			background-color 0.22s ease,
			color 0.22s ease,
			border-color 0.22s ease;
	}

	.action-btn:hover {
		transform: translateY(-3px);
	}

	.action-btn.primary {
		background: var(--primary);
		color: #ffffff;
	}

	.action-btn.primary:hover {
		background: #001f5a;
	}

	.action-btn.secondary {
		background: transparent;
		color: currentColor;
		border: 1.5px solid currentColor;
	}

	.action-btn.secondary:hover {
		background: var(--secondary);
		color: var(--ink);
		border-color: var(--secondary);
	}

	.verein-section--cta .action-btn.primary {
		background: var(--secondary);
		color: var(--ink);
	}

	.verein-section--cta .action-btn.primary:hover {
		background: #ffffff;
		color: var(--ink);
	}

	.verein-section--cta .action-btn.secondary {
		color: #ffffff;
	}

	.verein-section--cta .action-btn.secondary:hover {
		background: #ffffff;
		color: var(--ink);
		border-color: #ffffff;
	}

	/* Intro: redaktioneller Look */
	.intro-shell {
		display: grid;
		grid-template-columns: 0.7fr 1.3fr;
		gap: clamp(2rem, 6vw, 6rem);
		align-items: center;
	}

	.intro-shell::before {
		content: "⚽️";
		font-size: clamp(8rem, 22vw, 18rem);
		line-height: 0.78;
		font-weight: 900;
		letter-spacing: -0.12em;
		color: rgba(2, 44, 121, 0.053);
		transform: translate(30px, 30px);
	}

	.cta-panel::before {
		content: "⚽️";
		position: absolute;
		top: 0;
		left: 80dvw;
		font-size: clamp(8rem, 22vw, 18rem);
		line-height: 0.78;
		font-weight: 900;
		letter-spacing: -0.12em;
		color: rgba(2, 44, 121, 0.053);
	}

	/* Werte: Statements statt Cards */
	.values-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: clamp(1.2rem, 2vw, 2.4rem);
		margin-top: clamp(2.5rem, 5vw, 4rem);
	}

	.value-card {
		min-height: 15rem;
		padding-top: 1rem;
		border-top: 2px solid var(--line);
	}

	.value-card:nth-child(even) {
		margin-top: 4rem;
	}

	.card-title {
		margin: 0;
		font-size: clamp(1.55rem, 3vw, 2.35rem);
		line-height: 1;
		font-weight: 900;
		letter-spacing: -0.045em;
		color: var(--primary);
	}

	.card-text {
		margin: 1rem 0 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--muted);
	}

	/* Aktivitäten als ruhige Timeline */
	.activities-grid {
		position: relative;
		display: grid;
		gap: 0;
		margin-top: 3rem;
	}

	.activities-grid::before {
		content: "";
		position: absolute;
		left: 50%;
		top: 0.3rem;
		bottom: 1rem;
		width: 1px;
		transform: translateX(-50%);
		background: var(--line);
	}

	.activity-card {
		position: relative;
		width: calc(50% - 2.2rem);
		padding-bottom: 3rem;
	}

	.activity-card:nth-child(odd) {
		justify-self: start;
		text-align: right;
	}

	.activity-card:nth-child(even) {
		justify-self: end;
	}

	.activity-card::before {
		content: "";
		position: absolute;
		top: 0.45rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
		background: var(--secondary);
		border: 3px solid var(--cream);
		box-shadow: 0 0 0 2px var(--primary);
	}

	.activity-card:nth-child(odd)::before {
		right: -2.6rem;
	}

	.activity-card:nth-child(even)::before {
		left: -2.6rem;
	}

	/* Geschichte */
	.history-shell {
		display: grid;
		grid-template-columns: 1fr 0.7fr;
		gap: 4rem;
		align-items: center;
	}

	.history-copy {
		min-width: 0;
		max-width: 42rem;
	}

	.history-shell::after {
		content: "seit\A damals";
		white-space: pre-line;
		justify-self: end;
		font-size: clamp(4rem, 11vw, 9rem);
		line-height: 0.82;
		font-weight: 900;
		letter-spacing: -0.08em;
		color: rgba(255, 255, 255, 0.11);
	}

	/* Ansprechpartner als Polaroid-Board */
	.people-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
		margin-top: 3rem;
		padding: 0.2rem 0 0;
		align-items: start;
	}

	.people-card {
		padding: 0.75rem 0.75rem 1rem;
		background: #fffdf7;
		border: 1px solid rgba(17, 17, 17, 0.08);
		box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.18);
		transform: rotate(-1.6deg);
	}

	.people-card:nth-child(even) {
		transform: rotate(1.4deg);
	}

	.people-card:nth-child(3n) {
		transform: rotate(-0.55deg);
	}

	.people-photo {
		aspect-ratio: 4 / 4.7;
		border-radius: 0;
		overflow: hidden;
		background: #e9e5da;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.people-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.people-photo-fallback {
		width: 100%;
		height: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f1ede4;
		color: var(--green);
		font-size: 2.3rem;
		font-weight: 900;
	}

	.people-caption {
		padding-top: 0.8rem;
		text-align: center;
	}

	.people-name {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 900;
		letter-spacing: -0.04em;
		color: var(--ink);
	}

	.people-role {
		margin: 0.3rem 0 0;
		color: var(--muted);
	}

	/* CTA */
	.cta-panel {
		max-width: 900px;
		text-align: center;
		margin-inline: auto;
		position: relative;
	}

	.cta-panel .section-title,
	.cta-panel .section-text {
		margin-left: auto;
		margin-right: auto;
	}

	.cta-actions {
		justify-content: center;
	}

	/* Sanfte Scroll-Reveals, nicht verspielt-bunt */
	@supports (animation-timeline: view()) {
		.section-kicker,
		.section-title,
		.section-text,
		.value-card,
		.activity-card,
		.people-card {
			animation: reveal-soft both;
			animation-timeline: view();
			animation-range: entry 10% cover 32%;
		}

		@keyframes reveal-soft {
			from {
				opacity: 0;
				transform: translateY(2.4rem);
			}

			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}

	/* Tablet */
	@media (max-width: 1024px) {
		.welcome-card,
		.intro-shell,
		.history-shell {
			grid-template-columns: 1fr;
		}

		.values-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.value-card:nth-child(even) {
			margin-top: 0;
		}

		.history-shell::after {
			justify-self: start;
		}
	}

	/* Mobile */
	@media (max-width: 760px) {
		.verein-welcome,
		.verein-section {
			min-height: 100svh;
			padding: 4.25rem 1.15rem;
			align-items: center;
		}

		.verein-welcome {
			padding-top: 3rem;
		}

		.section-title {
			font-size: clamp(2rem, 10vw, 3.35rem);
			line-height: 0.94;
			letter-spacing: -0.05em;
		}

		.section-text {
			font-size: 1.06rem;
			line-height: 1.62;
		}

		.welcome-card {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 2rem;
		}

		.welcome-actions,
		.cta-actions,
		.people-actions {
			width: 100%;
			flex-direction: column;
		}

		.action-btn {
			width: 100%;
			min-height: 3.55rem;
		}

		.intro-shell {
			gap: 1.25rem;
		}

		.intro-shell::before {
			font-size: 7.5rem;
			line-height: 0.72;
		}

		.values-grid {
			grid-template-columns: 1fr;
			gap: 1.75rem;
			margin-top: 2.4rem;
		}

		.value-card {
			min-height: auto;
			padding: 0 0 1.35rem;
			border-top: 0;
			border-bottom: 1px solid var(--line);
		}

		.value-card::before {
			content: "";
			display: block;
			width: 2.5rem;
			height: 2px;
			margin-bottom: 0.9rem;
			background: var(--secondary);
		}

		.card-title {
			font-size: clamp(2rem, 10vw, 3.2rem);
		}

		.activities-grid {
			margin-top: 2.4rem;
			padding-left: 1.45rem;
		}

		.activities-grid::before {
			left: 0.25rem;
			transform: none;
		}

		.activity-card,
		.activity-card:nth-child(odd),
		.activity-card:nth-child(even) {
			width: 100%;
			justify-self: stretch;
			text-align: left;
			padding-bottom: 2.15rem;
		}

		.activity-card::before,
		.activity-card:nth-child(odd)::before,
		.activity-card:nth-child(even)::before {
			left: -1.55rem;
			right: auto;
		}

		.history-shell {
			gap: 2rem;
			position: relative;
		}

		.history-shell::after {
			content: "";
			justify-self: start;
			font-size: clamp(3.4rem, 16vw, 5.6rem);
			line-height: 0.84;
			letter-spacing: -0.06em;
			color: rgba(255, 255, 255, 0.08);
		}

		.people-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.7rem;
			width: 100%;
		}

		.people-photo {
			aspect-ratio: 3 / 3.7;
		}

		.people-card {
			padding: 0.35rem 0.35rem 0.65rem;
			box-shadow: 0 0.7rem 1.4rem rgba(0, 0, 0, 0.2);
		}

		.people-name {
			font-size: 0.84rem;
			line-height: 1.15;
		}

		.people-role {
			font-size: 0.68rem;
			line-height: 1.2;
		}

		.verein-section--cta,
		.cta-panel {
			text-align: left;
		}

		.cta-actions {
			justify-content: flex-start;
		}
	}

	/* Sehr kleine Geräte */
	@media (max-width: 390px) {
		.verein-welcome,
		.verein-section {
			padding-left: 0.95rem;
			padding-right: 0.95rem;
		}

		.section-title {
			font-size: clamp(2.55rem, 14vw, 4.1rem);
		}

		.people-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Barrierearm */
	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
			scroll-snap-type: none;
		}

		*,
		*::before,
		*::after {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
