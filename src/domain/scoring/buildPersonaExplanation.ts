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
    keywords: profile.keywords,
    memeOrigin: profile.memeOrigin,
    reasonText: profile.reasonTemplate,
    rarity: profile.rarity,
    relatedCompanies: profile.relatedCompanies,
  };
}
