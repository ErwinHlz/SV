<template>
  <div ref="wheelRef" class="wheel-card" :class="{ 'wheel-card--fullscreen': isFullscreen }">
    <div class="wheel-toolbar">
      <div v-if="!isFullscreen" class="wheel-toolbar-settings">
        <button
          type="button"
          class="wheel-btn wheel-btn--ghost"
          :disabled="spinning || isDragging"
          @click="applyDrinkPreset">
          Getränkepreise übernehmen
        </button>
        <button
          type="button"
          class="wheel-btn wheel-btn--ghost"
          :disabled="spinning || isDragging"
          @click="toggleEdit">
          <component :is="isEditing ? Check : Pencil" :size="18" />
          {{ isEditing ? "Fertig" : "Rad bearbeiten" }}
        </button>
      </div>
      <button
        ref="fullscreenButtonRef"
        type="button"
        class="wheel-btn wheel-btn--ghost wheel-fullscreen-button"
        :aria-label="isFullscreen ? 'Vollbild verlassen' : 'Vollbild öffnen'"
        :title="isFullscreen ? 'Vollbild verlassen' : 'Vollbild öffnen'"
        :aria-pressed="isFullscreen"
        @click="toggleFullscreen">
        <component :is="isFullscreen ? Minimize : Maximize" :size="22" aria-hidden="true" />
      </button>
    </div>

    <div class="wheel-stage">
      <div class="wheel-pointer" aria-hidden="true"></div>
      <div
        class="wheel-outer"
        :class="{ 'wheel-outer--dragging': isDragging, 'wheel-outer--spinning': spinning }"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="cancelDrag"
        @lostpointercapture="cancelDrag"
        @dragstart.prevent>
        <svg
          class="wheel-svg"
          :class="{ 'wheel-svg--dragging': isDragging }"
          :style="{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isDragging ? '0ms' : `${spinDurationMs}ms`,
          }"
          viewBox="0 0 200 200"
          aria-hidden="true">
          <defs>
            <clipPath id="wheelHubClip">
              <circle cx="100" cy="100" r="23" />
            </clipPath>
          </defs>
          <g v-for="(segment, index) in segments" :key="segment.id">
            <path :d="segmentPath(index)" :fill="segment.color" />
            <text
              :transform="labelTransform(index)"
              x="184"
              y="100"
              dominant-baseline="central"
              :style="{ fontSize: `${labelFontSize(index)}px` }"
              text-anchor="end"
              class="wheel-label"
              :fill="labelColor(segment.color)">
              {{ wheelLabel(segment.label) }}
            </text>
          </g>
          <circle cx="100" cy="100" r="25" class="wheel-hub-bg" />
          <image
            :href="clubLogo"
            x="77"
            y="77"
            width="46"
            height="46"
            clip-path="url(#wheelHubClip)"
            preserveAspectRatio="xMidYMid slice" />
          <circle cx="100" cy="100" r="25" class="wheel-hub-ring" />
        </svg>
      </div>
    </div>

    <div class="wheel-actions">
      <button
        type="button"
        class="wheel-btn wheel-btn--primary"
        :disabled="spinning || isDragging || segments.length < 2"
        @click="spin()">
        {{ spinning ? "Dreht..." : "Rad drehen" }}
      </button>
      <p
        class="wheel-result"
        :class="{ 'wheel-result--visible': !!winner }"
        aria-live="polite">
        <template v-if="winner"
          ><strong>{{ winner }}</strong></template
        >
      </p>
    </div>

    <fieldset v-if="isEditing && !isFullscreen" class="wheel-editor" :disabled="spinning || isDragging">
      <div class="wheel-editor-list">
        <div
          v-for="(segment, index) in segments"
          :key="segment.id"
          class="wheel-editor-item">
          <div class="wheel-editor-row">
            <input
              v-model="segment.color"
              type="color"
              class="wheel-color-input"
              :aria-label="`Farbe fuer ${segment.label}`" />
            <input
              v-model="segment.label"
              type="text"
              class="wheel-text-input"
              maxlength="24"
              placeholder="Beschriftung" />
            <button
              type="button"
              class="wheel-btn wheel-btn--icon"
              :disabled="segments.length <= 2"
              aria-label="Feld entfernen"
              @click="removeSegment(index)">
              <Trash2 :size="16" />
            </button>
          </div>
          <div class="wheel-editor-weight">
            <input
              :value="displayPercents[index]"
              type="range"
              min="0"
              max="100"
              step="1"
              class="wheel-weight-slider"
              :aria-label="`Gewinnchance fuer ${segment.label}`"
              @input="onPercentInput(index, $event)" />
            <label class="wheel-weight-number-group">
              <input
                :value="displayPercents[index]"
                type="number"
                min="0"
                max="100"
                step="1"
                class="wheel-weight-number"
                :aria-label="`Gewinnchance fuer ${segment.label} eintippen`"
                @input="onPercentInput(index, $event)" />
              <span aria-hidden="true">%</span>
            </label>
          </div>
        </div>
      </div>

      <div class="wheel-editor-footer">
        <button
          type="button"
          class="wheel-btn wheel-btn--ghost"
          :disabled="segments.length >= MAX_SEGMENTS"
          @click="addSegment">
          <Plus :size="16" /> Feld hinzufügen
        </button>
        <button
          type="button"
          class="wheel-btn wheel-btn--ghost"
          @click="resetSegments">
          <RotateCcw :size="16" /> Zurücksetzen
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Check, Maximize, Minimize, Pencil, Plus, RotateCcw, Trash2 } from "@lucide/vue";
import clubLogo from "@/assets/sv_logo_farbe.svg";
import { DRINK_WHEEL_SEGMENTS } from "@/utils/oktoberfestPrices";

type WheelSegment = {
  id: string;
  label: string;
  color: string;
  weight: number;
};

const MAX_SEGMENTS = 24;
const STORAGE_KEY = "sv-oktoberfest-wheel";
const SPIN_DURATION_MS = 4400;

const PALETTE = [
  "#022b79",
  "#f4d047",
  "#8c1f2b",
  "#1f6f4a",
  "#c97a1a",
  "#f7ead0",
];

function paletteColor(index: number): string {
  return PALETTE[index % PALETTE.length] ?? PALETTE[0]!;
}

const DEFAULT_SHARE = 100 / 8;

const DEFAULT_SEGMENTS: WheelSegment[] = [
  {
    id: "seg-1",
    label: "Gewinn 1",
    color: paletteColor(0),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-2",
    label: "Gewinn 2",
    color: paletteColor(1),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-3",
    label: "Gewinn 3",
    color: paletteColor(2),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-4",
    label: "Gewinn 4",
    color: paletteColor(3),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-5",
    label: "Gewinn 5",
    color: paletteColor(4),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-6",
    label: "Gewinn 6",
    color: paletteColor(5),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-7",
    label: "Gewinn 7",
    color: paletteColor(6),
    weight: DEFAULT_SHARE,
  },
  {
    id: "seg-8",
    label: "Gewinn 8",
    color: paletteColor(7),
    weight: DEFAULT_SHARE,
  },
];

function cloneDefaults(): WheelSegment[] {
  return DEFAULT_SEGMENTS.map((segment) => ({ ...segment }));
}

function weightOf(segment: WheelSegment): number {
  return Math.max(0, Number(segment.weight) || 0);
}

/** Rescales every segment's weight in place so they sum to exactly 100. */
function normalizeToHundred(list: WheelSegment[]) {
  const total = list.reduce((sum, segment) => sum + weightOf(segment), 0);
  if (list.length === 0) return;

  if (total > 0) {
    list.forEach((segment) => {
      segment.weight = (weightOf(segment) / total) * 100;
    });
  } else {
    const share = 100 / list.length;
    list.forEach((segment) => {
      segment.weight = share;
    });
  }
}

function loadSegments(): WheelSegment[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaults();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 2) return cloneDefaults();

    const list = parsed.slice(0, MAX_SEGMENTS).map((entry, index) => ({
      id:
        typeof entry?.id === "string" ? entry.id : `seg-${index}-${Date.now()}`,
      label:
        typeof entry?.label === "string" && entry.label.trim()
          ? entry.label.slice(0, 24)
          : `Feld ${index + 1}`,
      color:
        typeof entry?.color === "string" &&
        /^#[0-9a-fA-F]{6}$/.test(entry.color)
          ? entry.color
          : paletteColor(index),
      weight: Math.max(0, Number(entry?.weight) || 0),
    }));

    normalizeToHundred(list);
    return list;
  } catch {
    return cloneDefaults();
  }
}

const segments = ref<WheelSegment[]>(loadSegments());
function applyDrinkPreset() {
  if (spinning.value) return;
  segments.value = DRINK_WHEEL_SEGMENTS.map(({ id, label, color, weight }) => ({
    id, label, color, weight,
  }));
  normalizeToHundred(segments.value);
  winner.value = null;
  rotation.value = 0;
}

const isEditing = ref(false);
const spinning = ref(false);
const rotation = ref(0);
const spinDurationMs = ref(SPIN_DURATION_MS);
const winner = ref<string | null>(null);
const isDragging = ref(false);
let activePointerId: number | null = null;
let dragCenter = { x: 0, y: 0 };
let lastDragAngle = 0;
let dragDistance = 0;
let dragDirection = 1;
let dragSamples: { time: number; rotation: number }[] = [];
let spinTimer: ReturnType<typeof window.setTimeout> | null = null;
let disposed = false;

function pointerAngle(event: PointerEvent): number {
  return Math.atan2(event.clientY - dragCenter.y, event.clientX - dragCenter.x) * 180 / Math.PI;
}

function startDrag(event: PointerEvent) {
  if (spinning.value || isDragging.value || segments.value.length < 2 || !event.isPrimary || event.button !== 0) return;
  const target = event.currentTarget as HTMLElement;
  const bounds = target.getBoundingClientRect();
  dragCenter = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  // Near the centre, small finger movements cause unstable angle jumps.
  if (Math.hypot(event.clientX - dragCenter.x, event.clientY - dragCenter.y) < bounds.width * 0.12) return;
  target.setPointerCapture(event.pointerId);
  activePointerId = event.pointerId;
  lastDragAngle = pointerAngle(event);
  dragSamples = [{ time: event.timeStamp, rotation: rotation.value }];
  dragDistance = 0;
  dragDirection = 1;
  isDragging.value = true;
  event.preventDefault();
}

function moveDrag(event: PointerEvent) {
  if (event.pointerId !== activePointerId) return;
  const angle = pointerAngle(event);
  const delta = ((angle - lastDragAngle + 540) % 360) - 180;
  lastDragAngle = angle;
  rotation.value += delta;
  dragSamples.push({ time: event.timeStamp, rotation: rotation.value });
  // Use recent motion so holding still before release reduces the momentum.
  while (dragSamples.length > 2 && dragSamples[1]!.time < event.timeStamp - 120) {
    dragSamples.shift();
  }
  dragDistance += Math.abs(delta);
  if (Math.abs(delta) > 0.5) dragDirection = Math.sign(delta);
  if (dragDistance > 2) winner.value = null;
}

function releaseDrag(event: PointerEvent) {
  activePointerId = null;
  isDragging.value = false;
  const target = event.currentTarget as HTMLElement;
  if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
}

async function endDrag(event: PointerEvent) {
  if (event.pointerId !== activePointerId) return;
  moveDrag(event);
  const shouldSpin = dragDistance >= 12;
  const firstSample = dragSamples[0]!;
  const elapsed = event.timeStamp - firstSample.time;
  const velocity = elapsed > 0 ? (rotation.value - firstSample.rotation) / elapsed : 0;
  const direction = Math.abs(velocity) > 0.01 ? Math.sign(velocity) : dragDirection;
  const speed = Math.abs(velocity);
  releaseDrag(event);
  if (!shouldSpin) return;
  await nextTick();
  if (disposed) return;
  // Commit the dragged position and restore the transition before continuing.
  wheelRef.value?.getBoundingClientRect();
  spin(direction, speed);
}

function cancelDrag(event: PointerEvent) {
  if (event.pointerId === activePointerId) releaseDrag(event);
}

const wheelRef = ref<HTMLElement | null>(null);
const fullscreenButtonRef = ref<HTMLButtonElement | null>(null);
const isFullscreen = ref(false);
let previousBodyOverflow = "";

watch(isFullscreen, (active) => {
  if (active) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = previousBodyOverflow;
    nextTick(() => fullscreenButtonRef.value?.focus());
  }
}, { flush: "sync" });

async function toggleFullscreen() {
  if (isFullscreen.value) {
    if (document.fullscreenElement === wheelRef.value) {
      try {
        await document.exitFullscreen();
      } catch {
        return;
      }
    }
    isFullscreen.value = false;
    return;
  }

  isFullscreen.value = true;
  // The fixed overlay also works on browsers without the Fullscreen API.
  try {
    await wheelRef.value?.requestFullscreen?.();
  } catch {
    // Keep the viewport-filling fallback when native fullscreen is unavailable.
  }
}

function syncFullscreen() {
  isFullscreen.value = document.fullscreenElement === wheelRef.value;
}

function handleFullscreenKey(event: KeyboardEvent) {
  if (event.key === "Escape" && isFullscreen.value) {
    void toggleFullscreen();
  }
}

onMounted(() => {
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("keydown", handleFullscreenKey);
});

onBeforeUnmount(() => {
  disposed = true;
  if (spinTimer !== null) window.clearTimeout(spinTimer);
  document.removeEventListener("fullscreenchange", syncFullscreen);
  document.removeEventListener("keydown", handleFullscreenKey);
  if (isFullscreen.value) document.body.style.overflow = previousBodyOverflow;
});


watch(
  segments,
  (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Speicher nicht verfuegbar (z. B. privater Modus) - Aenderungen bleiben nur im Speicher
    }
  },
  { deep: true },
);

const totalWeight = computed(() =>
  segments.value.reduce((sum, segment) => sum + weightOf(segment), 0),
);

/**
 * Largest-remainder rounding: turns the raw weights into whole percentages
 * that always sum to exactly 100, so the number on the wheel and in the
 * editor always matches what was actually typed/dragged in.
 */
const displayPercents = computed<number[]>(() => {
  const list = segments.value;
  const n = list.length;
  if (n === 0) return [];

  const total = totalWeight.value;
  if (total <= 0) {
    const share = Math.floor(100 / n);
    const result = new Array(n).fill(share);
    let remainder = 100 - share * n;
    for (let i = 0; i < remainder; i++) result[i]!++;
    return result;
  }

  const raw = list.map((segment) => (weightOf(segment) / total) * 100);
  const floors = raw.map(Math.floor);
  const remainder = 100 - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...floors];
  for (let k = 0; k < remainder && k < order.length; k++) {
    const entry = order[k]!;
    result[entry.index]!++;
  }
  return result;
});

/**
 * Sets one segment's real percentage and proportionally rescales the other
 * segments so the wheel always sums to exactly 100%.
 */
function setSegmentPercent(index: number, rawValue: number) {
  const segment = segments.value[index];
  if (!segment) return;

  const clamped = Math.max(
    0,
    Math.min(100, Number.isFinite(rawValue) ? rawValue : 0),
  );
  const others = segments.value.filter((_, i) => i !== index);
  const remaining = 100 - clamped;

  segment.weight = clamped;
  if (others.length === 0) return;

  const sumOthers = others.reduce((sum, s) => sum + weightOf(s), 0);
  if (sumOthers > 0) {
    others.forEach((s) => {
      s.weight = (weightOf(s) / sumOthers) * remaining;
    });
  } else {
    const share = remaining / others.length;
    others.forEach((s) => {
      s.weight = share;
    });
  }
}

function onPercentInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement;
  setSegmentPercent(index, Number(target.value));
}

type SegmentAngle = { start: number; end: number; mid: number };

const segmentAngles = computed<SegmentAngle[]>(() => {
  const count = segments.value.length;
  if (count === 0) return [];

  const total = totalWeight.value;
  const equalSweep = 360 / count;
  let cursor = -90;

  return segments.value.map((segment) => {
    const sweep = total > 0 ? (weightOf(segment) / total) * 360 : equalSweep;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    return { start, end, mid: (start + end) / 2 };
  });
});

function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 100 + radius * Math.cos(rad), y: 100 + radius * Math.sin(rad) };
}

function segmentPath(index: number): string {
  const angle = segmentAngles.value[index];
  if (!angle) return "";
  const sweep = angle.end - angle.start;
  const p1 = pointAt(angle.start, 96);
  const p2 = pointAt(angle.end, 96);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M100,100 L${p1.x.toFixed(2)},${p1.y.toFixed(2)} A96,96 0 ${largeArc} 1 ${p2.x.toFixed(2)},${p2.y.toFixed(2)} Z`;
}

function labelTransform(index: number): string {
  const angle = segmentAngles.value[index];
  return `rotate(${angle ? angle.mid : 0} 100 100)`;
}

function wheelLabel(label: string): string {
  return label === "Leider kein Gewinn" ? "Kein Gewinn" : label;
}

function labelFontSize(index: number): number {
  const segment = segments.value[index];
  const angle = segmentAngles.value[index];
  if (!segment || !angle) return 0;
  const label = wheelLabel(segment.label);
  // Keep text between the hub and rim, and inside the narrowest part of its field.
  const radialLimit = 52 / (Math.max(1, label.length) * 0.65);
  const sweep = Math.min(180, Math.max(0, angle.end - angle.start));
  const angularLimit = 2 * 32 * Math.sin(sweep * Math.PI / 360) * 0.8;
  return Math.min(8, radialLimit, angularLimit);
}

function labelColor(hex: string): string {
  const value = hex.replace("#", "");
  if (value.length !== 6) return "#fff7e0";
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1204" : "#fff7e0";
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

function addSegment() {
  if (segments.value.length >= MAX_SEGMENTS) return;
  const index = segments.value.length;
  segments.value.push({
    id: `seg-${Date.now()}-${index}`,
    label: `Feld ${index + 1}`,
    color: paletteColor(index),
    weight: 0,
  });
  setSegmentPercent(index, 100 / segments.value.length);
}

function removeSegment(index: number) {
  if (segments.value.length <= 2) return;
  segments.value.splice(index, 1);
  normalizeToHundred(segments.value);
}

function resetSegments() {
  segments.value = cloneDefaults();
  winner.value = null;
}

function pickWinnerIndex(): number {
  const total = totalWeight.value;
  if (total <= 0) return Math.floor(Math.random() * segments.value.length);

  let remaining = Math.random() * total;
  for (let i = 0; i < segments.value.length; i++) {
    remaining -= weightOf(segments.value[i]!);
    if (remaining <= 0) return i;
  }
  return segments.value.length - 1;
}

function spin(direction = 1, gestureSpeed?: number) {
  if (spinning.value || isDragging.value || segments.value.length < 2) return;

  spinning.value = true;
  winner.value = null;

  const winnerIndex = pickWinnerIndex();
  const angle = segmentAngles.value[winnerIndex];
  const sweep = angle ? angle.end - angle.start : 360 / segments.value.length;
  const jitter = (Math.random() - 0.5) * sweep * 0.6;
  const originalMid = (angle ? angle.mid : 0) + 360;
  const requiredMod = (270 - (originalMid % 360) + 360) % 360;

  const strength = gestureSpeed === undefined ? null :
    Math.min(1, Math.max(0, Number.isFinite(gestureSpeed) ? gestureSpeed / 1.5 : 0));
  const extraSpins = strength === null ? 5 + Math.floor(Math.random() * 3) :
    1 + Math.round(strength * 9);
  spinDurationMs.value = strength === null ? SPIN_DURATION_MS :
    Math.round(2000 + strength * 3500);
  const delta = ((requiredMod + jitter - rotation.value) % 360 + 360) % 360;
  const target = rotation.value + direction * extraSpins * 360 +
    (direction < 0 ? delta - 360 : delta);

  rotation.value = target;

  spinTimer = window.setTimeout(() => {
    spinTimer = null;
    spinning.value = false;
    winner.value = segments.value[winnerIndex]?.label ?? null;
  }, spinDurationMs.value);
}
</script>

<style scoped>
.wheel-card {
  width: min(640px, 100%);
  margin: 0 auto;
  padding: clamp(20px, 4vw, 36px);
  border-radius: 28px;
  background: transparent;
  color: var(--sv-text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.wheel-toolbar {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.wheel-toolbar-settings {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wheel-btn.wheel-fullscreen-button {
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  margin-left: auto;
  padding: 0;
  justify-content: center;
}

/* Native fullscreen and mobile fallback share the same layout. */
.wheel-card--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2000;
  box-sizing: border-box;
  width: 100%;
  height: 100dvh;
  margin: 0;
  padding: max(12px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  border-radius: 0;
  background: #07142f;
  overflow-y: auto;
  gap: 12px;
}

.wheel-card--fullscreen .wheel-toolbar {
  justify-content: flex-end;
  flex-shrink: 0;
}

.wheel-card--fullscreen .wheel-stage {
  flex: 0 0 auto;
  margin: auto 0;
  padding-top: 28px;
}

.wheel-card--fullscreen .wheel-outer {
  width: min(80vw, calc(100dvh - 280px));
  min-width: 140px;
}

.wheel-card--fullscreen .wheel-actions {
  flex-shrink: 0;
}

fieldset.wheel-editor {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.wheel-stage {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 28px;
  width: 100%;
}

.wheel-pointer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 26px solid var(--sv-secondary-color);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));
  z-index: 2;
}

.wheel-outer {
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  position: relative;
  width: min(500px, 86vw);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 10px solid var(--sv-secondary-color);
  box-shadow:
    0 0 0 5px var(--sv-primary-color),
    0 24px 60px rgba(1, 12, 35, 0.4);
  overflow: hidden;
  background: #07142f;
}

.wheel-svg {
  width: 100%;
  height: 100%;
  display: block;
  transform-origin: 50% 50%;
  transition: transform 4.4s cubic-bezier(0.12, 0.67, 0.1, 1);
}

.wheel-outer--dragging {
  cursor: grabbing;
}

.wheel-outer--spinning {
  cursor: wait;
}

.wheel-svg--dragging {
  transition: none;
}

.wheel-label {
  font-weight: 700;
}

.wheel-percent {
  font-size: 7px;
  font-weight: 600;
  opacity: 0.85;
}

.wheel-hub-bg {
  fill: #ffffff;
}

.wheel-hub-ring {
  fill: none;
  stroke: var(--sv-secondary-color);
  stroke-width: 3;
}

.wheel-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 64px;
}

.wheel-result {
  margin: 0;
  min-height: 1.2em;
  max-width: 100%;
  font-size: clamp(1.6rem, 5vw, 2.5rem);
  line-height: 1.2;
  text-align: center;
  overflow-wrap: anywhere;
  color: var(--sv-secondary-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.wheel-card--fullscreen .wheel-result {
  font-size: clamp(2rem, min(7vw, 7dvh), 4rem);
}

.wheel-result--visible {
  opacity: 1;
}

.wheel-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.wheel-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.wheel-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.wheel-btn--primary {
  background: var(--sv-secondary-color);
  border-color: var(--sv-secondary-color);
  color: #07122c;
  padding: 0 28px;
}

.wheel-btn--icon {
  min-height: 40px;
  min-width: 40px;
  padding: 0;
  justify-content: center;
}

.wheel-editor {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wheel-editor-hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.75;
}

.wheel-editor-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wheel-editor-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.wheel-editor-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.wheel-editor-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.wheel-color-input {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
}

.wheel-text-input {
  min-height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font: inherit;
}

.wheel-text-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.wheel-editor-weight {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 12px;
  padding-left: 50px;
}

.wheel-weight-slider {
  flex: 1 1 120px;
  min-width: 90px;
  accent-color: var(--sv-secondary-color);
}

.wheel-weight-number-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 0.85rem;
}

.wheel-weight-number {
  width: 40px;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: right;
  padding: 0;
}

.wheel-weight-number::-webkit-inner-spin-button,
.wheel-weight-number::-webkit-outer-spin-button {
  opacity: 0.6;
}

.wheel-editor-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 480px) {
  .wheel-editor-weight {
    padding-left: 0;
  }
}
</style>
