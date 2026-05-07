<template>
	<div class="termine-page-flow">
		<PageHero
			class="termine-page-hero"
			:image="termineHero"
			title="Termine"
			lead="Alle Spiele, Events und Vereinsaktivitaeten auf einen Blick."
		>
			<p class="termine-mobile-scroll-hint">Nach unten scrollen</p>
		</PageHero>
		<section class="termine-grid" aria-label="Alle Termine">
			<article
				v-for="(item, index) in termineItems"
				:key="item.id"
				class="termine-card"
				:style="getTerminCardStyle(item, index)"
			>
				<span class="termine-card-pin" aria-hidden="true">
					<Pin :size="26" :stroke-width="2.1" />
				</span>
				<RouterLink
					class="termine-card-sheet-link"
					:to="{ name: 'termine-detail', params: { slug: item.slug } }"
					:aria-label="`Zum Termin ${item.title}`"
				>
					<div class="termine-card-sheet">
						<div class="termine-card-media">
							<img
								class="termine-card-image"
								:src="item.image"
								:alt="item.imageAlt"
								loading="lazy"
							/>
							<div class="termine-card-overlay" aria-hidden="true">
								<svg
									class="termine-card-icon"
									viewBox="0 0 48 48"
									focusable="false"
									aria-hidden="true"
								>
									<rect x="12" y="14" width="24" height="20" rx="3" />
									<path d="M16 12v6M32 12v6M16 22h16" />
								</svg>
							</div>
						</div>
						<div class="termine-card-body">
							<div class="termine-meta">
								<time class="termine-date" :datetime="item.date">
									{{ formatDate(item.date) }}
								</time>
								<span class="termine-time">{{ item.time }}</span>
								<span class="termine-location">{{ item.location }}</span>
								<span v-if="item.source" class="termine-source">{{
									item.source
								}}</span>
							</div>
							<div
								v-if="item.homeTeam && item.awayTeam"
								class="termine-matchup"
							>
								<div class="termine-team">
									<img
										v-if="item.homeLogo"
										class="termine-team-logo"
										:src="item.homeLogo"
										:alt="`${item.homeTeam} Logo`"
										loading="lazy"
									/>
									<span class="termine-team-name">{{ item.homeTeam }}</span>
								</div>
								<span class="termine-matchup-separator">vs</span>
								<div class="termine-team termine-team--away">
									<img
										v-if="item.awayLogo"
										class="termine-team-logo"
										:src="item.awayLogo"
										:alt="`${item.awayTeam} Logo`"
										loading="lazy"
									/>
									<span class="termine-team-name">{{ item.awayTeam }}</span>
								</div>
							</div>
							<h3 class="termine-card-title">{{ item.title }}</h3>
							<p class="termine-card-excerpt">{{ item.excerpt }}</p>
						</div>
					</div>
				</RouterLink>
				<RouterLink
					class="termine-mobile-detail"
					:to="{ name: 'termine-detail', params: { slug: item.slug } }"
					:aria-label="`Termin ${item.title} im Detail ansehen`"
				>
					<ExternalLink :size="22" :stroke-width="2.2" />
				</RouterLink>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { computed, nextTick, onBeforeUnmount, onMounted } from "vue";
	import { ExternalLink, Pin } from "@lucide/vue";
	import PageHero from "@/components/PageHero.vue";
	import termineHero from "@/assets/header/background.png";
	import { formatDate } from "@/utils/date";
	import { getTerminItems, type TerminEntry } from "@/utils/contentEntries";

	const termineItems = computed(() => getTerminItems());
	const termineScrollStorageKey = "sv-termine-scroll-position";

	const getRandomTilt = (seedSource: string, index: number) => {
		const seed = `${seedSource}-${index}`;
		let hash = 0;
		for (let i = 0; i < seed.length; i += 1) {
			hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
		}

		const direction = hash % 2 === 0 ? 1 : -1;
		const tilt = 0.75 + (hash % 175) / 100;
		return `${(direction * tilt).toFixed(2)}deg`;
	};

	const getTerminCardStyle = (item: TerminEntry, index: number) => ({
		"--pin-tilt": getRandomTilt(`${item.id}-${item.title}`, index),
	});

	const isMobileTermineLayout = () =>
		typeof window !== "undefined" &&
		window.matchMedia("(max-width: 700px)").matches;

	const getAppScrollContainer = () =>
		typeof document === "undefined"
			? null
			: (document.querySelector(".app-content") as HTMLElement | null);

	const readTerminScrollPosition = () => {
		if (typeof window === "undefined") {
			return 0;
		}

		if (isMobileTermineLayout()) {
			return getAppScrollContainer()?.scrollTop ?? 0;
		}

		return window.scrollY;
	};

	const persistTerminScrollPosition = () => {
		if (typeof window === "undefined") {
			return;
		}

		window.sessionStorage.setItem(
			termineScrollStorageKey,
			String(readTerminScrollPosition()),
		);
	};

	const restoreTerminScrollPosition = async () => {
		if (typeof window === "undefined") {
			return;
		}

		const storedValue = window.sessionStorage.getItem(termineScrollStorageKey);
		if (!storedValue) {
			return;
		}

		const nextScrollTop = Number(storedValue);
		if (!Number.isFinite(nextScrollTop)) {
			return;
		}

		await nextTick();
		window.requestAnimationFrame(() => {
			if (isMobileTermineLayout()) {
				getAppScrollContainer()?.scrollTo({
					top: nextScrollTop,
					behavior: "auto",
				});
				return;
			}

			window.scrollTo({ top: nextScrollTop, behavior: "auto" });
		});
	};

	onMounted(() => {
		restoreTerminScrollPosition();
		getAppScrollContainer()?.addEventListener(
			"scroll",
			persistTerminScrollPosition,
			{
				passive: true,
			},
		);
		window.addEventListener("scroll", persistTerminScrollPosition, {
			passive: true,
		});
	});

	onBeforeUnmount(() => {
		persistTerminScrollPosition();
		getAppScrollContainer()?.removeEventListener(
			"scroll",
			persistTerminScrollPosition,
		);
		window.removeEventListener("scroll", persistTerminScrollPosition);
	});
</script>

<style scoped>
	.termine-page-flow {
		display: contents;
	}

	.termine-grid {
		width: 80dvw;
		margin: 0 auto;
		padding: 20px clamp(24px, 7vw, 80px) clamp(44px, 7vw, 88px);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(10px, 1.4vw, 16px);
		align-items: start;
		overflow: visible;
	}

	.termine-mobile-scroll-hint {
		display: none;
	}

	.termine-card {
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: visible;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
		--termine-card-min-height: clamp(410px, 35vw, 500px);
		--termine-card-offset: 0px;
		--termine-card-overlap: -34px;
		--termine-card-overlap-x: 14px;
		--pin-tilt: 0deg;
		--termine-excerpt-lines: 3;
		min-height: var(--termine-card-min-height);
		width: calc(100% + (var(--termine-card-overlap-x) * 2));
		margin-top: var(--termine-card-overlap);
		margin-left: calc(var(--termine-card-overlap-x) * -1);
		transform: translateY(var(--termine-card-offset));
		z-index: 1;
		background: transparent;
	}

	.termine-card:hover {
		transform: translateY(calc(var(--termine-card-offset) - 6px));
		z-index: 10;
	}

	.termine-card-sheet-link {
		display: block;
		color: inherit;
		text-decoration: none;
		pointer-events: none;
	}

	.termine-card:focus-visible {
		outline: 2px solid var(--sv-secondary-color);
		outline-offset: 3px;
	}

	.termine-card-pin {
		position: absolute;
		top: 2px;
		left: 50%;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		color: var(--sv-secondary-color);
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
		transform: translateX(-50%);
		z-index: 4;
	}

	.termine-card-pin :deep(svg) {
		overflow: visible;
		fill: var(--sv-secondary-color);
	}

	.termine-card-sheet {
		display: flex;
		flex-direction: column;
		min-height: var(--termine-card-min-height);
		background: var(--sv-card-bg);
		border: 1px solid var(--sv-card-border);
		border-radius: 18px;
		box-shadow: 0 14px 28px rgba(2, 43, 121, 0.12);
		transform-origin: top center;
		transform: rotate(var(--pin-tilt));
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			border-color 0.3s ease;
		pointer-events: auto;
	}

	.termine-card:hover .termine-card-sheet {
		transform: rotate(calc(var(--pin-tilt) * -1));
		border-color: rgba(244, 208, 71, 0.7);
		box-shadow: 0 18px 36px rgba(2, 43, 121, 0.22);
	}

	.termine-mobile-detail {
		display: none;
		pointer-events: auto;
	}

	.termine-card-media {
		position: relative;
		height: clamp(180px, 15.5vw, 220px);
		overflow: hidden;
		background: #dfe6f1;
		border-radius: 18px 18px 0 0;
	}

	.termine-card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1);
		transition:
			transform 0.6s ease,
			filter 0.6s ease;
	}

	.termine-card-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: rgba(2, 43, 121, 0.35);
		opacity: 0;
		transform: scale(0.98);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
		pointer-events: none;
	}

	.termine-card-icon {
		width: 46px;
		height: 46px;
		stroke: var(--sv-secondary-color);
		stroke-width: 2.5;
		fill: none;
	}

	.termine-card:hover .termine-card-image {
		transform: scale(1.08);
		filter: grayscale(0.15);
	}

	.termine-card:hover .termine-card-overlay {
		opacity: 1;
		transform: scale(1);
	}

	.termine-card-body {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: clamp(12px, 1.6vw, 18px);
		padding-top: clamp(22px, 2.4vw, 28px);
		flex: 1;
		background: rgb(7, 18, 44);
		border: 1px solid rgb(7, 18, 44);
		border-radius: 0 0 18px 18px;
	}

	.termine-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.75;
	}

	.termine-card-title {
		margin: 0;
		font-size: clamp(17px, 1.45vw, 22px);
		line-height: 1.25;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.termine-matchup {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		gap: 10px;
	}

	.termine-team {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.termine-team--away {
		justify-content: flex-end;
	}

	.termine-team-logo {
		width: 34px;
		height: 34px;
		flex: 0 0 34px;
		object-fit: contain;
	}

	.termine-team-name {
		font-size: 13px;
		font-weight: 700;
		line-height: 1.2;
	}

	.termine-matchup-separator {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--sv-secondary-color);
	}

	.termine-card-excerpt {
		margin: 0;
		opacity: 0.85;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--termine-excerpt-lines);
		overflow: hidden;
	}

	.termine-source {
		color: var(--sv-secondary-color);
	}

	.termine-card:nth-child(6n + 2) {
		--termine-card-min-height: clamp(360px, 30vw, 425px);
		--termine-card-offset: 18px;
		--termine-card-overlap: -56px;
		--termine-card-overlap-x: 22px;
		--termine-excerpt-lines: 2;
	}

	.termine-card:nth-child(6n + 3) {
		--termine-card-offset: 6px;
		--termine-card-overlap: -44px;
		--termine-card-overlap-x: 18px;
	}

	.termine-card:nth-child(6n + 4) {
		--termine-card-offset: 10px;
		--termine-card-overlap: -48px;
		--termine-card-overlap-x: 20px;
	}

	.termine-card:nth-child(6n + 5) {
		--termine-card-min-height: clamp(450px, 39vw, 550px);
		--termine-card-offset: -14px;
		--termine-card-overlap: -68px;
		--termine-card-overlap-x: 28px;
		--termine-excerpt-lines: 4;
	}

	.termine-card:nth-child(6n + 6) {
		--termine-card-offset: -6px;
		--termine-card-overlap: -52px;
		--termine-card-overlap-x: 20px;
	}

	@media (max-width: 1100px) {
		.termine-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			padding-inline: clamp(20px, 6vw, 48px);
			gap: 12px;
		}

		.termine-card {
			--termine-card-min-height: clamp(380px, 46vw, 450px);
			--termine-card-overlap: -28px;
			--termine-card-overlap-x: 10px;
		}

		.termine-card:nth-child(6n + 2) {
			--termine-card-min-height: clamp(344px, 41vw, 404px);
			--termine-card-offset: 14px;
			--termine-card-overlap: -42px;
			--termine-card-overlap-x: 16px;
		}

		.termine-card:nth-child(6n + 5) {
			--termine-card-min-height: clamp(410px, 49vw, 490px);
			--termine-card-offset: -10px;
			--termine-card-overlap: -52px;
			--termine-card-overlap-x: 20px;
		}
	}

	@media (max-width: 700px) {
		.termine-page-flow {
			display: block;
		}

		.termine-page-hero {
			min-height: 100dvh;
			margin-bottom: 0;
			padding: 0 14px 22px;
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		.termine-page-hero :deep(.page-hero-content) {
			min-height: 100dvh;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 12px;
		}

		.termine-page-hero :deep(.page-hero-lead) {
			max-width: 28ch;
		}

		.termine-mobile-scroll-hint {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			margin: 18px 0 0;
			font-size: 12px;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--sv-secondary-color);
			opacity: 0.9;
		}

		.termine-mobile-scroll-hint::after {
			content: "";
			width: 20px;
			height: 20px;
			border-right: 2px solid currentColor;
			border-bottom: 2px solid currentColor;
			transform: rotate(45deg) translateY(-2px);
		}

		.termine-grid {
			width: 100dvw;
			grid-template-columns: 1fr;
			padding: 0;
			gap: 0;
			margin: 0;
		}

		.termine-card {
			min-height: 100dvh;
			--termine-card-offset: 0px;
			--termine-card-overlap: 0px;
			--termine-card-overlap-x: 0px;
			width: 100%;
			margin: 0;
			padding: 0;
			scroll-snap-align: start;
			scroll-snap-stop: always;
			align-items: stretch;
			transform: none;
		}

		.termine-card:hover {
			transform: none;
		}

		.termine-card-pin {
			display: none;
		}

		.termine-card-sheet-link {
			flex: 1;
		}

		.termine-card-sheet {
			min-height: 100dvh;
			border-radius: 0;
			border-left: 0;
			border-right: 0;
			transform: none;
		}

		.termine-card:hover .termine-card-sheet {
			transform: none;
			border-color: var(--sv-card-border);
			box-shadow: none;
		}

		.termine-card-media {
			height: 44dvh;
			border-radius: 0;
		}

		.termine-card-body {
			gap: 10px;
			padding: 16px 14px 22px;
			padding-top: 18px;
		}

		.termine-card-title {
			font-size: clamp(24px, 7vw, 34px);
			-webkit-line-clamp: 3;
		}

		.termine-card-excerpt {
			font-size: 15px;
			line-height: 1.55;
			-webkit-line-clamp: 6;
		}

		.termine-mobile-detail {
			position: absolute;
			right: 8px;
			bottom: 8px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			color: var(--sv-secondary-color);
			text-decoration: none;
			background: none;
			border: 0;
			transform: none;
			filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.55));
			z-index: 12;
		}

		.termine-mobile-detail :deep(svg) {
			flex: 0 0 auto;
		}

		.termine-card:hover .termine-card-image {
			transform: none;
			filter: none;
		}

		.termine-card:hover .termine-card-overlay {
			opacity: 0;
			transform: scale(0.98);
		}
	}
</style>
