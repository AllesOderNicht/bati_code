import type { PersonaRarity } from "../../domain/persona/types";
import { getPersonaCharacterAsset } from "../../assets/cropped_characters/personaCharacterMap";
import type {
  FinalPersonaResult,
  PersonaExplanation,
} from "../../domain/scoring/types";

export type ResultReasonBlock = {
  title: string;
  text: string;
};

export type ResultViewModel = {
  personaId: string;
  displayName: string;
  headline: string;
  characterImageSrc: string | null;
  characterImageAlt: string | null;
  relatedCompanies: string[];
  memeOrigin: string;
  rarity: PersonaRarity;
  personaDescription: string;
  deepInsight: string;
  funComment: string;
  dailyHabits: string[];
  funFacts: string[];
  keywords: string[];
  reasonText: string;
  shareTone: string;
  ssrExclusiveNote: string | null;
};

function buildShareTone(
  displayName: string,
  rarity: PersonaRarity,
): string {
  switch (rarity) {
    case "ssr":
      return `我是「${displayName}」，连厂味都抽到了隐藏款。快来测测你的厂味吧！`;
    case "concentration":
      return `我是「${displayName}」，厂味浓得都快挂杯了。快来测测你的厂味吧！`;
    default:
      return `我是「${displayName}」，厂味这下算是藏不住了。快来测测你的厂味吧！`;
  }
}

export function createResultViewModel(
  result: FinalPersonaResult,
  explanation: PersonaExplanation,
): ResultViewModel {
  const characterAsset = getPersonaCharacterAsset(
    result.personaId,
    explanation.headline,
  );

  return {
    personaId: result.personaId,
    displayName: explanation.headline,
    headline: explanation.headline,
    characterImageSrc: characterAsset.src,
    characterImageAlt: characterAsset.alt,
    relatedCompanies: explanation.relatedCompanies,
    memeOrigin: explanation.memeOrigin,
    rarity: explanation.rarity,
    personaDescription: explanation.personaDescription,
    deepInsight: explanation.deepInsight,
    funComment: explanation.funComment,
    dailyHabits: explanation.dailyHabits,
    funFacts: explanation.funFacts,
    keywords: explanation.keywords,
    reasonText: explanation.reasonText,
    shareTone: buildShareTone(explanation.headline, explanation.rarity),
    ssrExclusiveNote: explanation.ssrExclusiveNote,
  };
}
