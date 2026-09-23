<template>
	<div
		class="team-page-shell"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
	>
		<PageHero
			class="team-page-hero"
			title="Unsere 1. Mannschaft"
			lead="Bezirksliga Ill/Theel"
			compact
		/>
		<TeamOneNav />
		<ConsentControlledWidget
			provider="fupa"
			:widget-id="externalLinks.fupa.widgets.teamOne.tabelle.desktop"
			widget-class="fupa-widget"
			:fallback-url="externalLinks.fupa.clubUrl"
			:fallback-label="externalLinks.fupa.fallbackLabel"
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
	import externalLinks from "@/content/external-links.json";
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
