import type { PersonaRankedResult, ConcentrationResult } from "./types";
import { personaProfiles } from "../../data/personas/personaProfiles";

const NORMAL_PERSONA_COUNT = personaProfiles.filter(
  (p) => p.rarity === "normal",
).length;

const CONCENTRATION_BOOST_THRESHOLD = 1.45;

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
  let bestBoost = 0;
  let bestRatio = 0;

  for (const group of COMPANY_GROUPS) {
    const groupScore = rankedResults
      .filter((r) => group.memberPersonaIds.includes(r.personaId))
      .reduce((sum, r) => sum + r.score, 0);

    const ratio = groupScore / totalScore;
    const expectedRatio = group.memberPersonaIds.length / NORMAL_PERSONA_COUNT;
    const boost = expectedRatio > 0 ? ratio / expectedRatio : 0;

    if (boost > bestBoost) {
      bestBoost = boost;
      bestRatio = ratio;
      bestGroup = group;
    }
  }

  if (!bestGroup || bestBoost < CONCENTRATION_BOOST_THRESHOLD) {
    return { triggered: false, personaId: "", companyGroup: "", concentrationScore: 0 };
  }

  return {
    triggered: true,
    personaId: bestGroup.personaId,
    companyGroup: bestGroup.companyGroup,
    concentrationScore: bestRatio,
  };
}
