import { readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";

const COVER_DIR = join(process.cwd(), "public", "post-covers");
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

const normalizeSlug = (value: string) => value.trim().toLowerCase();

const coverBySlug = (() => {
  const map = new Map<string, string>();
  try {
    const files = readdirSync(COVER_DIR, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile()) continue;
      const ext = extname(file.name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) continue;
      const slug = normalizeSlug(basename(file.name, ext));
      map.set(slug, `/post-covers/${file.name}`);
    }
  } catch {
    // Ignore when directory does not exist yet.
  }
  return map;
})();

export function getPostCoverBySlug(slug: string): string | undefined {
  return coverBySlug.get(normalizeSlug(slug));
}

export function getResolvedPostCover(
  slug: string,
  explicitCover?: string
): string | undefined {
  return explicitCover ?? getPostCoverBySlug(slug);
}

