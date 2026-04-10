import type { DimensionKey } from "../questions/types";

export type CompanyRegion = "cn" | "global";

export type CompanyBaseProfile = {
  id: string;
  displayNameZh: string;
  brandTags: string[];
  region: CompanyRegion;
  category: string;
};

export type CompanyScoreProfile = {
  companyId: string;
  dimensionAffinity: Partial<Record<DimensionKey, number>>;
  priorityQuestions?: Record<string, number>;
  tieBreakWeight?: number;
};

export type CompanyCopyProfile = {
  companyId: string;
  headline: string;
  personaDescription: string;
  keywords: string[];
  explanationTemplates: string[];
};

export type CompanyGovernanceProfile = {
  companyId: string;
  isWhitelisted: boolean;
  isEnabled: boolean;
  riskNotes: string[];
  preferredDisplayNameZh: string;
  aliases: string[];
};

export type CompanyProfileRegistry = {
  baseProfiles: CompanyBaseProfile[];
  scoreProfiles: CompanyScoreProfile[];
  copyProfiles: CompanyCopyProfile[];
  governanceProfiles: CompanyGovernanceProfile[];
};
