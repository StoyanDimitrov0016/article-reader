"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryToSlug } from "@/lib/category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <section className="flex flex-col gap-4">
        <label
          htmlFor="article-search"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Search
        </label>
        <Input
          id="article-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, tag, category, or summary"
        />
        <p className="text-xs text-muted-foreground">
          {filteredArticles.length} result{filteredArticles.length === 1 ? "" : "s"}
          {normalizedQuery ? ` for "${query}"` : ""}
        </p>
        <Tabs
          value={lessonFilter}
          onValueChange={(value) =>
            setLessonFilter(value === "deep" ? "deep" : "core")
          }
          className="w-fit"
        >
          <TabsList>
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="deep">Deep</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <section id="categories" className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <Button key={category} asChild variant="outline" size="sm">
            <Link href={`/categories/${categoryToSlug(category)}`}>{category}</Link>
          </Button>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        {groupedCategories.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
            No articles match your search.
          </div>
        ) : (
          groupedCategories.map(([category, categoryArticles]) => (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {categoryArticles.map((article) => (
                  <li key={article.slug}>
                    <Card className="gap-4 py-0">
                      <CardContent className="flex flex-col gap-4 p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              {article.title}
                            </h3>
                            <Badge variant="outline">
                              {article.lessonType === "core" ? "Core lesson" : "Deep dive"}
                            </Badge>
                            <Badge variant="secondary">{article.readMinutes} min read</Badge>
                          </div>
                          {article.summary ? (
                            <p className="text-sm text-muted-foreground">{article.summary}</p>
                          ) : null}
                          {article.tags.length > 0 ? (
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              {article.tags.join(" | ")}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild size="sm">
                            <Link href={`/articles/${article.slug}`}>Read article</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/listen/${article.slug}`}>Listen mode</Link>
                          </Button>
                          {quizSlugSet.has(article.slug) ? (
                            <Button asChild variant="secondary" size="sm">
                              <Link href={`/quizzes/articles/${article.slug}`}>Quiz</Link>
                            </Button>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
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
