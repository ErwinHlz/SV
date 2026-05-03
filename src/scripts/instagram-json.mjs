import "dotenv/config";
import fs from "node:fs/promises";

const token = process.env.IG_ACCESS_TOKEN;
const limit = process.env.IG_LIMIT || 6;
const outputFile = process.env.IG_OUTPUT_FILE || "instagram.json";

if (!token) {
  throw new Error("IG_ACCESS_TOKEN fehlt in .env");
}

const fields = [
  "id",
  "caption",
  "media_type",
  "media_product_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "username",
  "children{id,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp}",
].join(",");

function normalizeCaption(caption = "") {
  return caption
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .trim();
}

function makeShortText(text = "", maxLength = 180) {
  const clean = normalizeCaption(text).replace(/\s+/g, " ");

  if (clean.length <= maxLength) return clean;

  return `${clean.slice(0, maxLength).trim()}...`;
}

function splitCaptionLines(caption = "") {
  return normalizeCaption(caption)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractHashtags(caption = "") {
  const matches = caption.match(/#[\p{L}\p{N}_]+/gu) || [];
  return [...new Set(matches.map((tag) => tag.toLowerCase()))];
}

function extractMentions(caption = "") {
  const matches = caption.match(/@[\p{L}\p{N}._]+/gu) || [];
  return [...new Set(matches.map((mention) => mention.toLowerCase()))];
}

function getType(media) {
  if (media.media_product_type === "REELS") return "REEL";
  if (media.media_type === "CAROUSEL_ALBUM") return "CAROUSEL";
  if (media.media_type === "VIDEO") return "VIDEO";
  if (media.media_type === "IMAGE") return "IMAGE";

  return media.media_type || "";
}

function getBestImage(media) {
  return media.thumbnail_url || media.media_url || "";
}

function normalizeMedia(media) {
  return {
    id: media.id,
    typ: getType(media),
    media_type: media.media_type || "",
    media_product_type: media.media_product_type || "",
    media_url: media.media_url || "",
    thumbnail_url: media.thumbnail_url || "",
    bild: getBestImage(media),
    permalink: media.permalink || "",
    timestamp: media.timestamp || "",
  };
}

function getPostMedia(post) {
  if (post.media_type === "CAROUSEL_ALBUM") {
    const children = post.children?.data || [];
    return children.map(normalizeMedia);
  }

  return [normalizeMedia(post)];
}

async function fetchInstagramPosts() {
  const url = new URL("https://graph.instagram.com/me/media");

  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", limit);
  url.searchParams.set("access_token", token);

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    console.error(JSON.stringify(json, null, 2));
    throw new Error(`Instagram API Fehler: HTTP ${response.status}`);
  }

  return json.data || [];
}

const rawPosts = await fetchInstagramPosts();

const posts = rawPosts.map((post) => {
  const caption = normalizeCaption(post.caption || "");
  const medien = getPostMedia(post);

  return {
    id: post.id,
    username: post.username || "sv_ottweiler1919",

    // REEL, VIDEO, IMAGE oder CAROUSEL
    typ: getType(post),

    // Originalwerte von Instagram
    media_type: post.media_type || "",
    media_product_type: post.media_product_type || "",

    datum: post.timestamp?.slice(0, 10) || "",
    timestamp: post.timestamp || "",

    // Beschreibung unter dem Post
    caption,
    caption_lines: splitCaptionLines(caption),
    kurztext: makeShortText(caption),

    hashtags: extractHashtags(caption),
    mentions: extractMentions(caption),

    // Hauptbild für Karten/Vorschau
    bild: medien[0]?.bild || "",

    // Link zum Instagram-Post
    permalink: post.permalink || "",

    // Alle Medien:
    // Einzelpost: 1 Element
    // Video/Reel: 1 Element
    // Carousel: mehrere Elemente
    medien,

    // Rohdaten der Children, falls du sie später brauchst
    children: post.children?.data || [],
  };
});

await fs.writeFile(
  outputFile,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      source: "https://www.instagram.com/sv_ottweiler1919/",
      count: posts.length,
      posts,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`${outputFile} aktualisiert mit ${posts.length} Posts.`);
