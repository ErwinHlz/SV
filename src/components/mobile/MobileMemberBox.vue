<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import CrestMark from "@/components/mobile/CrestMark.vue";

withDefaults(
  defineProps<{
    kicker?: string;
    text?: string;
    cta?: string;
  }>(),
  {
    kicker: "Mitglied werden",
    text: "",
    cta: "Zum Mitgliedsantrag",
  },
);
</script>

<template>
  <section class="member">
    <div class="m-box member__box m-rv">
      <CrestMark class="m-box__crest member__crest" />
      <p class="m-kicker">{{ kicker }}</p>
      <h2 class="m-display member__title"><slot /></h2>
      <p v-if="text" class="member__text">{{ text }}</p>
      <RouterLink to="/mitglied-werden" class="m-btn member__cta">
        {{ cta }} <ArrowRight :size="18" :stroke-width="2" />
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.member {
  padding: 64px var(--m-gutter) 0;
}

.member__box {
  border-radius: 28px;
  padding: 30px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member__crest {
  right: -70px;
  bottom: -80px;
  width: 280px;
  height: 280px;
  opacity: 0.14;
}

.member__title {
  position: relative;
  font-size: 48px;
  line-height: 0.92;
}

.member__text {
  position: relative;
  margin: 0;
  max-width: 260px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--m-text-2);
}

.member__cta {
  position: relative;
  align-self: flex-start;
}
</style>
