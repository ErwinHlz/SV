import type { SpielberichtEntry } from "@/utils/contentEntries";
import { getOwnTeam, isOwnClub, type OwnTeam } from "@/utils/mobileFormat";

export type ReportOutcome = "S" | "U" | "N";

export type MobileReport = SpielberichtEntry & {
  team: OwnTeam | null;
  homeGoals: string;
  awayGoals: string;
  outcome: ReportOutcome | null;
  paragraphs: string[];
};

const splitScore = (result?: string) => {
  const [home = "–", away = "–"] = (result ?? "").split(":").map((part) => part.trim());
  return { home: home || "–", away: away || "–" };
};

// Ergebnis aus Sicht des SV Ottweiler: S(ieg), U(nentschieden), N(iederlage).
const outcomeOf = (item: SpielberichtEntry, home: string, away: string): ReportOutcome | null => {
  const homeGoals = Number(home);
  const awayGoals = Number(away);
  if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return null;
  if (homeGoals === awayGoals) return "U";

  const ownIsHome = isOwnClub(item.homeTeam);
  const ownIsAway = isOwnClub(item.awayTeam);
  if (ownIsHome === ownIsAway) return null;

  return (homeGoals > awayGoals) === ownIsHome ? "S" : "N";
};

// fussball.de beginnt den Text mit einer Kopfzeile "Liga: Heim – Gast, 0:3 (0:1), Ort",
// die wir mobil bereits als Scoreboard zeigen.
const paragraphsOf = (item: SpielberichtEntry) => {
  const parts = (item.content ?? item.excerpt ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts[0] && item.competition && parts[0].startsWith(`${item.competition}:`)) {
    parts.shift();
  }

  return parts;
};

export const toMobileReport = (item: SpielberichtEntry): MobileReport => {
  const score = splitScore(item.result);

  return {
    ...item,
    team: getOwnTeam(item.homeTeam, item.awayTeam),
    homeGoals: score.home,
    awayGoals: score.away,
    outcome: outcomeOf(item, score.home, score.away),
    paragraphs: paragraphsOf(item),
  };
};

export const outcomeLabel: Record<ReportOutcome, string> = {
  S: "Sieg",
  U: "Remis",
  N: "Niederlage",
};

// Fallback, wenn fuer einen Gegner kein Wappen hinterlegt ist.
export const initials = (name?: string) =>
  (name ?? "")
    .split(/[\s/-]+/)
    .filter((word) => /^[A-ZÄÖÜ]/.test(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
