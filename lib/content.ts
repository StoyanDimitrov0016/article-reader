import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categoryToSlug } from "./category";

const CONTENT_DIR = path.join(process.cwd(), "content");

type ArticleFrontmatter = {
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  order?: number;
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  order?: number;
  content: string;
};

export type ArticleMeta = Pick<
  Article,
  "slug" | "title" | "category" | "tags" | "summary" | "order"
>;

function parseFrontmatter(
  rawData: unknown,
  slug: string,
  filePath: string
): ArticleFrontmatter {
  const data = (rawData ?? {}) as Record<string, unknown>;

  if (typeof data.title !== "string" || data.title.trim().length === 0) {
    throw new Error(
      `[content] Invalid "title" in ${filePath}. Expected a non-empty string.`
    );
  }

  let category = "General";
  if (data.category !== undefined) {
    if (typeof data.category !== "string" || data.category.trim().length === 0) {
      throw new Error(
        `[content] Invalid "category" in ${filePath}. Expected a non-empty string.`
      );
    }

    category = data.category.trim();
  }

  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    throw new Error(`[content] Invalid "tags" in ${filePath}. Expected an array.`);
  }

  const tags = Array.isArray(data.tags)
    ? data.tags.map((tag, index) => {
        if (typeof tag !== "string") {
          throw new Error(
            `[content] Invalid "tags[${index}]" in ${filePath}. Expected a string.`
          );
        }

        return tag;
      })
    : [];

  let summary: string | undefined;
  if (data.summary !== undefined) {
    if (typeof data.summary !== "string") {
      throw new Error(
        `[content] Invalid "summary" in ${filePath}. Expected a string.`
      );
    }

    const normalized = data.summary.trim();
    summary = normalized.length > 0 ? normalized : undefined;
  }

  let order: number | undefined;
  if (data.order !== undefined) {
    if (typeof data.order !== "number" || !Number.isFinite(data.order)) {
      throw new Error(
        `[content] Invalid "order" in ${filePath}. Expected a finite number.`
      );
    }

    order = data.order;
  }

  return {
    title: data.title.trim() || slug,
    category,
    tags,
    summary,
    order,
  };
}

function byCategoryThenOrderThenTitle(a: ArticleMeta, b: ArticleMeta): number {
  return (
    a.category.localeCompare(b.category) ||
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
    a.title.localeCompare(b.title)
  );
}

async function readArticleFile(slug: string): Promise<{
  frontmatter: ArticleFrontmatter;
  content: string;
}> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = await fs.promises.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = parseFrontmatter(data, slug, filePath);

  return { frontmatter, content };
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await fs.promises.readdir(CONTENT_DIR);
  return files
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const { frontmatter, content } = await readArticleFile(slug);

  return {
    slug,
    title: frontmatter.title,
    category: frontmatter.category,
    tags: frontmatter.tags,
    summary: frontmatter.summary,
    order: frontmatter.order,
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
      const { frontmatter } = await readArticleFile(slug);
      return {
        slug,
        title: frontmatter.title,
        category: frontmatter.category,
        tags: frontmatter.tags,
        summary: frontmatter.summary,
        order: frontmatter.order,
      };
    })
  );

  return metas.sort(byCategoryThenOrderThenTitle);
}

export async function listCategories(): Promise<string[]> {
  const articles = await listArticles();
  return Array.from(new Set(articles.map((article) => article.category))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export async function getCategoryBySlug(slug: string): Promise<string | null> {
  const categories = await listCategories();
  return categories.find((category) => categoryToSlug(category) === slug) ?? null;
}

export async function listArticlesByCategory(
  category: string
): Promise<ArticleMeta[]> {
  const articles = await listArticles();
  return articles.filter((article) => article.category === category);
}
