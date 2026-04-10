import { useMemo, useState } from "react";

import type { CompanyProfileRegistry } from "./domain/company/types";
import { buildExplanation } from "./domain/scoring/buildExplanation";
import { resolvePrimaryResult } from "./domain/scoring/resolvePrimaryResult";
import { scoreQuiz } from "./domain/scoring/scoreQuiz";
import type { Question } from "./domain/questions/types";
import { companyBaseProfiles } from "./data/companies/companyBaseProfiles";
import { companyCopyProfiles } from "./data/companies/companyCopyProfiles";
import { companyGovernanceProfiles } from "./data/companies/companyGovernanceProfiles";
import { companyScoreProfiles } from "./data/companies/companyScoreProfiles";
import { questionBank } from "./data/questions/questionBank";
import { ResultPage } from "./features/result/ResultPage";
import { guardResultPageState } from "./features/result/result-copy-guard";
import { createResultViewModel } from "./features/result/result-view-model";

type AppProps = {
  title?: string;
  questions?: Question[];
  registry?: CompanyProfileRegistry;
};

type Screen = "intro" | "quiz" | "result";

const defaultRegistry: CompanyProfileRegistry = {
  baseProfiles: companyBaseProfiles,
  scoreProfiles: companyScoreProfiles,
  copyProfiles: companyCopyProfiles,
  governanceProfiles: companyGovernanceProfiles,
};

export function App({
  title = "BATI 大厂气质测试",
  questions = questionBank,
  registry = defaultRegistry,
}: AppProps) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progressLabel = `第 ${currentIndex + 1} / ${questions.length} 题`;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const resultPageState = useMemo(() => {
    const rankedResults = scoreQuiz({
      answers,
      questions,
      companyScoreProfiles: registry.scoreProfiles,
    });

    const primaryResult = resolvePrimaryResult({
      rankedResults,
      companyBaseProfiles: registry.baseProfiles,
      governanceProfiles: registry.governanceProfiles,
    });

    if (!primaryResult) {
      return guardResultPageState({});
    }

    const explanation = buildExplanation({
      primaryResult,
      copyProfiles: registry.copyProfiles,
    });

    const viewModel = createResultViewModel({
      primaryResult,
      explanation,
      baseProfiles: registry.baseProfiles,
      copyProfiles: registry.copyProfiles,
    });

    const governanceProfile = registry.governanceProfiles.find(
      (profile) => profile.companyId === primaryResult.companyId,
    );

    return guardResultPageState({
      companyId: primaryResult.companyId,
      viewModel,
      governanceProfile,
    });
  }, [answers, questions, registry]);

  const handleStart = () => {
    setScreen("quiz");
    setCurrentIndex(0);
    setAnswers({});
  };

  const handleSelect = (optionId: string) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedOptionId) {
      return;
    }

    if (currentIndex === questions.length - 1) {
      setScreen("result");
      return;
    }

    setCurrentIndex((previous) => previous + 1);
  };

  const handleRestart = () => {
    setScreen("intro");
    setCurrentIndex(0);
    setAnswers({});
  };

  return (
    <main className="app-shell">
      {screen === "intro" ? (
        <section className="hero-card" aria-labelledby="hero-title">
          <p className="eyebrow">不是 MBTI，是 BATI</p>
          <h1 id="hero-title">{title}</h1>
          <p className="hero-copy">
            用几分钟回答一些性格和生活方式问题，看看你的互联网气质更像哪家大厂。
          </p>
          <p className="result-meta">30 道四选一，测你的大厂气质归属</p>
          <button className="primary-button" type="button" onClick={handleStart}>
            开始测你的厂味
          </button>
        </section>
      ) : null}

      {screen === "quiz" && currentQuestion ? (
        <section className="quiz-layout">
          <article className="quiz-card" aria-labelledby="question-title">
            <div className="progress-block" aria-label="答题进度">
              <div className="progress-header">
                <p className="progress-copy">{progressLabel}</p>
                <p className="progress-copy">{Math.round(progress)}%</p>
              </div>
              <div className="progress-track" aria-hidden="true">
                <span className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <p className="eyebrow">一屏一题，一次只做一个决定</p>
            <h1 id="question-title">{currentQuestion.title}</h1>

            <div className="options-grid" role="list" aria-label="可选答案">
              {currentQuestion.options.map((option) => {
                const selected = option.id === selectedOptionId;

                return (
                  <button
                    key={option.id}
                    className={`option-card${selected ? " option-card--selected" : ""}`}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    aria-pressed={selected}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={handleNext}
              disabled={!selectedOptionId}
            >
              {currentIndex === questions.length - 1 ? "查看结果" : "下一题"}
            </button>
          </article>
        </section>
      ) : null}

      {screen === "result" ? (
        <ResultPage
          onBackHome={handleRestart}
          onRestart={handleRestart}
          state={resultPageState}
        />
      ) : null}
    </main>
  );
}
