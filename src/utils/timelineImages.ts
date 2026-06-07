const historyImageModules = import.meta.glob("../assets/historie/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const rootAssetModules = import.meta.glob("../assets/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const historyImageMap = Object.fromEntries(
  Object.entries(historyImageModules).map(([key, value]) => [
    key.split("/").pop() ?? key,
    value,
  ]),
);

const rootAssetMap = Object.fromEntries(
  Object.entries(rootAssetModules).map(([key, value]) => [
    key.split("/").pop() ?? key,
    value,
  ]),
);

export const resolveTimelineImagePath = (imageSrc?: string) => {
  if (!imageSrc) {
    return undefined;
  }

  if (imageSrc.startsWith("/historie/")) {
    const filename = imageSrc.split("/").pop();
    return filename ? historyImageMap[filename] : undefined;
  }

  if (imageSrc.startsWith("/") && !imageSrc.includes("/historie/")) {
    const filename = imageSrc.split("/").pop();
    if (filename && rootAssetMap[filename]) {
      return rootAssetMap[filename];
    }
  }

  if (imageSrc.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${imageSrc.replace(/^\/+/, "")}`;
  }

  return imageSrc;
};
