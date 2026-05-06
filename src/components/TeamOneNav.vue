<template>
	<nav class="team-nav" :aria-label="`${teamLabel} Navigation`">
		<div class="team-nav-shell" role="list">
			<RouterLink
				v-for="item in items"
				:key="item.slug"
				class="team-nav-link"
				:to="`${normalizedBase}/${item.slug}`"
				role="listitem"
			>
				{{ item.label }}
			</RouterLink>
		</div>
	</nav>
</template>

<script setup lang="ts">
	import { computed } from "vue";

	const props = withDefaults(
		defineProps<{
			basePath?: string;
			teamLabel?: string;
		}>(),
		{
			basePath: "/teams/one",
			teamLabel: "1. Mannschaft",
		},
	);

	const normalizedBase = computed(() => props.basePath.replace(/\/$/, ""));

	const items = [
		{ label: "Kader", slug: "kader" },
		{ label: "Spielplan", slug: "spielplan" },
		{ label: "Tabelle", slug: "tabelle" },
	];
</script>

<style scoped>
	.team-nav {
		margin: -2dvh auto 3dvh;
		padding: 0 clamp(16px, 6vw, 48px);
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 1;
	}

	.team-nav-shell {
		width: min(1080px, 100%);
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0;
		padding: 0;
		background: black;
		position: relative;
		overflow: hidden;
		animation: team-nav-rise 0.6s ease both;
	}

	.team-nav-link {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 58px;
		padding: 14px 18px;
		border-radius: 0;
		white-space: nowrap;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		font-size: clamp(11px, 1.25vw, 14px);
		color: var(--sv-text-color);
		text-decoration: none;

		border-right: 1px solid rgba(255, 255, 255, 0.698);
		transition:
			transform 0.2s ease,
			color 0.25s ease,
			box-shadow 0.25s ease,
			border-color 0.25s ease;
	}

	.team-nav-link:last-child {
		border-right: 0;
	}

	.team-nav-link:hover,
	.team-nav-link:focus-visible {
		color: var(--sv-secondary-color);
		background: rgba(255, 255, 255, 0.08);
	}

	.team-nav-link.is-active,
	.team-nav-link.is-exact-active {
		color: var(--sv-secondary-color);
		border-bottom: 1px dotted var(--sv-secondary-color);
	}

	@media (prefers-reduced-motion: reduce) {
		.team-nav-shell {
			animation: none;
		}

		.team-nav-link {
			transition: none;
		}
	}

	@media (max-width: 768px) {
		.team-nav {
			margin-top: 0dvh;
			padding: 0;
		}

		.team-nav-shell {
			width: 100%;
			border-radius: 0px;
		}

		.team-nav-link {
			min-height: 50px;
			padding: 12px 10px;
			letter-spacing: 0.08em;
			font-size: 12px;
		}
	}
</style>
