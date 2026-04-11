import type { PersonaRarity } from "../persona/types";

export type PersonaRankedResult = {
  personaId: string;
  score: number;
  matchedKeywords: string[];
};

export type SSRResult = {
  triggered: boolean;
  personaId: string;
  rolledProbability: number;
  boosted: boolean;
};

export type ConcentrationResult = {
  triggered: boolean;
  personaId: string;
  companyGroup: string;
  concentrationScore: number;
};

export type FinalPersonaResult = {
  personaId: string;
  source: "ssr" | "concentration" | "normal";
  score: number;
  matchedKeywords: string[];
};

export type PersonaExplanation = {
  headline: string;
  personaDescription: string;
  deepInsight: string;
  funComment: string;
  dailyHabits: string[];
  funFacts: string[];
  keywords: string[];
  memeOrigin: string;
  reasonText: string;
  rarity: PersonaRarity;
  relatedCompanies: string[];
  ssrExclusiveNote: string | null;
};
