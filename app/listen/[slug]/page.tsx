import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-foreground" href="/">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                className="hover:text-foreground"
                href={`/categories/${categoryToSlug(article.category)}`}
              >
                {article.category}
              </Link>
            </li>
            <li>/</li>
            <li>Listen mode</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline" className="uppercase tracking-wide">
            Listen mode
          </Badge>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/articles/${slug}`}>Back to article</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-4xl font-semibold leading-tight text-foreground">
            {article.title}
          </h1>
          <Badge variant="secondary">{article.readMinutes} min read</Badge>
        </div>
        {article.tags.length > 0 ? (
          <p className="text-sm text-muted-foreground">{article.tags.join(" | ")}</p>
        ) : null}
        <Card className="gap-3 py-4 text-sm">
          <CardContent className="space-y-2">
            <p className="font-semibold text-foreground">Lesson Path</p>
            {relations.lessonType === "core" ? (
              relations.deepDives.length > 0 ? (
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <p>This is the core lesson. Continue with deep dives:</p>
                  {relations.deepDives.map((deepDive) => (
                    <Link
                      key={deepDive.slug}
                      className="text-foreground underline"
                      href={`/listen/${deepDive.slug}`}
                    >
                      {deepDive.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  This is the core lesson. No deep dives yet.
                </p>
              )
            ) : (
              <div className="flex flex-col gap-1 text-muted-foreground">
                <p>This is a deep dive.</p>
                {relations.coreArticle ? (
                  <Link className="text-foreground underline" href={`/listen/${relations.coreArticle.slug}`}>
                    Core lesson: {relations.coreArticle.title}
                  </Link>
                ) : null}
                {relations.deepDives.filter((deepDive) => deepDive.slug !== slug).length > 0 ? (
                  <p className="pt-1">Other deep dives:</p>
                ) : null}
                {relations.deepDives
                  .filter((deepDive) => deepDive.slug !== slug)
                  .map((deepDive) => (
                    <Link key={deepDive.slug} className="text-foreground underline" href={`/listen/${deepDive.slug}`}>
                      {deepDive.title}
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
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
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Back to list</Link>
          </Button>
          {articleQuiz ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/quizzes/articles/${slug}`}>Take quiz</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
