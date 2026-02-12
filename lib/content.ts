import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { categoryToSlug } from "./category";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DEFAULT_READING_WPM = 165;
const DEEP_SLUG_MARKER = "--deep-";

export type LessonType = "core" | "deep";

type ArticleFrontmatter = {
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  order?: number;
  readMinutes?: number;
};

export type Article = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  order?: number;
  readMinutes: number;
  lessonType: LessonType;
  coreSlug: string;
  content: string;
};

export type ArticleMeta = Pick<
  Article,
  | "slug"
  | "title"
  | "category"
  | "tags"
  | "summary"
  | "order"
  | "readMinutes"
  | "lessonType"
  | "coreSlug"
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

  let readMinutes: number | undefined;
  if (data.readMinutes !== undefined) {
    if (
      typeof data.readMinutes !== "number" ||
      !Number.isFinite(data.readMinutes) ||
      data.readMinutes <= 0
    ) {
      throw new Error(
        `[content] Invalid "readMinutes" in ${filePath}. Expected a positive number.`
      );
    }

    readMinutes = data.readMinutes;
  }

  return {
    title: data.title.trim() || slug,
    category,
    tags,
    summary,
    order,
    readMinutes,
  };
}

function estimateReadMinutes(content: string, wpm = DEFAULT_READING_WPM): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

function getLessonTypeFromSlug(slug: string): LessonType {
  return slug.includes(DEEP_SLUG_MARKER) ? "deep" : "core";
}

function getCoreSlugFromSlug(slug: string): string {
  if (!slug.includes(DEEP_SLUG_MARKER)) {
    return slug;
  }

  return slug.split(DEEP_SLUG_MARKER)[0] ?? slug;
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
  const lessonType = getLessonTypeFromSlug(slug);
  const coreSlug = getCoreSlugFromSlug(slug);

  return {
    slug,
    title: frontmatter.title,
    category: frontmatter.category,
    tags: frontmatter.tags,
    summary: frontmatter.summary,
    order: frontmatter.order,
    readMinutes: frontmatter.readMinutes ?? estimateReadMinutes(content),
    lessonType,
    coreSlug,
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
      const { frontmatter, content } = await readArticleFile(slug);
      return {
        slug,
        title: frontmatter.title,
        category: frontmatter.category,
        tags: frontmatter.tags,
        summary: frontmatter.summary,
        order: frontmatter.order,
        readMinutes: frontmatter.readMinutes ?? estimateReadMinutes(content),
        lessonType: getLessonTypeFromSlug(slug),
        coreSlug: getCoreSlugFromSlug(slug),
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

export async function getLessonRelations(slug: string): Promise<{
  lessonType: LessonType;
  coreSlug: string;
  coreArticle: ArticleMeta | null;
  deepDives: ArticleMeta[];
}> {
  const lessonType = getLessonTypeFromSlug(slug);
  const coreSlug = getCoreSlugFromSlug(slug);
  const articles = await listArticles();

  const coreArticle =
    articles.find(
      (article) => article.slug === coreSlug && article.lessonType === "core"
    ) ?? null;
  const deepDives = articles.filter(
    (article) => article.coreSlug === coreSlug && article.lessonType === "deep"
  );

  return {
    lessonType,
    coreSlug,
    coreArticle,
    deepDives,
  };
}
