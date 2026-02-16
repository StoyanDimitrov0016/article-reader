"use client";

import Link from "next/link";
import { categoryToSlug } from "@/lib/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  lessonFilter: "core" | "deep";
  onLessonFilterChange: (value: "core" | "deep") => void;
  resultCount: number;
  normalizedQuery: string;
  categories: string[];
};

export function LessonFilterPanel({
  query,
  onQueryChange,
  lessonFilter,
  onLessonFilterChange,
  resultCount,
  normalizedQuery,
  categories,
}: Props) {
  return (
    <aside className="flex w-full flex-col gap-4 rounded-lg border bg-card/80 p-3 sm:p-4 lg:h-fit lg:w-[17rem] lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:bg-transparent lg:p-0 lg:pr-5 lg:sticky lg:top-20">
      <section className="flex flex-col gap-2">
        <label
          htmlFor="lesson-search"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Search
        </label>
        <Input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Title, tag, category, summary"
          className="h-8 text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {resultCount} result{resultCount === 1 ? "" : "s"}
          {normalizedQuery ? ` for "${query}"` : ""}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Lesson Type
        </p>
        <Tabs
          value={lessonFilter}
          onValueChange={(value) => onLessonFilterChange(value === "deep" ? "deep" : "core")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="deep">Deep</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <section id="categories" className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {categories.map((category) => (
            <Button
              key={category}
              asChild
              variant="outline"
              size="sm"
              className="h-7 shrink-0 px-2.5 text-[11px]"
            >
              <Link href={`/categories/${categoryToSlug(category)}`}>{category}</Link>
            </Button>
          ))}
        </div>
      </section>
    </aside>
  );
}
