import { ArticleCatalog } from "@/components/article-catalog";
import { listArticles } from "@/lib/content";
import { listArticleQuizSlugs } from "@/lib/quiz";

export default async function Home() {
  const [articles, articleQuizSlugs] = await Promise.all([
    listArticles(),
    listArticleQuizSlugs(),
  ]);

  return (
    <main className="flex w-full flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <ArticleCatalog articles={articles} quizArticleSlugs={articleQuizSlugs} />
    </main>
  );
}
