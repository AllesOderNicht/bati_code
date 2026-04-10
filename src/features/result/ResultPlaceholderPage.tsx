import { Navigate, useNavigate } from "react-router-dom";

import { useQuizSession } from "../../app/state/quiz-session";
import { questionBank } from "../quiz/question-bank";

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";

export function ResultPlaceholderPage() {
  const navigate = useNavigate();
  const { answers, resetQuiz, status } = useQuizSession();

  if (status !== "completed") {
    return <Navigate replace to="/" />;
  }

  const answeredCount = Object.keys(answers).length;

  const handleRetry = () => {
    resetQuiz();
    navigate("/");
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 sm:p-4">
      <section
        className="w-full max-w-[480px] p-8 sm:p-6 bg-surface border border-border text-center animate-fade-in"
        style={{
          borderRadius: WOBBLY_CARD,
          boxShadow: "6px 6px 0px 0px rgba(251, 191, 36, 0.2)",
        }}
      >
        <p className="m-0 mb-3 font-mono text-accent-secondary text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
          结果页占位中
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] text-foreground">
          你的 BATI 结果正在装配
        </h1>
        <p className="mt-3 font-mono text-accent text-[0.95rem] font-medium">
          {`本轮共完成 ${answeredCount} / ${questionBank.length} 题`}
        </p>
        <p className="mt-4 text-muted text-[1.05rem] leading-relaxed">
          下一阶段会接入真实算法和公司画像配置，这里先把主流程跑通。
        </p>
        <button
          className="mt-6 w-full py-[18px] px-5 border border-[rgba(251,191,36,0.3)] bg-accent text-accent-fg text-[1.1rem] font-mono font-bold transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          onClick={handleRetry}
          type="button"
          style={{
            borderRadius: WOBBLY_BUTTON,
            boxShadow: "3px 3px 0px 0px rgba(251, 191, 36, 0.15)",
          }}
        >
          再测一次
        </button>
      </section>
    </main>
  );
}
