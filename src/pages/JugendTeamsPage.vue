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
				<div class="section-inner intro-facts-shell">
					<header class="section-header intro-facts-header">
						<p class="section-kicker">Jugendfakten</p>
						<h2 class="section-title">Jugend im Überblick</h2>
					</header>
					<div
						class="intro-info-grid"
						:class="{ 'is-unlocked': introInfoVisible }"
					>
						<span class="intro-info-line" aria-hidden="true"></span>
						<article
							v-for="(item, index) in introInfoItems"
							:key="item.label"
							class="intro-info-card"
							:class="{ 'is-visible': index < revealedIntroCardCount }"
						>
							<span class="intro-info-marker" aria-hidden="true"></span>
							<span class="intro-info-label">{{ item.label }}</span>
							<span class="intro-info-empty" aria-hidden="true"></span>
							<strong class="intro-info-value">{{ item.value }}</strong>
							<p class="intro-info-note">{{ item.note }}</p>
						</article>
					</div>
				</div>
			</section>

			<section
				id="jugendteams"
				class="teams-section"
				aria-label="Jugendmannschaften"
			>
				<div class="section-inner">
					<header class="section-header centered">
						<p class="section-kicker">Jugendteams</p>
					</header>

					<div class="teams-grid">
						<article
							v-for="team in visibleTeamCards"
							:key="team.id"
							class="team-card"
						>
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
					<div
						class="teams-toolbar"
						v-if="isDesktopYouthLayout && teamPageCount > 1"
					>
						<button
							type="button"
							class="teams-control-button"
							@click="goToPreviousTeamPage"
							:disabled="activeTeamPage === 0"
							aria-label="Vorherige Teamseite"
						>
							<ChevronLeft :size="18" :stroke-width="2.4" />
						</button>

						<div class="teams-page-indicator" aria-label="Teamseiten">
							<span
								v-for="page in teamPageCount"
								:key="page"
								class="teams-page-indicator__dot"
								:class="{ 'is-active': page - 1 === activeTeamPage }"
							></span>
						</div>

						<button
							type="button"
							class="teams-control-button"
							@click="goToNextTeamPage"
							:disabled="activeTeamPage >= teamPageCount - 1"
							aria-label="Nächste Teamseite"
						>
							<ChevronRight :size="18" :stroke-width="2.4" />
						</button>
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

					<div
						ref="coachGridRef"
						class="coach-grid"
						@scroll.passive="handleCoachGridScroll"
					>
						<article
							v-for="member in visibleCoachCards"
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
									<DummySilhouette />
								</span>
							</div>

							<div class="coach-caption">
								<p class="coach-name">{{ member.name }}</p>
								<p class="coach-role">{{ member.role }}</p>
							</div>
						</article>
					</div>

					<div
						v-if="!isDesktopYouthLayout && coachMobilePageCount > 1"
						class="coach-page-indicator"
						aria-label="Trainerseiten"
					>
						<span
							v-for="page in coachMobilePageCount"
							:key="page"
							class="coach-page-indicator__dot"
							:class="{ 'is-active': page - 1 === activeCoachPage }"
						></span>
					</div>

					<div
						v-if="isDesktopYouthLayout && coachDesktopPageCount > 1"
						class="coach-toolbar"
					>
						<button
							type="button"
							class="coach-control-button"
							@click="goToPreviousCoachPage"
							:disabled="activeDesktopCoachPage === 0"
							aria-label="Vorherige Trainerseite"
						>
							<ChevronLeft :size="18" :stroke-width="2.4" />
						</button>

						<div
							class="coach-page-indicator coach-page-indicator--desktop"
							aria-label="Trainerseiten"
						>
							<span
								v-for="page in coachDesktopPageCount"
								:key="page"
								class="coach-page-indicator__dot"
								:class="{ 'is-active': page - 1 === activeDesktopCoachPage }"
							></span>
						</div>

						<button
							type="button"
							class="coach-control-button"
							@click="goToNextCoachPage"
							:disabled="activeDesktopCoachPage >= coachDesktopPageCount - 1"
							aria-label="Nächste Trainerseite"
						>
							<ChevronRight :size="18" :stroke-width="2.4" />
						</button>
					</div>

					<div class="youth-sponsor-strip-wrap">
						<SponsorLogoStrip class="youth-sponsor-strip" />
					</div>
				</div>
			</section>

			<section class="contact-section" aria-label="Kontakt Jugend">
				<div class="section-inner contact-layout">
					<div class="contact-copy">
						<p class="section-kicker">Kontakt</p>
						<h2 class="section-title">{{ contact.title }}</h2>
						<p class="section-lead">{{ contact.lead }}</p>
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
					</form>
				</div>
			</section>

			<HomeSponsorsMobileSection />
		</main>
	</div>
</template>

<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref } from "vue";
	import { ChevronLeft, ChevronRight } from "@lucide/vue";
	import DummySilhouette from "@/components/DummySilhouette.vue";
	import HomeSponsorsMobileSection from "@/components/HomeSponsorsMobileSection.vue";
	import PageHero from "@/components/PageHero.vue";
	import SponsorLogoStrip from "@/components/SponsorLogoStrip.vue";
	import youthHero from "@/assets/header/background.png";
	import rawJugendtrainer from "@/content/jugendtrainer.json";
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

	const isCoachPortraitImage = (image?: string) =>
		Boolean(image && image !== "youthHero");

	type YouthTeamCard = YouthTeam & {
		tableUrl: string;
	};

	const teamCards: YouthTeamCard[] = youthContent.teams.map((team) => ({
		...team,
		image: teamImageMap[team.image] ?? team.image,
		tableUrl: team.tableUrl?.trim() || "https://next.fussball.de/",
	}));

	const activeTeamPage = ref(0);
	const isDesktopYouthLayout = ref(false);
	let desktopYouthMediaQuery: MediaQueryList | null = null;

	type CoachCard = CoachMember & {
		image?: string;
		imageAlt: string;
	};

	const coachCards: CoachCard[] = (rawJugendtrainer as CoachMember[]).map((member) => ({
		...member,
		image: isCoachPortraitImage(member.image)
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

	const introInfoItems = computed(() => [
		{
			label: "Philosophie",
			value: "Technik, Spielfreude und Teamgeist",
			note: "Altersgerechtes Training mit klaren Werten.",
		},
		{
			label: "Teams",
			value: `${teamCards.length} Teams`,
			note: "Von den jüngeren Jahrgängen bis zur älteren Jugend.",
		},
		{
			label: "Trainingsort",
			value: trainingLocation?.name ?? "Sportplatz Ottweiler",
			note: "Zentraler Treffpunkt für Training und Spielbetrieb.",
		},
		{
			label: "Probetraining",
			value: "Probetraining",
			note: "Jederzeit möglich",
		},
	]);

	const introInfoVisible = true;
	const revealedIntroCardCount = computed(() => introInfoItems.value.length);
	const coachGridRef = ref<HTMLElement | null>(null);
	const activeCoachPage = ref(0);
	const activeDesktopCoachPage = ref(0);
	const coachMobilePageCount = computed(() => Math.ceil(coachCards.length / 4));
	const coachDesktopPageCount = computed(() =>
		Math.ceil(coachCards.length / 5),
	);
	const teamPageCount = computed(() => Math.ceil(teamCards.length / 3));
	const visibleTeamCards = computed(() => {
		if (!isDesktopYouthLayout.value) {
			return teamCards;
		}

		const startIndex = activeTeamPage.value * 3;
		return teamCards.slice(startIndex, startIndex + 3);
	});
	const visibleCoachCards = computed(() => {
		if (!isDesktopYouthLayout.value) {
			return coachCards;
		}

		const startIndex = activeDesktopCoachPage.value * 5;
		return coachCards.slice(startIndex, startIndex + 5);
	});

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

	const syncDesktopYouthLayout = () => {
		const matches = desktopYouthMediaQuery?.matches ?? false;
		isDesktopYouthLayout.value = matches;

		if (!matches) {
			activeTeamPage.value = 0;
			activeDesktopCoachPage.value = 0;
			return;
		}

		activeTeamPage.value = Math.min(
			activeTeamPage.value,
			Math.max(teamPageCount.value - 1, 0),
		);
		activeDesktopCoachPage.value = Math.min(
			activeDesktopCoachPage.value,
			Math.max(coachDesktopPageCount.value - 1, 0),
		);
	};

	const goToPreviousTeamPage = () => {
		activeTeamPage.value = Math.max(activeTeamPage.value - 1, 0);
	};

	const goToNextTeamPage = () => {
		activeTeamPage.value = Math.min(
			activeTeamPage.value + 1,
			Math.max(teamPageCount.value - 1, 0),
		);
	};

	const goToPreviousCoachPage = () => {
		activeDesktopCoachPage.value = Math.max(
			activeDesktopCoachPage.value - 1,
			0,
		);
	};

	const goToNextCoachPage = () => {
		activeDesktopCoachPage.value = Math.min(
			activeDesktopCoachPage.value + 1,
			Math.max(coachDesktopPageCount.value - 1, 0),
		);
	};

	const updateActiveCoachPage = () => {
		const element = coachGridRef.value;
		if (!element) return;

		const pageWidth = element.clientWidth;
		if (!pageWidth) {
			activeCoachPage.value = 0;
			return;
		}

		activeCoachPage.value = Math.max(
			0,
			Math.min(
				coachMobilePageCount.value - 1,
				Math.round(element.scrollLeft / pageWidth),
			),
		);
	};

	const handleCoachGridScroll = () => {
		updateActiveCoachPage();
	};

	onMounted(() => {
		if (typeof window !== "undefined") {
			desktopYouthMediaQuery = window.matchMedia("(min-width: 981px)");
			syncDesktopYouthLayout();
			desktopYouthMediaQuery.addEventListener("change", syncDesktopYouthLayout);
		}

		updateActiveCoachPage();
		window.addEventListener("resize", updateActiveCoachPage);
	});

	onBeforeUnmount(() => {
		desktopYouthMediaQuery?.removeEventListener(
			"change",
			syncDesktopYouthLayout,
		);
		window.removeEventListener("resize", updateActiveCoachPage);
	});
</script>

<style scoped>
	.youth-page-flow {
		--youth-bg: var(--sv-bg-base);
		--youth-surface: #fffdf8;
		--youth-surface-strong: #f0e9d9;
		--youth-ink: #101828;
		--youth-muted: rgba(16, 24, 40, 0.68);
		--youth-border: rgba(2, 43, 121, 0.12);
		--youth-primary: #022b79;
		--youth-primary-strong: #011c4d;
		--youth-primary-soft: #e8eefb;
		--youth-accent: #f4d047;
		--youth-accent-soft: rgba(244, 208, 71, 0.2);
		--youth-shadow: rgba(1, 22, 61, 0.14);

		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
		background:
			linear-gradient(
				130deg,
				var(--sv-bg-header-black) 0%,
				var(--sv-bg-header-blue) 300%
			),
			linear-gradient(
				180deg,
				var(--sv-bg-deep) 0%,
				var(--sv-bg-base) 0%,
				var(--sv-bg-deep) 160%
			);
		color: var(--youth-ink);
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
				rgba(244, 208, 71, 0.22),
				transparent 28rem
			),
			radial-gradient(
				circle at 12% 82%,
				rgba(2, 43, 121, 0.26),
				transparent 30rem
			),
			linear-gradient(135deg, #04112d, #0a255f);
		color: #fff;
	}

	.youth-intro-panel--cards {
		background:
			radial-gradient(
				circle at 15% 18%,
				rgba(244, 208, 71, 0.16),
				transparent 24rem
			),
			radial-gradient(
				circle at 82% 78%,
				rgba(2, 43, 121, 0.18),
				transparent 28rem
			),
			linear-gradient(135deg, #07183d, #0b275f);
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
		color: var(--youth-primary);
		font-size: 0.78rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.youth-intro-panel .section-kicker,
	.coach-section .section-kicker {
		color: var(--youth-accent);
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
		border-left: 0.35rem solid var(--youth-accent);
	}

	.intro-info-grid {
		width: min(100%, 46rem);

		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		background: transparent;

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
		border: 1px solid rgba(255, 255, 255, 0.18);
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
		color: var(--youth-accent);
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

	.teams-toolbar,
	.teams-page-indicator {
		display: none;
	}

	.team-card {
		overflow: hidden;
		border-radius: 2rem;
		background: var(--youth-surface);
		box-shadow: 0 1.2rem 3.5rem var(--youth-shadow);
		border: 1px solid var(--youth-border);
	}

	.team-cover {
		position: relative;
		height: 18rem;
		background: var(--youth-primary-strong);
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
		color: var(--youth-accent);
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
		border-bottom: 1px solid var(--youth-border);
	}

	.team-meta-row span,
	.table-title,
	.team-action span {
		color: rgba(16, 24, 40, 0.55);
		font-size: 0.74rem;
		font-weight: 900;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.team-meta-row strong {
		text-align: right;
		color: var(--youth-primary);
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
		border-bottom: 1px solid rgba(2, 43, 121, 0.09);
		text-align: left;
		vertical-align: top;
	}

	.training-table th {
		color: rgba(16, 24, 40, 0.55);
		font-size: 0.72rem;
		font-weight: 900;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.training-table a {
		color: var(--youth-primary);
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
		background: var(--youth-primary-soft);
		color: var(--youth-primary-strong);
	}

	.team-action.primary {
		background: var(--youth-primary);
		color: #fff;
	}

	.team-action.primary span {
		color: rgba(255, 255, 255, 0.62);
	}

	.coach-section {
		background:
			radial-gradient(
				circle at 15% 15%,
				rgba(244, 208, 71, 0.16),
				transparent 25rem
			),
			radial-gradient(
				circle at 85% 82%,
				rgba(2, 43, 121, 0.22),
				transparent 24rem
			),
			linear-gradient(135deg, #07183d, #031128);
		color: #fff;
	}

	.coach-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: clamp(1rem, 2vw, 1.5rem);
	}

	.coach-page-indicator {
		display: none;
	}

	.coach-toolbar {
		display: none;
	}

	.youth-sponsor-strip-wrap {
		margin-top: 1.8rem;
	}

	.coach-card {
		padding: 0.8rem 0.8rem 1.2rem;
		background: var(--youth-surface);
		color: var(--youth-ink);
		box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.2);
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
		background: var(--youth-surface-strong);
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
		color: var(--youth-primary);
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
		color: var(--youth-ink);
	}

	.contact-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
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
		color: var(--youth-primary);
		text-decoration: none;
	}

	.contact-form {
		display: grid;
		gap: 1rem;
		padding: clamp(1.2rem, 3vw, 2rem);
		border-radius: 1.4rem;
		background: var(--youth-surface);
		border: 1px solid var(--youth-border);
		box-shadow: 0 1.2rem 3rem var(--youth-shadow);
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
		border: 1px solid rgba(2, 43, 121, 0.16);
		border-radius: 0.85rem;
		padding: 0.9rem 1rem;
		background: #fffefb;
		color: var(--youth-ink);
		font: inherit;
	}

	.contact-form input:focus,
	.contact-form textarea:focus {
		outline: 3px solid rgba(244, 208, 71, 0.2);
		border-color: var(--youth-primary);
	}

	.contact-form button {
		border: 0;
		border-radius: 999px;
		padding: 1rem 1.4rem;
		background: var(--youth-primary);
		color: #fff;
		font: inherit;
		font-weight: 900;
		cursor: pointer;
	}

	.contact-form button:hover {
		background: #0a3a99;
	}

	.form-note {
		margin: 0;
		color: rgba(17, 17, 17, 0.6);
		line-height: 1.55;
	}

	@media (min-width: 721px) {
		.youth-intro-panel,
		.youth-intro-panel--cards {
			min-height: auto;
			padding: clamp(4.25rem, 6vw, 6rem) 0;
		}

		.youth-intro-panel {
			background: var(--youth-surface);
			color: var(--youth-ink);
		}

		.youth-intro-panel--cards {
			background: var(--youth-bg);
			color: var(--youth-ink);
		}

		.youth-intro-panel .section-kicker {
			color: var(--youth-primary);
		}

		.intro-inner {
			width: min(1120px, calc(100% - 3rem));
			display: block;
		}

		.intro-copy {
			max-width: 780px;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			text-align: left;
		}

		.intro-title {
			font-size: clamp(2.9rem, 4.8vw, 4.8rem);
			line-height: 0.95;
		}

		.intro-text,
		.intro-added-text {
			max-width: 60ch;
			margin-left: 0;
			margin-right: 0;
			color: rgba(16, 24, 40, 0.72);
			opacity: 1;
		}

		.intro-added-text {
			padding-left: 0;
			border-left: 0;
		}

		.intro-info-grid {
			width: min(1120px, calc(100% - 3rem));

			grid-template-columns: repeat(4, minmax(0, 1fr));

			align-items: start;
		}

		.intro-info-card,
		.intro-info-card:nth-child(1),
		.intro-info-card:nth-child(2),
		.intro-info-card:nth-child(3),
		.intro-info-card:nth-child(4) {
			grid-column: span 1;
		}

		.intro-info-card {
			min-height: 14rem;
			padding: 1rem 0 0;
			display: block;
			background: transparent;
			border: 0;
			border-top: 2px solid rgba(2, 43, 121, 0.12);
			border-radius: 0;
			box-shadow: none;
			backdrop-filter: none;
		}

		.intro-info-label {
			position: static;
			display: inline-block;
			margin-bottom: 0.95rem;
			color: var(--youth-primary);
		}

		.intro-info-empty {
			display: none;
		}

		.intro-info-value {
			font-size: clamp(1.45rem, 2vw, 2rem);
			line-height: 1.02;
			color: var(--youth-ink);
		}

		.intro-info-note {
			margin-top: 0.85rem;
			color: rgba(16, 24, 40, 0.64);
			line-height: 1.6;
		}

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

	@media (min-width: 721px) and (max-width: 980px) {
		.youth-intro-panel,
		.coach-section,
		.contact-section {
			min-height: auto;
			padding: 4.5rem 0;
		}

		.intro-inner {
			width: min(940px, calc(100% - 2.5rem));
			display: block;
		}

		.intro-copy {
			max-width: 760px;
		}

		.youth-intro-panel--cards {
			padding-top: 0;
		}

		.intro-info-grid {
			width: 100%;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.intro-info-card:nth-child(1),
		.intro-info-card:nth-child(2),
		.intro-info-card:nth-child(3),
		.intro-info-card:nth-child(4) {
			grid-column: span 1;
		}

		.teams-section .section-inner,
		.coach-section .section-inner,
		.contact-section .section-inner {
			width: min(1080px, calc(100% - 2.5rem));
		}

		.teams-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: start;
		}

		.team-card {
			height: 100%;
		}

		.team-content {
			display: flex;
			flex-direction: column;
			min-height: 24rem;
		}

		.team-links {
			margin-top: auto;
			padding-top: 1.25rem;
		}

		.coach-section {
			background:
				radial-gradient(
					circle at 12% 12%,
					rgba(244, 208, 71, 0.12),
					transparent 22rem
				),
				linear-gradient(180deg, #f2ecde 0%, #fbf8f1 100%);
			color: var(--youth-ink);
		}

		.coach-section .section-kicker {
			color: var(--youth-primary);
		}

		.coach-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 1rem;
		}

		.coach-card,
		.coach-card:nth-child(even),
		.coach-card:nth-child(3n) {
			transform: none;
		}

		.contact-layout {
			gap: 2rem;
		}
	}

	@media (min-width: 981px) {
		.youth-page-hero {
			min-height: clamp(220px, 24vh, 310px);
			margin-bottom: 0;
		}

		.youth-page-hero :deep(.page-hero-content) {
			width: min(1120px, calc(100% - 4rem));
		}

		.youth-page-hero :deep(.page-hero::before) {
			box-shadow: none;
		}

		.youth-intro-panel,
		.youth-intro-panel--cards,
		.teams-section,
		.coach-section,
		.contact-section {
			min-height: calc(100svh - var(--sv-header-height));
			padding: clamp(2.75rem, 4vw, 4rem) 0;
			display: flex;
			align-items: center;
		}

		.youth-intro-panel {
			background:
				linear-gradient(180deg, #f8f4ea 0%, #fdfbf5 100%),
				radial-gradient(
					circle at 86% 14%,
					rgba(244, 208, 71, 0.12),
					transparent 22rem
				);
			color: var(--youth-ink);
		}

		.youth-content > .youth-intro-panel:not(.youth-intro-panel--cards) {
			min-height: calc(
				100svh - var(--sv-header-height) - clamp(220px, 24vh, 310px)
			);
			padding: clamp(1.5rem, 2.6vw, 2.4rem) 0;
		}

		.youth-intro-panel--cards,
		.teams-section,
		.coach-section,
		.contact-section {
			width: 100%;
		}

		.youth-intro-panel .section-kicker {
			color: var(--youth-primary);
		}

		.intro-inner {
			width: min(1120px, calc(100% - 4rem));
			display: block;
		}

		.intro-copy {
			width: min(880px, 100%);
			max-width: none;
			padding: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			text-align: left;
			border-top: 2px solid rgba(2, 43, 121, 0.14);
			padding-top: 1.2rem;
		}

		.intro-title {
			font-size: clamp(3rem, 4.6vw, 4.9rem);
			line-height: 0.94;
		}

		.intro-text,
		.intro-added-text {
			max-width: 58ch;
			color: rgba(16, 24, 40, 0.74);
			opacity: 1;
			margin-left: 0;
			margin-right: 0;
		}

		.youth-intro-panel--cards {
			background:
				linear-gradient(180deg, #fbf8f1 0%, #f2ebdb 100%),
				radial-gradient(
					circle at 14% 18%,
					rgba(2, 43, 121, 0.06),
					transparent 24rem
				),
				radial-gradient(
					circle at 84% 78%,
					rgba(244, 208, 71, 0.1),
					transparent 24rem
				);
			padding: clamp(2.75rem, 4vw, 4rem) 0;
		}

		.intro-facts-shell {
			width: min(1160px, calc(100% - 4rem));
		}

		.intro-facts-header {
			max-width: none;
			margin-bottom: clamp(2.5rem, 5vw, 4.25rem);
			text-align: left;
		}

		.intro-facts-header .section-title {
			font-size: clamp(4rem, 7vw, 6.9rem);
			line-height: 0.9;
			letter-spacing: -0.08em;
			text-wrap: balance;
		}

		.intro-info-grid {
			--facts-gap: clamp(4rem, 7vw, 5.5rem);
			position: relative;
			width: min(1040px, 100%);

			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));

			align-items: start;
		}

		.intro-info-line {
			position: absolute;
			top: 0.75rem;
			bottom: 0.75rem;
			left: 50%;
			width: 1px;
			background: rgba(16, 24, 40, 0.1);
			transform: translateX(-50%);
			z-index: 0;
			padding: 0;
			margin: 0;
			z-index: 0;
		}

		.intro-info-card {
			position: relative;
			width: 100%;
			min-height: 0;
			padding: 0;
			background: transparent;
			border: 0;
			box-shadow: none;
			backdrop-filter: none;
			border-radius: 0;
			z-index: 1;
		}

		.intro-info-card:nth-child(odd) {
			grid-column: 1;
			padding-right: clamp(2.75rem, 4vw, 3.4rem);
			text-align: right;
		}

		.intro-info-card:nth-child(even) {
			grid-column: 2;
			padding-left: clamp(2.75rem, 4vw, 3.4rem);
			text-align: left;
		}

		.intro-info-card:nth-child(1) {
			margin-top: 0.2rem;
		}

		.intro-info-card:nth-child(2) {
			margin-top: 4.3rem;
		}

		.intro-info-card:nth-child(3) {
			margin-top: 0.4rem;
		}

		.intro-info-card:nth-child(4) {
			margin-top: 4.4rem;
		}

		.intro-info-marker {
			position: absolute;
			top: 0.7rem;
			width: 1rem;
			height: 1rem;
			border-radius: 999px;
			background: var(--youth-accent);
			border: 2px solid var(--youth-primary);
			z-index: 10;
			margin: 0;
		}

		.intro-info-card:nth-child(odd) .intro-info-marker {
			right: 10px;
		}

		.intro-info-card:nth-child(even) .intro-info-marker {
			left: 10px;
		}

		.intro-info-label {
			display: none;
		}

		.intro-info-value {
			color: var(--youth-ink);
			max-width: 22rem;
			font-size: clamp(2rem, 2.7vw, 3rem);
			line-height: 0.94;
			letter-spacing: -0.06em;
			text-wrap: balance;
		}

		.intro-info-card:nth-child(odd) .intro-info-value {
			margin-left: auto;
		}

		.intro-info-note {
			max-width: 26rem;
			color: rgba(16, 24, 40, 0.62);
			margin-top: 0.95rem;
			font-size: 1rem;
			line-height: 1.6;
		}

		.intro-info-card:nth-child(odd) .intro-info-note {
			margin-left: auto;
		}

		.intro-info-empty {
			display: none;
		}

		.teams-section {
			background:
				radial-gradient(
					circle at 82% 16%,
					rgba(244, 208, 71, 0.14),
					transparent 22rem
				),
				radial-gradient(
					circle at 12% 78%,
					rgba(2, 43, 121, 0.12),
					transparent 24rem
				),
				linear-gradient(180deg, #f7f2e7 0%, #fcfaf5 100%);
		}

		.teams-section .section-inner,
		.coach-section .section-inner,
		.contact-section .section-inner {
			width: min(1240px, calc(100% - 4rem));
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		.teams-toolbar {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 1rem;
			margin-bottom: 1.35rem;
			margin-top: 1.35rem;
		}

		.teams-page-indicator {
			display: flex;
			align-items: center;
			gap: 0.45rem;
		}

		.teams-page-indicator__dot {
			width: 0.48rem;
			height: 0.48rem;
			border-radius: 999px;
			background: rgba(2, 43, 121, 0.18);
			transition:
				transform 0.2s ease,
				background-color 0.2s ease;
		}

		.teams-page-indicator__dot.is-active {
			background: var(--youth-primary);
			transform: scale(1.15);
		}

		.teams-control-button {
			width: 2.9rem;
			height: 2.9rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			border: 1px solid rgba(2, 43, 121, 0.14);
			border-radius: 999px;
			background: #fffdf7;
			color: var(--youth-primary);
			font: inherit;
			font-weight: 800;
			cursor: pointer;
			transition:
				background-color 0.2s ease,
				color 0.2s ease,
				border-color 0.2s ease,
				opacity 0.2s ease;
		}

		.teams-control-button:hover:not(:disabled) {
			background: var(--youth-primary);
			color: #fff;
			border-color: var(--youth-primary);
		}

		.teams-control-button:disabled {
			opacity: 0.45;
			cursor: default;
		}

		.teams-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.25rem;
			align-items: stretch;
		}

		.team-card {
			height: 100%;
			border-radius: 1.7rem;
		}

		.team-cover {
			height: 15.5rem;
		}

		.team-content {
			display: flex;
			flex-direction: column;
			min-height: 20.5rem;
			padding: 1rem 1rem 1.15rem;
		}

		.team-links {
			margin-top: auto;
			padding-top: 1rem;
		}

		.coach-section {
			background:
				radial-gradient(
					circle at 12% 18%,
					rgba(244, 208, 71, 0.12),
					transparent 22rem
				),
				radial-gradient(
					circle at 86% 22%,
					rgba(2, 43, 121, 0.12),
					transparent 20rem
				),
				linear-gradient(180deg, #efe6d4 0%, #faf6ed 100%);
			color: var(--youth-ink);
		}

		.coach-section .section-kicker {
			color: var(--youth-primary);
		}

		.coach-section .section-header {
			max-width: 640px;
		}

		.youth-sponsor-strip-wrap {
			width: min(980px, 100%);
			margin: 1.35rem auto 0;
		}

		.youth-sponsor-strip {
			width: 100%;
		}

		.coach-toolbar {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 1rem;
			margin-top: 1.35rem;
		}

		.coach-toolbar .coach-page-indicator {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.45rem;
		}

		.coach-toolbar .coach-page-indicator__dot {
			width: 0.48rem;
			height: 0.48rem;
			border-radius: 999px;
			background: rgba(2, 43, 121, 0.18);
			transition:
				transform 0.2s ease,
				background-color 0.2s ease;
		}

		.coach-toolbar .coach-page-indicator__dot.is-active {
			background: var(--youth-primary);
			transform: scale(1.15);
		}

		.coach-control-button {
			width: 2.9rem;
			height: 2.9rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			border: 1px solid rgba(2, 43, 121, 0.14);
			border-radius: 999px;
			background: #fffdf7;
			color: var(--youth-primary);
			font: inherit;
			font-weight: 800;
			cursor: pointer;
			transition:
				background-color 0.2s ease,
				color 0.2s ease,
				border-color 0.2s ease,
				opacity 0.2s ease;
		}

		.coach-control-button:hover:not(:disabled) {
			background: var(--youth-primary);
			color: #fff;
			border-color: var(--youth-primary);
		}

		.coach-control-button:disabled {
			opacity: 0.45;
			cursor: default;
		}

		.coach-grid {
			grid-template-columns: repeat(5, minmax(0, 180px));
			justify-content: center;
			gap: 0.7rem;
			align-items: start;
		}

		.coach-card,
		.coach-card:nth-child(even),
		.coach-card:nth-child(3n) {
			padding: 0.45rem 0.45rem 0.65rem;
			transform: rotate(-1.4deg);
			border-radius: 0;
			border: 1px solid rgba(17, 17, 17, 0.08);
			background: #fffdf7;
			box-shadow: 0 0.8rem 1.9rem rgba(0, 0, 0, 0.15);
		}

		.coach-card:nth-child(even) {
			transform: rotate(1.2deg);
		}

		.coach-card:nth-child(3n) {
			transform: rotate(-0.45deg);
		}

		.coach-caption {
			padding-top: 0.55rem;
		}

		.coach-name {
			font-size: 0.95rem;
		}

		.coach-role {
			font-size: 0.76rem;
		}

		.contact-section {
			background:
				linear-gradient(180deg, #0a1f52 0%, #07183d 100%),
				radial-gradient(
					circle at 18% 18%,
					rgba(244, 208, 71, 0.12),
					transparent 20rem
				);
			color: #fff;
		}

		.contact-section .section-kicker {
			color: var(--youth-accent);
		}

		.contact-section .section-title,
		.contact-section .section-lead {
			color: inherit;
		}

		.contact-section .section-lead {
			opacity: 0.8;
		}

		.contact-layout {
			grid-template-columns: 1fr;
			gap: 1.4rem;
			align-items: start;
			width: min(860px, 100%);
			margin-inline: auto;
		}

		.contact-copy {
			position: static;
			max-width: 44rem;
		}

		.contact-form {
			width: min(100%, 42rem);
			margin-inline: auto;
			padding: 1.5rem;
			border-radius: 1.35rem;
			background: rgba(255, 253, 247, 0.98);
		}
	}

	@media (max-width: 720px) {
		.youth-page-hero {
			display: none;
		}

		.youth-page-flow,
		.youth-content {
			display: contents;
		}

		.youth-content {
			width: 100%;
		}

		.youth-intro-panel,
		.coach-section,
		.contact-section {
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		.teams-section {
			scroll-snap-align: unset;
			scroll-snap-stop: normal;
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
				#07183d 0,
				#0c2d70 6%,
				#eef2fa 40%,
				#fbf8f1 62%,
				#fbf8f1 100%
			);
			color: var(--youth-ink);
			box-shadow: inset rgba(2, 43, 121, 0.72) 0px 1px 30px 1px;
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

		.intro-facts-shell {
			width: 100%;
		}

		.intro-facts-header {
			width: calc(100% - 2rem);
			margin: 0 auto 1.1rem;
			text-align: left;
		}

		.intro-facts-header .section-kicker {
			margin-bottom: 0.55rem;
		}

		.intro-facts-header .section-title {
			font-size: clamp(2.8rem, 14vw, 4.5rem);
			line-height: 0.96;
			letter-spacing: -0.06em;
			text-wrap: balance;
		}

		.intro-info-line,
		.intro-info-marker {
			display: none;
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
			margin-top: 0;
			border-radius: 1.25rem;
			padding: 0.9rem 0.9rem 0.95rem;
			background: linear-gradient(180deg, #ffffff 0%, #f3f0e7 100%);
			border: 1px solid rgba(2, 43, 121, 0.08);
			box-shadow: 0 1rem 2.5rem rgba(2, 43, 121, 0.12);
			backdrop-filter: none;
			text-align: left;
		}

		.intro-info-label {
			display: inline-block;
			position: static;
			margin-bottom: 0.65rem;
			color: var(--youth-primary);
			font-size: 0.62rem;
			letter-spacing: 0.14em;
		}

		.intro-info-empty {
			display: none;
		}

		.intro-info-value {
			align-self: start;
			max-width: none;
			font-size: 1.1rem;
			line-height: 1.08;
			letter-spacing: -0.04em;
			color: #111;
		}

		.intro-info-card:nth-child(odd) .intro-info-value {
			margin-left: 0;
		}

		.intro-info-card:nth-child(odd) .intro-info-note {
			margin-left: 0;
		}

		.intro-info-note {
			max-width: none;
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
			background: var(--youth-primary);
			color: #fff;
		}

		.teams-scroll-hint span {
			color: var(--youth-accent);
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
			scroll-snap-align: start;
			scroll-snap-stop: always;
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
				rgba(2, 43, 121, 0),
				rgba(2, 43, 121, 0.16) 22%,
				rgba(2, 43, 121, 0.4) 52%,
				rgba(2, 43, 121, 0.68) 78%,
				rgba(2, 43, 121, 0.86) 100%
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
			display: grid;
			grid-auto-flow: column;
			grid-template-rows: repeat(2, minmax(0, 1fr));
			grid-auto-columns: calc((100% - 0.55rem) / 2);
			grid-template-columns: none;
			gap: 0.55rem;
			overflow-x: auto;
			overflow-y: hidden;
			padding: 0 0 0.35rem;
			scroll-snap-type: x mandatory;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}

		.coach-page-indicator {
			display: flex;
			justify-content: center;
			gap: 0.4rem;
			margin-top: 0.7rem;
		}

		.youth-sponsor-strip-wrap {
			width: calc(100% - 1rem);
			margin: 1rem auto 0;
		}

		.coach-page-indicator__dot {
			width: 0.42rem;
			height: 0.42rem;
			border-radius: 999px;
			background: rgba(88, 119, 177, 0.22);
			transition:
				transform 0.2s ease,
				background-color 0.2s ease;
		}

		.coach-page-indicator__dot.is-active {
			background: var(--sv-secondary-color);
			transform: scale(1.15);
		}

		.coach-grid::-webkit-scrollbar {
			display: none;
		}

		.coach-card {
			padding: 0.35rem 0.35rem 0.65rem;
			box-shadow: 0 0.7rem 1.4rem rgba(0, 0, 0, 0.2);
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		.coach-card:nth-child(even),
		.coach-card:nth-child(odd) {
			transform: none;
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
			min-height: 100svh;
			padding: 0;
			display: flex;
			align-items: stretch;
		}

		.contact-layout {
			width: calc(100% - 1.5rem);
			min-height: 100svh;
			margin-inline: auto;
			padding: calc(var(--sv-header-height) + 10px) 0 14px;
			box-sizing: border-box;
			align-content: center;
			gap: 0.75rem;
		}

		.contact-copy {
			display: grid;
			gap: 0.45rem;
		}

		.contact-copy .section-kicker {
			color: var(--youth-accent);
		}

		.contact-copy .section-title {
			font-size: clamp(1.7rem, 8vw, 2.35rem);
			line-height: 0.96;
			color: #fff;
		}

		.contact-copy .section-lead {
			margin-top: 0;
			font-size: 0.88rem;
			line-height: 1.38;
			color: rgba(255, 255, 255, 0.78);
		}

		.contact-person {
			margin-top: 0.15rem;
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}

		.contact-person p {
			gap: 0.1rem;
			padding: 0.55rem 0.65rem;
			border-radius: 0.8rem;
			background: rgba(2, 43, 121, 0.05);
			border: 1px solid rgba(2, 43, 121, 0.08);
		}

		.contact-person span {
			font-size: 0.62rem;
			letter-spacing: 0.1em;
		}

		.contact-person strong,
		.contact-person a {
			font-size: 0.84rem;
			line-height: 1.25;
		}

		.contact-person p:not(:first-child) {
			display: none;
		}

		.form-row {
			grid-template-columns: 1fr;
			gap: 0.6rem;
		}

		.contact-form {
			gap: 0.7rem;
			padding: 0.8rem;
			border-radius: 0.9rem;
			background: linear-gradient(180deg, #fffdf8 0%, #f6f1e6 100%);
			border-color: rgba(255, 255, 255, 0.1);
			box-shadow: 0 1rem 2.4rem rgba(0, 0, 0, 0.22);
		}

		.contact-form label {
			gap: 0.3rem;
			color: rgba(16, 24, 40, 0.74);
			font-size: 0.75rem;
		}

		.contact-form input,
		.contact-form textarea {
			border-color: rgba(2, 43, 121, 0.12);
			background: rgba(255, 255, 255, 0.94);
			color: var(--youth-ink);
			padding: 0.72rem 0.8rem;
			border-radius: 0.7rem;
		}

		.contact-form input::placeholder,
		.contact-form textarea::placeholder {
			color: rgba(16, 24, 40, 0.46);
		}

		.contact-form textarea {
			min-height: 6.8rem;
		}

		.contact-form button {
			padding: 0.8rem 1rem;
			font-size: 0.92rem;
		}

		.form-note {
			font-size: 0.76rem;
			line-height: 1.32;
		}
	}
</style>
