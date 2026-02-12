import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryToSlug } from "@/lib/category";
import {
  getCategoryBySlug,
  listArticlesByCategory,
  listCategories,
} from "@/lib/content";
import { getCategoryQuizBySlug, listArticleQuizSlugs } from "@/lib/quiz";

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({
    category: categoryToSlug(category),
  }));
}

type Props = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const [articles, categoryQuiz, articleQuizSlugs] = await Promise.all([
    listArticlesByCategory(category),
    getCategoryQuizBySlug(categorySlug),
    listArticleQuizSlugs(),
  ]);
  const articleQuizSlugSet = new Set(articleQuizSlugs);

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
            <li>Categories</li>
            <li>/</li>
            <li>{category}</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-semibold text-zinc-900">{category}</h1>
        <p className="text-sm text-zinc-600">
          {articles.length} article{articles.length === 1 ? "" : "s"} in this
          category.
        </p>
        {categoryQuiz ? (
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              className="rounded-full bg-zinc-900 px-4 py-2 text-white"
              href={`/quizzes/categories/${categorySlug}`}
            >
              Take category quiz
            </Link>
          </div>
        ) : null}
      </header>

      {articles.length === 0 ? (
        <p className="text-zinc-500">No articles in this category yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <li
              key={article.slug}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {article.title}
                  </h2>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                    {article.readMinutes} min read
                  </span>
                </div>
                {article.summary ? (
                  <p className="text-sm text-zinc-600">{article.summary}</p>
                ) : null}
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
                {articleQuizSlugSet.has(article.slug) ? (
                  <Link
                    className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-800"
                    href={`/quizzes/articles/${article.slug}`}
                  >
                    Quiz
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
