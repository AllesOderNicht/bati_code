import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type QuizAnswer = {
  questionId: string;
  optionId: string;
};

export type QuizSessionStatus = "idle" | "answering" | "completed";

export type QuizSessionState = {
  currentIndex: number;
  answers: Record<string, string>;
  status: QuizSessionStatus;
};

type QuizSessionContextValue = QuizSessionState & {
  startQuiz: () => void;
  selectAnswer: (answer: QuizAnswer) => void;
  goToNextQuestion: (totalQuestions: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
};

const initialQuizSessionState: QuizSessionState = {
  currentIndex: 0,
  answers: {},
  status: "idle",
};

const QuizSessionContext = createContext<QuizSessionContextValue | undefined>(
  undefined,
);

export function QuizSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizSessionState>(initialQuizSessionState);

  const value = useMemo<QuizSessionContextValue>(
    () => ({
      ...state,
      startQuiz: () => {
        setState({
          ...initialQuizSessionState,
          status: "answering",
        });
      },
      selectAnswer: ({ questionId, optionId }) => {
        setState((prev) => ({
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: optionId,
          },
        }));
      },
      goToNextQuestion: (totalQuestions) => {
        setState((prev) => {
          if (prev.currentIndex >= totalQuestions - 1) {
            return {
              ...prev,
              status: "completed",
            };
          }

          return {
            ...prev,
            currentIndex: prev.currentIndex + 1,
          };
        });
      },
      completeQuiz: () => {
        setState((prev) => ({
          ...prev,
          status: "completed",
        }));
      },
      resetQuiz: () => {
        setState(initialQuizSessionState);
      },
    }),
    [state],
  );

  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
}

export function useQuizSession() {
  const context = useContext(QuizSessionContext);

  if (!context) {
    throw new Error("useQuizSession must be used within QuizSessionProvider");
  }

  return context;
}
