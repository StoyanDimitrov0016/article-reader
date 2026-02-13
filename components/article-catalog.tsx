"use client";

import { useMemo, useState } from "react";
import { ArticleCard, type ArticleCardData } from "@/components/article-card";
import { ArticleFilterPanel } from "@/components/article-filter-panel";

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
    <section className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[17rem_minmax(0,64rem)_minmax(0,1fr)] xl:gap-8">
      <div className="lg:col-start-1 lg:row-start-1 lg:self-start">
        <ArticleFilterPanel
          query={query}
          onQueryChange={setQuery}
          lessonFilter={lessonFilter}
          onLessonFilterChange={setLessonFilter}
          resultCount={filteredArticles.length}
          normalizedQuery={normalizedQuery}
          categories={allCategories}
        />
      </div>

      <section className="flex w-full flex-col gap-6 lg:col-start-2 lg:row-start-1">
        {groupedCategories.length === 0 ? (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            No articles match your search.
          </div>
        ) : (
          groupedCategories.map(([category, categoryArticles]) => (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">{category}</h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {categoryArticles.map((article) => (
                  <li key={article.slug}>
                    <ArticleCard article={article} hasQuiz={quizSlugSet.has(article.slug)} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </section>

    </section>
  );
}
