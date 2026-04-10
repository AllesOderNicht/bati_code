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
    reasonDimensions: topResult.matchedDimensions
      .slice(0, 3)
      .map((dimension) => dimension.key),
    reasonKeywords: topResult.matchedKeywords.slice(0, 5),
    brandTags: baseProfile?.brandTags ?? [],
    tieBreakWeight: topResult.tieBreakWeight,
  };
}
