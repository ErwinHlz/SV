<template>
	<div class="youth-page-flow">
		<PageHero
			class="youth-page-hero"
			:image="youthHero"
			:title="hero.title"
			:lead="hero.lead"
		/>

		<main class="youth-content">
			<section
				ref="introPanel"
				class="youth-intro-panel"
				aria-label="Jugendintro"
			>
				<div class="intro-inner">
					<div class="intro-copy">
						<p class="section-kicker">Jugendfußball</p>
						<h1 class="intro-title">{{ intro.title }}</h1>
						<p class="intro-text">{{ intro.text }}</p>

						<p class="intro-added-text">
							Ob Anfänger, Wiedereinsteiger oder ambitionierter Spieler: Bei uns
							stehen Teamgeist, Bewegung und Spaß am Fußball im Mittelpunkt.
						</p>
					</div>
				</div>
			</section>

			<section
				class="youth-intro-panel youth-intro-panel--cards"
				aria-hidden="true"
			>
				<div
					class="intro-info-grid"
					:class="{ 'is-unlocked': introInfoVisible }"
				>
					<article
						v-for="(item, index) in introInfoItems"
						:key="item.label"
						class="intro-info-card"
						:class="{ 'is-visible': index < revealedIntroCardCount }"
					>
						<span class="intro-info-label">{{ item.label }}</span>
						<span class="intro-info-empty" aria-hidden="true"></span>
						<strong class="intro-info-value">{{ item.value }}</strong>
						<p class="intro-info-note">{{ item.note }}</p>
					</article>
				</div>
			</section>

			<section
				id="jugendteams"
				class="teams-section"
				aria-label="Jugendmannschaften"
			>
				<div class="section-inner">
					<div class="teams-grid">
						<article v-for="team in teamCards" :key="team.id" class="team-card">
							<div class="team-cover">
								<img :src="team.image" :alt="team.imageAlt" loading="lazy" />
								<div class="team-cover-overlay">
									<p class="team-age">{{ team.ageGroup }}</p>
									<h3 class="team-name">{{ team.name }}</h3>
								</div>
							</div>

							<div class="team-content">
								<div class="team-meta-row">
									<span>Liga</span>
									<strong>{{ team.league }}</strong>
								</div>
								<div class="team-table-block">
									<p class="table-title">Trainingszeiten</p>

									<table v-if="team.training?.length" class="training-table">
										<thead>
											<tr>
												<th>Tag</th>
												<th>Uhrzeit</th>
												<th>Ort</th>
											</tr>
										</thead>

										<tbody>
											<tr
												v-for="slot in team.training"
												:key="`${team.id}-${slot.day}-${slot.time}-${slot.location}`"
											>
												<td>{{ slot.day }}</td>
												<td>{{ slot.time }}</td>
												<td>
													<a
														v-if="mapsHref"
														:href="mapsHref"
														target="_blank"
														rel="noopener noreferrer"
													>
														{{ slot.location }}
													</a>
													<span v-else>{{ slot.location }}</span>
												</td>
											</tr>
										</tbody>
									</table>

									<p v-else class="empty-training">
										Trainingszeiten folgen in Kürze.
									</p>
								</div>

								<div class="team-links">
									<a
										v-if="mapsHref"
										class="team-action secondary"
										:href="mapsHref"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>Spielstätte</span>
										<strong>{{ getTeamVenue(team) }}</strong>
									</a>

									<a
										class="team-action primary"
										:href="team.tableUrl"
										target="_blank"
										rel="noopener noreferrer"
									>
										<span>fussball.de</span>
										<strong>Aktuelle Tabelle</strong>
									</a>
								</div>
							</div>
						</article>
					</div>
				</div>
			</section>

			<section
				id="jugendtrainer"
				class="coach-section"
				aria-label="Trainerteam"
			>
				<div class="section-inner">
					<header class="section-header centered">
						<p class="section-kicker">Trainerteam</p>
						<h2 class="section-title">{{ coachSection.title }}</h2>
						<p class="section-lead">{{ coachSection.lead }}</p>
					</header>

					<div class="coach-grid">
						<article
							v-for="member in coachCards"
							:key="member.id"
							class="coach-card"
						>
							<div class="coach-photo">
								<img
									v-if="member.image"
									:src="member.image"
									:alt="member.imageAlt"
									loading="lazy"
								/>

								<span v-else class="coach-photo-fallback">
									{{ getInitials(member.name) }}
								</span>
							</div>

							<div class="coach-caption">
								<p class="coach-name">{{ member.name }}</p>
								<p class="coach-role">{{ member.role }}</p>
							</div>
						</article>
					</div>
				</div>
			</section>

			<section class="contact-section" aria-label="Kontakt Jugend">
				<div class="section-inner contact-layout">
					<div class="contact-copy">
						<p class="section-kicker">Kontakt</p>
						<h2 class="section-title">{{ contact.title }}</h2>
						<p class="section-lead">{{ contact.lead }}</p>

						<div class="contact-person">
							<p>
								<span>{{ contact.labels.name }}</span>
								<strong>{{ contact.name }}</strong>
							</p>
							<p>
								<span>{{ contact.labels.role }}</span>
								<strong>{{ contact.role }}</strong>
							</p>
							<p>
								<span>{{ contact.labels.phone }}</span>
								<strong>
									<a v-if="phoneHref" :href="phoneHref">{{ contact.phone }}</a>
									<span v-else>{{ contact.phone }}</span>
								</strong>
							</p>
							<p>
								<span>{{ contact.labels.email }}</span>
								<strong>
									<a v-if="emailHref" :href="emailHref">{{ contact.email }}</a>
									<span v-else>{{ contact.email }}</span>
								</strong>
							</p>
						</div>
					</div>

					<form class="contact-form" @submit.prevent="handleContactSubmit">
						<div class="form-row">
							<label>
								Name
								<input
									v-model="contactForm.name"
									type="text"
									name="name"
									autocomplete="name"
									required
								/>
							</label>

							<label>
								E-Mail
								<input
									v-model="contactForm.email"
									type="email"
									name="email"
									autocomplete="email"
									required
								/>
							</label>
						</div>

						<div class="form-row">
							<label>
								Telefon
								<input
									v-model="contactForm.phone"
									type="tel"
									name="phone"
									autocomplete="tel"
								/>
							</label>

							<label>
								Mannschaft / Alter
								<input
									v-model="contactForm.team"
									type="text"
									name="team"
									placeholder="z. B. D-Jugend, 11 Jahre"
								/>
							</label>
						</div>

						<label>
							Nachricht
							<textarea
								v-model="contactForm.message"
								name="message"
								rows="6"
								required
								placeholder="Hallo, ich interessiere mich für ein Probetraining ..."
							/>
						</label>

						<button type="submit">Anfrage senden</button>

						<p class="form-note">
							{{ contact.note }}
						</p>
					</form>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref } from "vue";
	import PageHero from "@/components/PageHero.vue";
	import youthHero from "@/assets/header/background.png";
	import rawYouthContent from "@/content/jugend.json";

	type YouthTeamWidget = {
		id?: string;
		type?: string;
		title?: string;
	};

	type YouthTraining = {
		day: string;
		time: string;
		location: string;
	};

	type TrainingLocation = {
		name: string;
		address: string;
		mapsUrl: string;
	};

	type YouthTeam = {
		id: string;
		name: string;
		ageGroup: string;
		league: string;
		description: string;
		image: string;
		imageAlt: string;
		widget?: YouthTeamWidget;
		tableUrl?: string;
		training?: YouthTraining[];
	};

	type CoachMember = {
		id: string;
		name: string;
		role: string;
		image?: string;
		imageAlt?: string;
	};

	type YouthContent = {
		hero: {
			title: string;
			lead: string;
		};
		intro: {
			title: string;
			text: string;
		};
		teamsSection: {
			title: string;
			lead: string;
		};
		trainingLocation?: TrainingLocation;
		teams: YouthTeam[];
		coachSection: {
			title: string;
			lead: string;
			members: CoachMember[];
		};
		contact: {
			title: string;
			lead: string;
			name: string;
			role: string;
			phone: string;
			email: string;
			note: string;
			labels: {
				name: string;
				role: string;
				phone: string;
				email: string;
			};
		};
	};

	const youthContent = rawYouthContent as YouthContent;
	const { hero, intro, coachSection, contact } = youthContent;

	const teamImageMap: Record<string, string> = {
		youthHero,
	};

	const coachImageMap: Record<string, string> = {
		youthHero,
	};

	type YouthTeamCard = YouthTeam & {
		tableUrl: string;
	};

	const teamCards: YouthTeamCard[] = youthContent.teams.map((team) => ({
		...team,
		image: teamImageMap[team.image] ?? team.image,
		tableUrl: team.tableUrl?.trim() || "https://next.fussball.de/",
	}));

	type CoachCard = CoachMember & {
		image?: string;
		imageAlt: string;
	};

	const coachCards: CoachCard[] = coachSection.members.map((member) => ({
		...member,
		image: member.image
			? (coachImageMap[member.image] ?? member.image)
			: undefined,
		imageAlt: member.imageAlt ?? member.name,
	}));

	const trainingLocation = youthContent.trainingLocation;

	const mapsHref =
		trainingLocation?.mapsUrl ??
		(trainingLocation?.address
			? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
					trainingLocation.address,
				)}`
			: "");

	const phoneHref = contact.phone
		? `tel:${contact.phone.replace(/\s+/g, "")}`
		: "";

	const emailHref = contact.email ? `mailto:${contact.email}` : "";

	const introInfoItems = computed(() => [
		{
			label: "Philosophie",
			value: "Technik, Spielfreude und Teamgeist",
			note: "Altersgerechtes Training mit klaren Werten.",
		},
		{
			label: "Teams",
			value: `${teamCards.length} `,
			note: "Von den jüngeren Jahrgängen bis zur älteren Jugend.",
		},
		{
			label: "Trainingsort",
			value: trainingLocation?.name ?? "Sportplatz Ottweiler",
			note: "Zentraler Treffpunkt für Training und Spielbetrieb.",
		},
		{
			label: "Probetraining",
			value: "Jederzeit möglich",
			note: contact.note,
		},
	]);

	const introInfoVisible = true;
	const revealedIntroCardCount = computed(() => introInfoItems.value.length);

	const contactForm = ref({
		name: "",
		email: "",
		phone: "",
		team: "",
		message: "",
	});

	const getTeamVenue = (team: YouthTeamCard) =>
		team.training?.[0]?.location ??
		trainingLocation?.name ??
		"Sportplatz Ottweiler";

	const getInitials = (value?: string) =>
		(value ?? "")
			.split(" ")
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part.charAt(0).toUpperCase())
			.join("");

	const handleContactSubmit = () => {
		if (!contact.email) return;

		const subject = `Jugend-Anfrage${contactForm.value.team ? ` - ${contactForm.value.team}` : ""}`;

		const body = [
			`Name: ${contactForm.value.name}`,
			`E-Mail: ${contactForm.value.email}`,
			`Telefon: ${contactForm.value.phone || "-"}`,
			`Mannschaft / Alter: ${contactForm.value.team || "-"}`,
			"",
			"Nachricht:",
			contactForm.value.message,
		].join("\n");

		window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
			subject,
		)}&body=${encodeURIComponent(body)}`;
	};
</script>

<style scoped>
	.youth-page-flow {
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
		background: #f7f5ef;
		color: #111;
	}

	.youth-page-hero {
		width: 100%;
	}

	.youth-content {
		width: 100%;
	}

	.section-inner,
	.intro-inner {
		width: min(1180px, calc(100% - 2rem));
		margin-inline: auto;
	}

	.youth-intro-panel,
	.coach-section,
	.contact-section {
		width: 100%;
		min-height: 100svh;
		padding: clamp(4rem, 7vw, 7rem) 0;
	}

	.youth-intro-panel {
		display: flex;
		align-items: center;
		background:
			radial-gradient(
				circle at 85% 10%,
				rgba(71, 151, 83, 0.26),
				transparent 28rem
			),
			linear-gradient(135deg, #07130b, #102716);
		color: #fff;
	}

	.youth-intro-panel--cards {
		background:
			radial-gradient(
				circle at 15% 18%,
				rgba(120, 217, 130, 0.18),
				transparent 24rem
			),
			linear-gradient(135deg, #0e2314, #122b19);
	}

	.intro-inner {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(320px, 1.05fr);
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
	}

	.section-kicker {
		margin: 0 0 0.85rem;
		color: #2f7d46;
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.youth-intro-panel .section-kicker,
	.coach-section .section-kicker {
		color: #78d982;
	}

	.intro-title,
	.section-title {
		margin: 0;
		font-size: clamp(2.6rem, 6vw, 5.6rem);
		line-height: 0.92;
		letter-spacing: -0.07em;
		text-wrap: balance;
	}

	.intro-text,
	.section-lead,
	.intro-added-text {
		max-width: 700px;
		margin: 1.3rem 0 0;
		font-size: clamp(1.05rem, 1.55vw, 1.25rem);
		line-height: 1.7;
		opacity: 0.78;
	}

	.intro-added-text {
		padding-left: 1.25rem;
		border-left: 0.35rem solid #78d982;
	}

	.intro-info-grid {
		width: min(100%, 46rem);
		margin-left: auto;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));

		gap: 1.1rem;
		align-items: center;
	}

	.intro-info-card {
		position: relative;
		min-height: 13rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.35rem;
		border-radius: 1.8rem;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.09);
		border: 1px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 1.4rem 4rem rgba(0, 0, 0, 0.22);
		backdrop-filter: blur(18px);
	}

	.intro-info-card:nth-child(1),
	.intro-info-card:nth-child(4) {
		grid-column: span 4;
	}

	.intro-info-card:nth-child(2),
	.intro-info-card:nth-child(3) {
		grid-column: span 2;
	}

	.intro-info-label {
		position: absolute;
		top: 1.2rem;
		left: 1.35rem;
		color: #78d982;
		font-size: 0.74rem;
		font-weight: 900;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.intro-info-empty {
		position: absolute;
		left: 1.35rem;
		right: 1.35rem;
		bottom: 4.8rem;
		height: 1.2rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		transition:
			opacity 400ms ease,
			transform 400ms ease;
	}

	.intro-info-value,
	.intro-info-note {
		opacity: 1;
		transform: none;
		display: block;
	}

	.intro-info-card.is-visible .intro-info-value,
	.intro-info-card.is-visible .intro-info-note {
		opacity: 1;
		transform: translateY(0);
	}

	.intro-info-card.is-visible .intro-info-empty {
		opacity: 0;
		transform: scaleX(0.6);
	}

	.intro-info-value {
		font-size: clamp(1.35rem, 2.4vw, 2.2rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.intro-info-note {
		margin: 0.8rem 0 0;
		color: rgba(255, 255, 255, 0.72);
		line-height: 1.55;
	}

	.section-header {
		max-width: 760px;
		margin-bottom: clamp(2rem, 4vw, 3.5rem);
	}

	.section-header.centered {
		margin-inline: auto;
		text-align: center;
	}

	.section-header.centered .section-lead {
		margin-inline: auto;
	}

	.teams-scroll-hint {
		display: none;
	}

	.teams-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(1.2rem, 2vw, 1.8rem);
	}

	.team-card {
		overflow: hidden;
		border-radius: 2rem;
		background: #fff;
		box-shadow: 0 1.2rem 3.5rem rgba(7, 19, 11, 0.12);
		border: 1px solid rgba(17, 17, 17, 0.08);
	}

	.team-cover {
		position: relative;
		height: 18rem;
		background: #102716;
	}

	.team-cover img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.team-cover::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent 65%);
	}

	.team-cover-overlay {
		position: absolute;
		z-index: 1;
		left: 1.25rem;
		right: 1.25rem;
		bottom: 1.25rem;
		color: #fff;
	}

	.team-age {
		margin: 0 0 0.35rem;
		color: #78d982;
		font-size: 0.75rem;
		font-weight: 900;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.team-name {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
	}

	.team-content {
		padding: clamp(1.15rem, 2vw, 1.6rem);
	}

	.team-meta-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(17, 17, 17, 0.1);
	}

	.team-meta-row span,
	.table-title,
	.team-action span {
		color: rgba(17, 17, 17, 0.55);
		font-size: 0.74rem;
		font-weight: 900;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.team-meta-row strong {
		text-align: right;
		color: #2f7d46;
	}

	.team-description {
		margin: 1rem 0 1.3rem;
		color: rgba(17, 17, 17, 0.72);
		line-height: 1.65;
	}

	.table-title {
		margin: 0 0 0.75rem;
	}

	.training-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	.training-table th,
	.training-table td {
		padding: 0.75rem 0.6rem;
		border-bottom: 1px solid rgba(17, 17, 17, 0.09);
		text-align: left;
		vertical-align: top;
	}

	.training-table th {
		color: rgba(17, 17, 17, 0.55);
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.training-table a {
		color: #2f7d46;
		font-weight: 800;
		text-decoration: none;
	}

	.training-table a:hover {
		text-decoration: underline;
	}

	.empty-training {
		margin: 0;
		color: rgba(17, 17, 17, 0.6);
	}

	.team-links {
		display: grid;
		gap: 0.75rem;
		margin-top: 1.3rem;
	}

	.team-action {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
	}

	.team-action.secondary {
		background: #edf4ea;
		color: #102716;
	}

	.team-action.primary {
		background: #102716;
		color: #fff;
	}

	.team-action.primary span {
		color: rgba(255, 255, 255, 0.62);
	}

	.coach-section {
		background:
			radial-gradient(
				circle at 15% 15%,
				rgba(120, 217, 130, 0.16),
				transparent 25rem
			),
			linear-gradient(135deg, #102716, #07130b);
		color: #fff;
	}

	.coach-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: clamp(1rem, 2vw, 1.5rem);
	}

	.coach-card {
		padding: 0.8rem 0.8rem 1.2rem;
		background: #fffdf7;
		color: #111;
		box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.22);
		transform: rotate(-1deg);
	}

	.coach-card:nth-child(even) {
		transform: rotate(1.2deg);
	}

	.coach-card:nth-child(3n) {
		transform: rotate(-0.4deg);
	}

	.coach-photo {
		aspect-ratio: 4 / 5;
		overflow: hidden;
		background: #e9e5da;
	}

	.coach-photo img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.coach-photo-fallback {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		color: #2f7d46;
		font-size: 3rem;
		font-weight: 900;
	}

	.coach-caption {
		padding-top: 0.9rem;
		text-align: center;
	}

	.coach-name {
		margin: 0;
		font-weight: 900;
	}

	.coach-role {
		margin: 0.25rem 0 0;
		color: rgba(17, 17, 17, 0.6);
		font-size: 0.92rem;
	}

	.contact-section {
		background: #f7f5ef;
		color: #111;
	}

	.contact-layout {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(320px, 1.15fr);
		gap: clamp(2rem, 5vw, 4rem);
		align-items: start;
	}

	.contact-person {
		margin-top: 2rem;
		display: grid;
		gap: 0.75rem;
	}

	.contact-person p {
		display: grid;
		gap: 0.2rem;
		margin: 0;
	}

	.contact-person span {
		color: rgba(17, 17, 17, 0.55);
		font-size: 0.75rem;
		font-weight: 900;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.contact-person a {
		color: #2f7d46;
		text-decoration: none;
	}

	.contact-form {
		display: grid;
		gap: 1rem;
		padding: clamp(1.2rem, 3vw, 2rem);
		border-radius: 1.4rem;
		background: #fff;
		border: 1px solid rgba(17, 17, 17, 0.08);
		box-shadow: 0 1.2rem 3rem rgba(7, 19, 11, 0.1);
	}

	.form-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.contact-form label {
		display: grid;
		gap: 0.45rem;
		color: rgba(17, 17, 17, 0.68);
		font-size: 0.86rem;
		font-weight: 800;
	}

	.contact-form input,
	.contact-form textarea {
		width: 100%;
		border: 1px solid rgba(17, 17, 17, 0.16);
		border-radius: 0.85rem;
		padding: 0.9rem 1rem;
		background: #fbfaf6;
		color: #111;
		font: inherit;
	}

	.contact-form input:focus,
	.contact-form textarea:focus {
		outline: 3px solid rgba(47, 125, 70, 0.2);
		border-color: #2f7d46;
	}

	.contact-form button {
		border: 0;
		border-radius: 999px;
		padding: 1rem 1.4rem;
		background: #102716;
		color: #fff;
		font: inherit;
		font-weight: 900;
		cursor: pointer;
	}

	.contact-form button:hover {
		background: #2f7d46;
	}

	.form-note {
		margin: 0;
		color: rgba(17, 17, 17, 0.6);
		line-height: 1.55;
	}

	@media (min-width: 721px) {
		.intro-info-value,
		.intro-info-note {
			opacity: 1;
			transform: none;
		}

		.intro-info-empty {
			display: none;
		}
	}

	@media (max-width: 980px) {
		.intro-inner,
		.contact-layout {
			grid-template-columns: 1fr;
		}

		.teams-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.youth-page-hero {
			display: none;
		}

		.youth-content {
			width: 100%;
		}

		.youth-intro-panel {
			min-height: 100svh;
			padding: 2rem 0;
			align-items: center;
		}

		.youth-intro-panel--cards {
			min-height: 100svh;
			padding: 0;
			background: linear-gradient(
				to bottom,
				#102716 0,
				#183920 5%,
				#e8eee6 40%,
				#fbfaf6 60%,
				#fbfaf6 100%
			);
			color: #111;
			box-shadow: inset #102716 0px 1px 30px 1px;
		}

		.intro-inner {
			width: min(100% - 2rem, 100%);
			min-height: calc(100svh - 4rem);
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.intro-title,
		.section-title {
			font-size: clamp(2.8rem, 14vw, 4.5rem);
		}

		.intro-info-grid {
			width: min(calc(100% - 2rem), 25rem);
			margin-inline: auto;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-auto-rows: minmax(10.1rem, 1fr);
			gap: 0.7rem;
			margin-top: 0;
			padding: 4.2rem 0 2rem;
			align-content: center;
			justify-content: center;
		}

		.intro-info-card:nth-child(1),
		.intro-info-card:nth-child(2),
		.intro-info-card:nth-child(3),
		.intro-info-card:nth-child(4) {
			grid-column: span 1;
		}

		.intro-info-card {
			min-height: 10.1rem;
			display: grid;
			grid-template-rows: auto 1fr auto;
			align-content: start;
			border-radius: 1.25rem;
			padding: 0.9rem 0.9rem 0.95rem;
			background: linear-gradient(180deg, #ffffff 0%, #f3f0e7 100%);
			border: 1px solid rgba(16, 39, 22, 0.08);
			box-shadow: 0 1rem 2.5rem rgba(16, 39, 22, 0.12);
			backdrop-filter: none;
		}

		.intro-info-label {
			position: static;
			margin-bottom: 0.65rem;
			color: #2f7d46;
			font-size: 0.62rem;
			letter-spacing: 0.14em;
		}

		.intro-info-empty {
			display: none;
		}

		.intro-info-value {
			align-self: center;
			font-size: 1.1rem;
			line-height: 1.08;
			letter-spacing: -0.04em;
			color: #111;
		}

		.intro-info-note {
			margin-top: 0.55rem;
			color: rgba(17, 17, 17, 0.62);
			font-size: 0.76rem;
			line-height: 1.3;
		}

		.section-inner {
			width: 100%;
		}

		.section-header {
			width: calc(100% - 2rem);
			margin-inline: auto;
		}

		.teams-scroll-hint {
			width: calc(100% - 2rem);
			margin: 0 auto 1rem;
			padding: 0.95rem 1rem;
			display: grid;
			gap: 0.15rem;
			border-radius: 1rem;
			background: #102716;
			color: #fff;
		}

		.teams-scroll-hint span {
			color: #78d982;
			font-size: 0.72rem;
			font-weight: 900;
			letter-spacing: 0.14em;
			text-transform: uppercase;
		}

		.teams-scroll-hint strong {
			font-size: 1rem;
			line-height: 1.3;
		}

		.teams-grid {
			width: 100%;
			gap: 0;
		}

		.team-card {
			position: relative;
			min-height: 100svh;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			border-radius: 0;
			border: 0;
			box-shadow: none;
		}

		.team-card:not(:last-child)::after {
			content: "";
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 14rem;
			background: linear-gradient(
				to bottom,
				rgba(16, 39, 22, 0),
				rgba(16, 39, 22, 0.18) 22%,
				rgba(16, 39, 22, 0.42) 52%,
				rgba(16, 39, 22, 0.68) 78%,
				rgba(16, 39, 22, 0.88) 100%
			);
			pointer-events: none;
		}

		.team-cover {
			height: 34svh;
			min-height: 16rem;
		}

		.team-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 1.1rem 1.1rem 2.6rem;
			background: linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0.98),
				rgba(247, 245, 239, 1)
			);
		}

		.training-table {
			font-size: 0.9rem;
		}

		.training-table th,
		.training-table td {
			padding: 0.7rem 0.45rem;
		}

		.team-links {
			grid-template-columns: 1fr;
			margin-top: 1.3rem;
			padding-bottom: 5.5rem;
		}

		.coach-section {
			padding: 3rem 0;
		}

		.coach-grid {
			width: calc(100% - 1rem);
			margin-inline: auto;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.55rem;
		}

		.coach-card {
			padding: 0.35rem 0.35rem 0.65rem;
			box-shadow: 0 0.7rem 1.4rem rgba(0, 0, 0, 0.2);
		}

		.coach-photo {
			aspect-ratio: 3 / 4;
		}

		.coach-name {
			font-size: 0.78rem;
			line-height: 1.15;
		}

		.coach-role {
			font-size: 0.68rem;
			line-height: 1.2;
		}

		.contact-section {
			padding: 3rem 0;
		}

		.contact-layout {
			width: calc(100% - 2rem);
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.contact-form {
			border-radius: 1rem;
		}
	}
</style>
