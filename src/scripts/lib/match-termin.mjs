export function parseCompetitionHeading(heading = "") {
  const text = heading.replace(/\s+/g, " ").trim();
  const match = text.match(/^(.*?),\s*(\d+\.\s*Spieltag|.*?runde|.*?finale)$/i);
  return match
    ? { competition: match[1].trim(), matchday: match[2].trim() }
    : { competition: text, matchday: "" };
}

export function createTermin(match, id) {
  const opponent = match.isHome ? match.awayTeam : match.homeTeam;
  const ownTeam = match.isHome ? match.homeTeam : match.awayTeam;
  const ownTeamLabel = /^SV\b/.test(ownTeam) ? ownTeam : `SV ${ownTeam}`;
  const location = match.venue || (match.isHome ? "Stadion Im Alten Weiher" : `Auswärts bei ${opponent}`);
  return {
    id,
    title: `${match.isHome ? "Heimspiel" : "Auswärtsspiel"} gegen ${opponent}`,
    excerpt: `${match.isHome ? "Heimspiel" : "Auswärtsspiel"} des ${ownTeamLabel}. Kommt vorbei und unterstützt das Team.`,
    date: match.date,
    time: match.time,
    location,
    content: `Anpfiff ist um ${match.time} Uhr. ${match.homeTeam} spielt gegen ${match.awayTeam}. Spielort: ${location}.`,
    image: "matchTemplate",
    imageAlt: `${match.homeTeam} gegen ${match.awayTeam}`,
    competition: match.competition || "",
    matchday: match.matchday || "",
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    externalUrl: match.matchUrl,
    mapsUrl: match.mapsUrl || "",
  };
}
