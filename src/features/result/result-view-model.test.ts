import { describe, expect, it } from "vitest";

import type {
  CompanyBaseProfile,
  CompanyCopyProfile,
} from "../../domain/company/types";
import type {
  ExplanationBlock,
  PrimaryCompanyResult,
} from "../../domain/scoring/types";
import { createResultViewModel } from "./result-view-model";

const baseProfiles: CompanyBaseProfile[] = [
  {
    id: "byte",
    displayNameZh: "字节跳动",
    brandTags: ["节奏快", "内容感", "迭代力"],
    region: "cn",
    category: "consumer-tech",
  },
];

const copyProfiles: CompanyCopyProfile[] = [
  {
    companyId: "byte",
    headline: "字节气质正在上号",
    personaDescription: "你对热闹和新鲜感很敏锐，常常一感觉对了就会立刻来电。",
    keywords: ["节奏快", "新鲜感", "反应在线"],
    explanationTemplates: [
      "你在 {dimension} 这一路信号特别亮。",
      "遇到 {keyword} 时，你会自动切到这一挂。",
    ],
  },
];

const explanation: ExplanationBlock = {
  headline: "字节气质正在上号",
  personaDescription: "你对热闹和新鲜感很敏锐，常常一感觉对了就会立刻来电。",
  keywords: ["节奏快", "新鲜感", "反应在线"],
  reasonBullets: [
    "你在行动节奏上的命中特别高。",
    "遇到新鲜感时，你很容易越玩越来劲。",
  ],
};

describe("createResultViewModel", () => {
  it("builds a high-confidence result headline and tone", () => {
    const primaryResult: PrimaryCompanyResult = {
      companyId: "byte",
      displayNameZh: "字节跳动",
      score: 12,
      matchPercentage: 91,
      reasonDimensions: ["shipFast"],
      reasonKeywords: ["节奏快", "新鲜感"],
      brandTags: ["节奏快", "内容感", "迭代力"],
    };

    const result = createResultViewModel({
      primaryResult,
      explanation,
      baseProfiles,
      copyProfiles,
    });

    expect(result?.headline).toBe("91% 是字节跳动人");
    expect(result?.shareTone).toContain("直接自动上号");
    expect(result?.personaDescription).toContain("默认把你分进了 字节跳动 频道");
  });

  it("uses a lighter tone when the match percentage is lower", () => {
    const primaryResult: PrimaryCompanyResult = {
      companyId: "byte",
      displayNameZh: "字节跳动",
      score: 7,
      matchPercentage: 70,
      reasonDimensions: ["shipFast"],
      reasonKeywords: ["节奏快", "新鲜感"],
      brandTags: ["节奏快", "内容感", "迭代力"],
    };

    const result = createResultViewModel({
      primaryResult,
      explanation,
      baseProfiles,
      copyProfiles,
    });

    expect(result?.shareTone).toContain("先抢到了 C 位");
    expect(result?.personaDescription).toContain("不是单一模板");
  });
});
