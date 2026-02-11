import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { getCategoryQuizBySlug, listCategoryQuizSlugs } from "@/lib/quiz";

export async function generateStaticParams() {
  const categories = await listCategoryQuizSlugs();
  return categories.map((category) => ({ category }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryQuizPage({ params }: Props) {
  const { category } = await params;
  const quiz = await getCategoryQuizBySlug(category);

  if (!quiz) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-zinc-700" href="/">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link className="hover:text-zinc-700" href="/quizzes">
                Quizzes
              </Link>
            </li>
            <li>/</li>
            <li>Category quiz</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-semibold text-zinc-900">{quiz.title}</h1>
        <p className="text-sm text-zinc-600">
          {quiz.description ?? "Test your understanding in this category."}
        </p>
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {quiz.questions.length} question
          {quiz.questions.length === 1 ? "" : "s"}
        </p>
      </header>

      <QuizPlayer questions={quiz.questions} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link className="text-zinc-700 underline" href={`/categories/${category}`}>
          Back to category
        </Link>
        <Link className="text-zinc-700 underline" href="/quizzes">
          More quizzes
        </Link>
      </div>
    </main>
  );
}
