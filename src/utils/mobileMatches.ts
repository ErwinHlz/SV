import rawMatchHighlights from "@/content/match-highlights.json";
import { getClubLogo, getTerminItems, type TerminEntry } from "@/utils/contentEntries";
import { getOwnTeam, isOwnClub, type OwnTeam } from "@/utils/mobileFormat";

type HighlightEntry = {
  heimmannschaft: string;
  gastmannschaft: string;
  ergebnis: string;
  bild_heim: string;
  bild_gast: string;
  ort: string;
  datum: string;
  uhrzeit: string;
  match_url?: string;
};

type TeamHighlights = {
  last: HighlightEntry | null;
  live: HighlightEntry | null;
  next: HighlightEntry | null;
};

const highlights = rawMatchHighlights as Record<OwnTeam, TeamHighlights>;

export type MatchResult = "Sieg" | "Remis" | "Niederlage";

export type MobileMatch = {
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  date: string;
  time: string;
  place: string;
  score?: string;
  result?: MatchResult;
  isHome: boolean;
  competition?: string;
  matchday?: string;
  url?: string;
  slug?: string;
};

export type MatchCenter = {
  last: MobileMatch | null;
  primary: MobileMatch | null;
  primaryLabel: string;
  secondary: MobileMatch | null;
  secondaryLabel: string;
};

const getResult = (score: string, isHome: boolean): MatchResult | undefined => {
  const [home = Number.NaN, away = Number.NaN] = score
    .split(":")
    .map((part) => Number.parseInt(part, 10));
  if (Number.isNaN(home) || Number.isNaN(away)) return undefined;

  const own = isHome ? home : away;
  const other = isHome ? away : home;
  if (own === other) return "Remis";
  return own > other ? "Sieg" : "Niederlage";
};

const matchTermine = () =>
  getTerminItems().filter((item) => item.homeTeam && item.awayTeam);

const findTermin = (team: OwnTeam, date: string) =>
  matchTermine().find(
    (item) =>
      item.date === date && getOwnTeam(item.homeTeam, item.awayTeam) === team,
  );

const fromHighlight = (team: OwnTeam, entry: HighlightEntry): MobileMatch => {
  const isHome = isOwnClub(entry.heimmannschaft);
  const termin = findTermin(team, entry.datum);
  const hasScore = /\d+\s*:\s*\d+/.test(entry.ergebnis);

  return {
    homeTeam: entry.heimmannschaft,
    awayTeam: entry.gastmannschaft,
    homeLogo: getClubLogo(entry.heimmannschaft) ?? entry.bild_heim,
    awayLogo: getClubLogo(entry.gastmannschaft) ?? entry.bild_gast,
    date: entry.datum,
    time: entry.uhrzeit,
    place: entry.ort,
    score: hasScore ? entry.ergebnis.replace(/\s/g, "") : undefined,
    result: hasScore ? getResult(entry.ergebnis, isHome) : undefined,
    isHome,
    competition: termin?.competition,
    matchday: termin?.matchday,
    url: entry.match_url,
    slug: termin?.slug,
  };
};

export const fromTermin = (termin: TerminEntry): MobileMatch => ({
  homeTeam: termin.homeTeam ?? "",
  awayTeam: termin.awayTeam ?? "",
  homeLogo: termin.homeLogo,
  awayLogo: termin.awayLogo,
  date: termin.date,
  time: termin.time,
  place: termin.location,
  isHome: isOwnClub(termin.homeTeam),
  competition: termin.competition,
  matchday: termin.matchday,
  url: termin.externalUrl,
  slug: termin.slug,
});

export const getMatchCenter = (team: OwnTeam): MatchCenter => {
  const entry = highlights[team];
  const live = entry.live ? fromHighlight(team, entry.live) : null;
  const next = entry.next ? fromHighlight(team, entry.next) : null;
  const primary = live ?? next;

  // Ohne "aktuelles" Spiel rueckt das naechste nach vorne; darunter steht
  // dann das uebernaechste aus den Spielterminen.
  let secondary = live ? next : null;
  if (!secondary && primary) {
    const following = matchTermine().find(
      (item) =>
        item.date > primary.date &&
        getOwnTeam(item.homeTeam, item.awayTeam) === team,
    );
    secondary = following ? fromTermin(following) : null;
  }

  return {
    last: entry.last ? fromHighlight(team, entry.last) : null,
    primary,
    primaryLabel: live ? "Aktueller Spieltag" : "Nächstes Spiel",
    secondary,
    secondaryLabel: live ? "Nächstes" : "Danach",
  };
};

// Fruehestes anstehendes Spiel beider Mannschaften (fuer das Menue).
export const getNextOwnMatch = (): MobileMatch | null => {
  const candidates = (["teamOne", "teamTwo"] as const)
    .map((team) => getMatchCenter(team).primary)
    .filter((match): match is MobileMatch => match !== null)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return candidates[0] ?? null;
};
