import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Article = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
};

export type ArticleMeta = Pick<Article, "slug" | "title" | "category" | "tags">;

function parseCategory(value: unknown): string {
  if (typeof value !== "string") {
    return "General";
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "General";
}

export function categoryToAnchorId(category: string): string {
  return `category-${category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await fs.promises.readdir(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = await fs.promises.readFile(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    category: parseCategory(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    content,
  };
}

export async function getArticleBySlugOrNull(
  slug: string
): Promise<Article | null> {
  try {
    return await getArticleBySlug(slug);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listArticles(): Promise<ArticleMeta[]> {
  const slugs = await getAllSlugs();
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const filePath = path.join(CONTENT_DIR, `${slug}.md`);
      const raw = await fs.promises.readFile(filePath, "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        category: parseCategory(data.category),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    })
  );

  return metas.sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
  );
}
