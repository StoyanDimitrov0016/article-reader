import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <ul className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <li key={article.slug}>
              <Card className="gap-4 py-0">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-foreground">{article.title}</h2>
                      <Badge variant="secondary">{article.readMinutes} min read</Badge>
                      <Badge variant="outline">
                        {article.lessonType === "core" ? "Core lesson" : "Deep dive"}
                      </Badge>
                    </div>
                    {article.summary ? (
                      <p className="text-sm text-muted-foreground">{article.summary}</p>
                    ) : null}
                    {article.tags.length > 0 ? (
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {article.tags.join(" | ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link href={`/articles/${article.slug}`}>Read article</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/listen/${article.slug}`}>Listen mode</Link>
                    </Button>
                    {articleQuizSlugSet.has(article.slug) ? (
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/quizzes/articles/${article.slug}`}>Quiz</Link>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
