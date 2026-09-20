<template>
  <div class="wheel-card">
    <div class="wheel-toolbar">
      <button
        type="button"
        class="wheel-btn wheel-btn--ghost"
        @click="toggleEdit">
        <component :is="isEditing ? Check : Pencil" :size="18" />
        {{ isEditing ? "Fertig" : "Rad bearbeiten" }}
      </button>
    </div>

    <div class="wheel-stage">
      <div class="wheel-pointer" aria-hidden="true"></div>
      <div class="wheel-outer">
        <svg
          class="wheel-svg"
          :style="{ transform: `rotate(${rotation}deg)` }"
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
              y="101"
              text-anchor="end"
              class="wheel-label"
              :fill="labelColor(segment.color)">
              {{ segment.label }}
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
        :disabled="spinning || segments.length < 2"
        @click="spin">
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

    <div v-if="isEditing" class="wheel-editor">
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
          :disabled="segments.length >= 12"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Check, Pencil, Plus, RotateCcw, Trash2 } from "@lucide/vue";
import clubLogo from "@/assets/sv_logo_farbe.svg";

type WheelSegment = {
  id: string;
  label: string;
  color: string;
  weight: number;
};

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

    const list = parsed.slice(0, 12).map((entry, index) => ({
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
const isEditing = ref(false);
const spinning = ref(false);
const rotation = ref(0);
const winner = ref<string | null>(null);

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
  if (segments.value.length >= 12) return;
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

function spin() {
  if (spinning.value || segments.value.length < 2) return;

  spinning.value = true;
  winner.value = null;

  const winnerIndex = pickWinnerIndex();
  const angle = segmentAngles.value[winnerIndex];
  const sweep = angle ? angle.end - angle.start : 360 / segments.value.length;
  const jitter = (Math.random() - 0.5) * sweep * 0.6;
  const originalMid = (angle ? angle.mid : 0) + 360;
  const requiredMod = (270 - (originalMid % 360) + 360) % 360;

  const extraSpins = 5 + Math.floor(Math.random() * 3);
  const baseRotation = rotation.value - (rotation.value % 360);
  let target = baseRotation + extraSpins * 360 + requiredMod + jitter;
  if (target <= rotation.value) {
    target += 360;
  }

  rotation.value = target;

  window.setTimeout(() => {
    spinning.value = false;
    winner.value = segments.value[winnerIndex]?.label ?? null;
  }, SPIN_DURATION_MS);
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
  justify-content: flex-end;
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

.wheel-label {
  font-size: 9px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 64px;
}

.wheel-result {
  margin: 0;
  font-size: 1.05rem;
  opacity: 0;
  transition: opacity 0.3s ease;
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
