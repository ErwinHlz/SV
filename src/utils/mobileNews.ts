import type { NewsEntry } from "@/utils/contentEntries";
import { cleanSocialText, truncate } from "@/utils/mobileFormat";

export type MobileNewsItem = NewsEntry & {
  cleanTitle: string;
  cleanExcerpt: string;
  isAlbum: boolean;
};

const excerptFor = (item: NewsEntry) => {
  // Bei Instagram ist die erste Caption-Zeile schon der Titel.
  const body =
    item.source === "Instagram" && item.content
      ? item.content.split("\n").slice(1).join(" ")
      : item.excerpt;

  return truncate(cleanSocialText(body), 200);
};

export const toMobileNews = (item: NewsEntry): MobileNewsItem => ({
  ...item,
  cleanTitle: cleanSocialText(item.title) || item.title,
  cleanExcerpt: excerptFor(item),
  isAlbum: (item.media?.length ?? 0) > 1,
});
