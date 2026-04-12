import { questionBank } from "../../data/questions/questionBank";
import { scorePersonaQuiz } from "../../domain/scoring/scorePersonaQuiz";
import { detectConcentration } from "../../domain/scoring/concentrationDetect";
import { resolvePersonaResult } from "../../domain/scoring/resolvePersonaResult";
import type { QuizAnswers } from "../../domain/questions/types";

export type DistributionEntry = {
  personaId: string;
  count: number;
  rate: number;
};

export type DistributionResult = {
  entries: DistributionEntry[];
  normalRate: number;
  concentrationRate: number;
  trials: number;
};

const OPTION_IDS = ["a", "b", "c", "d"] as const;

function randomAnswers(): QuizAnswers {
  const answers: QuizAnswers = {};
  for (const q of questionBank) {
    answers[q.id] = OPTION_IDS[Math.floor(Math.random() * 4)];
  }
  return answers;
}

export function computeResultDistribution(trials = 10000): DistributionResult {
  const counts = new Map<string, number>();
  let concentrationCount = 0;

  const noSsr = {
    triggered: false,
    personaId: "",
    rolledProbability: 0,
    boosted: false,
  };

  for (let i = 0; i < trials; i++) {
    const answers = randomAnswers();
    const ranked = scorePersonaQuiz(answers, questionBank);
    const concentration = detectConcentration(ranked);
    const final = resolvePersonaResult(ranked, noSsr, concentration);

    if (!final) {
      continue;
    }

    counts.set(final.personaId, (counts.get(final.personaId) ?? 0) + 1);
    if (final.source === "concentration") concentrationCount++;
  }

  const entries = [...counts.entries()]
    .map(([personaId, count]) => ({
      personaId,
      count,
      rate: count / trials,
    }))
    .sort((a, b) => b.rate - a.rate);

  return {
    entries,
    normalRate: (trials - concentrationCount) / trials,
    concentrationRate: concentrationCount / trials,
    trials,
  };
}
