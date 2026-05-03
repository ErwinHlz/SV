import newsImage from "@/assets/home/news.svg";
import termineImage from "@/assets/home/termine.svg";
import ergebnisseImage from "@/assets/home/ergebnisse.svg";
import spielberichtImageOne from "@/assets/spielberichte/stock_spielberichte_1.png";
import spielberichtImageTwo from "@/assets/spielberichte/stock_spielberichte_2.jpg";
import spielberichtImageThree from "@/assets/spielberichte/stock_spielberichte_3.png";
import rawNews from "@/content/news.json";
import rawInstagramPosts from "@/content/instagram-posts.json";
import rawSpielberichte from "@/content/spielberichte.json";
import rawSpielTermine from "@/content/spiel-termine.json";
import rawVereinslogos from "@/content/vereinslogos.json";

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

const vereinslogoAssets = import.meta.glob("../assets/vereinslogos/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

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
  mapsUrl?: string;
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
    .replace(/\bsg\b/g, "")
    .replace(/\bfsg\b/g, "")
    .replace(/\b08\b/g, "")
    .replace(/\bii\b/g, "2")
    .replace(/\biii\b/g, "3")
    .replace(/\s+/g, " ")
    .trim();

const vereinslogos = rawVereinslogos as VereinslogoEntry[];
const ownClubName = "FSG Ottweiler-Steinbach II";
const ownClubLogo = Object.entries(vereinslogoAssets).find(([path]) =>
  path.endsWith("/fsg_logo.svg"),
)?.[1];
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
  ["fsg ottweiler steinbach 2", ownClubName],
  ["ottweiler steinbach 2", ownClubName],
  ["fsg ottweiler steinbach ii", ownClubName],
  ["ottweiler steinbach ii", ownClubName],
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
]);

const clubLogoMap = new Map(
  vereinslogos.map((club) => {
    if (club.name === ownClubName && ownClubLogo) {
      return [normalizeClubName(club.name), ownClubLogo] as const;
    }

    const expectedFile = clubLogoFiles.get(club.name);
    const assetPath = Object.entries(vereinslogoAssets).find(([path]) =>
      expectedFile ? path.endsWith(`/${expectedFile}`) : false,
    )?.[1];

    return [normalizeClubName(club.name), assetPath ?? club.logo] as const;
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

const pickSpielberichtImage = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return spielberichtImages[hash % spielberichtImages.length] ?? spielberichtImageOne;
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

const getInstagramMediaItems = (post: InstagramPostSource): NewsMediaItem[] => {
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
    const mediaType = mapInstagramMediaType(media.media_type, media.typ);
    const src = media.media_url || media.bild || media.thumbnail_url;
    const poster = media.thumbnail_url || media.bild || media.media_url;

    if (!src) {
      return;
    }

    items.push({
      id: String(media.id),
      type: mediaType,
      src,
      poster: mediaType === "video" ? poster : undefined,
      alt: `Instagram-Beitrag von @${post.username}`,
      permalink: media.permalink || post.permalink,
    });
  });

  return items;
};

const instagramPosts = rawInstagramPosts.posts as InstagramPostSource[];

export const getNewsItems = (): NewsEntry[] => {
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
      image: post.media_url || post.bild,
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
      sortByDateTimeDesc(rawSpielTermine).map((item) => {
        const opponent = getOpponentFromTerminTitle(item.title);
        const isHome = isHomeTermin(item.title, item.location);
        const homeTeam = isHome ? ownClubName : opponent;
        const awayTeam = isHome ? opponent : ownClubName;

        return {
          ...item,
          homeTeam,
          awayTeam,
          homeLogo: getClubLogo(homeTeam),
          awayLogo: getClubLogo(awayTeam),
        };
      }),
    ),
  );

export const getSpielberichtItems = (): SpielberichtEntry[] => {
  const mappedReports: SpielberichtEntry[] = rawSpielberichte.reports.map((report) => ({
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
    slug: "",
  }));

  return withUniqueSlugs(withResolvedAssets(sortByDateTimeDesc(mappedReports)));
};

export const findNewsBySlug = (slug: string) =>
  getNewsItems().find((item) => item.slug === slug);

export const findTerminBySlug = (slug: string) =>
  getTerminItems().find((item) => item.slug === slug);

export const findSpielberichtBySlug = (slug: string) =>
  getSpielberichtItems().find((item) => item.slug === slug);
