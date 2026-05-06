<template>
	<div
		class="team-page-shell"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
	>
		<PageHero
			class="team-page-hero"
			:image="newsHero"
			title="Unsere 2. Mannschaft"
			lead="Kreisklasse A"
			compact
		/>
		<TeamOneNav base-path="/teams/two" team-label="2. Mannschaft" />
		<div id="fp-widget_root-37aqKSilbQ7bjar6peFCZK5GfeX" class="fupa-widget">
			<a
				href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
				target="_blank"
				rel="noopener"
				>FSG Ottweiler-Steinbach auf FuPa</a
			>
		</div>

		<div
			id="fp-widget_root-3DIVtXz6mJl4c8t2DogIHCKgiqW"
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

	const { onTouchEnd, onTouchStart } = useTeamViewSwipe("/teams/two");
</script>

<style scoped>
	.team-page-hero {
		margin-bottom: 2dvh;
	}

	.fupa-widget {
		background: transparent !important;
		justify-items: center;
	}

	.fupa-widget * {
		justify-self: center;
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
