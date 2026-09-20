<template>
	<div class="news-stage">
		<div class="section-header">
			<h2 class="section-title">Neuste News</h2>
			<RouterLink to="/news" class="section-cta" aria-label="Alle News">
				<Newspaper :size="22" :stroke-width="2.2" aria-hidden="true" />
			</RouterLink>
		</div>
		<HomeTileRow class="news-row" :items="rowItems" aria-label="Neuste News" />
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { Newspaper } from "@lucide/vue";
	import HomeTileRow from "@/components/HomeTileRow.vue";
	import { formatDate } from "@/utils/date";
	import { getNewsItems } from "@/utils/contentEntries";

	const newsItems = computed(() => getNewsItems());

	const rowItems = computed(() =>
		newsItems.value.slice(0, 3).map((item) => ({
			id: item.id,
			to: { name: "news-detail", params: { slug: item.slug } },
			img: item.image,
			kicker: formatDate(item.date),
			title: item.title,
		})),
	);
</script>

<style scoped>
	.news-stage {
		width: 100%;
	}

	.section-header {
		width: 88dvw;
		max-width: 1400px;
		margin: 0 auto clamp(16px, 2.4vw, 28px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.section-title {
		margin: 0;
		color: var(--sv-secondary-color);
		font-size: clamp(24px, 2.5vw, 30px);
		font-weight: 700;
		text-transform: uppercase;
	}

	.section-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		flex: 0 0 auto;
		padding: 0;
		border-radius: 999px;
		background: var(--sv-secondary-color);
		color: var(--sv-primary-color);
		text-decoration: none;
		border: 2px solid transparent;
		transition:
			background 0.25s ease,
			color 0.25s ease,
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.section-cta:hover,
	.section-cta:focus-visible {
		background: transparent;
		color: var(--sv-secondary-color);
		border-color: var(--sv-secondary-color);
		box-shadow: 0 12px 26px rgba(2, 43, 121, 0.18);
	}

	:deep(.news-row) {
		height: clamp(360px, 58dvh, 560px);
	}

	@media (max-width: 900px) {
		.news-stage {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-top: calc(var(--sv-header-height) + 18px);
			box-sizing: border-box;
		}

		.section-header {
			width: calc(100dvw - 32px);
			flex: 0 0 auto;
		}

		:deep(.news-row) {
			flex: 1;
			height: auto;
			min-height: 0;
		}
	}

	@media (max-width: 640px) {
		.news-stage {
			padding-top: calc(var(--sv-header-height) + 14px);
		}

		.section-header {
			width: calc(100dvw - 28px);
			margin-bottom: 14px;
		}

		.section-title {
			font-size: 22px;
		}
	}
</style>
