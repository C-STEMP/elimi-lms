"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FiCheckCircle, FiXCircle, FiHelpCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { InlineSpinner } from "@/shared/components/ui/loader";
import { useToast } from "@/shared/components/ui/toast";
import {
  useItemAssessment,
  useStartAttempt,
  useSubmitAttempt,
  assessmentKeys,
} from "@/features/assessments/hooks";
import type { AssessmentAttempt, AssessmentSubmitResult } from "@/features/assessments/types";

export interface QuizRunnerProps {
  enrollmentId: string;
  itemId: string;
  onProgress: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ enrollmentId, itemId, onProgress }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentSubmitResult | null>(null);

  const { data: paper, isLoading } = useItemAssessment(enrollmentId, itemId);
  const { mutate: startAttempt, isPending: isStarting } = useStartAttempt(enrollmentId, itemId);
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt(
    enrollmentId,
    itemId,
    attempt?.id ?? ""
  );

  const resetForNewAttempt = () => {
    setAttempt(null);
    setAnswers({});
    setResult(null);
  };

  const handleStart = () => {
    startAttempt(undefined, {
      onSuccess: (newAttempt) => {
        setAttempt(newAttempt);
        setAnswers({});
        setResult(null);
      },
      onError: () => {
        toast({
          type: "error",
          title: "Couldn't Start Assessment",
          description: "Unable to start a new attempt right now.",
        });
      },
    });
  };

  const handleSubmit = () => {
    if (!paper) return;
    const unanswered = paper.questions.some((q) => !answers[q.id]);
    if (unanswered) {
      toast({ type: "error", title: "Incomplete", description: "Please answer every question." });
      return;
    }

    submitAttempt(
      { answers: Object.entries(answers).map(([questionId, choiceId]) => ({ questionId, choiceId })) },
      {
        onSuccess: (submitResult) => {
          setResult(submitResult);
          queryClient.invalidateQueries({ queryKey: assessmentKeys.paper(enrollmentId, itemId) });
          if (submitResult.attempt.passed) {
            onProgress();
          }
        },
        onError: () => {
          toast({
            type: "error",
            title: "Submission Failed",
            description: "Unable to submit your answers. Please try again.",
          });
        },
      }
    );
  };

  if (isLoading || !paper) {
    return <InlineSpinner />;
  }

  const attemptsUsed = paper.attemptsUsed ?? 0;
  const canRetry = paper.maxAttempts == null || attemptsUsed < paper.maxAttempts;

  if (result) {
    const passed = result.attempt.passed;
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-10 px-4">
        {passed ? (
          <FiCheckCircle className="w-14 h-14 text-green-600" />
        ) : (
          <FiXCircle className="w-14 h-14 text-primary-solid" />
        )}
        <h3 className="text-xl font-extrabold text-neutral-primary">
          {passed ? "You passed!" : "Not quite — try again"}
        </h3>
        <p className="text-neutral-secondary text-sm">
          Score: {result.attempt.scorePercent ?? 0}% (pass mark {paper.passPercent}%)
        </p>
        {!passed && canRetry && (
          <Button type="button" variant="secondary" size="md" onClick={resetForNewAttempt}>
            Try Again
          </Button>
        )}
        {!passed && !canRetry && (
          <p className="text-neutral-secondary text-xs max-w-sm">
            You&apos;ve used all your attempts for this assessment.
          </p>
        )}
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-10 px-4">
        <FiHelpCircle className="w-14 h-14 text-primary-solid/70" />
        <h3 className="text-xl font-extrabold text-neutral-primary">Ready for the assessment?</h3>
        <p className="text-neutral-secondary text-sm max-w-sm">
          {paper.questions.length} question{paper.questions.length === 1 ? "" : "s"} · Pass mark{" "}
          {paper.passPercent}%
          {paper.maxAttempts != null && ` · ${paper.maxAttempts - attemptsUsed} attempt(s) left`}
        </p>
        {canRetry ? (
          <Button type="button" variant="secondary" size="md" loading={isStarting} onClick={handleStart}>
            Start Assessment
          </Button>
        ) : (
          <p className="text-neutral-secondary text-xs">You&apos;ve used all your attempts.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 px-1">
      <AnimatePresence>
        {paper.questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="bg-input-bg/60 rounded-xl p-4 flex flex-col gap-3"
          >
            <p className="font-semibold text-text-dark text-sm">
              {index + 1}. {question.prompt}
            </p>
            <div className="flex flex-col gap-2">
              {question.choices.map((choice) => {
                const selected = answers[question.id] === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: choice.id }))}
                    className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                      selected
                        ? "border-primary-solid bg-primary-solid/5 text-neutral-primary font-medium"
                        : "border-border-gray/60 bg-white text-text-dark hover:border-primary-solid/30"
                    }`}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="secondary"
        size="md"
        fullWidth
        loading={isSubmitting}
        onClick={handleSubmit}
      >
        Submit Assessment
      </Button>
    </div>
  );
};
