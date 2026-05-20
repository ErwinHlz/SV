<template>
	<div class="team-page-shell" @touchstart="onTouchStart" @touchend="onTouchEnd">
		<PageHero
			class="team-page-hero"
			:image="newsHero"
			title="Unsere 2. Mannschaft"
			lead="Kreisklasse A"
			compact
		/>
		<TeamOneNav base-path="/teams/two" team-label="2. Mannschaft" />
		<ConsentControlledWidget
			provider="fupa"
			widget-id="fp-widget_root-37g8LGvo0BNWuS0kffhxzc5Xwo8"
			widget-class="fupa-widget"
			fallback-url="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			fallback-label="FSG Ottweiler-Steinbach auf FuPa"
			placeholder-title="FuPa Tabelle"
			placeholder-description="Die FuPa-Tabelle wird erst geladen, wenn du externe Inhalte zulässt."
		/>
		<ConsentControlledWidget
			provider="fupa"
			widget-id="fp-widget_root-3DIWXWVcROFpY0rxHiRKufqIF4z"
			widget-class="fupa-widget-mobile"
			fallback-url="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			fallback-label="FSG Ottweiler-Steinbach auf FuPa"
			placeholder-title="FuPa Tabelle"
			placeholder-description="Die mobile FuPa-Tabelle wird erst geladen, wenn du externe Inhalte zulässt."
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

	const { onTouchEnd, onTouchStart } = useTeamViewSwipe("/teams/two");
</script>

<style scoped>
	.team-page-hero {
		margin-bottom: 2dvh;
	}

	.fupa-widget * {
		justify-self: center;
		background: transparent;
		color: white;
		font-family: Georgia, "Times New Roman", Times, serif;
		gap: 5px;
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
			color: white !important;
		}
	}
</style>
