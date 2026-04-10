import { useNavigate } from "react-router-dom";

import { useQuizSession } from "../../app/state/quiz-session";

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";

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
    <main className="min-h-screen grid place-items-center p-6 sm:p-4">
      <section
        className="w-full max-w-[480px] p-8 sm:p-6 bg-surface border border-border text-center animate-fade-in"
        style={{
          borderRadius: WOBBLY_CARD,
          boxShadow: "6px 6px 0px 0px rgba(251, 191, 36, 0.2)",
        }}
      >
        <p className="m-0 mb-3 font-mono text-accent text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
          不是 MBT，是 BAT
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-muted text-[1.05rem] leading-relaxed">
          用几分钟回答一些性格和生活方式问题，看看你的互联网气质更像哪家大厂。
        </p>
        <button
          className="mt-6 w-full py-[18px] px-5 border border-[rgba(251,191,36,0.3)] bg-accent text-accent-fg text-[1.1rem] font-mono font-bold transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          onClick={handleStart}
          type="button"
          style={{
            borderRadius: WOBBLY_BUTTON,
            boxShadow: "3px 3px 0px 0px rgba(251, 191, 36, 0.15)",
          }}
        >
          开始测你的厂味
        </button>
      </section>
    </main>
  );
}
