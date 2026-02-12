import { ArticleCatalog } from "@/components/article-catalog";
import { Badge } from "@/components/ui/badge";
import { listArticles } from "@/lib/content";
import { listArticleQuizSlugs } from "@/lib/quiz";

export default async function Home() {
  const [articles, articleQuizSlugs] = await Promise.all([
    listArticles(),
    listArticleQuizSlugs(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-4">
        <Badge variant="outline" className="w-fit uppercase tracking-wide">
          Article Reader
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight text-foreground">
          Theory notes, ready for commuting
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Choose an article to read or jump straight into a stripped-down
          listen mode that works well with Chrome Read Aloud.
        </p>
      </header>

      <ArticleCatalog articles={articles} quizArticleSlugs={articleQuizSlugs} />
    </main>
  );
}
