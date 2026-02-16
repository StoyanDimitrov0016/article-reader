"use client";

import { useMemo, useState } from "react";
import { LessonCard, type LessonCardData } from "@/components/lesson-card";
import { LessonFilterPanel } from "@/components/lesson-filter-panel";

type Props = {
  lessons: LessonCardData[];
  quizLessonSlugs: string[];
};

function matchesQuery(lesson: LessonCardData, query: string): boolean {
  const haystack = [
    lesson.title,
    lesson.category,
    lesson.tags.join(" "),
    lesson.summary ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function LessonCatalog({ lessons, quizLessonSlugs }: Props) {
  const [query, setQuery] = useState("");
  const [lessonFilter, setLessonFilter] = useState<"core" | "deep">("core");
  const normalizedQuery = query.trim().toLowerCase();
  const quizSlugSet = useMemo(() => new Set(quizLessonSlugs), [quizLessonSlugs]);

  const scopedLessons = useMemo(
    () => lessons.filter((lesson) => lesson.lessonType === lessonFilter),
    [lessons, lessonFilter]
  );

  const filteredLessons = useMemo(() => {
    if (!normalizedQuery) {
      return scopedLessons;
    }

    return scopedLessons.filter((lesson) => matchesQuery(lesson, normalizedQuery));
  }, [normalizedQuery, scopedLessons]);

  const groupedCategories = useMemo(() => {
    const grouped = new Map<string, LessonCardData[]>();

    for (const lesson of filteredLessons) {
      const bucket = grouped.get(lesson.category);
      if (bucket) {
        bucket.push(lesson);
      } else {
        grouped.set(lesson.category, [lesson]);
      }
    }

    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredLessons]);

  const allCategories = useMemo(
    () => Array.from(new Set(scopedLessons.map((lesson) => lesson.category))).sort(),
    [scopedLessons]
  );

  return (
    <section className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[17rem_minmax(0,64rem)_minmax(0,1fr)] xl:gap-8">
      <div className="lg:col-start-1 lg:row-start-1 lg:self-start">
        <LessonFilterPanel
          query={query}
          onQueryChange={setQuery}
          lessonFilter={lessonFilter}
          onLessonFilterChange={setLessonFilter}
          resultCount={filteredLessons.length}
          normalizedQuery={normalizedQuery}
          categories={allCategories}
        />
      </div>

      <section className="flex w-full flex-col gap-6 lg:col-start-2 lg:row-start-1">
        {groupedCategories.length === 0 ? (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            No lessons match your search.
          </div>
        ) : (
          groupedCategories.map(([category, categoryLessons]) => (
            <section key={category} className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-foreground">{category}</h2>
              <ul className="grid gap-3 md:grid-cols-2">
                {categoryLessons.map((lesson) => (
                  <li key={lesson.slug} className="h-full">
                    <LessonCard lesson={lesson} hasQuiz={quizSlugSet.has(lesson.slug)} />
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
