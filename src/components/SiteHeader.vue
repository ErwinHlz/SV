<template>
	<header
		class="header-container sticky w-100dvw xl:h-[10dvh] flex items-center justify-between pl-4 md:pl-8 min-[1040px]:pl-12 xl:pl-50"
	>
		<RouterLink to="/" class="logo">
			<svg class="flex items-start fill-current">
				<use :href="logo" />
			</svg>
		</RouterLink>
		<nav class="nav">
			<ul class="nav-list">
				<li v-for="item in items" :key="item.label" class="nav-item">
					<!-- Normaler Link -->
					<RouterLink
						v-if="item.to && !item.children?.length"
						:to="item.to"
						class="link"
						active-class="active"
					>
						{{ item.label }}
					</RouterLink>

					<!-- Dropdown -->
					<div v-else-if="item.children?.length" class="dropdown">
						<RouterLink
							v-if="item.to"
							:to="item.to"
							class="dropdown-btn"
							:class="{ active: isItemActive(item) }"
							@mouseenter="showDropdown(item.label)"
							@mouseleave="scheduleCloseDropdown"
							@click="open = null"
						>
							<span>{{ item.label }}</span>
							<span class="dropdown-chevron" aria-hidden="true">
								<ChevronUp
									v-if="open === item.label"
									:size="16"
									:stroke-width="2.2"
								/>
								<ChevronDown v-else :size="16" :stroke-width="2.2" />
							</span>
						</RouterLink>
						<button
							v-else
							type="button"
							class="dropdown-btn"
							:class="{ active: isItemActive(item) }"
							@mouseenter="showDropdown(item.label)"
							@mouseleave="scheduleCloseDropdown"
						>
							<span>{{ item.label }}</span>
							<span class="dropdown-chevron" aria-hidden="true">
								<ChevronUp
									v-if="open === item.label"
									:size="16"
									:stroke-width="2.2"
								/>
								<ChevronDown v-else :size="16" :stroke-width="2.2" />
							</span>
						</button>

						<ul
							v-if="open === item.label"
							class="dropdown-menu"
							@mouseenter="showDropdown(item.label)"
							@mouseleave="scheduleCloseDropdown"
						>
							<li class="dropdown-title">{{ item.label }}</li>
							<li class="dropdown-items">
								<template v-for="child in item.children" :key="child.label">
									<div v-if="child.children?.length" class="dropdown-group">
										<RouterLink
											v-if="child.to"
											:to="child.to"
											class="dropdown-group-title dropdown-link"
											active-class="active"
											@click="open = null"
										>
											{{ child.label }}
										</RouterLink>
										<span v-else class="dropdown-group-title">
											{{ child.label }}
										</span>
										<div class="dropdown-group-links">
											<RouterLink
												v-for="grandChild in child.children"
												:key="grandChild.label"
												:to="grandChild.to!"
												class="dropdown-link"
												active-class="active"
												@click="open = null"
											>
												{{ grandChild.label }}
											</RouterLink>
										</div>
									</div>
									<RouterLink
										v-else
										:to="child.to!"
										class="dropdown-link"
										active-class="active"
										@click="open = null"
									>
										{{ child.label }}
									</RouterLink>
								</template>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</nav>
		<div class="social-links-desktop hidden md:flex">
			<a href="https://www.instagram.com/sv_ottweiler1919/">
				<svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					class="socials size-6 fill-current"
				>
					<title>Instagram</title>
					<path
						d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
					/>
				</svg>
			</a>
			<a
				href="https://www.facebook.com/people/SV-Ottweiler-1919/61582646983437/"
				><svg
					role="img"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					class="socials size-6 fill-current"
				>
					<title>Facebook</title>
					<path
						d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
					/>
				</svg>
			</a>
		</div>

		<div class="pr-4">
			<button
				type="button"
				class="hamburger flex md:hidden"
				:class="{ 'is-open': isMenuOpen }"
				:aria-expanded="isMenuOpen ? 'true' : 'false'"
				aria-controls="mobile-nav"
				aria-label="Menu"
				@click="toggleMenu"
			>
				<span class="hamburger-line"></span>
				<span class="hamburger-line"></span>
				<span class="hamburger-line"></span>
			</button>
		</div>
		<Transition name="mobile-nav-overlay">
			<nav id="mobile-nav" class="mobile-nav md:hidden" v-if="isMenuOpen">
				<div class="mobile-nav-panel">
					<ul class="mobile-nav-list">
						<li
							v-for="item in items"
							:key="`mobile-${item.label}`"
							class="mobile-nav-item"
						>
							<RouterLink
								v-if="item.to && !item.children?.length"
								:to="item.to"
								class="mobile-nav-link"
								@click="closeMenu"
							>
								{{ item.label }}
							</RouterLink>

							<div v-else-if="item.children?.length" class="mobile-nav-group">
								<button
									type="button"
									class="mobile-nav-toggle"
									:class="{ active: isItemActive(item) }"
									@click="toggleMobileSection(item.label)"
								>
									<span>{{ item.label }}</span>
									<span class="mobile-nav-toggle-icon" aria-hidden="true">
										<ChevronUp
											v-if="openMobileSection === item.label"
											:size="18"
											:stroke-width="2.2"
										/>
										<ChevronDown v-else :size="18" :stroke-width="2.2" />
									</span>
								</button>

								<div
									v-if="openMobileSection === item.label"
									class="mobile-nav-children"
								>
									<template
										v-for="child in item.children"
										:key="`mobile-child-${child.label}`"
									>
										<div
											v-if="child.children?.length"
											class="mobile-nav-subgroup"
										>
											<RouterLink
												v-if="child.to"
												:to="child.to"
												class="mobile-nav-sublabel"
												@click="closeMenu"
											>
												{{ child.label }}
											</RouterLink>
											<span v-else class="mobile-nav-sublabel">
												{{ child.label }}
											</span>
											<RouterLink
												v-for="grandChild in child.children"
												:key="`mobile-grandchild-${grandChild.label}`"
												:to="grandChild.to!"
												class="mobile-nav-sublink"
												@click="closeMenu"
											>
												{{ grandChild.label }}
											</RouterLink>
										</div>

										<RouterLink
											v-else
											:to="child.to!"
											class="mobile-nav-sublink"
											@click="closeMenu"
										>
											{{ child.label }}
										</RouterLink>
									</template>
								</div>
							</div>
						</li>
						<li class="mobile-nav-item mobile-nav-item--social">
							<a href="https://www.instagram.com/sv_ottweiler1919/">
								<svg
									role="img"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									class="socials socials-mobile size-8 fill-current"
								>
									<title>Instagram</title>
									<path
										d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
									/>
								</svg>
							</a>
							<a
								href="https://www.facebook.com/people/SV-Ottweiler-1919/61582646983437/"
							>
								<svg
									role="img"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									class="socials socials-mobile size-8 fill-current"
								>
									<title>Facebook</title>
									<path
										d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
									/>
								</svg>
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</Transition>
	</header>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useRoute } from "vue-router";
	import { ChevronDown, ChevronUp } from "@lucide/vue";
	import logo from "@/assets/sv_logo.svg";

	const isMenuOpen = ref(false);

	const toggleMenu = () => {
		isMenuOpen.value = !isMenuOpen.value;
	};

	const closeMenu = () => {
		isMenuOpen.value = false;
		openMobileSection.value = null;
	};

	import { NAV, type NavItem } from "@/utils/nav";

	const items = NAV as NavItem[];
	const route = useRoute();
	const open = ref<string | null>(null);
	const openMobileSection = ref<string | null>(null);
	let dropdownCloseTimer: ReturnType<typeof setTimeout> | null = null;

	const normalizePath = (path: string) => {
		const trimmed = path.replace(/\/+$/, "");
		return trimmed.length > 0 ? trimmed : "/";
	};

	const isPathActive = (to?: string) => {
		if (!to) return false;
		const current = normalizePath(route.path);
		const target = normalizePath(to);
		return current === target;
	};

	const isItemActive = (item: NavItem): boolean => {
		if (isPathActive(item.to)) {
			return true;
		}
		if (!item.children?.length) {
			return false;
		}
		return item.children.some((child) => isItemActive(child));
	};

	const showDropdown = (label: string) => {
		if (dropdownCloseTimer) {
			clearTimeout(dropdownCloseTimer);
			dropdownCloseTimer = null;
		}
		open.value = label;
	};

	const scheduleCloseDropdown = () => {
		if (dropdownCloseTimer) {
			clearTimeout(dropdownCloseTimer);
		}
		dropdownCloseTimer = setTimeout(() => {
			open.value = null;
			dropdownCloseTimer = null;
		}, 110);
	};

	const toggleMobileSection = (label: string) => {
		openMobileSection.value = openMobileSection.value === label ? null : label;
	};
</script>

<style scoped>
	/* Header Container Styles */
	.header-container {
		background:
			linear-gradient(180deg, #022b79 0%, #02122e 100%),
			linear-gradient(90deg, #000000 0%, #022b79 60%);
		background-blend-mode: overlay;
		width: 100dvw;
		height: 10dvh;
		z-index: 100;
		position: fixed;
		box-shadow: inset 0px -10px 30px rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 1280px) {
		.header-container {
			height: 7dvh;
		}
	}

	@media (max-width: 767px) {
		.header-container {
			background: transparent !important;
			box-shadow: none !important;
			backdrop-filter: none !important;
		}

		.mobile-nav-panel {
			padding-top: calc(var(--sv-header-height) + 56px);
		}

		.mobile-nav-list {
			gap: 10px;
		}

		.mobile-nav-link,
		.mobile-nav-toggle,
		.mobile-nav-sublabel,
		.mobile-nav-sublink {
			background: transparent;
			border: 0;
			border-radius: 0;
			padding-left: 0;
			padding-right: 0;
			box-shadow: none;
		}

		.mobile-nav-link,
		.mobile-nav-toggle {
			padding-top: 4px;
			padding-bottom: 4px;
			font-size: clamp(18px, 5.8vw, 28px);
			letter-spacing: 0.04em;
			font-weight: 600;
		}

		.mobile-nav-children {
			padding-left: 10px;
		}

		.mobile-nav-sublabel {
			padding-top: 6px;
			padding-bottom: 0;
			font-size: 11px;
		}

		.mobile-nav-sublink {
			padding-top: 6px;
			padding-bottom: 6px;
			font-size: 14px;
		}

		.mobile-nav-link:hover,
		.mobile-nav-link.is-exact-active,
		.mobile-nav-toggle:hover,
		.mobile-nav-toggle.active,
		.mobile-nav-sublink:hover,
		.mobile-nav-sublink.is-exact-active,
		.mobile-nav-item--social a:hover {
			color: var(--sv-text-color);
			border-color: transparent;
			background: transparent;
			box-shadow: none;
		}

		.mobile-nav-sublink.is-exact-active {
			background: transparent;
			border-color: transparent;
		}

		.mobile-nav-item--social {
			justify-content: flex-start;
			gap: 14px;
			padding-top: 22px;
		}

		.mobile-nav-item--social a {
			width: auto;
			height: auto;
			background: transparent;
			border: 0;
			border-radius: 0;
		}
	}

	/* Desktop Navigation Styles */
	.nav {
		display: none;
	}

	@media (min-width: 768px) {
		.nav {
			display: block;
		}
	}

	.nav-list {
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.link,
	.dropdown-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		min-width: 5rem;
		height: 3rem;
		padding: 0 0.75rem;
		font-weight: 500;
		color: var(--sv-text-color);
		cursor: pointer;
		text-align: center;
		text-transform: uppercase;
		text-decoration: none;
		background: transparent;
		border: none;
		position: relative;
		line-height: 1;
		background-image: linear-gradient(
			var(--sv-secondary-color),
			var(--sv-secondary-color)
		);
		background-position: 0 100%;
		background-size: 0 3px;
		background-repeat: no-repeat;
		transition:
			color 0.22s ease,
			background-size 0.3s ease;
	}

	.link:hover,
	.dropdown-btn:hover {
		color: var(--sv-secondary-color);
		background-size: 100% 3px;
	}

	.link.active {
		color: var(--sv-secondary-color);
		background-size: 100% 3px;
	}

	.dropdown-btn.active {
		color: var(--sv-secondary-color);
		background-size: 100% 3px;
	}

	.dropdown {
		position: relative;
	}

	.dropdown-chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 1px;
	}

	.dropdown-menu {
		position: fixed;
		top: var(--sv-header-height);
		left: 0;
		right: 0;
		width: 100vw;
		margin: 0;
		padding: 12px clamp(18px, 8vw, 80px);
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: center;
		gap: clamp(24px, 4vw, 64px);
		list-style: none;
		overflow: hidden;
		z-index: -1;
	}

	.dropdown-menu::before {
		content: "";
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, #000000 0%, #022b79 100%),
			linear-gradient(0deg, #022b79 0%, #02122e 100%);
		background-blend-mode: overlay;
		transform-origin: top center;
		transform: scaleY(0.08);
		opacity: 0;
		animation: dropdown-surface-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		will-change: transform, opacity;
	}

	.dropdown-menu > * {
		position: relative;
		z-index: 1;
	}

	.dropdown-title {
		align-self: flex-start;
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--sv-secondary-color);
		font-size: 3dvw;
		position: relative;
		margin-left: 0dvw;
		opacity: 0;
		animation: dropdown-text-in 0.22s ease forwards;
		animation-delay: 0.2s;
	}

	.dropdown-items {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		flex-wrap: wrap;
		gap: clamp(16px, 2.5vw, 36px);
		border-top: 2px solid white;
		border-bottom: 2px solid white;
		padding: 2dvh;
		padding-right: 5dvw;
		padding-left: 5dvw;
		opacity: 0;
		animation: dropdown-text-in 0.22s ease forwards;
		animation-delay: 0.2s;
	}

	.dropdown-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-width: clamp(140px, 12vw, 220px);
		align-items: center;
		text-align: center;
	}

	.dropdown-group-title {
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: clamp(12px, 1.1vw, 16px);
		font-weight: 700;
		color: var(--sv-secondary-color);
	}

	.dropdown-group-links {
		display: grid;
		gap: 8px;
		justify-items: center;
	}

	@keyframes dropdown-surface-in {
		from {
			transform: scaleY(0.08);
			opacity: 0;
		}
		to {
			transform: scaleY(1);
			opacity: 1;
		}
	}

	@keyframes dropdown-text-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.dropdown-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--sv-text-color);
		font-size: clamp(11px, 1vw, 14px);
		justify-self: center;
	}

	.dropdown-group-title.dropdown-link {
		color: var(--sv-secondary-color);
	}

	.dropdown-link:hover,
	.dropdown-link:focus-visible {
		color: var(--sv-secondary-color);
	}

	/* Mobile Navigation Styles */
	.mobile-nav {
		position: fixed;
		inset: 0;
		z-index: 95;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(10px);
		overflow: hidden;
	}

	.mobile-nav-panel {
		position: absolute;
		inset: 0;
		padding: calc(var(--sv-header-height) + 8dvh) 12px 28px;
		overflow-y: auto;
	}

	.mobile-nav-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 10px;
	}

	.mobile-nav-item {
		display: grid;
		gap: 8px;
	}

	.mobile-nav-link,
	.mobile-nav-toggle,
	.mobile-nav-sublabel,
	.mobile-nav-sublink {
		display: flex;
		width: 100%;
		text-decoration: none;
		color: var(--sv-text-color);
	}

	.mobile-nav-link,
	.mobile-nav-toggle {
		align-items: center;
		padding: 14px 16px;
		font-weight: 300;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		transition: none;
	}

	.mobile-nav-toggle {
		cursor: pointer;
		text-align: left;
	}

	.mobile-nav-link.is-exact-active,
	.mobile-nav-toggle.active {
		color: var(--sv-secondary-color);
		border-color: rgba(244, 208, 71, 0.35);
	}

	.mobile-nav-toggle-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-nav-children {
		display: grid;
		gap: 10px;
		padding: 4px 0 0 12px;
	}

	.mobile-nav-subgroup {
		display: grid;
		gap: 8px;
	}

	.mobile-nav-sublabel {
		align-items: center;
		padding: 10px 14px 4px;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--sv-secondary-color);
	}

	.mobile-nav-sublink {
		align-items: center;
		padding: 12px 14px;
		font-size: 14px;
		transition: none;
		text-decoration: double;
		color: #ffffff;
	}

	.mobile-nav-sublink.is-exact-active {
		color: var(--sv-secondary-color);
		border-color: rgba(244, 208, 71, 0.3);
	}

	.mobile-nav-item--social {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 1dvh;
		left: 50dvw;
		transform: translate(-50%, 0);
		padding-top: 10px;
	}

	.mobile-nav-item--social a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
	}

	.mobile-nav-item--social a:hover {
		color: var(--sv-secondary-color);
	}

	.mobile-nav-overlay-enter-active,
	.mobile-nav-overlay-leave-active {
		transition: opacity 0.24s ease;
	}

	.mobile-nav-overlay-enter-active .mobile-nav-panel,
	.mobile-nav-overlay-leave-active .mobile-nav-panel {
		transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.mobile-nav-overlay-enter-from,
	.mobile-nav-overlay-leave-to {
		opacity: 0;
	}

	.mobile-nav-overlay-enter-from .mobile-nav-panel,
	.mobile-nav-overlay-leave-to .mobile-nav-panel {
		transform: translateX(100%);
	}

	/* Hamburger Styles */
	.hamburger {
		flex-direction: column;
		gap: 6px;
		position: relative;
		top: 0.75rem;
		right: 0.75rem;
		background: transparent;
		border: none;
		cursor: pointer;
		position: relative;
		z-index: 110;
	}

	.hamburger-line {
		width: 24px;
		height: 2px;
		background: white;
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.hamburger.is-open .hamburger-line:nth-of-type(1) {
		transform: translateY(8px) rotate(45deg);
	}

	.hamburger.is-open .hamburger-line:nth-of-type(2) {
		opacity: 0;
	}

	.hamburger.is-open .hamburger-line:nth-of-type(3) {
		transform: translateY(-8px) rotate(-45deg);
	}

	/* Logo Styles */
	.logo {
		display: inline-flex;
		justify-content: center;
		position: relative;
		z-index: 110;
		transform: translateY(25%);
		width: 7dvw;
		height: 7dvw;
		transition:
			filter 0.5s ease,
			scale 0.5s ease;
	}

	.logo:hover {
		scale: 1.05;
		filter: drop-shadow(0 0 5px var(--sv-secondary-color));
		color: var(--sv-primary-color);
		background: var(--sv-secondary-color);
		border-radius: 50%;
	}

	.logo svg {
		width: 98%;
		height: 98%;
		align-self: center;
	}

	@media (max-width: 427px) {
		.logo {
			width: 20dvw;
			height: 20dvw;
		}
	}

	@media (min-width: 427px) and (max-width: 1039px) {
		.logo {
			width: 9dvw;
			height: 9dvw;
		}
	}

	/* Social Links Styles */
	.socials:hover {
		fill: var(--sv-secondary-color);
		transition: all 0.3s ease;
	}

	.social-links-desktop {
		position: fixed;
		right: 0px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 120;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.social-links-desktop a {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		width: 68px;
		height: 44px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		background: rgba(2, 43, 121, 0.82);
		color: var(--sv-secondary-color);
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
		padding-left: 12px;
		transform: translate(24px, -500%);
		transition:
			transform 0.28s ease,
			background-color 0.16s ease,
			color 0.28s ease,
			box-shadow 0.28s ease;
		position: relative;
	}

	.social-links-desktop a:hover {
		transform: translate(0, -500%);
		background: var(--sv-secondary-color);
		color: var(--sv-primary-color);
		box-shadow: 0 14px 28px rgba(0, 0, 0, 0.24);
	}

	.social-links-desktop .socials {
		width: 22px;
		height: 22px;
		fill: currentColor;
	}

	@media (max-width: 767px) {
		.social-links-desktop {
			display: none;
		}

		.socials {
			display: none;
		}

		.socials-mobile {
			display: inline;
		}
	}

	@media (hover: none), (pointer: coarse) {
		.logo:hover {
			scale: 1;
			filter: none;
			color: inherit;
			background: transparent;
			border-radius: 0;
		}
	}
</style>
