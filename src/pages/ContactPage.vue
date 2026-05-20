<template>
	<section class="contact-page">
		<section class="contact-hero" aria-labelledby="contact-hero-title">
			<div class="contact-hero__media" aria-hidden="true">
				<img :src="contactHero" alt="" />
			</div>
			<div class="contact-hero__overlay" aria-hidden="true"></div>
			<div class="contact-hero__content">
				<p class="contact-eyebrow">Kontakt</p>
				<h1 id="contact-hero-title" class="contact-hero__title">
					Schreib uns eine Nachricht
				</h1>
			</div>
		</section>

		<div class="contact-shell">
			<div class="contact-mobile-intro">
				<p class="contact-eyebrow">Kontakt</p>
				<h1 class="contact-mobile-title">Schreib uns eine Nachricht</h1>
			</div>

			<form class="contact-form" @submit.prevent="handleContactSubmit">
				<div class="contact-form__row">
					<label>
						Name
						<input
							v-model="contactForm.name"
							type="text"
							name="name"
							autocomplete="name"
							required
						/>
					</label>

					<label>
						E-Mail
						<input
							v-model="contactForm.email"
							type="email"
							name="email"
							autocomplete="email"
							required
						/>
					</label>
				</div>

				<label>
					Betreff
					<input
						v-model="contactForm.subject"
						type="text"
						name="subject"
						placeholder="z. B. Mitgliedschaft, Mannschaft, Veranstaltung"
						required
					/>
				</label>

				<label>
					Nachricht
					<textarea
						v-model="contactForm.message"
						name="message"
						rows="8"
						placeholder="Hallo, ich möchte mich gern wegen ... melden."
						required
					/>
				</label>

				<button type="submit" class="contact-submit">
					Nachricht an den Verein senden
				</button>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import contactHero from "@/assets/header/background.png";

	const contactEmail = "erwinholzhauser.eh@gmail.com";

	const contactForm = ref({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

const handleContactSubmit = () => {
  const subject = `Kontaktanfrage - ${contactForm.value.subject}`;
  const body = [
    contactForm.value.message,
    "",
    `Name: ${contactForm.value.name}`,
    `E-Mail: ${contactForm.value.email}`,
  ].join("\n");

		window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
			subject,
		)}&body=${encodeURIComponent(body)}`;
	};
</script>

<style scoped>
	.contact-page {
		min-height: calc(100dvh - var(--sv-header-height));
		color: var(--sv-text-color);
	}

	.contact-shell {
		width: min(760px, 100%);
		margin: 0 auto;
		display: grid;
		gap: 24px;
		padding: clamp(32px, 6vw, 72px) 18px;
	}

	.contact-mobile-intro {
		display: none;
	}

	.contact-hero {
		position: relative;
		min-height: clamp(220px, 30dvh, 340px);
		display: grid;
		align-items: end;
		padding: clamp(32px, 6vw, 72px) 18px;
		overflow: hidden;
	}

	.contact-hero__media,
	.contact-hero__overlay {
		position: absolute;
		inset: 0;
	}

	.contact-hero__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.contact-hero__overlay {
		background:
			linear-gradient(180deg, rgba(3, 9, 22, 0.28), rgba(3, 9, 22, 0.84)),
			linear-gradient(120deg, rgba(2, 43, 121, 0.5), rgba(3, 9, 22, 0.2));
	}

	.contact-hero__content {
		position: relative;
		width: min(760px, 100%);
		margin: 0 auto;
		display: grid;
		gap: 12px;
	}

	.contact-hero__title {
		margin: 0;
		font-size: clamp(40px, 7vw, 72px);
		line-height: 0.94;
	}

	.contact-hero__lead {
		margin: 0;
		max-width: 40ch;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.65;
	}

	.contact-intro {
		display: grid;
		gap: 10px;
	}

	.contact-eyebrow {
		margin: 0;
		color: var(--sv-secondary-color);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.contact-title {
		margin: 0;
		font-size: clamp(34px, 5vw, 52px);
		line-height: 1;
	}

	.contact-lead {
		margin: 0;
		max-width: 44ch;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.65;
	}

	.contact-form {
		display: grid;
		gap: 18px;
		padding: clamp(20px, 3vw, 30px);
		border-radius: 28px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(7, 18, 44, 0.72);
		box-shadow: 0 18px 36px rgba(0, 0, 0, 0.14);
	}

	.contact-form__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
	}

	.contact-form label {
		display: grid;
		gap: 8px;
		font-size: 14px;
		font-weight: 600;
	}

	.contact-form input,
	.contact-form textarea {
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		padding: 14px 16px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.05);
		color: var(--sv-text-color);
		font: inherit;
	}

	.contact-form input::placeholder,
	.contact-form textarea::placeholder {
		color: rgba(255, 255, 255, 0.42);
	}

	.contact-form input:focus,
	.contact-form textarea:focus {
		outline: 2px solid rgba(244, 208, 71, 0.35);
		border-color: rgba(244, 208, 71, 0.35);
	}

.contact-submit {
  min-height: 48px;
  width: fit-content;
  padding: 0 22px;
  border: 2px solid transparent;
  border-radius: 999px;
  background: var(--sv-secondary-color);
  color: #07122c;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition:
    background-color 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease;
}

.contact-submit:hover,
.contact-submit:focus-visible {
  background: transparent;
  color: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
}

.contact-submit:focus-visible {
  outline: 2px solid rgba(244, 208, 71, 0.42);
  outline-offset: 3px;
}

	.contact-note {
		margin: 0;
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.72);
	}

	@media (max-width: 700px) {
		.contact-page {
			min-height: 100dvh;
			display: flex;
			align-items: stretch;
		}

		.contact-hero {
			display: none;
		}

		.contact-shell {
			width: 100%;
			min-height: 100dvh;
			gap: 16px;
			align-content: center;
			padding: calc(var(--sv-header-height) + 18px) 14px 20px;
		}

		.contact-mobile-intro {
			display: grid;
			gap: 6px;
		}

		.contact-mobile-title {
			margin: 0;
			font-size: clamp(28px, 9vw, 38px);
			line-height: 0.98;
		}

		.contact-title {
			font-size: 34px;
		}

		.contact-form {
			gap: 14px;
			padding: 16px 14px;
			border-radius: 22px;
		}

		.contact-form__row {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.contact-form label {
			gap: 6px;
			font-size: 13px;
		}

		.contact-form input,
		.contact-form textarea {
			padding: 12px 14px;
			border-radius: 16px;
		}

		.contact-form textarea {
			min-height: 160px;
		}

		.contact-submit {
			width: 100%;
			min-height: 44px;
		}
	}
</style>
