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
		<ConsentControlledWidget
			provider="fupa"
			widget-id="fp-widget_root-37fxNnaiMg36erHcuTi0Z4mtOdT"
			widget-class="fupa-widget"
			fallback-url="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			fallback-label="FSG Ottweiler-Steinbach auf FuPa"
			placeholder-title="FuPa Spielplan"
			placeholder-description="Der FuPa-Spielplan wird erst geladen, wenn du externe Inhalte zulässt."
		/>

		<ConsentControlledWidget
			provider="fupa"
			widget-id="fp-widget_root-3DIJSgwApglLoZPryelyFBHPO6k"
			widget-class="fupa-widget-mobile"
			fallback-url="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			fallback-label="FSG Ottweiler-Steinbach auf FuPa"
			placeholder-title="FuPa Spielplan"
			placeholder-description="Der mobile FuPa-Spielplan wird erst geladen, wenn du externe Inhalte zulässt."
		/>
		<InlineSponsorAdSection />
	</div>
</template>

<script setup lang="ts">
	import InlineSponsorAdSection from "@/components/InlineSponsorAdSection.vue";
	import PageHero from "@/components/PageHero.vue";
	import ConsentControlledWidget from "@/components/ConsentControlledWidget.vue";
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
