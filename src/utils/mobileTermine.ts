import type { TerminEntry } from "@/utils/contentEntries";
import { isOwnClub } from "@/utils/mobileFormat";

export const isMatchTermin = (item: TerminEntry) => Boolean(item.homeTeam && item.awayTeam);

export const mapsUrl = (item: TerminEntry) => {
  if (item.mapsUrl) return item.mapsUrl;
  const query = isOwnClub(item.homeTeam)
    ? "Stadion Im Alten Weiher, Ottweiler"
    : `Sportplatz ${item.homeTeam ?? item.location}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const icsText = (value: string) => value.replace(/[\\,;]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");

export const downloadIcs = (item: TerminEntry) => {
  const date = item.date.replace(/-/g, "");
  const time = /^\d{1,2}:\d{2}$/.test(item.time) ? item.time.padStart(5, "0").replace(":", "") : "";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = isMatchTermin(item) ? `${item.homeTeam} – ${item.awayTeam}` : item.title;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SV Ottweiler//Termine//DE",
    "BEGIN:VEVENT",
    `UID:${item.slug}@sv-ottweiler`,
    `DTSTAMP:${stamp}`,
    time ? `DTSTART:${date}T${time}00` : `DTSTART;VALUE=DATE:${date}`,
    time ? "DURATION:PT2H" : "",
    `SUMMARY:${icsText(title)}`,
    item.location ? `LOCATION:${icsText(item.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${item.slug || "termin"}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};
