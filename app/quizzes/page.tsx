import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  listArticleQuizSummaries,
  listCategoryQuizSummaries,
} from "@/lib/quiz";

export default async function QuizIndexPage() {
  const [articleQuizzes, categoryQuizzes] = await Promise.all([
    listArticleQuizSummaries(),
    listCategoryQuizSummaries(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-foreground">Quizzes</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Try predefined quizzes by article or by category. Results are session
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
              <li key={quiz.slug}>
                <Card className="gap-4 py-0">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    {quiz.description ? (
                      <CardDescription>{quiz.description}</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {quiz.questionCount} question
                      {quiz.questionCount === 1 ? "" : "s"}
                    </p>
                    <Button asChild size="sm">
                      <Link href={`/quizzes/categories/${quiz.slug}`}>Start category quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Article Quizzes</h2>
        {articleQuizzes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No article quizzes yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {articleQuizzes.map((quiz) => (
              <li key={quiz.slug}>
                <Card className="gap-4 py-0">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    {quiz.description ? (
                      <CardDescription>{quiz.description}</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {quiz.questionCount} question
                      {quiz.questionCount === 1 ? "" : "s"}
                    </p>
                    <Button asChild size="sm">
                      <Link href={`/quizzes/articles/${quiz.slug}`}>Start article quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
