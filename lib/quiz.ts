import fs from "node:fs";
import path from "node:path";

const LESSONS_DIR = path.join(process.cwd(), "lessons");
const CATEGORY_QUIZ_DIR = path.join(LESSONS_DIR, "_category-quizzes");
const CORE_QUIZ_FILE = "quiz.json";
const DEEP_DIR_NAME = "deep";
const DEEP_QUIZ_FILE = "quiz.json";
const DEEP_SLUG_MARKER = "--deep-";
const RESERVED_LESSONS_DIR = "_category-quizzes";

type QuizScope = "lesson" | "category";
type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: QuizDifficulty;
};

export type Quiz = {
  id: string;
  title: string;
  description?: string;
  scope: QuizScope;
  source: string;
  questions: QuizQuestion[];
};

export type QuizSummary = {
  slug: string;
  title: string;
  questionCount: number;
  description?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("[quiz] Expected quiz JSON to be an object.");
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
      `[quiz] Invalid "${key}" in ${filePath}. Expected a non-empty string.`
    );
  }

  return value.trim();
}

function parseOptionalString(
  record: Record<string, unknown>,
  key: string,
  filePath: string
): string | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`[quiz] Invalid "${key}" in ${filePath}. Expected a string.`);
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function parseDifficulty(value: unknown, filePath: string, questionId: string) {
  if (value === "easy" || value === "medium" || value === "hard") {
    return value;
  }

  throw new Error(
    `[quiz] Invalid "difficulty" in ${filePath} for question "${questionId}". Expected "easy", "medium", or "hard".`
  );
}

function parseQuestion(
  rawQuestion: unknown,
  index: number,
  filePath: string
): QuizQuestion {
  const questionRecord = asRecord(rawQuestion);
  const id = parseRequiredString(questionRecord, "id", filePath);
  const question = parseRequiredString(questionRecord, "question", filePath);
  const explanation = parseRequiredString(questionRecord, "explanation", filePath);
  const difficulty = parseDifficulty(questionRecord.difficulty, filePath, id);
  const rawOptions = questionRecord.options;

  if (!Array.isArray(rawOptions) || rawOptions.length < 2) {
    throw new Error(
      `[quiz] Invalid "options" in ${filePath} for question "${id}". Expected an array with at least 2 items.`
    );
  }

  const options = rawOptions.map((option, optionIndex) => {
    if (typeof option !== "string" || option.trim().length === 0) {
      throw new Error(
        `[quiz] Invalid "options[${optionIndex}]" in ${filePath} for question "${id}". Expected a non-empty string.`
      );
    }

    return option.trim();
  });

  const answerIndex = questionRecord.answerIndex;
  if (
    typeof answerIndex !== "number" ||
    !Number.isInteger(answerIndex) ||
    answerIndex < 0 ||
    answerIndex >= options.length
  ) {
    throw new Error(
      `[quiz] Invalid "answerIndex" in ${filePath} for question "${id}".`
    );
  }

  return {
    id: id || `q-${index + 1}`,
    question,
    options,
    answerIndex,
    explanation,
    difficulty,
  };
}

function parseScope(value: unknown, filePath: string): QuizScope {
  if (value === "lesson" || value === "category") {
    return value;
  }

  throw new Error(
    `[quiz] Invalid "scope" in ${filePath}. Expected "lesson" or "category".`
  );
}

function parseQuiz(raw: unknown, filePath: string): Quiz {
  const record = asRecord(raw);
  const id = parseRequiredString(record, "id", filePath);
  const title = parseRequiredString(record, "title", filePath);
  const scope = parseScope(record.scope, filePath);
  const source = parseRequiredString(record, "source", filePath);
  const description = parseOptionalString(record, "description", filePath);
  const rawQuestions = record.questions;

  if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
    throw new Error(
      `[quiz] Invalid "questions" in ${filePath}. Expected a non-empty array.`
    );
  }

  const questions = rawQuestions.map((question, index) =>
    parseQuestion(question, index, filePath)
  );

  return {
    id,
    title,
    description,
    scope,
    source,
    questions,
  };
}

async function readQuizFile(filePath: string): Promise<Quiz> {
  const raw = await fs.promises.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return parseQuiz(parsed, filePath);
}

async function listQuizSlugs(directory: string): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(directory);
    return files
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => fileName.replace(/\.json$/, ""))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function listQuizSummaries(
  slugs: string[],
  loader: (slug: string) => Promise<Quiz | null>
): Promise<QuizSummary[]> {
  const entries = await Promise.all(
    slugs.map(async (slug) => ({
      slug,
      quiz: await loader(slug),
    }))
  );

  return entries
    .filter((entry): entry is { slug: string; quiz: Quiz } => entry.quiz !== null)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.quiz.title,
      description: entry.quiz.description,
      questionCount: entry.quiz.questions.length,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function listLessonQuizSlugs(): Promise<string[]> {
  const entries = await fs.promises.readdir(LESSONS_DIR, { withFileTypes: true });
  const lessonSlugs = entries
    .filter(
      (entry) => entry.isDirectory() && entry.name !== RESERVED_LESSONS_DIR
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const slugs: string[] = [];
  for (const lessonSlug of lessonSlugs) {
    const coreQuizPath = path.join(LESSONS_DIR, lessonSlug, CORE_QUIZ_FILE);
    if (fs.existsSync(coreQuizPath)) {
      slugs.push(lessonSlug);
    }

    const deepDir = path.join(LESSONS_DIR, lessonSlug, DEEP_DIR_NAME);
    try {
      const deepEntries = await fs.promises.readdir(deepDir, { withFileTypes: true });
      for (const deepEntry of deepEntries) {
        if (!deepEntry.isDirectory()) {
          continue;
        }

        const deepQuizPath = path.join(deepDir, deepEntry.name, DEEP_QUIZ_FILE);
        if (fs.existsSync(deepQuizPath)) {
          slugs.push(`${lessonSlug}${DEEP_SLUG_MARKER}${deepEntry.name}`);
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  return slugs.sort((a, b) => a.localeCompare(b));
}

export async function listCategoryQuizSlugs(): Promise<string[]> {
  return listQuizSlugs(CATEGORY_QUIZ_DIR);
}

export async function getLessonQuizBySlug(slug: string): Promise<Quiz | null> {
  const [coreSlug, deepSlug] = slug.split(DEEP_SLUG_MARKER);
  const filePath = deepSlug
    ? path.join(LESSONS_DIR, coreSlug, DEEP_DIR_NAME, deepSlug, DEEP_QUIZ_FILE)
    : path.join(LESSONS_DIR, slug, CORE_QUIZ_FILE);

  try {
    const quiz = await readQuizFile(filePath);
    return quiz.scope === "lesson" ? quiz : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function getCategoryQuizBySlug(slug: string): Promise<Quiz | null> {
  const filePath = path.join(CATEGORY_QUIZ_DIR, `${slug}.json`);

  try {
    const quiz = await readQuizFile(filePath);
    return quiz.scope === "category" ? quiz : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listLessonQuizSummaries(): Promise<QuizSummary[]> {
  const slugs = await listLessonQuizSlugs();
  return listQuizSummaries(slugs, getLessonQuizBySlug);
}

export async function listCategoryQuizSummaries(): Promise<QuizSummary[]> {
  const slugs = await listCategoryQuizSlugs();
  return listQuizSummaries(slugs, getCategoryQuizBySlug);
}
