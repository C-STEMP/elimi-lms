import type { QuizQuestion, ProgressSnapshot } from "@/shared/types";

export type AssessmentPaper = {
  itemId: string;
  passPercent: number;
  maxAttempts?: number | null;
  attemptsUsed?: number;
  /** Answers omitted for the learner-facing paper. */
  questions: QuizQuestion[];
};

export type AssessmentAttemptStatus = "in_progress" | "submitted";

export type AssessmentAttempt = {
  id: string;
  itemId: string;
  status: AssessmentAttemptStatus;
  scorePercent?: number | null;
  passed?: boolean | null;
  startedAt?: string;
  submittedAt?: string | null;
};

export type AssessmentAnswer = {
  questionId: string;
  choiceId: string;
};

export type AssessmentSubmitInput = {
  answers: AssessmentAnswer[];
};

export type AssessmentSubmitResult = {
  attempt: AssessmentAttempt;
  progress: ProgressSnapshot;
};
