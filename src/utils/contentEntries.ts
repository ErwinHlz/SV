import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import spielberichtImageOne from "@/assets/spielberichte/stock_spielberichte_1.png";
import spielberichtImageTwo from "@/assets/spielberichte/stock_spielberichte_2.jpg";
import spielberichtImageThree from "@/assets/spielberichte/stock_spielberichte_3.png";
import rawNews from "@/content/news.json";
import rawInstagramPosts from "@/content/instagram-posts.json";
import rawSpielberichte from "@/content/spielberichte.json";
import rawTermine from "@/content/termine.json";

const imageMap: Record<string, string> = {
  newsImage,
  termineImage,
  ergebnisseImage,
};

const spielberichtImages = [
  spielberichtImageOne,
  spielberichtImageTwo,
  spielberichtImageThree,
];

export type NewsEntry = {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  imageAlt: string;
  slug: string;
  source?: string;
  externalUrl?: string;
  media?: NewsMediaItem[];
};

export type NewsMediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  permalink?: string;
};

export type TerminEntry = {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  time: string;
  location: string;
  image: string;
  imageAlt: string;
  slug: string;
  source?: string;
  externalUrl?: string;
};

export type SpielberichtEntry = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  time: string;
  image: string;
  imageAlt: string;
  slug: string;
  competition: string;
  location: string;
  result: string;
  halfTime?: string;
  homeTeam: string;
  awayTeam: string;
  sourceUrl: string;
  matchUrl: string;
  author: string;
};

export const slugifyTitle = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const withResolvedAssets = <T extends { image: string }>(items: T[]) =>
  items.map((item) => ({
    ...item,
    image: imageMap[item.image] ?? item.image,
  }));

const withUniqueSlugs = <T extends { id: number | string; title: string }>(
  items: T[],
) => {
  const slugCounts = new Map<string, number>();

  return items.map((item) => {
    const baseSlug = slugifyTitle(item.title) || `eintrag-${item.id}`;
    const seenCount = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, seenCount + 1);

    return {
      ...item,
      slug: seenCount === 0 ? baseSlug : `${baseSlug}-${item.id}`,
    };
  });
};

const sortByDateTimeDesc = <T extends { date: string; time?: string }>(
  items: T[],
) =>
  [...items].sort((a, b) => {
    const left = Date.parse(`${a.date}T${a.time ?? "00:00"}:00`);
    const right = Date.parse(`${b.date}T${b.time ?? "00:00"}:00`);
    return right - left;
  });

const pickSpielberichtImage = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return spielberichtImages[hash % spielberichtImages.length];
};

const getInstagramPostTitle = (caption: string, fallback: string) => {
  const firstLine = caption
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  return firstLine ?? fallback;
};

const getInstagramPostExcerpt = (caption: string) => {
  const compact = caption.replace(/\s+/g, " ").trim();
  return compact.length <= 180 ? compact : `${compact.slice(0, 177)}...`;
};

const getLocalTimeFromTimestamp = (timestamp: string) =>
  new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Berlin",
  }).format(new Date(timestamp));

const mapInstagramMediaType = (
  mediaType?: string,
  typ?: string,
): "image" | "video" =>
  mediaType === "VIDEO" || typ === "VIDEO" || mediaType === "REEL"
    ? "video"
    : "image";

const getInstagramMediaItems = (
  post: (typeof rawInstagramPosts.posts)[number],
): NewsMediaItem[] => {
  const mediaItems = post.medien?.length
    ? post.medien
    : [
        {
          id: post.id,
          typ: post.typ,
          media_type: post.media_type,
          media_url: post.bild,
          thumbnail_url: "",
          permalink: post.permalink,
        },
      ];

  return mediaItems
    .map((media) => {
      const mediaType = mapInstagramMediaType(media.media_type, media.typ);
      const src = media.media_url || media.bild || media.thumbnail_url;
      const poster = media.thumbnail_url || media.bild || media.media_url;

      if (!src) {
        return null;
      }

      return {
        id: String(media.id),
        type: mediaType,
        src,
        poster: mediaType === "video" ? poster : undefined,
        alt: `Instagram-Beitrag von @${post.username}`,
        permalink: media.permalink || post.permalink,
      };
    })
    .filter((media): media is NewsMediaItem => media !== null);
};

export const getNewsItems = (): NewsEntry[] =>
  withUniqueSlugs(
    withResolvedAssets(
      sortByDateTimeDesc([
        ...rawNews,
        ...rawInstagramPosts.posts.map((post) => ({
          id: `instagram-${post.id}`,
          title: getInstagramPostTitle(
            post.caption,
            `Instagram-Post von @${post.username}`,
          ),
          excerpt: getInstagramPostExcerpt(post.caption),
          content: post.caption,
          date: post.datum,
          time: getLocalTimeFromTimestamp(post.timestamp),
          image: post.media_url || post.bild,
          imageAlt: `Instagram-Beitrag von @${post.username}`,
          source: "Instagram",
          externalUrl: post.permalink,
          media: getInstagramMediaItems(post),
        })),
      ]),
    ),
  );

export const getTerminItems = (): TerminEntry[] =>
  withUniqueSlugs(withResolvedAssets(sortByDateTimeDesc(rawTermine)));

export const getSpielberichtItems = (): SpielberichtEntry[] =>
  withUniqueSlugs(
    withResolvedAssets(
      sortByDateTimeDesc(
        rawSpielberichte.reports.map((report) => ({
          id: report.id,
          title: report.titel,
          excerpt: report.kurztext,
          content: report.text,
          date: report.datum,
          time: report.uhrzeit,
          image: pickSpielberichtImage(report.id),
          imageAlt: `${report.spiel.heimmannschaft} gegen ${report.spiel.gastmannschaft}`,
          competition: report.wettbewerb,
          location: report.spiel.ort,
          result: report.spiel.ergebnis,
          halfTime: report.spiel.halbzeit,
          homeTeam: report.spiel.heimmannschaft,
          awayTeam: report.spiel.gastmannschaft,
          sourceUrl: report.url,
          matchUrl: report.spiel_url,
          author: report.autor,
        })),
      ),
    ),
  );

export const findNewsBySlug = (slug: string) =>
  getNewsItems().find((item) => item.slug === slug);

export const findTerminBySlug = (slug: string) =>
  getTerminItems().find((item) => item.slug === slug);

export const findSpielberichtBySlug = (slug: string) =>
  getSpielberichtItems().find((item) => item.slug === slug);
