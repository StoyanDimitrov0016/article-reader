import { LessonCatalog } from "@/components/lesson-catalog";
import { listLessons } from "@/lib/content";
import { listLessonQuizSlugs } from "@/lib/quiz";

export default async function Home() {
  const [lessons, lessonQuizSlugs] = await Promise.all([
    listLessons(),
    listLessonQuizSlugs(),
  ]);

  return (
    <main className="flex w-full flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <LessonCatalog lessons={lessons} quizLessonSlugs={lessonQuizSlugs} />
    </main>
  );
}
