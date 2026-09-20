<template>
  <span
    v-if="isOwn"
    class="contest-vote-count"
    :class="{ 'contest-vote-count--light': variant === 'light' }"
    aria-label="Eigenes Foto – Stimmen">
    <Heart :size="iconSize" />
    {{ votes }}
  </span>
  <button
    v-else
    type="button"
    class="contest-vote-btn"
    :class="{
      'contest-vote-btn--light': variant === 'light',
      'contest-vote-btn--voted': isVoted,
      'contest-vote-btn--lg': size === 'lg',
    }"
    :disabled="disabled"
    :aria-label="
      isVoted ? `Stimme für Foto von ${name} zurückziehen` : `Für Foto von ${name} abstimmen`
    "
    @click.stop="$emit('toggle')">
    <Heart :size="iconSize" :fill="isVoted ? 'currentColor' : 'none'" />
    {{ votes }}
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Heart } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    name: string;
    votes: number;
    isOwn: boolean;
    isVoted: boolean;
    disabled: boolean;
    size?: "sm" | "lg";
    variant?: "dark" | "light";
  }>(),
  { size: "sm", variant: "dark" },
);

defineEmits<{ toggle: [] }>();

const iconSize = computed(() => (props.size === "lg" ? 18 : 14));
</script>

<style scoped>
.contest-vote-btn,
.contest-vote-count {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.75rem;
  font-weight: 700;
}

.contest-vote-count {
  color: rgba(255, 255, 255, 0.7);
}

.contest-vote-count--light {
  color: rgba(43, 34, 16, 0.55);
}

.contest-vote-btn {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 999px;
  padding: 4px 9px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;
}

.contest-vote-btn--light {
  background: rgba(2, 43, 121, 0.1);
  color: var(--sv-primary-color);
}

.contest-vote-btn:hover:not(:disabled) {
  background: var(--sv-secondary-color);
  color: #07122c;
}

.contest-vote-btn:active:not(:disabled) {
  transform: scale(0.92);
}

.contest-vote-btn--voted {
  background: var(--sv-secondary-color);
  color: #07122c;
}

.contest-vote-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.contest-vote-btn--lg {
  font-size: 0.95rem;
  padding: 8px 16px;
}
</style>
