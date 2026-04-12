import type { Question, QuizAnswers } from "../questions/types";
import type { SSRResult } from "./types";

const SSR_BASE_PROBABILITY = 0.01;
const SSR_MAX_PROBABILITY = 0.05;
const SSR_BOOST_PER_PATTERN = 0.005;

const SSR_PERSONA_IDS = ["chosen-one", "magician"] as const;

type RandomFn = () => number;

function countDistinctPersonaHits(
  answers: QuizAnswers,
  questions: Question[],
): number {
  const hitPersonas = new Set<string>();

  for (const question of questions) {
    const selectedOptionId = answers[question.id];

    if (!selectedOptionId) continue;

    const option = question.options.find((o) => o.id === selectedOptionId);

    if (!option) continue;

    for (const personaId of Object.keys(option.personaWeights)) {
      hitPersonas.add(personaId);
    }
  }

  return hitPersonas.size;
}

function countBalancedAnswers(
  answers: QuizAnswers,
  questions: Question[],
): number {
  const optionIdCounts = new Map<string, number>();

  for (const question of questions) {
    const selectedOptionId = answers[question.id];

    if (selectedOptionId) {
      optionIdCounts.set(
        selectedOptionId,
        (optionIdCounts.get(selectedOptionId) ?? 0) + 1,
      );
    }
  }

  const counts = [...optionIdCounts.values()];
  const answeredCount = counts.reduce((sum, c) => sum + c, 0);

  if (answeredCount < 4) return 0;

  const idealPerOption = answeredCount / 4;
  const maxDeviation = Math.max(
    ...counts.map((c) => Math.abs(c - idealPerOption)),
  );

  return maxDeviation <= 1 ? 2 : maxDeviation <= 2 ? 1 : 0;
}

export function rollSSR(
  answers: QuizAnswers,
  questions: Question[],
  random: RandomFn = Math.random,
): SSRResult {
  const distinctHits = countDistinctPersonaHits(answers, questions);
  const balanceScore = countBalancedAnswers(answers, questions);

  let boostCount = 0;

  if (distinctHits >= 10) boostCount += 1;
  if (distinctHits >= 12) boostCount += 1;
  if (balanceScore >= 1) boostCount += balanceScore;

  const boost = boostCount * SSR_BOOST_PER_PATTERN;
  const finalProbability = Math.min(
    SSR_BASE_PROBABILITY + boost,
    SSR_MAX_PROBABILITY,
  );

  const roll = random();
  const triggered = roll < finalProbability;

  if (!triggered) {
    return {
      triggered: false,
      personaId: "",
      rolledProbability: finalProbability,
      boosted: boost > 0,
    };
  }

  const ssrIndex = random() < 0.5 ? 0 : 1;

  return {
    triggered: true,
    personaId: SSR_PERSONA_IDS[ssrIndex],
    rolledProbability: finalProbability,
    boosted: boost > 0,
  };
}
