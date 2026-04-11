import { personaProfiles } from "../../data/personas/personaProfiles";
import type { FinalPersonaResult, PersonaExplanation } from "./types";

export function buildPersonaExplanation(
  result: FinalPersonaResult,
): PersonaExplanation | null {
  const profile = personaProfiles.find((p) => p.id === result.personaId);

  if (!profile) {
    return null;
  }

  return {
    headline: profile.headline,
    personaDescription: profile.personaDescription,
    deepInsight: profile.deepInsight,
    funComment: profile.funComment,
    dailyHabits: profile.dailyHabits,
    funFacts: profile.funFacts,
    keywords: profile.keywords,
    memeOrigin: profile.memeOrigin,
    reasonText: profile.reasonTemplate,
    rarity: profile.rarity,
    relatedCompanies: profile.relatedCompanies,
    ssrExclusiveNote: profile.ssrExclusiveNote ?? null,
  };
}
