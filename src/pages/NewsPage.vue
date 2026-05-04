<template>
	<div class="news-page-flow">
		<PageHero
			class="news-page-hero"
			:image="newsHero"
			title="News"
			lead="Aktuelle Meldungen rund um den Verein, die Teams und Events."
		>
			<p class="news-mobile-scroll-hint">Nach unten scrollen</p>
		</PageHero>
		<section class="news-grid" aria-label="Alle News">
			<article
				v-for="(item, index) in newsItems"
				:key="item.id"
				class="news-card"
				:style="getNewsCardStyle(item, index)"
			>
				<span class="news-card-pin" aria-hidden="true">
					<Pin :size="26" :stroke-width="2.1" />
				</span>
				<RouterLink
					class="news-card-sheet-link"
					:to="{ name: 'news-detail', params: { slug: item.slug } }"
					:aria-label="`Zur News ${item.title}`"
				>
					<div class="news-card-sheet">
						<div class="news-card-media">
							<img
								class="news-card-image"
								:src="item.image"
								:alt="item.imageAlt"
								loading="lazy"
							/>
							<div class="news-card-overlay" aria-hidden="true">
								<svg
									class="news-card-icon"
									viewBox="0 0 48 48"
									focusable="false"
									aria-hidden="true"
								>
									<circle cx="24" cy="24" r="18" />
									<path d="M24 16v16M16 24h16" />
								</svg>
							</div>
						</div>
						<div class="news-card-body">
							<div class="news-meta">
								<time class="news-date" :datetime="item.date">
									{{ formatDate(item.date) }}
								</time>
								<span v-if="item.source" class="news-source">{{
									item.source
								}}</span>
							</div>
							<h3 class="news-card-title">{{ item.title }}</h3>
							<p class="news-card-excerpt">{{ item.excerpt }}</p>
						</div>
					</div>
				</RouterLink>
				<RouterLink
					class="news-mobile-detail"
					:to="{ name: 'news-detail', params: { slug: item.slug } }"
					:aria-label="`News ${item.title} im Detail ansehen`"
				>
					<ExternalLink :size="22" :stroke-width="2.2" />
				</RouterLink>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { ExternalLink, Pin } from "@lucide/vue";
	import PageHero from "@/components/PageHero.vue";
	import newsHero from "@/assets/news/stock_news_1.png";
	import { formatDate } from "@/utils/date";
	import { getNewsItems, type NewsEntry } from "@/utils/contentEntries";

	const newsItems = computed(() => getNewsItems());

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

	const getNewsCardStyle = (item: NewsEntry, index: number) => ({
		"--pin-tilt": getRandomTilt(`${item.id}-${item.title}`, index),
	});
</script>

<style scoped>
	.news-page-flow {
		display: contents;
	}

	.news-grid {
		width: 80dvw;
		margin: 0 auto;
		padding: 20px clamp(24px, 7vw, 80px) clamp(44px, 7vw, 88px);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(10px, 1.4vw, 16px);
		align-items: start;
		overflow: visible;
	}

	.news-mobile-scroll-hint {
		display: none;
	}

	.news-card {
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: visible;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
		--news-card-min-height: clamp(390px, 33vw, 470px);
		--news-card-offset: 0px;
		--news-card-overlap: -34px;
		--news-card-overlap-x: 14px;
		--pin-tilt: 0deg;
		--news-excerpt-lines: 4;
		min-height: var(--news-card-min-height);
		width: calc(100% + (var(--news-card-overlap-x) * 2));
		margin-top: var(--news-card-overlap);
		margin-left: calc(var(--news-card-overlap-x) * -1);
		transform: translateY(var(--news-card-offset));
		z-index: 1;
	}

	.news-card:hover {
		z-index: 10;
	}

	.news-card-sheet-link {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.news-card:focus-visible {
		outline: 2px solid var(--sv-secondary-color);
		outline-offset: 3px;
	}

	.news-card-pin {
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

	.news-card-pin :deep(svg) {
		overflow: visible;
		fill: var(--sv-secondary-color);
	}

	.news-card-sheet {
		display: flex;
		flex-direction: column;
		min-height: var(--news-card-min-height);
		background: rgb(7, 18, 44);
		border: 1px solid var(--sv-card-border);
		border-radius: 18px;

		transform-origin: top center;
		transform: rotate(var(--pin-tilt));
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			border-color 0.3s ease;
	}

	.news-card:hover .news-card-sheet {
		transform: rotate(calc(var(--pin-tilt) * -1));
		border-color: rgba(244, 208, 71, 0.7);
		box-shadow: 0 18px 36px rgba(244, 208, 71, 0.7);
	}

	.news-mobile-detail {
		display: none;
	}

	.news-card-media {
		position: relative;
		height: clamp(190px, 16vw, 232px);
		overflow: hidden;
		background: #dfe6f1;
		border-radius: 18px 18px 0 0;
	}

	.news-card-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1);
		transition:
			transform 0.6s ease,
			filter 0.6s ease;
	}

	.news-card-overlay {
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

	.news-card-icon {
		width: 46px;
		height: 46px;
		stroke: var(--sv-secondary-color);
		stroke-width: 2.5;
		fill: none;
	}

	.news-card:hover .news-card-image {
		transform: scale(1.08);
		filter: grayscale(0.15);
	}

	.news-card:hover .news-card-overlay {
		opacity: 1;
		transform: scale(1);
	}

	.news-card-body {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: clamp(12px, 1.6vw, 18px);
		padding-top: clamp(22px, 2.4vw, 28px);
		flex: 1;
	}

	.news-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 12px;
		align-items: center;
	}

	.news-date {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.news-source {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sv-secondary-color);
	}

	.news-card-title {
		margin: 0;
		font-size: clamp(18px, 1.7vw, 24px);
		font-size: clamp(17px, 1.45vw, 22px);
		line-height: 1.25;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.news-card-excerpt {
		margin: 0;
		opacity: 0.85;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--news-excerpt-lines);
		overflow: hidden;
	}

	.news-card:nth-child(6n + 2) {
		--news-card-min-height: clamp(340px, 29vw, 395px);
		--news-card-offset: 18px;
		--news-card-overlap: -56px;
		--news-card-overlap-x: 22px;
		--news-excerpt-lines: 2;
	}

	.news-card:nth-child(6n + 3) {
		--news-card-offset: 6px;
		--news-card-overlap: -44px;
		--news-card-overlap-x: 18px;
	}

	.news-card:nth-child(6n + 5) {
		--news-card-min-height: clamp(425px, 37vw, 520px);
		--news-card-offset: -14px;
		--news-card-overlap: -68px;
		--news-card-overlap-x: 28px;
		--news-excerpt-lines: 6;
	}

	.news-card:nth-child(6n + 4) {
		--news-card-offset: 10px;
		--news-card-overlap: -48px;
		--news-card-overlap-x: 20px;
	}

	.news-card:nth-child(6n + 6) {
		--news-card-offset: -6px;
		--news-card-overlap: -52px;
		--news-card-overlap-x: 20px;
	}

	@media (max-width: 1100px) {
		.news-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			padding-inline: clamp(20px, 6vw, 48px);
			gap: 12px;
		}

		.news-card {
			--news-card-min-height: clamp(360px, 44vw, 430px);
			--news-card-overlap: -28px;
			--news-card-overlap-x: 10px;
		}

		.news-card:nth-child(6n + 2) {
			--news-card-min-height: clamp(328px, 40vw, 390px);
			--news-card-offset: 14px;
			--news-card-overlap: -42px;
			--news-card-overlap-x: 16px;
		}

		.news-card:nth-child(6n + 5) {
			--news-card-min-height: clamp(390px, 47vw, 470px);
			--news-card-offset: -10px;
			--news-card-overlap: -52px;
			--news-card-overlap-x: 20px;
		}
	}

	@media (max-width: 700px) {
		.news-page-flow {
			display: block;
			height: calc(100dvh + var(--sv-header-height));
			margin-top: calc(var(--sv-header-height) * -1);
			overflow-y: auto;
			scroll-snap-type: y mandatory;
			overscroll-behavior-y: contain;
		}

		.news-page-hero {
			min-height: 100dvh;
			margin-bottom: 0;
			padding: 0 14px 22px;
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		.news-page-hero :deep(.page-hero-content) {
			min-height: 100dvh;
			align-items: center;
			justify-content: center;
			text-align: center;
			gap: 12px;
		}

		.news-page-hero :deep(.page-hero-lead) {
			max-width: 28ch;
		}

		.news-mobile-scroll-hint {
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

		.news-mobile-scroll-hint::after {
			content: "";
			width: 20px;
			height: 20px;
			border-right: 2px solid currentColor;
			border-bottom: 2px solid currentColor;
			transform: rotate(45deg) translateY(-2px);
		}

		.news-grid {
			width: 100dvw;
			grid-template-columns: 1fr;
			padding: 0;
			gap: 0;
			margin: 0;
		}

		.news-card {
			min-height: 100dvh;
			--news-card-offset: 0px;
			--news-card-overlap: 0px;
			--news-card-overlap-x: 0px;
			width: 100%;
			margin: 0;
			padding: 0;
			scroll-snap-align: start;
			scroll-snap-stop: always;
			align-items: stretch;
			transform: none;
		}

		.news-card:hover {
			transform: none;
		}

		.news-card-pin {
			display: none;
		}

		.news-card-sheet-link {
			pointer-events: none;
			flex: 1;
		}

		.news-card-sheet {
			min-height: 100dvh;
			border-radius: 0;
			border-left: 0;
			border-right: 0;
			transform: none;
		}

		.news-card:hover .news-card-sheet {
			transform: none;
			border-color: var(--sv-card-border);
			box-shadow: none;
		}

		.news-card-media {
			height: 44dvh;
			border-radius: 0;
		}

		.news-card-body {
			gap: 10px;
			padding: 16px 14px 22px;
			padding-top: 18px;
		}

		.news-card-title {
			font-size: clamp(24px, 7vw, 34px);
			-webkit-line-clamp: 3;
		}

		.news-card-excerpt {
			font-size: 15px;
			line-height: 1.55;
			-webkit-line-clamp: 6;
		}

		.news-mobile-detail {
			position: fixed;
			right: 20px;
			bottom: 20px;
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

		.news-mobile-detail :deep(svg) {
			flex: 0 0 auto;
		}

		.news-card:hover .news-card-image {
			transform: none;
			filter: none;
		}

		.news-card:hover .news-card-overlay {
			opacity: 0;
			transform: scale(0.98);
		}
	}
</style>
