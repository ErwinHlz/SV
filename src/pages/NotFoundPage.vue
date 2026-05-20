<template>
	<section class="not-found-page">
		<div class="not-found-shell">
			<div class="not-found-spotlight" aria-hidden="true"></div>

			<div class="not-found-art" aria-hidden="true">
				<div class="not-found-cloud"></div>

				<div class="not-found-mascot">
					<span class="not-found-arm not-found-arm--left"></span>
					<span class="not-found-arm not-found-arm--right"></span>
					<span class="not-found-card"></span>

					<img class="not-found-logo" :src="logoImage" alt="" />

					<span class="not-found-leg not-found-leg--left"></span>
					<span class="not-found-leg not-found-leg--right"></span>
				</div>

				<div class="not-found-window">
					<span></span>
					<span></span>
					<span></span>
					<div class="not-found-code">404</div>
				</div>
			</div>

			<p class="not-found-kicker">Seite nicht gefunden</p>
			<h1 class="not-found-title"><span>PLATZVERWEIS!</span></h1>

			<div class="not-found-hint">
				<span class="not-found-sign" aria-hidden="true">!</span>
				<p>
					Der aufgerufene Link ist nicht mehr im Spiel. Wechsel einfach zur
					Startseite.
				</p>
			</div>

			<div class="not-found-actions">
				<RouterLink class="not-found-button not-found-button--primary" to="/">
					Zur Startseite
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import logoImage from "@/assets/sv_logo_farbe.svg";
</script>

<style scoped>
	.not-found-page {
		min-height: calc(100dvh - var(--sv-header-height));
		display: grid;
		place-items: center;
		padding: clamp(28px, 5vw, 56px) 18px;
	}

	.not-found-shell {
		--sv-blue: #022b79;
		--sv-yellow: #f2cf48;
		--sv-red: #c91f26;
		--sv-ink: #f7f5ef;

		position: relative;
		isolation: isolate;
		overflow: hidden;
		width: min(100%, 880px);
		margin: 0 auto;
		padding: clamp(34px, 5vw, 48px) clamp(20px, 4vw, 34px);
		border-radius: 34px;

		text-align: center;
		color: var(--sv-ink);
	}

	.not-found-spotlight {
		position: absolute;
		inset: auto 50% 110px;
		width: 320px;
		height: 70px;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.34), transparent 72%);
		transform: translateX(-50%);
		filter: blur(10px);
	}

	.not-found-shell::before,
	.not-found-shell::after {
		content: "";
		position: absolute;
		z-index: -1;
		width: 180px;
		height: 70px;
		border-bottom: 3px dashed rgba(244, 208, 71, 0.16);
		border-radius: 50%;
	}

	.not-found-shell::before {
		top: 94px;
		left: 80px;
		transform: rotate(-16deg);
	}

	.not-found-shell::after {
		top: 94px;
		right: 80px;
		transform: rotate(16deg);
	}

	.not-found-art {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1.6rem;
		min-height: 270px;
		margin-bottom: 1.9rem;
	}

	.not-found-cloud {
		justify-self: end;
		position: relative;
		width: 166px;
		height: 64px;
		border: 4px solid rgba(229, 231, 235, 0.72);
		border-radius: 999px;

		transform: translateY(12px) rotate(-4deg);
		box-shadow: 0 10px 18px rgba(0, 0, 0, 0.1);
	}

	.not-found-cloud::before,
	.not-found-cloud::after {
		content: "";
		position: absolute;
		bottom: 24px;

		border: 4px solid rgba(229, 231, 235, 0.72);
		border-bottom: 0;
		border-radius: 999px 999px 0 0;
	}

	.not-found-cloud::before {
		left: 26px;
		width: 50px;
		height: 45px;
	}

	.not-found-cloud::after {
		right: 26px;
		width: 62px;
		height: 58px;
	}

	.not-found-mascot {
		position: relative;
		width: 212px;
		height: 236px;
		display: grid;
		place-items: center;
	}

	.not-found-logo {
		position: relative;
		z-index: 3;
		width: 188px;
		height: 188px;
		object-fit: contain;
		border-radius: 50%;
		filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.24))
			drop-shadow(0 0 26px rgba(244, 208, 71, 0.12));
		animation: not-found-bob 5.8s ease-in-out infinite;
	}

	.not-found-arm {
		position: absolute;
		top: 114px;
		width: 68px;
		height: 16px;
		background: var(--sv-yellow);
		border-radius: 999px;
		z-index: 1;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.14);
	}

	.not-found-arm::after {
		content: "";
		position: absolute;
		top: -12px;
		width: 32px;
		height: 32px;
		border: 4px solid #f8fafc;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.95);
	}

	.not-found-arm--left {
		left: -20px;
		transform: rotate(-28deg);
	}

	.not-found-arm--left::after {
		left: -12px;
	}

	.not-found-arm--right {
		right: -18px;
		transform: rotate(28deg);
	}

	.not-found-arm--right::after {
		right: -12px;
	}

	.not-found-card {
		position: absolute;
		top: 80px;
		right: -25px;
		width: 38px;
		height: 52px;
		border-radius: 8px;
		background: linear-gradient(180deg, #ef4444, var(--sv-red));
		border: 4px solid rgba(248, 250, 252, 0.9);
		box-shadow:
			0 10px 18px rgba(0, 0, 0, 0.18),
			0 0 0 2px rgba(17, 24, 39, 0.18);
		transform: rotate(18deg);
		z-index: 4;
	}

	.not-found-leg {
		position: absolute;
		bottom: 8px;
		width: 18px;
		height: 58px;
		background: var(--sv-yellow);
		border-radius: 999px;
		z-index: 1;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.14);
	}

	.not-found-leg::after {
		content: "";
		position: absolute;
		bottom: -13px;
		width: 52px;
		height: 20px;
		background: rgba(255, 255, 255, 0.96);
		border: 4px solid #f8fafc;
		border-radius: 999px;
	}

	.not-found-leg--left {
		left: 58px;
	}

	.not-found-leg--left::after {
		right: -4px;
	}

	.not-found-leg--right {
		right: 58px;
	}

	.not-found-leg--right::after {
		left: -4px;
	}

	.not-found-window {
		justify-self: start;
		position: relative;
		width: 190px;
		height: 132px;
		border: 4px solid rgba(248, 250, 252, 0.7);
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 32px 0 rgba(255, 255, 255, 0.06);
		transform: rotate(3deg) translateY(4px);
	}

	.not-found-window span {
		position: absolute;
		top: 13px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(248, 250, 252, 0.5);
	}

	.not-found-window span:nth-child(1) {
		left: 16px;
	}

	.not-found-window span:nth-child(2) {
		left: 32px;
	}

	.not-found-window span:nth-child(3) {
		left: 48px;
	}

	.not-found-code {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: clamp(2rem, 5vw, 3.4rem);
		font-weight: 900;
		letter-spacing: 0.08em;
		color: var(--sv-red);
		text-shadow: 0 4px 14px rgba(0, 0, 0, 0.24);
	}

	.not-found-kicker {
		margin: 0 0 0.6rem;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--sv-yellow);
	}

	.not-found-title {
		margin: 0;
		font-size: clamp(2.4rem, 6vw, 4.9rem);
		line-height: 0.92;
		letter-spacing: 0.015em;
		font-weight: 800;
		text-wrap: balance;
	}

	.not-found-title span {
		color: #ffcc4d;
	}

	.not-found-hint {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		max-width: 620px;
		margin-top: 1.9rem;
		padding: 1.1rem 1.35rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.06);
		box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
	}

	.not-found-hint p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
		text-align: left;
		color: rgba(247, 245, 239, 0.88);
	}

	.not-found-sign {
		flex: 0 0 46px;
		width: 46px;
		height: 46px;
		display: inline-grid;
		place-items: center;
		border-radius: 50%;
		background: rgba(201, 31, 38, 0.18);
		border: 2px solid rgba(255, 255, 255, 0.16);
		color: #fff;
		font-size: 24px;
		font-weight: 900;
	}

	.not-found-actions {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 1.75rem;
	}

	.not-found-button {
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
		transition:
			transform 0.22s ease,
			box-shadow 0.22s ease,
			background-color 0.22s ease,
			border-color 0.22s ease;
	}

	.not-found-button:hover {
		transform: translateY(-2px);
	}

	.not-found-button--primary {
		border: 0;
		background: var(--sv-yellow);
		color: #07122c;
		box-shadow: 0 10px 22px rgba(244, 208, 71, 0.22);
	}

	@keyframes not-found-bob {
		0%,
		100% {
			transform: translateY(0) rotate(-0.35deg);
		}

		50% {
			transform: translateY(-3px) rotate(0.35deg);
		}
	}

	@media (max-width: 700px) {
		.not-found-page {
			min-height: auto;
			padding: calc(var(--sv-header-height) + 24px) 14px 28px;
		}

		.not-found-shell {
			padding: 28px 16px 24px;
			border-radius: 28px;
		}

		.not-found-art {
			grid-template-columns: 1fr;
			gap: 1rem;
			min-height: auto;
		}

		.not-found-cloud,
		.not-found-window {
			display: none;
		}

		.not-found-mascot {
			margin-inline: auto;
			transform: scale(0.96);
		}

		.not-found-hint {
			align-items: flex-start;
		}

		.not-found-actions {
			display: grid;
		}
	}
</style>
