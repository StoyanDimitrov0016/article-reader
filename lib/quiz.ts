import fs from "node:fs";
import path from "node:path";

const QUIZ_ROOT = path.join(process.cwd(), "content", "quizzes");
const ARTICLE_QUIZ_DIR = path.join(QUIZ_ROOT, "articles");
const CATEGORY_QUIZ_DIR = path.join(QUIZ_ROOT, "categories");

type QuizScope = "article" | "category";
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
  if (value === "article" || value === "category") {
    return value;
  }

  throw new Error(
    `[quiz] Invalid "scope" in ${filePath}. Expected "article" or "category".`
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
  const quizzes = await Promise.all(slugs.map((slug) => loader(slug)));
  return quizzes
    .filter((quiz): quiz is Quiz => quiz !== null)
    .map((quiz) => ({
      slug: quiz.source,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function listArticleQuizSlugs(): Promise<string[]> {
  return listQuizSlugs(ARTICLE_QUIZ_DIR);
}

export async function listCategoryQuizSlugs(): Promise<string[]> {
  return listQuizSlugs(CATEGORY_QUIZ_DIR);
}

export async function getArticleQuizBySlug(slug: string): Promise<Quiz | null> {
  const filePath = path.join(ARTICLE_QUIZ_DIR, `${slug}.json`);

  try {
    const quiz = await readQuizFile(filePath);
    return quiz.scope === "article" ? quiz : null;
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

export async function listArticleQuizSummaries(): Promise<QuizSummary[]> {
  const slugs = await listArticleQuizSlugs();
  return listQuizSummaries(slugs, getArticleQuizBySlug);
}

export async function listCategoryQuizSummaries(): Promise<QuizSummary[]> {
  const slugs = await listCategoryQuizSlugs();
  return listQuizSummaries(slugs, getCategoryQuizBySlug);
}
