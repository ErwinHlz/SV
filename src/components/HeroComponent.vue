<template>
  <HomeTileRow :items="items" aria-label="Hero Links" />
</template>

<script setup>
import HomeTileRow from "@/components/HomeTileRow.vue";
import kaderImage from "@/assets/Kader/team-1-kader.jpg";
import mitgliedImage from "@/assets/home/mitglied-werden.svg";
import instagramImage from "@/assets/home/instagram.svg";
import galerieImage from "@/assets/galerie/galerie_13.jpeg";
import externalLinks from "@/content/external-links.json";

const items = [
  {
    id: 1,
    to: "/teams/one/kader",
    img: kaderImage,
    kicker: "MANNSCHAFT",
    title: "Zum Kader\nder 1. Mannschaft",
  },
  {
    id: 2,
    to: "/mitglied-werden",
    img: mitgliedImage,
    kicker: "VEREIN",
    title: "Mitglied werden\nund Teil des Vereins sein",
  },
  {
    id: 3,
    to: externalLinks.social.instagram.url,
    external: true,
    img: instagramImage,
    kicker: "SOCIAL MEDIA",
    title: "Folgt uns\nauf Instagram",
  },
  {
    id: 4,
    to: "/galerie",
    img: galerieImage,
    kicker: "IMPRESSIONEN",
    title: "Zur Galerie\nmit Bildern vom Verein",
  },
];
</script>
