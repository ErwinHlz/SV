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
		<div id="fp-widget_root-37g8LGvo0BNWuS0kffhxzc5Xwo8" class="fupa-widget">
		<a
			href="https://www.fupa.net/club/fsg-ottweiler-steinbach"
			target="_blank"
			rel="noopener"
			>FSG Ottweiler-Steinbach auf FuPa</a
		>
		</div>
		<div
			id="fp-widget_root-3DIWXWVcROFpY0rxHiRKufqIF4z"
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
