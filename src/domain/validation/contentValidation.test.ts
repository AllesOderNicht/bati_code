import { describe, expect, it } from "vitest";

import type { CompanyGovernanceProfile } from "../company/types";
import type { ResultViewModel } from "../../features/result/result-view-model";
import { validateResultContent } from "./contentValidation";

const governanceProfile: CompanyGovernanceProfile = {
  companyId: "byte",
  isWhitelisted: true,
  isEnabled: true,
  riskNotes: [],
  preferredDisplayNameZh: "字节跳动",
  aliases: ["字节"],
};

const validViewModel: ResultViewModel = {
  displayNameZh: "字节跳动",
  headline: "你像字节派",
  brandTags: ["节奏快", "内容感", "迭代力"],
  personaDescription: "你总是能把点子快速推到下一版。",
  keywords: ["推进快", "节奏在线", "反馈回路"],
  reasonBlocks: [
    { title: "你为什么像它", text: "你在推进速度上的命中特别高。" },
    { title: "你的发光点", text: "一有反馈你就会越做越来劲。" },
  ],
  shareTone: "节奏快、反馈快、想法也快。",
};

describe("validateResultContent", () => {
  it("accepts a valid ready-to-render result payload", () => {
    expect(
      validateResultContent({
        companyId: "byte",
        viewModel: validViewModel,
        governanceProfile,
      }),
    ).toEqual([]);
  });

  it("blocks invalid keyword counts and disabled results", () => {
    const issues = validateResultContent({
      companyId: "byte",
      viewModel: {
        ...validViewModel,
        keywords: ["推进快", "节奏在线"],
      },
      governanceProfile: {
        ...governanceProfile,
        isEnabled: false,
      },
    });

    expect(issues).toHaveLength(2);
    expect(issues[0]?.severity).toBe("error");
  });
});
