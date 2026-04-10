import type { CompanyCopyProfile } from "../company/types";
import { DIMENSION_LABELS } from "../questions/types";
import type { ExplanationBlock, PrimaryCompanyResult } from "./types";

type BuildExplanationInput = {
  primaryResult: PrimaryCompanyResult;
  copyProfiles: CompanyCopyProfile[];
};

function applyTemplate(template: string, primaryResult: PrimaryCompanyResult) {
  const firstDimension = primaryResult.reasonDimensions[0] ?? "你的高命中维度";
  const firstKeyword = primaryResult.reasonKeywords[0] ?? "你的主导关键词";

  return template
    .replace("{dimension}", DIMENSION_LABELS[firstDimension as keyof typeof DIMENSION_LABELS] ?? firstDimension)
    .replace("{keyword}", firstKeyword);
}

export function buildExplanation({
  primaryResult,
  copyProfiles,
}: BuildExplanationInput): ExplanationBlock {
  const copyProfile = copyProfiles.find(
    (profile) => profile.companyId === primaryResult.companyId,
  );

  const headline = copyProfile?.headline ?? `你像 ${primaryResult.displayNameZh} 派`;
  const personaDescription =
    copyProfile?.personaDescription ?? "你的选择轨迹正在慢慢收束成一种很鲜明的气质。";
  const keywords = copyProfile?.keywords.slice(0, 5) ?? primaryResult.reasonKeywords.slice(0, 5);

  const templates =
    copyProfile?.explanationTemplates.length
      ? copyProfile.explanationTemplates
      : [
          "你在 {dimension} 这一项上特别有辨识度。",
          "当 {keyword} 出现时，你的状态往往会更顺。",
        ];

  return {
    headline,
    personaDescription,
    keywords,
    reasonBullets: templates.slice(0, 2).map((template) =>
      applyTemplate(template, primaryResult),
    ),
  };
}
