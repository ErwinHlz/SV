import svLogoFarbe from "@/assets/sv_logo_farbe.svg";
import djkVsSv from "@/assets/historie/djk_vs_sv.jpg";
import historie10 from "@/assets/historie/historie_10.jpg";
import historie11 from "@/assets/historie/historie_11.jpg";
import historie12 from "@/assets/historie/historie_12.jpg";
import historie13 from "@/assets/historie/historie_13.jpg";
import historie14 from "@/assets/historie/historie_14.jpg";
import historie15 from "@/assets/historie/historie_15.jpg";
import historie16 from "@/assets/historie/historie_16.jpg";
import historie18 from "@/assets/historie/historie_18.jpg";
import historie19 from "@/assets/historie/historie_19.jpg";
import historie3 from "@/assets/historie/historie_3.jpg";
import historie4 from "@/assets/historie/historie_4.jpg";
import historie5 from "@/assets/historie/historie_5.jpg";
import historie6 from "@/assets/historie/historie_6.jpg";
import historie7 from "@/assets/historie/historie_7.jpg";
import historie8 from "@/assets/historie/historie_8.jpg";
import verbandsliga1979 from "@/assets/historie/verbandsliga_1979.jpg";

const timelineAssetMap: Record<string, string> = {
  "/sv_logo_farbe.svg": svLogoFarbe,
  "/historie/djk_vs_sv.jpg": djkVsSv,
  "/historie/historie_3.jpg": historie3,
  "/historie/historie_4.jpg": historie4,
  "/historie/historie_5.jpg": historie5,
  "/historie/historie_6.jpg": historie6,
  "/historie/historie_7.jpg": historie7,
  "/historie/historie_8.jpg": historie8,
  "/historie/historie_10.jpg": historie10,
  "/historie/historie_11.jpg": historie11,
  "/historie/historie_12.jpg": historie12,
  "/historie/historie_13.jpg": historie13,
  "/historie/historie_14.jpg": historie14,
  "/historie/historie_15.jpg": historie15,
  "/historie/historie_16.jpg": historie16,
  "/historie/historie_18.jpg": historie18,
  "/historie/historie_19.jpg": historie19,
  "/historie/verbandsliga_1979.jpg": verbandsliga1979,
};

export const resolveTimelineImagePath = (imageSrc?: string) => {
  if (!imageSrc) {
    return undefined;
  }

  if (timelineAssetMap[imageSrc]) {
    return timelineAssetMap[imageSrc];
  }

  if (imageSrc.startsWith("/timeline/")) {
    return `${import.meta.env.BASE_URL}${imageSrc.replace(/^\/+/, "")}`;
  }

  return imageSrc;
};
