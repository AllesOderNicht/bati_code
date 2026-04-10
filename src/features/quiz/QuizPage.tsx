import { Navigate, useNavigate } from "react-router-dom";

import { QuestionCard } from "../../components/QuestionCard";
import { ProgressBar } from "../../components/ProgressBar";
import { useQuizSession } from "../../app/state/quiz-session";
import { questionBank } from "./question-bank";

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
    <main className="app-shell">
      <div className="quiz-layout">
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
          className="primary-button"
          disabled={!currentAnswer}
          onClick={handleNext}
          type="button"
        >
          {currentIndex === questionBank.length - 1 ? "查看结果" : "下一题"}
        </button>
      </div>
    </main>
  );
}
