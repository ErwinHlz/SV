<template>
  <article class="entry-detail-body">
    <img
      v-if="image"
      class="entry-detail-image"
      :src="image"
      :alt="imageAlt" />
    <p v-if="title" class="entry-detail-lead">{{ title }}</p>
    <div v-if="content" class="entry-detail-text">
      {{ content }}
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
}>();
</script>

<style scoped>
.entry-detail-body {
  width: min(920px, calc(100dvw - 48px));
  margin: 0 auto clamp(48px, 8vw, 96px);
  padding: clamp(28px, 4vw, 48px);
}

.entry-detail-image {
  float: right;
  width: min(340px, 38%);
  margin: 0 0 20px 28px;
  border-radius: 14px;
}

.entry-detail-body::after {
  content: "";
  display: block;
  clear: both;
}

.entry-detail-lead {
  margin: 0 0 18px;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.55;
  font-weight: 600;
  color: #fff2cf;
}

.entry-detail-text {
  font-size: 17px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-line;
}

@media (max-width: 900px) {
  .entry-detail-body {
    width: calc(100dvw - 24px);
    padding: 22px 18px;
  }

  .entry-detail-text {
    font-size: 16px;
    line-height: 1.75;
  }

  .entry-detail-image {
    float: none;
    width: 100%;
    margin: 0 0 20px;
  }
}
</style>
