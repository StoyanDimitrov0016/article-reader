import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryToSlug } from "@/lib/category";
import { getAllSlugs, getLessonBySlugOrNull, getLessonRelations } from "@/lib/content";
import { getLessonQuizBySlug } from "@/lib/quiz";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonBySlugOrNull(slug);

  if (!lesson) {
    return {
      title: "Lesson not found | Lesson Reader",
    };
  }

  const description =
    lesson.summary ??
    `Listen to ${lesson.title} in ${lesson.category}. Estimated reading time: ${lesson.readMinutes} minutes.`;

  return {
    title: `${lesson.title} | Lesson Reader`,
    description,
    alternates: {
      canonical: `/lessons/${slug}`,
    },
    openGraph: {
      type: "article",
      title: lesson.title,
      description,
      url: `/lessons/${slug}`,
    },
  };
}

export default async function LessonPage({ params }: RouteProps) {
  const { slug } = await params;
  const [lesson, lessonQuiz, relations] = await Promise.all([
    getLessonBySlugOrNull(slug),
    getLessonQuizBySlug(slug),
    getLessonRelations(slug),
  ]);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-8 sm:py-10">
      <article itemScope itemType="https://schema.org/Article" className="flex flex-col gap-6">
        <meta itemProp="inLanguage" content="en-US" />
        <meta itemProp="timeRequired" content={`PT${lesson.readMinutes}M`} />
        <header className="flex flex-col gap-3">
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
                  href={`/categories/${categoryToSlug(lesson.category)}`}
                >
                  {lesson.category}
                </Link>
              </li>
              <li>/</li>
              <li>Lesson</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <h1 itemProp="headline" className="text-4xl font-semibold leading-tight text-foreground">
              {lesson.title}
            </h1>
            <Badge variant="secondary">{lesson.readMinutes} min</Badge>
          </div>
          {lesson.summary ? (
            <p itemProp="description" className="text-sm text-muted-foreground">
              {lesson.summary}
            </p>
          ) : null}
          {lesson.tags.length > 0 ? (
            <p className="text-sm text-muted-foreground">{lesson.tags.join(" | ")}</p>
          ) : null}
        </header>

        <section itemProp="articleBody" className="lesson-content text-lg leading-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
        </section>
      </article>

      <aside className="flex flex-col gap-4 text-sm">
        <ListingCard
          className="text-sm"
          titleClassName="text-base"
          title="Lesson Path"
          details={
            relations.lessonType === "core" ? (
              relations.deepDives.length > 0 ? (
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <p>This is the core lesson. Continue with deep dives:</p>
                  {relations.deepDives.map((deepDive) => (
                    <Link
                      key={deepDive.slug}
                      className="text-foreground underline"
                      href={`/lessons/${deepDive.slug}`}
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
                {relations.coreLesson ? (
                  <Link
                    className="text-foreground underline"
                    href={`/lessons/${relations.coreLesson.slug}`}
                  >
                    Core lesson: {relations.coreLesson.title}
                  </Link>
                ) : null}
                {relations.deepDives.filter((deepDive) => deepDive.slug !== slug).length > 0 ? (
                  <p className="pt-1">Other deep dives:</p>
                ) : null}
                {relations.deepDives
                  .filter((deepDive) => deepDive.slug !== slug)
                  .map((deepDive) => (
                    <Link
                      key={deepDive.slug}
                      className="text-foreground underline"
                      href={`/lessons/${deepDive.slug}`}
                    >
                      {deepDive.title}
                    </Link>
                  ))}
              </div>
            )
          }
        />

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Back to lessons</Link>
          </Button>
          {lessonQuiz ? (
            <Button asChild variant="secondary" size="sm">
              <Link href={`/quizzes/lessons/${slug}`}>Take quiz</Link>
            </Button>
          ) : null}
        </div>
      </aside>
    </main>
  );
}

