import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/lesson-card";
import { Button } from "@/components/ui/button";
import { categoryToSlug } from "@/lib/category";
import {
  getCategoryBySlug,
  listCategories,
  listLessonsByCategory,
} from "@/lib/content";
import { getCategoryQuizBySlug, listLessonQuizSlugs } from "@/lib/quiz";

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({
    category: categoryToSlug(category),
  }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const [lessons, categoryQuiz, lessonQuizSlugs] = await Promise.all([
    listLessonsByCategory(category),
    getCategoryQuizBySlug(categorySlug),
    listLessonQuizSlugs(),
  ]);
  const lessonQuizSlugSet = new Set(lessonQuizSlugs);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-foreground" href="/">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>Categories</li>
            <li>/</li>
            <li>{category}</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-semibold text-foreground">{category}</h1>
        <p className="text-sm text-muted-foreground">
          {lessons.length} lesson{lessons.length === 1 ? "" : "s"} in this
          category.
        </p>
        {categoryQuiz ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/quizzes/categories/${categorySlug}`}>Take category quiz</Link>
            </Button>
          </div>
        ) : null}
      </header>

      {lessons.length === 0 ? (
        <p className="text-muted-foreground">No lessons in this category yet.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {lessons.map((lesson) => (
            <li key={lesson.slug} className="h-full">
              <LessonCard lesson={lesson} hasQuiz={lessonQuizSlugSet.has(lesson.slug)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
