<template>
	<section class="sv-fallback" role="status" aria-live="polite">
		<div class="sv-fallback__spotlight" aria-hidden="true"></div>
		<div class="sv-fallback__art" aria-hidden="true">
			<div class="sv-cloud"></div>

			<div class="sv-mascot">
				<span class="sv-arm sv-arm--left"></span>
				<span class="sv-arm sv-arm--right"></span>

				<img class="sv-logo" :src="logoImage" alt="" />

				<span class="sv-leg sv-leg--left"></span>
				<span class="sv-leg sv-leg--right"></span>
			</div>

			<div class="sv-window">
				<span></span>
				<span></span>
				<span></span>
				<div class="sv-x"></div>
			</div>
		</div>

		<h2 class="sv-fallback__title">
			Externe Inhalte<br />
			<span>nicht geladen</span>
		</h2>

		<div class="sv-fallback__hint">
			<span class="sv-gear" aria-hidden="true"></span>
			<p>
				Du kannst externe Inhalte in den
				<strong>Datenschutzeinstellungen</strong>
				aktivieren.
			</p>
		</div>

		<div class="sv-fallback__actions">
			<button
				type="button"
				class="sv-fallback__button sv-fallback__button--primary"
				@click="openCookieSettings"
			>
				Einstellungen öffnen
			</button>
			<a
				v-if="fallbackUrl"
				class="sv-fallback__button sv-fallback__button--ghost"
				:href="fallbackUrl"
				target="_blank"
				rel="noopener noreferrer"
			>
				Beim Anbieter ansehen
			</a>
		</div>
	</section>
</template>

<script setup lang="ts">
	import logoImage from "@/assets/sv_logo_farbe.svg";
	import { openCookieSettings } from "@/composables/useCookieConsent";

	defineProps<{
		title?: string;
		description?: string;
		fallbackUrl?: string;
	}>();
</script>

<style scoped>
	.sv-fallback {
		--sv-blue: #022b79;
		--sv-yellow: #f2cf48;
		--sv-red: #c91f26;
		--sv-ink: #111827;
		--sv-soft: #f7f4ee;
		--sv-line: #d7d7d7;

		position: relative;
		isolation: isolate;
		overflow: hidden;
		max-width: 760px;
		margin: 2rem auto;
		padding: 3rem 2rem 2.25rem;
		border-radius: 34px;
		background: transparent;
		box-shadow:
			0 24px 54px rgba(2, 43, 121, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
		text-align: center;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
		color: var(--sv-ink);
	}

	.sv-fallback__spotlight {
		position: absolute;
		inset: auto 50% 98px;
		width: 280px;
		height: 60px;
		background: radial-gradient(
			circle,
			rgba(17, 24, 39, 0.18),
			transparent 72%
		);
		transform: translateX(-50%);
		filter: blur(10px);
	}

	.sv-fallback::before,
	.sv-fallback::after {
		content: "";
		position: absolute;
		z-index: -1;
		width: 180px;
		height: 70px;
		border-bottom: 3px dashed rgba(2, 43, 121, 0.22);
		border-radius: 50%;
	}

	.sv-fallback::before {
		top: 90px;
		left: 90px;
		transform: rotate(-18deg);
	}

	.sv-fallback::after {
		top: 90px;
		right: 90px;
		transform: rotate(18deg);
	}

	.sv-fallback__art {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.5rem;
		min-height: 260px;
		margin-bottom: 1.8rem;
	}

	.sv-cloud {
		justify-self: end;
		position: relative;
		width: 166px;
		height: 64px;
		border: 4px solid #9ca3af;
		border-radius: 999px;
		background: #e5e7eb;
		transform: translateY(12px) rotate(-4deg);
		box-shadow: 0 10px 18px rgba(17, 24, 39, 0.08);
	}

	.sv-cloud::before,
	.sv-cloud::after {
		content: "";
		position: absolute;
		bottom: 24px;
		background: #e5e7eb;
		border: 4px solid #9ca3af;
		border-bottom: 0;
		border-radius: 999px 999px 0 0;
	}

	.sv-cloud::before {
		left: 26px;
		width: 50px;
		height: 45px;
	}

	.sv-cloud::after {
		right: 26px;
		width: 62px;
		height: 58px;
	}

	.sv-mascot {
		position: relative;
		width: 212px;
		height: 236px;
		display: grid;
		place-items: center;
	}

	.sv-logo {
		position: relative;
		z-index: 3;
		width: 188px;
		height: 188px;
		object-fit: contain;
		border-radius: 50%;
		filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.2))
			drop-shadow(0 0 22px rgba(242, 207, 72, 0.18));
		animation: sv-bob 5.4s ease-in-out infinite;
	}

	.sv-arm {
		position: absolute;
		top: 114px;
		width: 68px;
		height: 16px;
		background: var(--sv-secondary-color);
		border-radius: 999px;
		z-index: 1;
		box-shadow: 0 4px 0 rgba(17, 24, 39, 0.12);
	}

	.sv-arm::after {
		content: "";
		position: absolute;
		top: -12px;
		width: 32px;
		height: 32px;
		border: 4px solid var(--sv-ink);
		border-radius: 50%;
		background: #fff;
	}

	.sv-arm--left {
		left: -20px;
		transform: rotate(-28deg);
	}

	.sv-arm--left::after {
		left: -12px;
	}

	.sv-arm--right {
		right: -18px;
		transform: rotate(28deg);
	}

	.sv-arm--right::after {
		right: -12px;
	}

	.sv-leg {
		position: absolute;
		bottom: 8px;
		width: 18px;
		height: 58px;
		background: var(--sv-secondary-color);
		border-radius: 999px;
		z-index: 1;
		box-shadow: 0 4px 0 rgba(17, 24, 39, 0.12);
	}

	.sv-leg::after {
		content: "";
		position: absolute;
		bottom: -13px;
		width: 52px;
		height: 20px;
		background: #fff;
		border: 4px solid var(--sv-ink);
		border-radius: 999px;
	}

	.sv-leg--left {
		left: 58px;
	}

	.sv-leg--left::after {
		right: -4px;
	}

	.sv-leg--right {
		right: 58px;
	}

	.sv-leg--right::after {
		left: -4px;
	}

	.sv-window {
		justify-self: start;
		position: relative;
		width: 190px;
		height: 132px;
		border: 4px solid rgba(17, 24, 39, 0.75);
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.75);
		box-shadow: inset 0 32px 0 rgba(17, 24, 39, 0.08);
		transform: rotate(3deg) translateY(4px);
	}

	.sv-window span {
		position: absolute;
		top: 13px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(17, 24, 39, 0.5);
	}

	.sv-window span:nth-child(1) {
		left: 16px;
	}

	.sv-window span:nth-child(2) {
		left: 32px;
	}

	.sv-window span:nth-child(3) {
		left: 48px;
	}

	.sv-x {
		position: absolute;
		left: 50%;
		top: 66%;
		width: 104px;
		height: 18px;
		background: var(--sv-red);
		border: 3px solid var(--sv-ink);
		border-radius: 999px;
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.sv-x::after {
		content: "";
		position: absolute;
		inset: -3px;
		background: var(--sv-red);
		border: 3px solid var(--sv-ink);
		border-radius: 999px;
		transform: rotate(90deg);
	}

	.sv-fallback__title {
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 4.9rem);
		line-height: 0.92;
		letter-spacing: 0.015em;
		font-weight: 800;
		color: white;
		text-wrap: balance;
	}

	.sv-fallback__title span {
		color: var(--sv-red);
	}

	.sv-fallback__hint {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		max-width: 610px;
		margin-top: 2rem;
		padding: 1.1rem 1.35rem;
		border: 3px solid rgba(2, 43, 121, 0.14);
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.68);
		box-shadow: 0 10px 22px rgba(2, 43, 121, 0.08);
	}

	.sv-fallback__hint p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.45;
		text-align: left;
	}

	.sv-fallback__hint strong {
		color: var(--sv-red);
	}

	.sv-gear {
		position: relative;
		flex: 0 0 46px;
		width: 46px;
		height: 46px;
		border: 4px solid var(--sv-ink);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			transparent 0 9px,
			var(--sv-red) 10px 13px,
			transparent 14px
		);
	}

	.sv-gear::before,
	.sv-gear::after {
		content: "";
		position: absolute;
		inset: -8px 17px;
		background: var(--sv-ink);
		border-radius: 4px;
	}

	.sv-gear::after {
		transform: rotate(90deg);
	}

	.sv-fallback__actions {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 1.75rem;
	}

	.sv-fallback__button {
		min-height: 44px;
		padding: 0 20px;
		border-radius: 999px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font: inherit;
		font-size: 0.95rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.22s ease,
			box-shadow 0.22s ease,
			background-color 0.22s ease,
			border-color 0.22s ease;
	}

	.sv-fallback__button:hover {
		transform: translateY(-2px);
	}

	.sv-fallback__button--primary {
		border: 0;
		background: var(--sv-blue);
		color: #fff;
		box-shadow: 0 10px 22px rgba(2, 43, 121, 0.24);
	}

	.sv-fallback__button--ghost {
		border: 2px solid rgba(2, 43, 121, 0.22);
		background: rgba(255, 255, 255, 0.72);
		color: var(--sv-ink);
	}

	@keyframes sv-bob {
		0%,
		100% {
			transform: translateY(0) rotate(-0.35deg);
		}

		50% {
			transform: translateY(-3px) rotate(0.35deg);
		}
	}

	@media (max-width: 650px) {
		.sv-fallback {
			padding: 2rem 1rem 1.5rem;
			border-radius: 26px;
		}

		.sv-fallback__art {
			grid-template-columns: 1fr;
			gap: 1rem;
			min-height: auto;
		}

		.sv-cloud,
		.sv-window {
			display: none;
		}

		.sv-mascot {
			margin-inline: auto;
			transform: scale(0.96);
		}

		.sv-fallback__hint {
			align-items: flex-start;
		}

		.sv-fallback__actions {
			display: grid;
		}
	}
</style>
