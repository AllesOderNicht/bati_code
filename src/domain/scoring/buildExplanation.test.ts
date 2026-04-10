import { describe, expect, it } from "vitest";

import type { CompanyCopyProfile } from "../company/types";
import type { PrimaryCompanyResult } from "./types";
import { buildExplanation } from "./buildExplanation";

const primaryResult: PrimaryCompanyResult = {
  companyId: "byte",
  displayNameZh: "字节跳动",
  score: 12,
  reasonDimensions: ["shipFast", "commercialFocus"],
  reasonKeywords: ["推进快", "节奏在线", "有反馈就来劲"],
};

const copyProfiles: CompanyCopyProfile[] = [
  {
    companyId: "byte",
    headline: "你像字节派",
    personaDescription: "你的行动和反馈回路都很顺。",
    keywords: ["推进快", "节奏在线", "内容感"],
    explanationTemplates: [
      "你更容易在 {dimension} 的场景里打开状态。",
      "一旦有 {keyword}，你就会越做越有手感。",
    ],
  },
];

describe("buildExplanation", () => {
  it("turns top dimensions and keywords into explanation blocks", () => {
    const explanation = buildExplanation({
      primaryResult,
      copyProfiles,
    });

    expect(explanation.headline).toBe("你像字节派");
    expect(explanation.reasonBullets[0]).toContain("推进速度");
    expect(explanation.reasonBullets[1]).toContain("推进快");
    expect(explanation.keywords).toEqual(["推进快", "节奏在线", "内容感"]);
  });
});
