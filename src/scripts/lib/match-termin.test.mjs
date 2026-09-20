import assert from "node:assert/strict";
import test from "node:test";
import { createTermin, parseCompetitionHeading } from "./match-termin.mjs";

test("Liga und tatsächlicher Spieltag, auch bei Nachholspielen", () => {
  assert.deepEqual(parseCompetitionHeading("Kreisliga A Blies, 6. Spieltag"), {
    competition: "Kreisliga A Blies", matchday: "6. Spieltag",
  });
  assert.deepEqual(parseCompetitionHeading(" Saarlandpokal,  Achtelfinale "), {
    competition: "Saarlandpokal", matchday: "Achtelfinale",
  });
});

test("Fehlende Angaben werden nicht erfunden", () => {
  assert.deepEqual(parseCompetitionHeading(), { competition: "", matchday: "" });
  assert.deepEqual(parseCompetitionHeading("Freundschaftsspiel"), {
    competition: "Freundschaftsspiel", matchday: "",
  });
});

test("Termine behalten Teams, Spieltag, Anstoßzeit und Spielort für die Vorlage", () => {
  const match = {
    homeTeam: "Hofeld", awayTeam: "Ottweiler II", isHome: false,
    date: "2026-09-20", time: "15:00", venue: "Sportplatz Hofeld",
    competition: "Kreisliga A Blies", matchday: "8. Spieltag",
    matchUrl: "https://example.org/match", mapsUrl: "https://example.org/maps",
  };
  const result = createTermin(match, 1);
  assert.equal(result.image, "matchTemplate");
  assert.equal(result.homeTeam, "Hofeld");
  assert.equal(result.awayTeam, "Ottweiler II");
  assert.equal(result.matchday, "8. Spieltag");
  assert.equal(result.competition, "Kreisliga A Blies");
  assert.equal(result.time, "15:00");
  assert.equal(result.location, "Sportplatz Hofeld");
  assert.equal(result.mapsUrl, match.mapsUrl);
  assert.equal(createTermin({ ...match, venue: "" }, 2).location, "Auswärts bei Hofeld");
  assert.equal(createTermin({ ...match, isHome: true, venue: "" }, 3).location, "Stadion Im Alten Weiher");
});
