import { useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

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
import { CompanyCatalogPage } from "./features/companies/CompanyCatalogPage";
import { createCompanyCatalogItems } from "./features/companies/company-catalog-view-model";
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

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_OPTION = "95px 4px 92px 5px / 5px 80px 6px 95px";
const WOBBLY_CHIP = "255px 12px 245px 14px / 14px 210px 12px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";
const BATI_BASE_ROUTE = "/bati";
const BATI_COMPANIES_ROUTE = "/bati/companies";

export function App({
  title = "BATI 大厂气质测试",
  questions = questionBank,
  registry = defaultRegistry,
}: AppProps) {
  return (
    <BrowserRouter>
      <AppShell title={title} questions={questions} registry={registry} />
    </BrowserRouter>
  );
}

type AppShellProps = Required<AppProps>;

function AppShell({
  title,
  questions,
  registry,
}: AppShellProps) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answeredCount = Object.keys(answers).length;

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progressLabel = `第 ${currentIndex + 1} / ${questions.length} 题`;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const rankedResults = useMemo(
    () =>
      scoreQuiz({
        answers,
        questions,
        companyScoreProfiles: registry.scoreProfiles,
      }),
    [answers, questions, registry],
  );

  const resultPageState = useMemo(() => {
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
  }, [rankedResults, registry]);

  const companyCatalogItems = useMemo(
    () =>
      createCompanyCatalogItems({
        baseProfiles: registry.baseProfiles,
        questions,
        scoreProfiles: registry.scoreProfiles,
      }),
    [questions, registry.baseProfiles, registry.scoreProfiles],
  );

  const resetSession = (nextScreen: Screen) => {
    setScreen(nextScreen);
    setCurrentIndex(0);
    setAnswers({});
  };

  const handleStart = () => {
    resetSession("quiz");
    navigate(BATI_BASE_ROUTE);
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

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  const handleNext = () => {
    if (!selectedOptionId) {
      return;
    }

    if (currentIndex === questions.length - 1) {
      setScreen("result");
      navigate(BATI_BASE_ROUTE);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
  };

  const handleRestart = () => {
    resetSession("quiz");
    navigate(BATI_BASE_ROUTE);
  };

  const handleBackHome = () => {
    resetSession("intro");
    navigate(BATI_BASE_ROUTE);
  };

  const handleOpenCatalog = () => {
    navigate(BATI_COMPANIES_ROUTE);
  };

  const handleBackFromCatalog = () => {
    if (screen === "intro") {
      handleStart();
      return;
    }

    navigate(BATI_BASE_ROUTE);
  };

  const backPrimaryLabel =
    screen === "result"
      ? "回到结果页"
      : screen === "quiz"
        ? "继续答题"
        : "去开始答题";

  return (
    <Routes>
      <Route
        path={BATI_BASE_ROUTE}
        element={
          <main className="min-h-screen p-6 sm:p-4">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
              <div className="flex justify-end">
                <button
                  className="border bg-surface px-4 py-3 font-mono text-[0.85rem] font-semibold text-foreground transition-all duration-200 hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                  onClick={handleOpenCatalog}
                  type="button"
                  style={{
                    borderRadius: WOBBLY_CHIP,
                    borderColor: "var(--color-border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  查看全厂图谱
                </button>
              </div>

              <div className="grid min-h-[calc(100vh-7.5rem)] place-items-center">
                <>
                  {screen === "intro" ? (
                    <section
                      className="w-full max-w-[480px] p-8 sm:p-6 bg-surface border border-border text-center animate-fade-in"
                      style={{
                        borderRadius: WOBBLY_CARD,
                        boxShadow: "var(--shadow-sketch-md)",
                      }}
                      aria-labelledby="hero-title"
                    >
                      <p className="m-0 mb-3 font-mono text-accent text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
                        不是 MBT，是 BAT
                      </p>
                      <h1
                        id="hero-title"
                        className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] text-foreground"
                      >
                        {title}
                      </h1>
                      <p className="mt-4 text-muted text-[1.05rem] leading-relaxed">
                        用几分钟回答一些问题，看看你的互联网气质更像哪家大厂。
                      </p>
                      <button
                        className="mt-6 w-full py-[18px] px-5 border bg-accent text-accent-fg text-[1.1rem] font-mono font-bold transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                        type="button"
                        onClick={handleStart}
                        style={{
                          borderRadius: WOBBLY_BUTTON,
                          borderColor: "var(--color-border-strong)",
                          boxShadow: "var(--shadow-sketch)",
                        }}
                      >
                        开始测你的厂味
                      </button>
                    </section>
                  ) : null}

                  {screen === "quiz" && currentQuestion ? (
                    <section className="w-full max-w-[560px] animate-fade-in">
                      <article
                        className="w-full p-6 sm:p-6 bg-surface border border-border"
                        style={{
                          borderRadius: WOBBLY_CARD,
                          boxShadow: "var(--shadow-sketch-md)",
                        }}
                        aria-labelledby="question-title"
                      >
                        <div className="mb-5" aria-label="答题进度">
                          <div className="flex items-center justify-between gap-3">
                            <p className="m-0 text-muted text-[0.85rem] font-mono font-medium">
                              {progressLabel}
                            </p>
                            <p className="m-0 text-muted text-[0.85rem] font-mono font-medium">
                              {Math.round(progress)}%
                            </p>
                          </div>
                          <div
                            className="mt-3 h-2 bg-surface-alt border border-border overflow-hidden"
                            aria-hidden="true"
                            style={{ borderRadius: WOBBLY_CHIP }}
                          >
                            <span
                              className="block h-full bg-accent transition-[width] duration-200 ease-out"
                              style={{
                                width: `${progress}%`,
                                borderRadius: "inherit",
                              }}
                            />
                          </div>
                        </div>

                        <h1
                          id="question-title"
                          className="m-0 font-display text-[clamp(1.5rem,4vw,2.1rem)] leading-[1.35] text-foreground"
                        >
                          {currentQuestion.title}
                        </h1>

                        <div className="grid gap-3.5 mt-6" role="list" aria-label="可选答案">
                          {currentQuestion.options.map((option) => {
                            const selected = option.id === selectedOptionId;

                            return (
                              <button
                                key={option.id}
                                className={`w-full p-4 border text-left font-sans text-[0.95rem] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                                  selected
                                    ? "bg-accent-soft text-accent border-border-strong"
                                    : "bg-surface text-foreground border-border hover:border-border-strong hover:shadow-glow hover:translate-x-px hover:translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                                }`}
                                type="button"
                                onClick={() => handleSelect(option.id)}
                                aria-pressed={selected}
                                style={{
                                  borderRadius: WOBBLY_OPTION,
                                  boxShadow: selected
                                    ? "none"
                                    : "var(--shadow-card)",
                                }}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className={`mt-6 grid gap-3 ${currentIndex > 0 ? "grid-cols-[1fr_2fr]" : ""}`}>
                          {currentIndex > 0 ? (
                            <button
                              className="py-[18px] px-4 border bg-surface text-muted text-[1.05rem] font-mono font-medium transition-all duration-200 hover:text-foreground hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                              type="button"
                              onClick={handlePrevious}
                              style={{
                                borderRadius: WOBBLY_BUTTON,
                                borderColor: "var(--color-border)",
                                boxShadow: "var(--shadow-card)",
                              }}
                            >
                              上一题
                            </button>
                          ) : null}
                          <button
                            className="py-[18px] px-5 border bg-accent text-accent-fg text-[1.05rem] font-mono font-bold transition-all duration-200 hover:not-disabled:shadow-glow active:not-disabled:translate-x-[3px] active:not-disabled:translate-y-[3px] active:not-disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-35 disabled:bg-surface-alt disabled:text-muted disabled:border-border focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                            type="button"
                            onClick={handleNext}
                            disabled={!selectedOptionId}
                            style={{
                              borderRadius: WOBBLY_BUTTON,
                              borderColor: !selectedOptionId
                                ? "var(--color-border)"
                                : "var(--color-border-strong)",
                              boxShadow: !selectedOptionId
                                ? "none"
                                : "var(--shadow-sketch)",
                            }}
                          >
                            {currentIndex === questions.length - 1 ? "查看结果" : "下一题"}
                          </button>
                        </div>
                      </article>
                    </section>
                  ) : null}

                  {screen === "result" ? (
                    <ResultPage
                      onBackHome={handleBackHome}
                      onOpenCatalog={handleOpenCatalog}
                      onRestart={handleRestart}
                      state={resultPageState}
                    />
                  ) : null}
                </>
              </div>
            </div>
          </main>
        }
      />
      <Route
        path={BATI_COMPANIES_ROUTE}
        element={
          <CompanyCatalogPage
            answeredCount={answeredCount}
            backPrimaryLabel={backPrimaryLabel}
            items={companyCatalogItems}
            onBackHome={handleBackHome}
            onBackPrimary={handleBackFromCatalog}
            questionCount={questions.length}
          />
        }
      />
      <Route path="/" element={<Navigate replace to={BATI_BASE_ROUTE} />} />
      <Route
        path="/companies"
        element={<Navigate replace to={BATI_COMPANIES_ROUTE} />}
      />
      <Route path="*" element={<Navigate replace to={BATI_BASE_ROUTE} />} />
    </Routes>
  );
}
