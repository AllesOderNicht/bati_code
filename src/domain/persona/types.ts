export type PersonaRarity = "normal" | "ssr" | "concentration";

export type PersonaProfile = {
  id: string;
  displayName: string;
  rarity: PersonaRarity;
  relatedCompanies: string[];
  memeOrigin: string;
  headline: string;
  personaDescription: string;
  deepInsight: string;
  funComment: string;
  dailyHabits: string[];
  funFacts: string[];
  keywords: string[];
  reasonTemplate: string;
  ssrBaseProbability?: number;
  concentrationCompanyGroup?: string;
  ssrExclusiveNote?: string;
};
