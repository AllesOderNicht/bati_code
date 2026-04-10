import { useNavigate } from "react-router-dom";

import { useQuizSession } from "../../app/state/quiz-session";

type HomePageProps = {
  title: string;
};

export function HomePage({ title }: HomePageProps) {
  const navigate = useNavigate();
  const { startQuiz } = useQuizSession();

  const handleStart = () => {
    startQuiz();
    navigate("/quiz");
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">不是 MBTI，是 BATI</p>
        <h1>{title}</h1>
        <p className="hero-copy">
          用几分钟回答一些性格和生活方式问题，看看你的互联网气质更像哪家大厂。
        </p>
        <button className="primary-button" onClick={handleStart} type="button">
          开始测你的厂味
        </button>
      </section>
    </main>
  );
}
