import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
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
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-foreground" href="/">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>Categories</li>
            <li>/</li>
            <li>{category}</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-semibold text-foreground">{category}</h1>
        <p className="text-sm text-muted-foreground">
          {articles.length} article{articles.length === 1 ? "" : "s"} in this
          category.
        </p>
        {categoryQuiz ? (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/quizzes/categories/${categorySlug}`}>Take category quiz</Link>
            </Button>
          </div>
        ) : null}
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">No articles in this category yet.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {articles.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} hasQuiz={articleQuizSlugSet.has(article.slug)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
