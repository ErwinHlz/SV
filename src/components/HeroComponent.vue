<template>
  <HomeTileRow :items="items" aria-label="Hero Links" />
</template>

<script setup>
import HomeTileRow from "@/components/HomeTileRow.vue";
import externalLinks from "@/content/external-links.json";
import { getGalleryPlaceholder } from "@/utils/galleryPlaceholders";
import teamOneKaderPhoto from "@/assets/Kader/team-1-kader.jpg";

const items = [
  {
    id: 1,
    to: "/teams/one/kader",
    img: teamOneKaderPhoto,
    kicker: "MANNSCHAFT",
    title: "Zum Kader\nder 1. Mannschaft",
  },
  {
    id: 2,
    to: "/mitglied-werden",
    img: getGalleryPlaceholder("home:mitglied-werden"),
    kicker: "VEREIN",
    title: "Mitglied werden\nund Teil des Vereins sein",
  },
  {
    id: 3,
    to: externalLinks.social.instagram.url,
    external: true,
    img: getGalleryPlaceholder("home:instagram"),
    kicker: "SOCIAL MEDIA",
    title: "Folgt uns\nauf Instagram",
  },
  {
    id: 4,
    to: "/galerie",
    img: getGalleryPlaceholder("home:galerie"),
    kicker: "IMPRESSIONEN",
    title: "Zur Galerie\nmit Bildern vom Verein",
  },
];
</script>
