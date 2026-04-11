export type PersonaRarity = "normal" | "ssr" | "concentration";

export type PersonaProfile = {
  id: string;
  displayName: string;
  rarity: PersonaRarity;
  relatedCompanies: string[];
  memeOrigin: string;
  headline: string;
  personaDescription: string;
  keywords: string[];
  reasonTemplate: string;
  ssrBaseProbability?: number;
  concentrationCompanyGroup?: string;
};
