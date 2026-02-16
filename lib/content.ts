import fs from "node:fs";
import path from "node:path";
import { categoryToSlug } from "./category";

const LESSONS_DIR = path.join(process.cwd(), "lessons");
const LESSON_METADATA_FILE = "lesson.json";
const CORE_LESSON_FILE = "core.md";
const DEEP_DIR_NAME = "deep";
const DEEP_LESSON_FILE = "lesson.md";
const CATEGORY_QUIZZES_DIR = "_category-quizzes";
const DEEP_SLUG_MARKER = "--deep-";

export type LessonType = "core" | "deep";

type DeepDiveConfig = {
  slug: string;
  title: string;
  tags: string[];
  summary: string;
  order: number;
  readMinutes: number;
};

type LessonConfig = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  order: number;
  readMinutes: number;
  deepDives: DeepDiveConfig[];
};

export type Lesson = {
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

export type LessonMeta = Pick<
  Lesson,
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

function asRecord(value: unknown, filePath: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`[lesson] Invalid JSON object in ${filePath}.`);
  }

  return value as Record<string, unknown>;
}

function parseRequiredString(
  record: Record<string, unknown>,
  key: string,
  filePath: string
): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `[lesson] Invalid "${key}" in ${filePath}. Expected a non-empty string.`
    );
  }

  return value.trim();
}

function parseRequiredNumber(
  record: Record<string, unknown>,
  key: string,
  filePath: string
): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(
      `[lesson] Invalid "${key}" in ${filePath}. Expected a positive number.`
    );
  }

  return value;
}

function parseStringArray(
  record: Record<string, unknown>,
  key: string,
  filePath: string
): string[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`[lesson] Invalid "${key}" in ${filePath}. Expected an array.`);
  }

  return value.map((item, index) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new Error(
        `[lesson] Invalid "${key}[${index}]" in ${filePath}. Expected a non-empty string.`
      );
    }

    return item.trim();
  });
}

function parseDeepDiveConfig(value: unknown, filePath: string): DeepDiveConfig {
  const record = asRecord(value, filePath);

  return {
    slug: parseRequiredString(record, "slug", filePath),
    title: parseRequiredString(record, "title", filePath),
    tags: parseStringArray(record, "tags", filePath),
    summary: parseRequiredString(record, "summary", filePath),
    order: parseRequiredNumber(record, "order", filePath),
    readMinutes: parseRequiredNumber(record, "readMinutes", filePath),
  };
}

function parseLessonConfig(
  rawData: unknown,
  expectedSlug: string,
  filePath: string
): LessonConfig {
  const record = asRecord(rawData, filePath);
  const slug = parseRequiredString(record, "slug", filePath);
  if (slug !== expectedSlug) {
    throw new Error(
      `[lesson] Invalid "slug" in ${filePath}. Expected "${expectedSlug}", got "${slug}".`
    );
  }

  const rawDeepDives = record.deepDives;
  if (!Array.isArray(rawDeepDives)) {
    throw new Error(
      `[lesson] Invalid "deepDives" in ${filePath}. Expected an array.`
    );
  }

  const deepDives = rawDeepDives.map((deepDive) =>
    parseDeepDiveConfig(deepDive, filePath)
  );

  const deepSlugSet = new Set<string>();
  for (const deepDive of deepDives) {
    if (deepSlugSet.has(deepDive.slug)) {
      throw new Error(
        `[lesson] Duplicate deep-dive slug "${deepDive.slug}" in ${filePath}.`
      );
    }
    deepSlugSet.add(deepDive.slug);
  }

  return {
    slug,
    title: parseRequiredString(record, "title", filePath),
    category: parseRequiredString(record, "category", filePath),
    tags: parseStringArray(record, "tags", filePath),
    summary: parseRequiredString(record, "summary", filePath),
    order: parseRequiredNumber(record, "order", filePath),
    readMinutes: parseRequiredNumber(record, "readMinutes", filePath),
    deepDives,
  };
}

function asNotFoundError(message: string): NodeJS.ErrnoException {
  const error = new Error(message) as NodeJS.ErrnoException;
  error.code = "ENOENT";
  return error;
}

async function listLessonSlugsInternal(): Promise<string[]> {
  const entries = await fs.promises.readdir(LESSONS_DIR, { withFileTypes: true });
  return entries
    .filter(
      (entry) => entry.isDirectory() && entry.name !== CATEGORY_QUIZZES_DIR
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function readLessonConfig(lessonSlug: string): Promise<LessonConfig> {
  const filePath = path.join(LESSONS_DIR, lessonSlug, LESSON_METADATA_FILE);
  const raw = await fs.promises.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return parseLessonConfig(parsed, lessonSlug, filePath);
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

function getDeepSlugFromSlug(slug: string): string | null {
  if (!slug.includes(DEEP_SLUG_MARKER)) {
    return null;
  }

  return slug.split(DEEP_SLUG_MARKER)[1] ?? null;
}

function byCategoryThenOrderThenTitle(a: LessonMeta, b: LessonMeta): number {
  return (
    a.category.localeCompare(b.category) ||
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
    a.title.localeCompare(b.title)
  );
}

async function readCoreLessonContent(coreSlug: string): Promise<string> {
  const filePath = path.join(LESSONS_DIR, coreSlug, CORE_LESSON_FILE);
  return fs.promises.readFile(filePath, "utf8");
}

async function readDeepLessonContent(
  coreSlug: string,
  deepSlug: string
): Promise<string> {
  const filePath = path.join(
    LESSONS_DIR,
    coreSlug,
    DEEP_DIR_NAME,
    deepSlug,
    DEEP_LESSON_FILE
  );
  return fs.promises.readFile(filePath, "utf8");
}

export async function getAllSlugs(): Promise<string[]> {
  const lessonSlugs = await listLessonSlugsInternal();
  const slugs: string[] = [];
  for (const lessonSlug of lessonSlugs) {
    const lessonConfig = await readLessonConfig(lessonSlug);
    slugs.push(lessonSlug);
    for (const deepDive of lessonConfig.deepDives) {
      slugs.push(`${lessonSlug}${DEEP_SLUG_MARKER}${deepDive.slug}`);
    }
  }

  return slugs.sort((a, b) => a.localeCompare(b));
}

export async function getLessonBySlug(slug: string): Promise<Lesson> {
  const lessonType = getLessonTypeFromSlug(slug);
  const coreSlug = getCoreSlugFromSlug(slug);
  const deepSlug = getDeepSlugFromSlug(slug);
  const lessonConfig = await readLessonConfig(coreSlug);

  if (lessonType === "core") {
    const content = await readCoreLessonContent(coreSlug);
    return {
      slug,
      title: lessonConfig.title,
      category: lessonConfig.category,
      tags: lessonConfig.tags,
      summary: lessonConfig.summary,
      order: lessonConfig.order,
      readMinutes: lessonConfig.readMinutes,
      lessonType,
      coreSlug,
      content,
    };
  }

  if (!deepSlug) {
    throw asNotFoundError(`[lesson] Deep lesson slug not found for "${slug}".`);
  }

  const deepDive = lessonConfig.deepDives.find((item) => item.slug === deepSlug);
  if (!deepDive) {
    throw asNotFoundError(
      `[lesson] Deep lesson "${deepSlug}" not found in ${coreSlug}.`
    );
  }

  const content = await readDeepLessonContent(coreSlug, deepSlug);

  return {
    slug,
    title: deepDive.title,
    category: lessonConfig.category,
    tags: deepDive.tags,
    summary: deepDive.summary,
    order: deepDive.order,
    readMinutes: deepDive.readMinutes,
    lessonType,
    coreSlug,
    content,
  };
}

export async function getLessonBySlugOrNull(
  slug: string
): Promise<Lesson | null> {
  try {
    return await getLessonBySlug(slug);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listLessons(): Promise<LessonMeta[]> {
  const lessonSlugs = await listLessonSlugsInternal();
  const metas: LessonMeta[] = [];

  for (const lessonSlug of lessonSlugs) {
    const lessonConfig = await readLessonConfig(lessonSlug);
    metas.push({
      slug: lessonSlug,
      title: lessonConfig.title,
      category: lessonConfig.category,
      tags: lessonConfig.tags,
      summary: lessonConfig.summary,
      order: lessonConfig.order,
      readMinutes: lessonConfig.readMinutes,
      lessonType: "core",
      coreSlug: lessonSlug,
    });

    for (const deepDive of lessonConfig.deepDives) {
      metas.push({
        slug: `${lessonSlug}${DEEP_SLUG_MARKER}${deepDive.slug}`,
        title: deepDive.title,
        category: lessonConfig.category,
        tags: deepDive.tags,
        summary: deepDive.summary,
        order: deepDive.order,
        readMinutes: deepDive.readMinutes,
        lessonType: "deep",
        coreSlug: lessonSlug,
      });
    }
  }

  return metas.sort(byCategoryThenOrderThenTitle);
}

export async function listCategories(): Promise<string[]> {
  const lessons = await listLessons();
  return Array.from(new Set(lessons.map((lesson) => lesson.category))).sort(
    (a, b) => a.localeCompare(b)
  );
}

export async function getCategoryBySlug(slug: string): Promise<string | null> {
  const categories = await listCategories();
  return categories.find((category) => categoryToSlug(category) === slug) ?? null;
}

export async function listLessonsByCategory(
  category: string
): Promise<LessonMeta[]> {
  const lessons = await listLessons();
  return lessons.filter((lesson) => lesson.category === category);
}

export async function getLessonRelations(slug: string): Promise<{
  lessonType: LessonType;
  coreSlug: string;
  coreLesson: LessonMeta | null;
  deepDives: LessonMeta[];
}> {
  const lessonType = getLessonTypeFromSlug(slug);
  const coreSlug = getCoreSlugFromSlug(slug);
  const lessons = await listLessons();

  const coreLesson =
    lessons.find(
      (lesson) => lesson.slug === coreSlug && lesson.lessonType === "core"
    ) ?? null;
  const deepDives = lessons.filter(
    (lesson) => lesson.coreSlug === coreSlug && lesson.lessonType === "deep"
  );

  return {
    lessonType,
    coreSlug,
    coreLesson,
    deepDives,
  };
}
