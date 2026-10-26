<template>
	<section v-if="training.length" class="team-training" aria-label="Trainingszeiten">
		<p class="team-training__label">Training</p>
		<ul class="team-training__list">
			<li v-for="slot in training" :key="`${slot.day}-${slot.time}-${slot.location}`">
				<strong>{{ slot.day }}</strong> · {{ slot.time }}<template v-if="slot.location"> · {{ slot.location }}</template>
			</li>
		</ul>
	</section>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import aktive from "@/content/aktive.json";

	const props = defineProps<{ teamId: string }>();

	const training = computed(
		() => aktive.teams.find((team) => team.id === props.teamId)?.training ?? [],
	);
</script>

<style scoped>
	.team-training {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		gap: 4px 16px;
		margin: 0 auto 2dvh;
		padding: 0 16px;
		color: var(--sv-text-color);
	}

	.team-training__label {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--sv-secondary-color);
	}

	.team-training__list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
