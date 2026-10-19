<script setup lang="ts">
// Einfarbiges Wappen, faerbt sich ueber "color" (currentColor).
import logo from "@/assets/sv_logo.svg?raw";
</script>

<template>
  <span class="crest-mark" aria-hidden="true" v-html="logo"></span>
</template>

<style scoped>
.crest-mark {
  display: block;
  line-height: 0;
}

.crest-mark :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
