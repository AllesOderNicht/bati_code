import type {
  CompanyBaseProfile,
  CompanyCopyProfile,
} from "../../domain/company/types";
import type {
  ExplanationBlock,
  PrimaryCompanyResult,
} from "../../domain/scoring/types";

export type ResultReasonBlock = {
  title: string;
  text: string;
};

export type ResultViewModel = {
  displayNameZh: string;
  headline: string;
  brandTags: string[];
  personaDescription: string;
  keywords: string[];
  reasonBlocks: ResultReasonBlock[];
  shareTone: string;
};

type CreateResultViewModelInput = {
  primaryResult: PrimaryCompanyResult;
  explanation: ExplanationBlock;
  baseProfiles: CompanyBaseProfile[];
  copyProfiles: CompanyCopyProfile[];
};

export function createResultViewModel({
  primaryResult,
  explanation,
  baseProfiles,
  copyProfiles,
}: CreateResultViewModelInput): ResultViewModel | null {
  const baseProfile = baseProfiles.find(
    (profile) => profile.id === primaryResult.companyId,
  );
  const copyProfile = copyProfiles.find(
    (profile) => profile.companyId === primaryResult.companyId,
  );

  if (!baseProfile || !copyProfile) {
    return null;
  }

  const reasonBlocks = explanation.reasonBullets.slice(0, 2).map((text, index) => ({
    title: index === 0 ? "你为什么像它" : "你的发光点",
    text,
  }));

  return {
    displayNameZh: primaryResult.displayNameZh,
    headline: explanation.headline,
    brandTags: baseProfile.brandTags.slice(0, 3),
    personaDescription: explanation.personaDescription,
    keywords: explanation.keywords.slice(0, 5),
    reasonBlocks,
    shareTone: `${explanation.headline} · ${baseProfile.brandTags.slice(0, 2).join(" / ")}`,
  };
}
