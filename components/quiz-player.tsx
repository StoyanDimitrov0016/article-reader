"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/quiz";

type Props = {
  questions: QuizQuestion[];
};

export function QuizPlayer({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + (answers[question.id] === question.answerIndex ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  function updateAnswer(questionId: string, answerIndex: number) {
    if (submitted) {
      return;
    }

    setAnswers((current) => ({ ...current, [questionId]: answerIndex }));
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <p className="text-zinc-600">
          {answeredCount}/{questions.length} answered
        </p>
        {submitted ? (
          <p className="font-semibold text-zinc-900">
            Score: {score}/{questions.length}
          </p>
        ) : null}
      </div>

      <ol className="flex flex-col gap-4">
        {questions.map((question, index) => {
          const selectedAnswer = answers[question.id];
          const isAnswered = selectedAnswer !== undefined;

          return (
            <li
              key={question.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-zinc-900">
                  {index + 1}. {question.question}
                </h3>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs uppercase tracking-wide text-zinc-600">
                  {question.difficulty}
                </span>
              </div>

              <fieldset className="flex flex-col gap-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = optionIndex === question.answerIndex;

                  let optionClassName =
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition";

                  if (submitted && isCorrect) {
                    optionClassName +=
                      " border-emerald-300 bg-emerald-50 text-emerald-900";
                  } else if (submitted && isSelected && !isCorrect) {
                    optionClassName += " border-rose-300 bg-rose-50 text-rose-900";
                  } else if (isSelected) {
                    optionClassName += " border-zinc-400 bg-zinc-50 text-zinc-900";
                  } else {
                    optionClassName +=
                      " border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300";
                  }

                  return (
                    <label key={`${question.id}-${optionIndex}`} className={optionClassName}>
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() => updateAnswer(question.id, optionIndex)}
                        className="h-4 w-4 border-zinc-300"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </fieldset>

              {submitted && isAnswered ? (
                <p className="mt-4 text-sm text-zinc-700">{question.explanation}</p>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-3">
        {submitted ? (
          <button
            type="button"
            onClick={resetQuiz}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-800"
          >
            Retry quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={answeredCount !== questions.length}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Submit answers
          </button>
        )}
      </div>
    </section>
  );
}
