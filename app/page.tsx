import Link from "next/link";
import { listArticles } from "@/lib/content";

export default async function Home() {
  const articles = await listArticles();

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-14">
        <header className="flex flex-col gap-4">
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            Article Reader
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
            Theory notes, ready for commuting
          </h1>
          <p className="max-w-2xl text-base text-zinc-600">
            Choose an article to read or jump straight into a stripped-down
            listen mode that works well with Chrome Read Aloud.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          {articles.length === 0 ? (
            <p className="text-zinc-500">No articles yet.</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {articles.map((article) => (
                <li
                  key={article.slug}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-zinc-900">
                      {article.title}
                    </h2>
                    {article.tags.length > 0 ? (
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {article.tags.join(" | ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      className="rounded-full bg-zinc-900 px-4 py-2 text-white"
                      href={`/articles/${article.slug}`}
                    >
                      Read article
                    </Link>
                    <Link
                      className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800"
                      href={`/listen/${article.slug}`}
                    >
                      Listen mode
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
