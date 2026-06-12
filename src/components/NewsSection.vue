<template>
	<section class="section section--news">
		<div class="section-header">
			<h2 class="section-title">Neuste News</h2>
			<div class="section-cta-wrap">
				<RouterLink to="/news" class="news-cta" aria-label="Alle News">
					<Newspaper :size="22" :stroke-width="2.2" aria-hidden="true" />
				</RouterLink>
			</div>
		</div>
		<RouterLink to="/news" class="mobile-section-cta">
			<Newspaper :size="16" :stroke-width="2.2" aria-hidden="true" />
		</RouterLink>
		<div class="news-pinboard">
			<article
				v-for="(item, index) in newsItems.slice(0, 3)"
				:key="`desktop-${item.id}`"
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
							</div>
							<h3 class="news-card-title">{{ item.title }}</h3>
							<p class="news-card-excerpt">{{ item.excerpt }}</p>
						</div>
					</div>
				</RouterLink>
			</article>
		</div>
		<article
			v-for="(item, index) in newsItems.slice(0, 3)"
			:key="item.id"
			class="news-item news-item--mobile"
			:class="{ 'news-item--reverse': index % 2 === 1 }"
		>
			<RouterLink
				class="news-text"
				:to="{ name: 'news-detail', params: { slug: item.slug } }"
			>
				<time class="news-date" :datetime="item.date">
					{{ formatDate(item.date) }}
				</time>
				<h3 class="news-item-title">{{ item.title }}</h3>
				<p class="news-excerpt">{{ item.excerpt }}</p>
			</RouterLink>
			<RouterLink
				class="news-image-frame"
				:to="{ name: 'news-detail', params: { slug: item.slug } }"
			>
				<img
					class="news-image"
					:src="item.image"
					:alt="item.imageAlt"
					loading="lazy"
				/>
				<div class="news-image-overlay" aria-hidden="true">
					<svg
						class="news-overlay-icon"
						viewBox="0 0 48 48"
						focusable="false"
						aria-hidden="true"
					>
						<circle cx="24" cy="24" r="18" />
						<path d="M24 16v16M16 24h16" />
					</svg>
				</div>
			</RouterLink>
		</article>
	</section>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { Newspaper, Pin } from "@lucide/vue";
	import { formatDate } from "@/utils/date";
	import { getNewsItems, type NewsEntry } from "@/utils/contentEntries";

	const newsItems = computed(() => getNewsItems());

	const getRandomTilt = (seedSource: string, index: number) => {
		let hash = 0;
		const seed = `${seedSource}-${index}`;
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
	.section {
		min-height: calc(100dvh - var(--sv-header-height));
		display: flex;
		align-items: center;
		position: relative;
		scroll-margin-top: var(--sv-header-height);
		scroll-snap-align: start;
		scroll-snap-stop: normal;
	}

	.section--news {
		flex-direction: column;
		position: relative;
	}

	.section-header {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		padding: 5rem 10dvw 0;
		margin-bottom: 2.5rem;
	}

	.section-title {
		margin: 0;
		display: flex;
		align-items: center;
		color: var(--sv-secondary-color);
		font-size: clamp(28px, 2.5vw, 30px);
		font-weight: 700;
		text-transform: uppercase;
	}

	.section-cta-wrap {
		display: flex;
		align-items: center;
	}

	.news-pinboard {
		width: 88dvw;
		margin: 0 auto;
		padding: 28px clamp(20px, 5vw, 56px) clamp(56px, 8vw, 104px);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(14px, 1.8vw, 22px);
		align-items: start;
		overflow: visible;
	}

	.news-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		padding: 0;
		border-radius: 999px;
		background: var(--sv-secondary-color);
		color: var(--sv-primary-color);
		text-decoration: none;
		border: 2px solid transparent;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			background 0.25s ease,
			color 0.25s ease;
	}

	.news-cta:hover,
	.news-cta:focus-visible {
		background: transparent;
		color: var(--sv-secondary-color);
		border-color: var(--sv-secondary-color);
		box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
	}

	.news-card {
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: visible;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
		--news-card-min-height: clamp(440px, 36vw, 560px);
		--news-card-offset: 0px;
		--news-card-overlap: -42px;
		--news-card-overlap-x: 18px;
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
		box-shadow: 0 18px 36px rgba(244, 208, 71, 0.35);
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

	.news-card-title {
		margin: 0;
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

	.news-card:nth-child(3n + 2) {
		--news-card-min-height: clamp(382px, 31vw, 452px);
		--news-card-offset: 24px;
		--news-card-overlap: -68px;
		--news-card-overlap-x: 28px;
		--news-excerpt-lines: 2;
	}

	.news-card:nth-child(3n + 3) {
		--news-card-offset: 10px;
		--news-card-overlap: -54px;
		--news-card-overlap-x: 24px;
	}

	.news-item {
		flex: 1 1 0;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		grid-template-areas: "text image";
		align-items: center;
		gap: clamp(16px, 3vw, 36px);
		background: rgba(255, 255, 255, 0.89);
		color: black;
		border: 1px solid var(--sv-card-border);
		min-height: clamp(180px, 22vh, 260px);
		overflow: hidden;
		width: 100dvw;
		transition:
			background-color 0.35s ease,
			border-color 0.35s ease,
			box-shadow 0.35s ease;
	}

	.news-item--reverse {
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		grid-template-areas: "image text";
	}

	.news-item--reverse .news-image {
		transform-origin: left center;
	}

	.news-text {
		grid-area: text;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: clamp(16px, 2.5vw, 28px);
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		cursor: pointer;
		text-decoration: none;
		color: inherit;
		transition: color 0.35s ease;
	}

	.news-item:nth-child(even) .news-text {
		border-top-right-radius: 40px;
		border-bottom-right-radius: 40px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.news-item:hover,
	.news-item:focus-within {
		background-color: var(--sv-secondary-color);
		border-color: rgba(244, 208, 71, 0.72);
	}

	.news-item:hover .news-text,
	.news-item:focus-within .news-text {
		color: var(--sv-primary-color);
	}

	.news-item:hover .news-image,
	.news-item:focus-within .news-image {
		transform: scale(1.2);
	}

	.news-item:hover .news-image-overlay,
	.news-item:focus-within .news-image-overlay {
		opacity: 1;
		transform: scale(1);
	}

	.news-image-frame {
		grid-area: image;
		width: 100%;
		height: 100%;
		min-height: 160px;
		position: relative;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.08);
		clip-path: polygon(0 100%, 0 0, 85% 0, 100% 100%);
		cursor: pointer;
		text-decoration: none;
	}

	.news-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1);
		transition: all 3s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform;
		transform-origin: right center;
	}

	.news-image-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(2, 43, 121, 0.35);
		opacity: 0;
		transform: scale(0.98);
		transition:
			opacity 0.35s ease,
			transform 0.35s ease;
		pointer-events: none;
	}

	.news-overlay-icon {
		width: 56px;
		height: 56px;
		stroke: var(--sv-secondary-color);
		stroke-width: 2.5;
		fill: none;
	}

	.news-item:nth-child(odd) .news-image-frame {
		clip-path: polygon(0 100%, 15% 0, 100% 0, 100% 100%);
	}

	.news-date {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.news-item-title {
		margin: 0;
		font-size: clamp(20px, 2vw, 28px);
		line-height: 1.25;
	}

	.news-excerpt {
		margin: 0;
		opacity: 0.85;
	}

	.news-item.news-item--mobile {
		display: none;
	}

	@media (max-width: 900px) {
		.news-pinboard {
			display: none;
		}

		.news-item.news-item--mobile {
			display: grid;
		}

		.section--news {
			justify-content: flex-start;
		}

		.section-header {
			padding: 38px 12px 0;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.section-title {
			font-size: 24px;
		}

		.news-item,
		.news-item--reverse {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				"image"
				"text";
		}

		.news-image-frame {
			height: clamp(180px, 40vw, 240px);
			clip-path: none;
		}

		.news-text,
		.news-item:nth-child(even) .news-text {
			border-radius: 0;
		}
	}

	@media (max-width: 640px) {
		.section {
			height: calc(100dvh - var(--sv-header-height));
			min-height: calc(100dvh - var(--sv-header-height));
			padding-top: 0;
			box-sizing: border-box;
			padding-left: 0;
		}

		.section--news {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			position: relative;
		}

		.section--news::before {
			content: "NEWS";
			position: absolute;
			left: -6px;
			top: 50%;
			transform: translateY(-50%) rotate(180deg);
			writing-mode: vertical-rl;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			font-family: "Marker Felt", "Brush Script MT", "Segoe Print", cursive;
			font-size: 9.5dvh;
			line-height: 0.9;
			font-weight: 800;
			color: var(--sv-secondary-color);
			opacity: 0.42;
			z-index: 3;
			pointer-events: none;
		}

		.section-header {
			display: none;
		}

		.mobile-section-cta {
			position: absolute;
			right: 14px;
			bottom: 26px;
			z-index: 4;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 42px;
			height: 42px;
			padding: 0;
			background: rgba(2, 43, 121, 0.82);
			border: 1px solid rgba(244, 208, 71, 0.72);
			border-radius: 999px;
			color: var(--sv-secondary-color);
			text-decoration: none;
			box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
		}

		.news-item,
		.news-item--reverse {
			position: relative;
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: "stack";
			width: 100dvw;
			min-height: 0;
			flex: 1 1 0;
			margin: 0;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: var(--sv-text-color);
			gap: 0;
		}

		.news-image-frame {
			grid-area: stack;
			position: relative;
			display: block;
			width: 100%;
			height: 100%;
			min-height: 100%;
			clip-path: none;
			z-index: 0;
		}

		.news-item:nth-child(odd) .news-image-frame {
			clip-path: none;
		}

		.news-text {
			grid-area: stack;
			position: relative;
			z-index: 2;
			justify-content: flex-end;
			min-height: 100%;
			gap: 8px;
			padding: 18px 16px 18px 20px;
			color: var(--sv-text-color);
			background: linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.78) 0%,
				rgba(0, 0, 0, 0.36) 52%,
				rgba(0, 0, 0, 0.08) 100%
			);
			border-radius: 0;
		}

		.news-item-title {
			font-size: 20px;
			line-height: 1.12;
		}

		.news-excerpt {
			display: none;
		}

		.news-date {
			color: var(--sv-secondary-color);
			opacity: 1;
		}

		.news-image {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			transform: scale(1.02);
		}

		.news-image-overlay {
			display: none;
		}

		.news-item:hover,
		.news-item:focus-within {
			background: transparent;
			border-color: transparent;
		}

		.news-item:hover .news-text,
		.news-item:focus-within .news-text {
			color: var(--sv-text-color);
		}

		.news-item:hover .news-image,
		.news-item:focus-within .news-image {
			transform: scale(1.02);
		}

		.section--news > .news-item {
			flex: 1 1 0;
		}
	}

	@media (min-width: 641px) {
		.mobile-section-cta {
			display: none;
		}
	}
</style>
