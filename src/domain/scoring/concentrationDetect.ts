import type { PersonaRankedResult, ConcentrationResult } from "./types";

const CONCENTRATION_THRESHOLD = 0.35;

type CompanyGroupMapping = {
  personaId: string;
  companyGroup: string;
  memberPersonaIds: string[];
};

const COMPANY_GROUPS: CompanyGroupMapping[] = [
  {
    personaId: "pure-ali",
    companyGroup: "alibaba",
    memberPersonaIds: ["blessed-puppy", "gaming-ali", "heartless-ant"],
  },
  {
    personaId: "pure-byte",
    companyGroup: "byte",
    memberPersonaIds: ["starry-eyes", "chrysanthemum-dancer", "heartless-ant", "didi-delivery"],
  },
  {
    personaId: "pure-goose",
    companyGroup: "tencent",
    memberPersonaIds: ["penguin-water", "wechat-dog", "happy-drunk", "gaming-ali", "zoo-director"],
  },
];

export function detectConcentration(
  rankedResults: PersonaRankedResult[],
): ConcentrationResult {
  const totalScore = rankedResults.reduce((sum, r) => sum + r.score, 0);

  if (totalScore <= 0) {
    return { triggered: false, personaId: "", companyGroup: "", concentrationScore: 0 };
  }

  let bestGroup: CompanyGroupMapping | null = null;
  let bestRatio = 0;

  for (const group of COMPANY_GROUPS) {
    const groupScore = rankedResults
      .filter((r) => group.memberPersonaIds.includes(r.personaId))
      .reduce((sum, r) => sum + r.score, 0);

    const ratio = groupScore / totalScore;

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestGroup = group;
    }
  }

  if (!bestGroup || bestRatio < CONCENTRATION_THRESHOLD) {
    return { triggered: false, personaId: "", companyGroup: "", concentrationScore: 0 };
  }

  return {
    triggered: true,
    personaId: bestGroup.personaId,
    companyGroup: bestGroup.companyGroup,
    concentrationScore: bestRatio,
  };
}
