<template>
	<div class="team-page-shell" @touchstart="onTouchStart" @touchend="onTouchEnd">
		<PageHero
			class="team-page-hero"
			:image="newsHero"
			title="Unsere 1. Mannschaft"
			lead="Bezirksliga Ill/Theel"
			compact
		/>
		<TeamOneNav />
		<div id="fp-widget_root-37fxNnaiMg36erHcuTi0Z4mtOdT" class="fupa-widget">
		<a
			href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			target="_blank"
			rel="noopener"
			>FSG Ottweiler-Steinbach auf FuPa</a
		>
		</div>

		<div
			id="fp-widget_root-3DIJSgwApglLoZPryelyFBHPO6k"
			class="fupa-widget-mobile"
		>
		<a
			href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			target="_blank"
			rel="noopener"
			>FSG Ottweiler-Steinbach auf FuPa</a
		>
	</div>
	</div>
</template>

<script setup lang="ts">
	import PageHero from "@/components/PageHero.vue";
	import TeamOneNav from "@/components/TeamOneNav.vue";
	import newsHero from "@/assets/header/background.png";
	import { useTeamViewSwipe } from "@/composables/useTeamViewSwipe";

	const { onTouchEnd, onTouchStart } = useTeamViewSwipe("/teams/one");
</script>

<style scoped>
	.team-page-hero {
		margin-bottom: 2dvh;
	}

	.fupa-widget {
		justify-self: center;
		width: 80dvw;
		max-width: 80dvw;
		background: transparent !important;
	}

	.fupa-widget:nth-child(odd) {
		width: 80dvw !important;
		max-width: 80dvw !important;
	}

	.fupa-widget-mobile {
		display: none;
	}

	@media (max-width: 900px) {
		.team-page-hero {
			margin-bottom: 1dvh;
		}

		.fupa-widget {
			display: none;
		}
		.fupa-widget-mobile {
			display: block;
			justify-self: center;
			width: 100dvw;
			background: transparent !important;
			color: white !important;
		}
	}
</style>
