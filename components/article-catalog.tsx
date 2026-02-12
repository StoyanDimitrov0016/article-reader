"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryToSlug } from "@/lib/category";

type ArticleCardData = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  readMinutes: number;
  lessonType: "core" | "deep";
};

type Props = {
  articles: ArticleCardData[];
  quizArticleSlugs: string[];
};

function matchesQuery(article: ArticleCardData, query: string): boolean {
  const haystack = [
    article.title,
    article.category,
    article.tags.join(" "),
    article.summary ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function ArticleCatalog({ articles, quizArticleSlugs }: Props) {
  const [query, setQuery] = useState("");
  const [lessonFilter, setLessonFilter] = useState<"core" | "deep">("core");
  const normalizedQuery = query.trim().toLowerCase();
  const quizSlugSet = useMemo(() => new Set(quizArticleSlugs), [quizArticleSlugs]);

  const scopedArticles = useMemo(
    () => articles.filter((article) => article.lessonType === lessonFilter),
    [articles, lessonFilter]
  );

  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) {
      return scopedArticles;
    }

    return scopedArticles.filter((article) => matchesQuery(article, normalizedQuery));
  }, [normalizedQuery, scopedArticles]);

  const groupedCategories = useMemo(() => {
    const grouped = new Map<string, ArticleCardData[]>();

    for (const article of filteredArticles) {
      const bucket = grouped.get(article.category);
      if (bucket) {
        bucket.push(article);
      } else {
        grouped.set(article.category, [article]);
      }
    }

    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredArticles]);

  const allCategories = useMemo(
    () => Array.from(new Set(scopedArticles.map((article) => article.category))).sort(),
    [scopedArticles]
  );

  return (
    <>
      <section className="flex flex-col gap-3">
        <label
          htmlFor="article-search"
          className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
        >
          Search
        </label>
        <input
          id="article-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, tag, category, or summary"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none ring-zinc-200 transition focus:border-zinc-400 focus:ring-4"
        />
        <p className="text-xs text-zinc-500">
          {filteredArticles.length} result{filteredArticles.length === 1 ? "" : "s"}
          {normalizedQuery ? ` for "${query}"` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setLessonFilter("core")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              lessonFilter === "core"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
            }`}
          >
            Core
          </button>
          <button
            type="button"
            onClick={() => setLessonFilter("deep")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              lessonFilter === "deep"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
            }`}
          >
            Deep
          </button>
        </div>
      </section>

      <section id="categories" className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <Link
            key={category}
            href={`/categories/${categoryToSlug(category)}`}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
          >
            {category}
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        {groupedCategories.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
            No articles match your search.
          </div>
        ) : (
          groupedCategories.map(([category, categoryArticles]) => (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-zinc-800">{category}</h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {categoryArticles.map((article) => (
                  <li
                    key={article.slug}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-zinc-900">
                          {article.title}
                        </h3>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600">
                          {article.lessonType === "core" ? "Core lesson" : "Deep dive"}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                          {article.readMinutes} min read
                        </span>
                      </div>
                      {article.summary ? (
                        <p className="text-sm text-zinc-600">{article.summary}</p>
                      ) : null}
                      {article.tags.length > 0 ? (
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {article.tags.join(" | ")}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Link
                        className="rounded-full bg-zinc-900 px-4 py-2 text-white"
                        href={`/articles/${article.slug}`}
                      >
                        Read article
                      </Link>
                      <Link
                        className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800"
                        href={`/listen/${article.slug}`}
                      >
                        Listen mode
                      </Link>
                      {quizSlugSet.has(article.slug) ? (
                        <Link
                          className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800"
                          href={`/quizzes/articles/${article.slug}`}
                        >
                          Quiz
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </section>
    </>
  );
}
