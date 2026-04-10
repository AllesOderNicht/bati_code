import { Navigate, useNavigate } from "react-router-dom";

import { useQuizSession } from "../../app/state/quiz-session";
import { questionBank } from "../quiz/question-bank";

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
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">结果页占位中</p>
        <h1>你的 BATI 结果正在装配</h1>
        <p className="result-meta">{`本轮共完成 ${answeredCount} / ${questionBank.length} 题`}</p>
        <p className="hero-copy">
          下一阶段会接入真实算法和公司画像配置，这里先把主流程跑通。
        </p>
        <button className="primary-button" onClick={handleRetry} type="button">
          再测一次
        </button>
      </section>
    </main>
  );
}
