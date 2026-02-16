import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import {
  listCategoryQuizSummaries,
  listLessonQuizSummaries,
} from "@/lib/quiz";

export default async function QuizIndexPage() {
  const [lessonQuizzes, categoryQuizzes] = await Promise.all([
    listLessonQuizSummaries(),
    listCategoryQuizSummaries(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-foreground">Quizzes</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Try predefined quizzes by lesson or by category. Results are session
          only for now.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Category Quizzes</h2>
        {categoryQuizzes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No category quizzes yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {categoryQuizzes.map((quiz) => (
              <li key={quiz.slug} className="h-full">
                <ListingCard
                  title={quiz.title}
                  description={quiz.description}
                  details={
                    <p className="text-xs text-muted-foreground">
                      {quiz.questionCount} question
                      {quiz.questionCount === 1 ? "" : "s"}
                    </p>
                  }
                  actions={
                    <Button asChild size="sm" className="h-7 px-2.5 text-xs">
                      <Link href={`/quizzes/categories/${quiz.slug}`}>Start category quiz</Link>
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Lesson Quizzes</h2>
        {lessonQuizzes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lesson quizzes yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {lessonQuizzes.map((quiz) => (
              <li key={quiz.slug} className="h-full">
                <ListingCard
                  title={quiz.title}
                  description={quiz.description}
                  details={
                    <p className="text-xs text-muted-foreground">
                      {quiz.questionCount} question
                      {quiz.questionCount === 1 ? "" : "s"}
                    </p>
                  }
                  actions={
                    <Button asChild size="sm" className="h-7 px-2.5 text-xs">
                      <Link href={`/quizzes/lessons/${quiz.slug}`}>Start lesson quiz</Link>
                    </Button>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
