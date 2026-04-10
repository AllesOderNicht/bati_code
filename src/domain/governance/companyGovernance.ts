import type {
  CompanyGovernanceProfile,
  CompanyProfileRegistry,
} from "../company/types";

export function buildGovernanceLookup(
  governanceProfiles: CompanyGovernanceProfile[],
) {
  return new Map(governanceProfiles.map((profile) => [profile.companyId, profile]));
}

export function isCompanyEligible(profile?: CompanyGovernanceProfile) {
  return Boolean(profile?.isEnabled && profile.isWhitelisted);
}

export function validateCompanyProfiles({
  baseProfiles,
  scoreProfiles,
  copyProfiles,
  governanceProfiles,
}: CompanyProfileRegistry) {
  const baseIds = new Set<string>();

  for (const profile of baseProfiles) {
    if (!profile.id) {
      throw new Error("Company base profile must include id");
    }

    if (!profile.displayNameZh) {
      throw new Error(`Company ${profile.id} is missing displayNameZh`);
    }

    if (baseIds.has(profile.id)) {
      throw new Error(`Duplicate base profile id: ${profile.id}`);
    }

    baseIds.add(profile.id);
  }

  const seenScoreIds = new Set<string>();
  for (const profile of scoreProfiles) {
    if (!profile.companyId) {
      throw new Error("score profile must include companyId");
    }
    if (!baseIds.has(profile.companyId)) {
      throw new Error(`Company ${profile.companyId} has score profile without base profile`);
    }
    if (seenScoreIds.has(profile.companyId)) {
      throw new Error(`Duplicate score profile id: ${profile.companyId}`);
    }
    if (Object.keys(profile.dimensionAffinity).length === 0) {
      throw new Error(`Company ${profile.companyId} is missing dimension affinity`);
    }
    seenScoreIds.add(profile.companyId);
  }

  const seenCopyIds = new Set<string>();
  for (const profile of copyProfiles) {
    if (!profile.companyId) {
      throw new Error("copy profile must include companyId");
    }
    if (!baseIds.has(profile.companyId)) {
      throw new Error(`Company ${profile.companyId} has copy profile without base profile`);
    }
    if (seenCopyIds.has(profile.companyId)) {
      throw new Error(`Duplicate copy profile id: ${profile.companyId}`);
    }
    if (profile.keywords.length < 3 || profile.keywords.length > 5) {
      throw new Error(`Company ${profile.companyId} must include 3-5 copy keywords`);
    }
    seenCopyIds.add(profile.companyId);
  }

  const seenGovernanceIds = new Set<string>();
  for (const profile of governanceProfiles) {
    if (!profile.companyId) {
      throw new Error("governance profile must include companyId");
    }
    if (!baseIds.has(profile.companyId)) {
      throw new Error(`Company ${profile.companyId} has governance profile without base profile`);
    }
    if (seenGovernanceIds.has(profile.companyId)) {
      throw new Error(`Duplicate governance profile id: ${profile.companyId}`);
    }
    if (!profile.preferredDisplayNameZh) {
      throw new Error(`Company ${profile.companyId} is missing preferredDisplayNameZh`);
    }
    if (profile.aliases.length === 0) {
      throw new Error(`Company ${profile.companyId} must include at least one alias`);
    }
    seenGovernanceIds.add(profile.companyId);
  }

  for (const baseId of baseIds) {
    if (!seenScoreIds.has(baseId)) {
      throw new Error(`Company ${baseId} is missing score profile`);
    }
    if (!seenCopyIds.has(baseId)) {
      throw new Error(`Company ${baseId} is missing copy profile`);
    }
    if (!seenGovernanceIds.has(baseId)) {
      throw new Error(`Company ${baseId} is missing governance profile`);
    }
  }

  return true;
}
