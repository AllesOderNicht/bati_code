import type { Question, QuizAnswers } from "../questions/types";
import { personaProfiles } from "../../data/personas/personaProfiles";
import type { PersonaRankedResult } from "./types";

const NORMAL_PERSONA_IDS = new Set(
  personaProfiles
    .filter((p) => p.rarity === "normal")
    .map((p) => p.id),
);

export function scorePersonaQuiz(
  answers: QuizAnswers,
  questions: Question[],
): PersonaRankedResult[] {
  const personaScores = new Map<string, number>();
  const collectedKeywords = new Set<string>();

  for (const question of questions) {
    const selectedOptionId = answers[question.id];

    if (!selectedOptionId) {
      continue;
    }

    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId,
    );

    if (!selectedOption) {
      continue;
    }

    for (const [personaId, weight] of Object.entries(
      selectedOption.personaWeights,
    )) {
      if (NORMAL_PERSONA_IDS.has(personaId)) {
        personaScores.set(
          personaId,
          (personaScores.get(personaId) ?? 0) + weight,
        );
      }
    }

    for (const keyword of selectedOption.keywords) {
      collectedKeywords.add(keyword);
    }
  }

  const keywords = [...collectedKeywords].slice(0, 5);

  return [...personaScores.entries()]
    .map(([personaId, score]) => ({
      personaId,
      score,
      matchedKeywords: keywords,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.personaId.localeCompare(b.personaId);
    });
}
