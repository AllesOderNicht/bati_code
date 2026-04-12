import type {
  PersonaRankedResult,
  SSRResult,
  ConcentrationResult,
  FinalPersonaResult,
} from "./types";

export function resolvePersonaResult(
  rankedResults: PersonaRankedResult[],
  ssrResult: SSRResult,
  concentrationResult: ConcentrationResult,
): FinalPersonaResult | null {
  if (ssrResult.triggered) {
    return {
      personaId: ssrResult.personaId,
      source: "ssr",
      score: 0,
      matchedKeywords: rankedResults[0]?.matchedKeywords ?? [],
    };
  }

  if (concentrationResult.triggered) {
    return {
      personaId: concentrationResult.personaId,
      source: "concentration",
      score: concentrationResult.concentrationScore,
      matchedKeywords: rankedResults[0]?.matchedKeywords ?? [],
    };
  }

  if (rankedResults.length === 0) {
    return null;
  }

  const top = rankedResults[0];

  return {
    personaId: top.personaId,
    source: "normal",
    score: top.score,
    matchedKeywords: top.matchedKeywords,
  };
}
