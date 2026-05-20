import rawSponsors from "@/content/sponsor.json";

type RawSponsor = {
  id: number;
  name: string;
  url: string;
  image: string;
  imageAlt?: string;
};

export type SponsorEntry = RawSponsor & {
  image: string;
};

const sponsorAssetModules = import.meta.glob("../assets/sponsor/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const sponsorAssetMap = Object.fromEntries(
  Object.entries(sponsorAssetModules).map(([path, asset]) => [
    path.split("/").pop() ?? path,
    asset,
  ]),
);

export const getSponsors = (): SponsorEntry[] =>
  (rawSponsors as RawSponsor[]).map((sponsor) => ({
    ...sponsor,
    image: sponsorAssetMap[sponsor.image] ?? sponsor.image,
  }));
