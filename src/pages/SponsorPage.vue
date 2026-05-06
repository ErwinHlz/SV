<template>
	<PageHero
		class="sponsor-page-hero"
		:image="sponsorHero"
		title="Sponsoren"
		lead="Danke an alle Partner, die unseren Verein unterstuetzen."
	/>
	<div class="sponsor-cta-wrap">
		<RouterLink to="/sponsor/werden" class="sponsor-cta">
			<span
				class="sponsor-cta__icon sponsor-cta__icon--lead"
				aria-hidden="true"
			>
				<Handshake style="width: 2rem; height: 2rem" />
			</span>
			<span class="sponsor-cta__label">Sponsor werden</span>
			<span
				class="sponsor-cta__icon sponsor-cta__icon--trail"
				aria-hidden="true"
			>
				<ArrowRight style="width: 2rem; height: 2rem" />
			</span>
		</RouterLink>
	</div>
	<section class="sponsor-grid" aria-label="Sponsoren">
		<a
			v-for="sponsor in sponsors"
			:key="sponsor.id"
			class="sponsor-card"
			:href="sponsor.url"
			target="_blank"
			rel="noopener"
			:aria-label="sponsor.name"
		>
			<div class="sponsor-logo">
				<img
					:src="sponsor.image"
					:alt="sponsor.imageAlt ?? sponsor.name"
					loading="lazy"
				/>
			</div>
			<div class="sponsor-name">
				<span>{{ sponsor.name }}</span>
				<ExternalLink aria-hidden="true" />
			</div>
		</a>
	</section>
	<div class="sponsor-cta-wrap sponsor-cta-wrap--bottom">
		<RouterLink to="/sponsor/werden" class="sponsor-cta">
			<span
				class="sponsor-cta__icon sponsor-cta__icon--lead"
				aria-hidden="true"
			>
				<Handshake />
			</span>
			<span class="sponsor-cta__label">Sponsor werden</span>
			<span
				class="sponsor-cta__icon sponsor-cta__icon--trail"
				aria-hidden="true"
			>
				<ArrowRight />
			</span>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
	import { computed } from "vue";
	import { ArrowRight, ExternalLink, Handshake } from "@lucide/vue";
	import PageHero from "@/components/PageHero.vue";
	import sponsorHero from "@/assets/header/background.png";
	import rawSponsors from "@/content/sponsor.json";
	import sponsorAlpha from "@/assets/sponsor/sponsor-alpha.svg";
	import sponsorBeta from "@/assets/sponsor/sponsor-beta.svg";
	import sponsorGamma from "@/assets/sponsor/sponsor-gamma.svg";
	import sponsorDelta from "@/assets/sponsor/sponsor-delta.svg";
	import sponsorEpsilon from "@/assets/sponsor/sponsor-epsilon.svg";
	import sponsorZeta from "@/assets/sponsor/sponsor-zeta.svg";

	const logoMap: Record<string, string> = {
		sponsorAlpha,
		sponsorBeta,
		sponsorGamma,
		sponsorDelta,
		sponsorEpsilon,
		sponsorZeta,
	};

	const sponsors = computed(() =>
		rawSponsors.map((sponsor) => ({
			...sponsor,
			image: logoMap[sponsor.image] ?? sponsor.image,
		})),
	);
</script>

<style scoped>
	.sponsor-grid {
		width: 80dvw;
		margin: 0 auto;
		padding: 0 clamp(18px, 8vw, 80px) clamp(48px, 8vw, 96px);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: clamp(16px, 2.5vw, 32px);
	}

	.sponsor-cta-wrap {
		width: 80dvw;
		margin: 0 auto 3dvh;
		display: flex;
		justify-content: center;
	}

	.sponsor-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		padding: 12px 20px 12px 16px;
		border-radius: 3px;
		background: linear-gradient(135deg, #f2d052 0%, #f8e48f 100%);
		color: var(--sv-primary-color);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		border: 1px solid rgba(201, 165, 40, 0.28);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease,
			color 0.25s ease;
	}

	.sponsor-cta__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.sponsor-cta__icon svg {
		width: 2rem;
		height: 2rem;
	}

	.sponsor-cta__icon--lead {
		width: 2rem;
		height: 2rem;
		color: var(--sv-primary-color);
	}

	.sponsor-cta__icon--trail {
		opacity: 1;
	}

	.sponsor-cta__label {
		line-height: 1;
	}

	.sponsor-cta:hover,
	.sponsor-cta:focus-visible {
		background: linear-gradient(135deg, #f8df74 0%, #fff0b1 100%);
		color: var(--sv-primary-color);
		border-color: rgba(2, 43, 121, 0.12);
		box-shadow: 0 18px 34px rgba(2, 43, 121, 0.2);
		transform: translateY(-2px);
	}

	.sponsor-card {
		display: grid;
		gap: 12px;
		align-items: center;
		padding: clamp(16px, 2vw, 24px);
		border-radius: 18px;
		text-decoration: none;
		color: var(--sv-text-color);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease,
			border-color 0.3s ease;
		filter: grayscale(1);
	}

	.sponsor-card:hover,
	.sponsor-card:focus-visible {
		transform: translateY(-6px);
		border-color: rgba(244, 208, 71, 0.7);
		filter: none;
	}

	.sponsor-card:focus-visible {
		outline: 2px solid var(--sv-secondary-color);
		outline-offset: 3px;
	}

	.sponsor-logo {
		width: 100%;
		aspect-ratio: 3 / 2;
		display: grid;
		place-items: center;
		padding: clamp(12px, 1.8vw, 18px);
		border-radius: 14px;

		overflow: hidden;
	}

	.sponsor-logo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.sponsor-name {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: clamp(11px, 1.1vw, 14px);
		font-weight: 700;
		color: var(--sv-secondary-color);
	}

	.sponsor-name svg {
		width: 0.85rem;
		height: 0.85rem;
		flex-shrink: 0;
	}

	.sponsor-cta-wrap--bottom {
		display: none;
	}

@media (max-width: 720px) {
  .sponsor-page-hero {
    min-height: 38svh;
  }

		.sponsor-grid,
		.sponsor-cta-wrap {
			width: calc(100dvw - 24px);
		}

		.sponsor-cta-wrap {
			margin: -2.25rem auto 1.25rem;
			position: relative;
			z-index: 2;
		}

		.sponsor-cta {
			width: 80%;
			min-height: 3.7rem;
			justify-content: space-between;
			padding: 0.95rem 1rem 0.95rem 0.9rem;
			background: linear-gradient(135deg, #efc948 0%, #f6dc7a 100%);
			color: var(--sv-primary-color);
			border: 1px solid rgba(201, 165, 40, 0.24);
			letter-spacing: 0.1em;
			box-shadow: 0 1rem 2rem rgba(2, 43, 121, 0.22);
			font-size: 0.875rem;
			border-radius: 3px;
		}

		.sponsor-cta__icon--lead {
			width: 2.2rem;
			height: 2.2rem;
			color: var(--sv-primary-color);
		}

		.sponsor-cta:hover,
		.sponsor-cta:focus-visible {
			background: linear-gradient(135deg, #f6d964 0%, #ffefab 100%);
			color: var(--sv-primary-color);
			border-color: rgba(2, 43, 121, 0.12);
			box-shadow: 0 1rem 2rem rgba(2, 43, 121, 0.24);
		}

  .sponsor-grid {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 2rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .sponsor-card {
    filter: none;
  }

  .sponsor-cta-wrap--bottom {
    display: flex;
    margin: 0 auto 2rem;
  }
	}

	@media (max-width: 520px) {
		.sponsor-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
