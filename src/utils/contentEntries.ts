import matchTemplate from "@/assets/Spieltag Template.png";
import spielberichtTemplate from "@/assets/Spielberichte_template.png";
import { getGalleryPlaceholder, galleryPlaceholderAlt } from "@/utils/galleryPlaceholders";
import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import externalContentNotAllowedImage from "@/assets/placeholder/extern_content_not_allowed.png";
import rawNews from "@/content/news.json";
import rawInstagramPostsJson from "@/content/instagram-posts.json?raw";
import rawSpielberichte from "@/content/spielberichte.json";
import rawSpielTermine from "@/content/spiel-termine.json";
import rawVereinstermine from "@/content/vereinstermine.json";
import rawVereinslogos from "@/content/vereinslogos.json";
import ownClubCrest from "@/assets/sv_logo_farbe.svg";
import { useCookieConsent } from "@/composables/useCookieConsent";

const imageMap: Record<string, string> = {
  newsImage,
  termineImage,
  ergebnisseImage,
};

const instagramPlaceholderImage = externalContentNotAllowedImage;

const vereinslogoAssets = import.meta.glob("../assets/vereinslogos/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Manuell gepflegte Termin-Bilder (z.B. Vereinsfeste), die nicht vom
// FuPa-Scraper (spiele-als-termine.mjs) stammen.
const termineEventAssets = import.meta.glob("../assets/termine/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const resolveTermineEventImage = (image: string) => {
  const assetPath = Object.entries(termineEventAssets).find(
    ([path]) => path.split("/").pop() === image,
  )?.[1];

  return assetPath ?? image;
};

type VereinslogoEntry = {
  name: string;
  slug: string;
  logo: string;
  sourceUrl?: string;
  originalLogoUrl?: string;
};

type InstagramMediaSource = {
  id: string;
  typ?: string;
  media_type?: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  bild?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramPostSource = {
  id: string;
  username: string;
  typ?: string;
  media_type?: string;
  media_product_type?: string;
  datum: string;
  timestamp: string;
  caption: string;
  kurztext?: string;
  bild: string;
  media_url?: string;
  permalink: string;
  medien?: InstagramMediaSource[];
};

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
  // "instagram-embed": Instagram liefert für dieses Medium keine media_url
  // (typischerweise Reels mit urheberrechtlich geschützter Musik). Statt eines
  // kaputten <video> wird hier über Instagrams eigenes Embed-Widget abgespielt.
  type: "image" | "video" | "instagram-embed";
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
  mapsUrl?: string;
  competition?: string;
  matchday?: string;
  isMatchTemplate?: boolean;
  homeTeam?: string;
  awayTeam?: string;
  homeLogo?: string;
  awayLogo?: string;
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
  isMatchTemplate?: boolean;
  homeLogo?: string;
  awayLogo?: string;
};

export const slugifyTitle = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const withResolvedAssets = <T extends { id: number | string; image: string; imageAlt: string }>(items: T[]) =>
  items.map((item) => {
    const isPlaceholder = !item.image || Object.prototype.hasOwnProperty.call(imageMap, item.image);
    return {
      ...item,
      image: isPlaceholder
        ? getGalleryPlaceholder(`content:${item.image}:${item.id}`)
        : item.image,
      imageAlt: isPlaceholder ? galleryPlaceholderAlt : item.imageAlt,
    };
  });

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
    const left = Date.parse(`${a.date}T${a.time || "00:00"}:00`);
    const right = Date.parse(`${b.date}T${b.time || "00:00"}:00`);
    return right - left;
  });

const sortByDateTimeAsc = <T extends { date: string; time?: string }>(
  items: T[],
) =>
  [...items].sort((a, b) => {
    const left = Date.parse(`${a.date}T${a.time || "00:00"}:00`);
    const right = Date.parse(`${b.date}T${b.time || "00:00"}:00`);
    return left - right;
  });

const normalizeClubName = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " und ")
    .replace(/[/.]/g, " ")
    .replace(/\bsv\b/g, "")
    .replace(/\bsc\b/g, "")
    .replace(/\bvfb\b/g, "")
    .replace(/\bvfr\b/g, "")
    .replace(/\bsg\b/g, "")
    .replace(/\bfsg\b/g, "")
    .replace(/\b08\b/g, "")
    .replace(/\bii\b/g, "2")
    .replace(/\biii\b/g, "3")
    .replace(/\s+/g, " ")
    .trim();

const vereinslogos = rawVereinslogos as VereinslogoEntry[];

// Namensvarianten des eigenen Vereins (alt: FSG Ottweiler-Steinbach, neu:
// SV Ottweiler) - alle bekommen immer das eigene Wappen, unabhängig davon,
// was für sie in vereinslogos.json gescraped wurde.
const ownClubNames = new Set(
  [
    "FSG Ottweiler-Steinbach",
    "FSG Ottweiler-Steinbach II",
    "FSG Ottweiler-Steinbach 2",
    "SV Ottweiler",
    "SV Ottweiler II",
    "Ottweiler",
    "Ottweiler II",
  ].map(normalizeClubName),
);

// Anzeigename der 2. Mannschaft für die "Termine" (spiele-als-termine.mjs
// scraped nur für die 2. Mannschaft).
const terminOwnClubName = "Ottweiler II";
const clubLogoFiles = new Map<string, string>([
  ["Alsweiler", "alsweiler.png"],
  ["Bubach-C.", "bubach.png"],
  ["Dirmingen-B.", "dirmingen-b.png"],
  ["FSG Schiffweiler-Landsweiler II", "schiffweiler.png"],
  ["Habach", "habach.png"],
  ["Heiligenwald", "heiligenwald.png"],
  ["Heusweiler II", "heusweiler.png"],
  ["Humes", "humes.png"],
  ["Hüttigweiler", "hüttigweiler.png"],
  ["Merchweiler II", "merchweiler.png"],
  ["Saubach II", "saubach.png"],
  ["SG Lebach-Landsweiler II", "landsweiler-lebach.png"],
  ["SG Marpingen-Urexweiler II", "marpingen.png"],
  ["SG Thalex./Aschbach", "thalexweiler.png"],
  ["Wemmetsweil.", "wemmetsweiler.png"],
]);

const logoAliases = new Map<string, string>([
  ["fsg ottweiler steinbach 2", "Ottweiler II"],
  ["ottweiler steinbach 2", "Ottweiler II"],
  ["fsg ottweiler steinbach ii", "Ottweiler II"],
  ["ottweiler steinbach ii", "Ottweiler II"],
  ["saubach 2", "Saubach II"],
  ["sg saubach 2", "Saubach II"],
  ["sv merchweiler 2", "Merchweiler II"],
  ["merchweiler 2", "Merchweiler II"],
  ["sg dirmingen berschweiler", "Dirmingen-B."],
  ["dirmingen berschweiler", "Dirmingen-B."],
  ["sg thalexweiler aschbach", "SG Thalex./Aschbach"],
  ["thalexweiler aschbach", "SG Thalex./Aschbach"],
  ["sc wemmatia wemmetsweiler", "Wemmetsweil."],
  ["wemmetsweiler", "Wemmetsweil."],
  ["sc wemmetsweiler", "Wemmetsweil."],
  ["fsg 08 schiffweiler landsweiler 2", "FSG Schiffweiler-Landsweiler II"],
  ["schiffweiler landsweiler 2", "FSG Schiffweiler-Landsweiler II"],
  ["sg lebach landsweiler 2", "SG Lebach-Landsweiler II"],
  ["lebach landsweiler 2", "SG Lebach-Landsweiler II"],
  ["sg marpingen urexweiler 2", "SG Marpingen-Urexweiler II"],
  ["marpingen urexweiler 2", "SG Marpingen-Urexweiler II"],
  ["hettigweiler", "Hüttigweiler"],
  ["huettigweiler", "Hüttigweiler"],
  // fussball.de nennt Vereine bei den Spielberichten mit vollem Namen statt
  // der bei FuPa (vereinslogos.json) üblichen Kurzform.
  ["nohfelden-wolfersweiler 2", "SG Nohfelden-Wolfersw. II"],
  ["fc niederlinxweiler", "Niederlinxw."],
  ["oberkirchen grugelborn 2", "SG Oberkirchen-Grügelb. II"],
  ["fc blau-weiß st wendel 2", "St. Wendel II"],
  ["leitersweiler", "Leitersw."],
  ["victoria st wendel", "Vict. WND"],
]);

const clubLogoMap = new Map(
  vereinslogos.map((club) => {
    if (ownClubNames.has(normalizeClubName(club.name))) {
      return [normalizeClubName(club.name), ownClubCrest] as const;
    }

    const expectedFile = clubLogoFiles.get(club.name);
    const curatedAssetPath = expectedFile
      ? Object.entries(vereinslogoAssets).find(([path]) =>
          path.endsWith(`/${expectedFile}`),
        )?.[1]
      : undefined;

    // Fallback für Vereine ohne manuellen Eintrag in clubLogoFiles: das
    // Scraper-Skript legt Logos bereits unter ihrem eigenen slug ab.
    const slugAssetPath = Object.entries(vereinslogoAssets).find(([path]) =>
      path.split("/").pop()?.startsWith(`${club.slug}.`),
    )?.[1];

    return [
      normalizeClubName(club.name),
      curatedAssetPath ?? slugAssetPath ?? club.logo,
    ] as const;
  }),
);

const clubSourceUrlMap = new Map(
  vereinslogos.map((club) => [
    normalizeClubName(club.name),
    club.sourceUrl,
  ] as const),
);

export const getClubLogo = (clubName?: string) => {
  if (!clubName) {
    return undefined;
  }

  const normalized = normalizeClubName(clubName);

  if (ownClubNames.has(normalized)) {
    return ownClubCrest;
  }

  const aliasTarget = logoAliases.get(normalized);
  const lookupKey = aliasTarget ? normalizeClubName(aliasTarget) : normalized;
  return clubLogoMap.get(lookupKey);
};

export const getClubSourceUrl = (clubName?: string) => {
  if (!clubName) {
    return undefined;
  }

  const normalized = normalizeClubName(clubName);
  const aliasTarget = logoAliases.get(normalized);
  const lookupKey = aliasTarget ? normalizeClubName(aliasTarget) : normalized;
  return clubSourceUrlMap.get(lookupKey);
};

const getOpponentFromTerminTitle = (title: string) => {
  const match = title.match(/gegen\s+(.+)$/i);
  return match?.[1]?.trim() ?? title.trim();
};

const isHomeTermin = (title: string, location: string) =>
  /^heimspiel/i.test(title) || /ottweiler/i.test(location);

// Nur Titel im Schema von createTermin() (match-termin.mjs) sind echte
// Spiele - alles andere (z.B. manuell gepflegte Vereinsfeste in
// vereinstermine.json) soll keine Heim-/Auswärtsteam-Zuordnung erfinden,
// nur weil der Ort zufällig "Ottweiler" enthält.
const MATCH_TITLE_PATTERN = /^(heimspiel|auswärtsspiel)\s+gegen\s+/i;

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

const getInstagramMediaItems = (post: InstagramPostSource): NewsMediaItem[] => {
  const { hasExternalMediaConsent } = useCookieConsent();
  if (!hasExternalMediaConsent.value) {
    return [];
  }

  const mediaItems: InstagramMediaSource[] = post.medien?.length
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

  const items: NewsMediaItem[] = [];

  mediaItems.forEach((media) => {
    const isVideoLike = mapInstagramMediaType(media.media_type, media.typ) === "video";
    const permalink = media.permalink || post.permalink;
    const poster = media.thumbnail_url || media.bild || media.media_url;

    // Instagram liefert für manche Videos/Reels keine media_url zurück,
    // insbesondere bei urheberrechtlich geschützter Musik. In dem Fall gibt es
    // keine abspielbare Videodatei - stattdessen über Instagrams eigenes
    // Embed-Widget abspielen (das lädt das Video direkt von Instagram).
    const mediaType: NewsMediaItem["type"] = !isVideoLike
      ? "image"
      : media.media_url
        ? "video"
        : "instagram-embed";

    if (mediaType === "instagram-embed") {
      if (!permalink) {
        return;
      }

      items.push({
        id: String(media.id),
        type: mediaType,
        src: poster || "",
        alt: `Instagram-Beitrag von @${post.username}`,
        permalink,
      });
      return;
    }

    const src =
      mediaType === "video"
        ? media.media_url
        : media.bild || media.thumbnail_url || media.media_url;

    if (!src) {
      return;
    }

    items.push({
      id: String(media.id),
      type: mediaType,
      src,
      poster: mediaType === "video" ? poster : undefined,
      alt: `Instagram-Beitrag von @${post.username}`,
      permalink,
    });
  });

  return items;
};

const rawInstagramPosts = JSON.parse(rawInstagramPostsJson) as {
  posts?: InstagramPostSource[];
};

const instagramPosts = Array.isArray(rawInstagramPosts.posts)
  ? rawInstagramPosts.posts
  : [];

const spielTermine = rawSpielTermine as TerminEntry[];
const vereinstermine = rawVereinstermine as TerminEntry[];

export const getNewsItems = (): NewsEntry[] => {
  const { hasExternalMediaConsent } = useCookieConsent();
  const mappedNews: Array<Omit<NewsEntry, "slug"> & { time?: string }> = [
    ...rawNews,
    ...instagramPosts.map((post) => ({
      id: `instagram-${post.id}`,
      title: getInstagramPostTitle(
        post.caption,
        `Instagram-Post von @${post.username}`,
      ),
      excerpt: getInstagramPostExcerpt(post.caption),
      content: post.caption,
      date: post.datum,
      time: getLocalTimeFromTimestamp(post.timestamp),
      image: hasExternalMediaConsent.value
        ? post.media_url || post.bild
        : instagramPlaceholderImage,
      imageAlt: `Instagram-Beitrag von @${post.username}`,
      source: "Instagram",
      externalUrl: post.permalink,
      media: getInstagramMediaItems(post),
    })),
  ];

  return withUniqueSlugs(withResolvedAssets(sortByDateTimeDesc(mappedNews)));
};

export const getTerminItems = (): TerminEntry[] =>
  withUniqueSlugs(
    withResolvedAssets(
      sortByDateTimeAsc([...spielTermine, ...vereinstermine]).map((item) => {
        const isMatchTitle = MATCH_TITLE_PATTERN.test(item.title);
        const opponent = isMatchTitle ? getOpponentFromTerminTitle(item.title) : undefined;
        const isHome = isMatchTitle && isHomeTermin(item.title, item.location);
        const homeTeam = item.homeTeam || (isMatchTitle ? (isHome ? terminOwnClubName : opponent) : undefined);
        const awayTeam = item.awayTeam || (isMatchTitle ? (isHome ? opponent : terminOwnClubName) : undefined);
        const isMatchTemplateImage = item.image === "matchTemplate" || item.image === "termineImage";

        return {
          ...item,
          isMatchTemplate: isMatchTemplateImage,
          image: isMatchTemplateImage ? matchTemplate : resolveTermineEventImage(item.image),
          homeTeam,
          awayTeam,
          homeLogo: getClubLogo(homeTeam),
          awayLogo: getClubLogo(awayTeam),
        };
      }),
    ),
  );

export const getSpielberichtItems = (): SpielberichtEntry[] => {
  const mappedReports: SpielberichtEntry[] = rawSpielberichte.reports.map((report) => {
    const homeTeam = report.spiel.heimmannschaft;
    const awayTeam = report.spiel.gastmannschaft;

    return {
      id: report.id,
      title: report.titel,
      excerpt: report.kurztext,
      content: report.text,
      date: report.datum,
      time: report.uhrzeit,
      image: spielberichtTemplate,
      imageAlt: `${homeTeam} ${report.spiel.ergebnis} ${awayTeam}`.trim(),
      competition: report.wettbewerb,
      location: report.spiel.ort,
      result: report.spiel.ergebnis,
      halfTime: report.spiel.halbzeit,
      homeTeam,
      awayTeam,
      sourceUrl: report.url,
      matchUrl: report.spiel_url,
      author: report.autor,
      slug: "",
      isMatchTemplate: true,
      homeLogo: getClubLogo(homeTeam),
      awayLogo: getClubLogo(awayTeam),
    };
  });

  return withUniqueSlugs(withResolvedAssets(sortByDateTimeDesc(mappedReports)));
};

export const findNewsBySlug = (slug: string) =>
  getNewsItems().find((item) => item.slug === slug);

export const findTerminBySlug = (slug: string) =>
  getTerminItems().find((item) => item.slug === slug);

export const findSpielberichtBySlug = (slug: string) =>
  getSpielberichtItems().find((item) => item.slug === slug);
