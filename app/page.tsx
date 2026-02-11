import Link from "next/link";
import { categoryToAnchorId, listArticles } from "@/lib/content";

export default async function Home() {
  const articles = await listArticles();
  const groupedArticles = new Map<string, typeof articles>();

  for (const article of articles) {
    const bucket = groupedArticles.get(article.category);
    if (bucket) {
      bucket.push(article);
    } else {
      groupedArticles.set(article.category, [article]);
    }
  }

  const categories = Array.from(groupedArticles.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-4">
 
        <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
          Theory notes, ready for commuting
        </h1>
        <p className="max-w-2xl text-base text-zinc-600">
          Choose an article to read or jump straight into a stripped-down
          listen mode that works well with Chrome Read Aloud.
        </p>
      </header>

      <section id="categories" className="flex flex-wrap gap-2">
        {categories.map(([category]) => (
          <Link
            key={category}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-900"
            href={`/#${categoryToAnchorId(category)}`}
          >
            {category}
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        {articles.length === 0 ? (
          <p className="text-zinc-500">No articles yet.</p>
        ) : (
          categories.map(([category, categoryArticles]) => (
            <section
              key={category}
              id={categoryToAnchorId(category)}
              className="flex flex-col gap-3 scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-zinc-800">{category}</h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {categoryArticles.map((article) => (
                  <li
                    key={article.slug}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold text-zinc-900">
                        {article.title}
                      </h3>
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
            </section>
          ))
        )}
      </section>
    </main>
  );
}
