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

		<div id="fp-widget_root-3DIT44DmEUZtco9bQ4FO27yvKVP" class="fupa-widget">
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

	@media (max-width: 900px) {
		.team-page-hero {
			margin-bottom: 1dvh;
		}
	}
</style>
