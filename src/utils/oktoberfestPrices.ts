export const OKTOBERFEST_PRICES = {
  longdrink: 3,
  shot: 1.5,
  spin: 2,
} as const;

// 60 gleich wahrscheinliche Anteile:
// (14 * 1.5 + 10 * 3 + 6 * 4.5 + 6 * 3 + 4 * 6) / 60 = 2 Euro.
// Bei 2 Euro Einsatz entspricht das einer Ausschüttungsquote von 1 (100 %).
export const DRINK_WHEEL_PRESET = [
  { id: "drink-none", label: "Leider kein Gewinn", color: "#022b79", weight: 20, value: 0 },
  { id: "drink-shot", label: "1 Shot", color: "#f7ead0", weight: 14, value: OKTOBERFEST_PRICES.shot },
  { id: "drink-two-shots", label: "2 Shots", color: "#8c1f2b", weight: 10, value: 2 * OKTOBERFEST_PRICES.shot },
  { id: "drink-three-shots", label: "3 Shots", color: "#c97a1a", weight: 6, value: 3 * OKTOBERFEST_PRICES.shot },
  { id: "drink-longdrink", label: "1 Longdrink", color: "#1f6f4a", weight: 6, value: OKTOBERFEST_PRICES.longdrink },
  { id: "drink-jackpot", label: "2 Longdrinks", color: "#f4d047", weight: 4, value: 2 * OKTOBERFEST_PRICES.longdrink },
];

// Wiederholte Gewinne abwechselnd verteilen. Ihr Gesamtgewicht bleibt erhalten.
const DRINK_FIELD_ORDER = [0, 1, 2, 0, 3, 0, 1, 4, 0, 2, 5, 0, 1, 0, 3, 2, 0, 4, 0, 1, 5];
export const DRINK_WHEEL_SEGMENTS = DRINK_FIELD_ORDER.map((prizeIndex, index) => {
  const prize = DRINK_WHEEL_PRESET[prizeIndex]!;
  const count = DRINK_FIELD_ORDER.filter((entry) => entry === prizeIndex).length;
  return {
    ...prize,
    id: `${prize.id}-field-${index + 1}`,
    weight: prize.weight / count,
  };
});

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
