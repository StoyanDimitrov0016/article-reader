import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { cn } from "@/lib/utils";
import type { LessonMeta } from "@/lib/content";

export type LessonCardData = Pick<
  LessonMeta,
  "slug" | "title" | "category" | "tags" | "summary" | "readMinutes" | "lessonType"
>;

type Props = {
  lesson: LessonCardData;
  hasQuiz: boolean;
};

function lessonBadgeClass(lessonType: LessonCardData["lessonType"]): string {
  if (lessonType === "core") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-900";
}

function lessonLabel(lessonType: LessonCardData["lessonType"]): string {
  return lessonType === "core" ? "Core lesson" : "Deep dive";
}

export function LessonCard({ lesson, hasQuiz }: Props) {
  return (
    <ListingCard
      title={lesson.title}
      badges={
        <>
          <Badge className={cn("border", lessonBadgeClass(lesson.lessonType))}>
            {lessonLabel(lesson.lessonType)}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            {lesson.readMinutes} min
          </Badge>
        </>
      }
      description={lesson.summary}
      details={
        lesson.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {lesson.tags.map((tag) => (
              <li key={`${lesson.slug}-${tag}`}>
                <Badge
                  variant="outline"
                  className="rounded-sm border-border/70 bg-muted/25 text-[11px] uppercase tracking-wide"
                >
                  {tag}
                </Badge>
              </li>
            ))}
          </ul>
        ) : null
      }
      actions={
        <>
          <Button asChild size="sm" className="h-7 px-2.5 text-xs">
            <Link href={`/lessons/${lesson.slug}`}>Open lesson</Link>
          </Button>
          {hasQuiz ? (
            <Button asChild variant="secondary" size="sm" className="h-7 px-2.5 text-xs">
              <Link href={`/quizzes/lessons/${lesson.slug}`}>Quiz</Link>
            </Button>
          ) : null}
        </>
      }
    />
  );
}
