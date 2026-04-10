import { Navigate, useNavigate } from "react-router-dom";

import { QuestionCard } from "../../components/QuestionCard";
import { ProgressBar } from "../../components/ProgressBar";
import { useQuizSession } from "../../app/state/quiz-session";
import { questionBank } from "./question-bank";

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";

export function QuizPage() {
  const navigate = useNavigate();
  const { answers, currentIndex, status, completeQuiz, goToNextQuestion, selectAnswer } =
    useQuizSession();

  if (status === "idle") {
    return <Navigate replace to="/" />;
  }

  if (status === "completed") {
    return <Navigate replace to="/result" />;
  }

  const currentQuestion = questionBank[currentIndex];

  if (!currentQuestion) {
    return <Navigate replace to="/" />;
  }

  const currentAnswer = answers[currentQuestion.id];

  const handleNext = () => {
    if (!currentAnswer) {
      return;
    }

    if (currentIndex === questionBank.length - 1) {
      completeQuiz();
      navigate("/result");
      return;
    }

    goToNextQuestion(questionBank.length);
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 sm:p-4">
      <div className="w-full max-w-[560px] animate-fade-in">
        <article
          className="w-full p-6 sm:p-6 bg-surface border border-border"
          style={{
            borderRadius: WOBBLY_CARD,
            boxShadow: "6px 6px 0px 0px rgba(251, 191, 36, 0.2)",
          }}
        >
          <ProgressBar currentIndex={currentIndex} total={questionBank.length} />
          <QuestionCard
            onSelect={(optionId) =>
              selectAnswer({
                questionId: currentQuestion.id,
                optionId,
              })
            }
            question={currentQuestion}
            selectedOptionId={currentAnswer}
          />
          <button
            className="mt-6 w-full py-[18px] px-5 border border-[rgba(251,191,36,0.3)] bg-accent text-accent-fg text-[1.05rem] font-mono font-bold transition-all duration-200 hover:not-disabled:shadow-glow active:not-disabled:translate-x-[3px] active:not-disabled:translate-y-[3px] active:not-disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-35 disabled:bg-surface-alt disabled:text-muted disabled:border-border focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            disabled={!currentAnswer}
            onClick={handleNext}
            type="button"
            style={{
              borderRadius: WOBBLY_BUTTON,
              boxShadow: !currentAnswer
                ? "none"
                : "3px 3px 0px 0px rgba(251, 191, 36, 0.15)",
            }}
          >
            {currentIndex === questionBank.length - 1 ? "查看结果" : "下一题"}
          </button>
        </article>
      </div>
    </main>
  );
}
