const galleryAssets = import.meta.glob<string>(
  "../assets/galerie/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default" },
);
const images = Object.values(galleryAssets);
const assignedImages = new Map<string, string>();
let remainingImages: string[] = [];
let lastImage: string | undefined;

export const galleryPlaceholderAlt = "Symbolbild aus der Vereinsgalerie";

// Keep each entry stable across cards, detail pages and reactive updates.
// Use every image once before starting another shuffled round.
export const getGalleryPlaceholder = (key: string): string => {
  const assigned = assignedImages.get(key);
  if (assigned) return assigned;
  if (!images.length) return "";

  if (!remainingImages.length) {
    remainingImages = [...images];
    for (let i = remainingImages.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingImages[i], remainingImages[j]] = [remainingImages[j]!, remainingImages[i]!];
    }
    const last = remainingImages.length - 1;
    if (last > 0 && remainingImages[last] === lastImage) {
      [remainingImages[0], remainingImages[last]] = [remainingImages[last]!, remainingImages[0]!];
    }
  }

  const image = remainingImages.pop()!;
  assignedImages.set(key, image);
  lastImage = image;
  return image;
};
