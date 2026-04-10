import type {
  CompanyBaseProfile,
  CompanyGovernanceProfile,
} from "../company/types";
import { buildGovernanceLookup, isCompanyEligible } from "../governance/companyGovernance";
import type { PrimaryCompanyResult, RankedCompanyResult } from "./types";

type ResolvePrimaryResultInput = {
  rankedResults: RankedCompanyResult[];
  companyBaseProfiles: CompanyBaseProfile[];
  governanceProfiles: CompanyGovernanceProfile[];
  tieThreshold?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calculateMatchPercentage(
  sortedResults: RankedCompanyResult[],
  tieThreshold: number,
) {
  const [topResult, secondResult, thirdResult] = sortedResults;

  if (!topResult) {
    return 0;
  }

  if (!secondResult) {
    return 92;
  }

  const comparisonResults = [topResult, secondResult, thirdResult].filter(
    (result): result is RankedCompanyResult => Boolean(result),
  );
  const scorePool = comparisonResults.reduce(
    (total, result) => total + Math.max(result.score, 0),
    0,
  );
  const concentration = scorePool > 0 ? topResult.score / scorePool : 1;
  const lead = topResult.score > 0
    ? Math.max(0, topResult.score - secondResult.score)
        / Math.max(topResult.score, tieThreshold)
    : 0;
  const coreStrength = topResult.score > 0
    ? topResult.coreDimensionScore / topResult.score
    : 0;

  return Math.round(
    clamp(58 + concentration * 20 + lead * 24 + coreStrength * 10, 61, 96),
  );
}

export function resolvePrimaryResult({
  rankedResults,
  companyBaseProfiles,
  governanceProfiles,
  tieThreshold = 0.5,
}: ResolvePrimaryResultInput): PrimaryCompanyResult | null {
  const governanceLookup = buildGovernanceLookup(governanceProfiles);
  const baseLookup = new Map(
    companyBaseProfiles.map((profile) => [profile.id, profile]),
  );

  const eligibleResults = rankedResults.filter((result) =>
    isCompanyEligible(governanceLookup.get(result.companyId)),
  );

  if (eligibleResults.length === 0) {
    return null;
  }

  const sortedResults = [...eligibleResults].sort((left, right) => {
    const scoreDelta = right.score - left.score;

    if (Math.abs(scoreDelta) > tieThreshold) {
      return scoreDelta;
    }

    if (right.coreDimensionScore !== left.coreDimensionScore) {
      return right.coreDimensionScore - left.coreDimensionScore;
    }

    if (right.priorityHitScore !== left.priorityHitScore) {
      return right.priorityHitScore - left.priorityHitScore;
    }

    if (right.tieBreakWeight !== left.tieBreakWeight) {
      return right.tieBreakWeight - left.tieBreakWeight;
    }

    return left.companyId.localeCompare(right.companyId);
  });

  const topResult = sortedResults[0];
  const baseProfile = baseLookup.get(topResult.companyId);
  const governanceProfile = governanceLookup.get(topResult.companyId);

  return {
    companyId: topResult.companyId,
    displayNameZh:
      governanceProfile?.preferredDisplayNameZh ??
      baseProfile?.displayNameZh ??
      topResult.companyId,
    score: topResult.score,
    matchPercentage: calculateMatchPercentage(sortedResults, tieThreshold),
    reasonDimensions: topResult.matchedDimensions
      .slice(0, 3)
      .map((dimension) => dimension.key),
    reasonKeywords: topResult.matchedKeywords.slice(0, 5),
    brandTags: baseProfile?.brandTags ?? [],
    tieBreakWeight: topResult.tieBreakWeight,
  };
}
