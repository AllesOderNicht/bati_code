export type MatchedDimension = {
  key: string;
  score: number;
};

export type RankedCompanyResult = {
  companyId: string;
  score: number;
  matchedDimensions: MatchedDimension[];
  matchedKeywords: string[];
  coreDimensionScore: number;
  priorityHitScore: number;
  tieBreakWeight: number;
};

export type PrimaryCompanyResult = {
  companyId: string;
  displayNameZh: string;
  score: number;
  matchPercentage: number;
  reasonDimensions: string[];
  reasonKeywords: string[];
  brandTags?: string[];
  tieBreakWeight?: number;
};

export type ExplanationBlock = {
  headline: string;
  personaDescription: string;
  keywords: string[];
  reasonBullets: string[];
};
