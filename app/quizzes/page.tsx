import Link from "next/link";
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
        <h1 className="text-3xl font-semibold text-zinc-900">Quizzes</h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Try predefined quizzes by article or by category. Results are session
          only for now.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-800">Category Quizzes</h2>
        {categoryQuizzes.length === 0 ? (
          <p className="text-sm text-zinc-500">No category quizzes yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {categoryQuizzes.map((quiz) => (
              <li
                key={quiz.slug}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-zinc-900">{quiz.title}</h3>
                {quiz.description ? (
                  <p className="text-sm text-zinc-600">{quiz.description}</p>
                ) : null}
                <p className="text-xs text-zinc-500">
                  {quiz.questionCount} question
                  {quiz.questionCount === 1 ? "" : "s"}
                </p>
                <Link
                  className="mt-1 w-fit rounded-full bg-zinc-900 px-4 py-2 text-sm text-white"
                  href={`/quizzes/categories/${quiz.slug}`}
                >
                  Start category quiz
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-800">Article Quizzes</h2>
        {articleQuizzes.length === 0 ? (
          <p className="text-sm text-zinc-500">No article quizzes yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {articleQuizzes.map((quiz) => (
              <li
                key={quiz.slug}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-zinc-900">{quiz.title}</h3>
                {quiz.description ? (
                  <p className="text-sm text-zinc-600">{quiz.description}</p>
                ) : null}
                <p className="text-xs text-zinc-500">
                  {quiz.questionCount} question
                  {quiz.questionCount === 1 ? "" : "s"}
                </p>
                <Link
                  className="mt-1 w-fit rounded-full bg-zinc-900 px-4 py-2 text-sm text-white"
                  href={`/quizzes/articles/${quiz.slug}`}
                >
                  Start article quiz
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
