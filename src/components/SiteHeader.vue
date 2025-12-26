<template>
  <header
    class="header-container sticky w-100dvw xl:h-[10dvh] flex items-center justify-between pl-4 md:pl-8 min-[1040px]:pl-12 xl:pl-50">
    <RouterLink to="/" class="logo">
      <svg class="flex items-start fill-current">
        <use :href="logo" />
      </svg>
    </RouterLink>
    <nav class="desktop-nav hidden md:block">
      <ul
        class="flex items-center min-[1040px]: xl:translate-x-50 xl:translate-y-5">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </ul>
    </nav>
    <div class="absolute right-5 top-5 hidden md:inline-flex gap-4"
      ><a href="https://www.instagram.com/sv_ottweiler1919/">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="socials size-8 fill-current">
          <title>Instagram</title>
          <path
            d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
        </svg>
      </a>
      <a
        href="https://www.facebook.com/people/SV-Ottweiler-1919/61582646983437/"
        ><svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="socials size-8 fill-current">
          <title>Facebook</title>
          <path
            d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" /></svg></a
    ></div>
    <div class="pr-4">
      <button
        type="button"
        class="hamburger flex md:hidden"
        :class="{ 'is-open': isMenuOpen }"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-controls="mobile-nav"
        aria-label="Menu"
        @click="toggleMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    <nav
      id="mobile-nav"
      class="mobile-nav md:hidden absolute left-0 top-full w-full z-20"
      v-if="isMenuOpen">
      <ul class="flex flex-col items-center gap-2 py-4">
        <RouterLink to="/" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/about" @click="closeMenu">About</RouterLink>
        <RouterLink to="/contact" @click="closeMenu">Contact</RouterLink>
        <a href="https://www.instagram.com/sv_ottweiler1919/">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="socials socials-mobile size-8 fill-current">
            <title>Instagram</title>
            <path
              d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
          </svg>
        </a>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import background from "@/assets/header/background.png";
import logo from "@/assets/sv_logo.svg";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
/* Header Container Styles */
.header-container {
  background: #022b79;
  width: 100dvw;
  height: 10dvh;
  z-index: 100;
  position: fixed;
}

@media (max-width: 1280px) {
  .header-container {
    height: 7dvh;
  }
}

/* Desktop Navigation Styles */
.desktop-nav a {
  font-weight: 500;
  color: var(--sv-text-color);
  cursor: pointer;
  width: 5rem;
  height: 3rem;
  text-align: center;
}

.desktop-nav a::after {
  content: "";
  display: block;
  position: relative;
  width: 0;
  left: 0;
  bottom: -0.75rem;
  height: 2px;
  background: var(--sv-secondary-color);
  transition: width 0.5s ease;
}

.desktop-nav a:hover::after {
  width: 100%;
}

.desktop-nav a:hover {
  color: var(--sv-secondary-color);
}

.desktop-nav a.is-exact-active {
  color: var(--sv-secondary-color);
}

.desktop-nav a.is-exact-active::after {
  content: "";
  display: block;
  position: relative;
  width: 100%;
  left: 0;
  bottom: -0.75rem;
  height: 2px;
  background: var(--sv-secondary-color);
  transition: width 0.3s ease;
}

/* Mobile Navigation Styles */
.mobile-nav {
  background: #022b79;
  opacity: 0.9;
  height: 80dvh;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.mobile-nav a {
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  font-weight: 500;
  text-align: center;
  color: var(--sv-text-color);
}

.mobile-nav a:hover,
.mobile-nav a.is-exact-active {
  color: var(--sv-secondary-color);
}

/* Hamburger Styles */
.hamburger {
  flex-direction: column;
  gap: 6px;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--sv-text-color);
  transition: transform 0.2s ease, opacity 0.2s ease;
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
  transform: translateY(25%);
  width: 7dvw;
  height: 7dvw;
  transition: filter 0.5s ease, scale 0.5s ease;
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

@media (max-width: 767px) {
  .socials {
    display: none;
  }

  .socials-mobile {
    display: inline;
  }
}
</style>
