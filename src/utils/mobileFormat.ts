const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];
const MONTHS_LONG = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const DAY_MS = 24 * 60 * 60 * 1000;

const pad = (value: number) => String(value).padStart(2, "0");

// Erwartet "YYYY-MM-DD" (Content-Format) oder "DD.MM.YYYY".
export const parseLocalDate = (value?: string): Date | null => {
  if (!value) return null;

  const [first, second, third] = value.includes(".")
    ? value.split(".").reverse()
    : value.split("-");
  const date = new Date(Number(first), Number(second) - 1, Number(third));

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export type DateParts = {
  weekday: string;
  day: string;
  month: string;
};

export const getDateParts = (value?: string): DateParts | null => {
  const date = parseLocalDate(value);
  if (!date) return null;

  return {
    weekday: WEEKDAYS[date.getDay()] ?? "",
    day: pad(date.getDate()),
    month: MONTHS_SHORT[date.getMonth()] ?? "",
  };
};

// "Di 27.10."
export const formatShortDate = (value?: string) => {
  const date = parseLocalDate(value);
  if (!date) return value ?? "";

  return `${WEEKDAYS[date.getDay()]} ${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`;
};

// "Dienstag, 27.10."
export const formatLongDate = (value?: string) => {
  const date = parseLocalDate(value);
  if (!date) return value ?? "";

  const weekday = new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(
    date,
  );
  return `${weekday}, ${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`;
};

export const formatMonthLabel = (value?: string) => {
  const date = parseLocalDate(value);
  if (!date) return "";

  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
};

export const daysUntil = (value?: string, now = new Date()) => {
  const date = parseLocalDate(value);
  if (!date) return null;

  return Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS,
  );
};

export const isTodayOrLater = (value?: string, now = new Date()) => {
  const days = daysUntil(value, now);
  return days !== null && days >= 0;
};

export const formatCountdown = (days: number | null) => {
  if (days === null || days < 0) return "";
  if (days === 0) return "Heute";
  if (days === 1) return "Morgen";
  return `in ${days} Tagen`;
};

export type WeekInfo = {
  key: string;
  week: number;
  rangeLabel: string;
};

// ISO-Kalenderwoche (Montag bis Sonntag).
export const getWeekInfo = (value?: string): WeekInfo | null => {
  const date = parseLocalDate(value);
  if (!date) return null;

  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const week = Math.ceil(
    (Math.round((thursday.getTime() - yearStart.getTime()) / DAY_MS) + 1) / 7,
  );

  const sameMonth = monday.getMonth() === sunday.getMonth();
  const rangeLabel = sameMonth
    ? `${pad(monday.getDate())}.–${pad(sunday.getDate())}. ${MONTHS_LONG[sunday.getMonth()]}`
    : `${pad(monday.getDate())}. ${MONTHS_SHORT[monday.getMonth()]}.–${pad(sunday.getDate())}. ${MONTHS_SHORT[sunday.getMonth()]}.`;

  return {
    key: `${thursday.getFullYear()}-${week}`,
    week,
    rangeLabel,
  };
};

// Instagram-Captions nutzen oft "𝙁𝙚𝙩𝙩𝙚" Unicode-Buchstaben und Emojis.
// NFKC macht daraus normale Buchstaben, Emojis fliegen raus.
export const cleanSocialText = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()} …`;

const OWN_CLUB = /ottweiler/i;
const OWN_SECOND_TEAM = /ottweiler\s*(ii|2)\b/i;

export const isOwnClub = (name?: string) => Boolean(name && OWN_CLUB.test(name));

export type OwnTeam = "teamOne" | "teamTwo";

export const getOwnTeam = (
  homeTeam?: string,
  awayTeam?: string,
): OwnTeam | null => {
  const names = [homeTeam, awayTeam].filter(Boolean) as string[];
  if (names.some((name) => OWN_SECOND_TEAM.test(name))) return "teamTwo";
  if (names.some((name) => OWN_CLUB.test(name))) return "teamOne";
  return null;
};

export const ownTeamLabel = (team: OwnTeam | null) =>
  team === "teamTwo" ? "2. Mannschaft" : team === "teamOne" ? "1. Mannschaft" : "Verein";
