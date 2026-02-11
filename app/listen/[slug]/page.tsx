import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { categoryToSlug } from "@/lib/category";
import { getAllSlugs, getArticleBySlugOrNull } from "@/lib/content";
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
  const [article, articleQuiz] = await Promise.all([
    getArticleBySlugOrNull(slug),
    getArticleQuizBySlug(slug),
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
        <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
          {article.title}
        </h1>
        {article.tags.length > 0 ? (
          <p className="text-sm text-zinc-500">{article.tags.join(" | ")}</p>
        ) : null}
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
