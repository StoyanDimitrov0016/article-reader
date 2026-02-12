import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticleQuizBySlug, listArticleQuizSlugs } from "@/lib/quiz";

export async function generateStaticParams() {
  const slugs = await listArticleQuizSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleQuizPage({ params }: Props) {
  const { slug } = await params;
  const quiz = await getArticleQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

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
            <li>
              <Link className="hover:text-foreground" href="/quizzes">
                Quizzes
              </Link>
            </li>
            <li>/</li>
            <li>Article quiz</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-semibold text-foreground">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground">
          {quiz.description ?? "Test your understanding of this article."}
        </p>
        <Badge variant="outline" className="w-fit uppercase tracking-wide">
          {quiz.questions.length} question
          {quiz.questions.length === 1 ? "" : "s"}
        </Badge>
      </header>

      <QuizPlayer questions={quiz.questions} />

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/articles/${slug}`}>Back to article</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/listen/${slug}`}>Listen mode</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/quizzes">More quizzes</Link>
        </Button>
      </div>
    </main>
  );
}
