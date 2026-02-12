import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { categoryToSlug } from "@/lib/category";
import { getAllSlugs, getArticleBySlugOrNull, getLessonRelations } from "@/lib/content";
import { getArticleQuizBySlug } from "@/lib/quiz";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ListenPage({ params }: Props) {
  const { slug } = await params;
  const [article, articleQuiz, relations] = await Promise.all([
    getArticleBySlugOrNull(slug),
    getArticleQuizBySlug(slug),
    getLessonRelations(slug),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
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
              <Link
                className="hover:text-zinc-700"
                href={`/categories/${categoryToSlug(article.category)}`}
              >
                {article.category}
              </Link>
            </li>
            <li>/</li>
            <li>Listen mode</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-3 py-1 uppercase tracking-wide">
            Listen mode
          </span>
          <Link className="underline" href={`/articles/${slug}`}>
            Back to article
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
            {article.title}
          </h1>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">
            {article.readMinutes} min read
          </span>
        </div>
        {article.tags.length > 0 ? (
          <p className="text-sm text-zinc-500">{article.tags.join(" | ")}</p>
        ) : null}
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-800">Lesson Path</p>
          {relations.lessonType === "core" ? (
            relations.deepDives.length > 0 ? (
              <div className="mt-2 flex flex-col gap-1">
                <p>This is the core lesson. Continue with deep dives:</p>
                {relations.deepDives.map((deepDive) => (
                  <Link
                    key={deepDive.slug}
                    className="underline"
                    href={`/listen/${deepDive.slug}`}
                  >
                    {deepDive.title}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2">This is the core lesson. No deep dives yet.</p>
            )
          ) : (
            <div className="mt-2 flex flex-col gap-1">
              <p>This is a deep dive.</p>
              {relations.coreArticle ? (
                <Link className="underline" href={`/listen/${relations.coreArticle.slug}`}>
                  Core lesson: {relations.coreArticle.title}
                </Link>
              ) : null}
              {relations.deepDives.filter((deepDive) => deepDive.slug !== slug).length > 0 ? (
                <p className="pt-1">Other deep dives:</p>
              ) : null}
              {relations.deepDives
                .filter((deepDive) => deepDive.slug !== slug)
                .map((deepDive) => (
                  <Link key={deepDive.slug} className="underline" href={`/listen/${deepDive.slug}`}>
                    {deepDive.title}
                  </Link>
                ))}
            </div>
          )}
        </section>
      </header>
      <article className="article-content text-lg leading-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            li: ({ children, className }) => (
              <li className={className}>
                <span className="font-medium text-zinc-600">Item: </span>
                {children}
              </li>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>
      <div className="text-sm">
        <div className="flex flex-wrap gap-4">
          <Link className="text-zinc-700 underline" href="/">
            Back to list
          </Link>
          {articleQuiz ? (
            <Link className="text-zinc-700 underline" href={`/quizzes/articles/${slug}`}>
              Take quiz
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
