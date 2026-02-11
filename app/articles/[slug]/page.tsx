import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getArticleBySlugOrNull } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlugOrNull(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-wide text-zinc-500">Article</p>
        <h1 className="text-3xl font-semibold leading-tight text-zinc-900">
          {article.title}
        </h1>
        {article.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 text-xs text-zinc-600">
            {article.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-zinc-100 px-3 py-1">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      <article className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </article>
      <div className="flex flex-wrap gap-4 text-sm">
        <Link className="text-zinc-700 underline" href="/">
          Back to list
        </Link>
        <Link className="text-zinc-700 underline" href={`/listen/${slug}`}>
          Listen mode
        </Link>
      </div>
    </main>
  );
}
