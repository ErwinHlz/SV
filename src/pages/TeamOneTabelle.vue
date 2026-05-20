<template>
	<div
		class="team-page-shell"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
	>
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
			widget-id="fp-widget_root-3DIT44DmEUZtco9bQ4FO27yvKVP"
			widget-class="fupa-widget"
			fallback-url="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			fallback-label="FSG Ottweiler-Steinbach auf FuPa"
			placeholder-title="FuPa Tabelle"
			placeholder-description="Die FuPa-Tabelle wird erst geladen, wenn du externe Inhalte zulässt."
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

	@media (max-width: 900px) {
		.team-page-hero {
			margin-bottom: 1dvh;
		}
	}
</style>
