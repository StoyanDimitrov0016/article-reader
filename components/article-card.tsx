import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ArticleMeta } from "@/lib/content";

export type ArticleCardData = Pick<
  ArticleMeta,
  "slug" | "title" | "category" | "tags" | "summary" | "readMinutes" | "lessonType"
>;

type Props = {
  article: ArticleCardData;
  hasQuiz: boolean;
};

function lessonBadgeClass(lessonType: ArticleCardData["lessonType"]): string {
  if (lessonType === "core") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-900";
}

function lessonLabel(lessonType: ArticleCardData["lessonType"]): string {
  return lessonType === "core" ? "Core lesson" : "Deep dive";
}

export function ArticleCard({ article, hasQuiz }: Props) {
  return (
    <Card className="gap-3 py-0 shadow-xs">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold leading-tight text-foreground">
              {article.title}
            </h3>
            <Badge className={cn("border", lessonBadgeClass(article.lessonType))}>
              {lessonLabel(article.lessonType)}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              {article.readMinutes} min
            </Badge>
          </div>
          {article.summary ? (
            <p className="text-sm leading-6 text-muted-foreground">{article.summary}</p>
          ) : null}
          {article.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <li key={`${article.slug}-${tag}`}>
                  <Badge
                    variant="outline"
                    className="rounded-sm border-border/70 bg-muted/25 text-[11px] uppercase tracking-wide"
                  >
                    {tag}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="sm" className="h-7 px-2.5 text-xs">
            <Link href={`/articles/${article.slug}`}>Read</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-xs">
            <Link href={`/listen/${article.slug}`}>Listen</Link>
          </Button>
          {hasQuiz ? (
            <Button asChild variant="secondary" size="sm" className="h-7 px-2.5 text-xs">
              <Link href={`/quizzes/articles/${article.slug}`}>Quiz</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
