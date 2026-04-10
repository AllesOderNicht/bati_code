import { describe, expect, it } from "vitest";

import type { CompanyGovernanceProfile } from "../company/types";
import { companyBaseProfiles } from "../../data/companies/companyBaseProfiles";
import { companyCopyProfiles } from "../../data/companies/companyCopyProfiles";
import type { ResultViewModel } from "../../features/result/result-view-model";
import {
  validateDisplayCopySemantics,
  validateResultContent,
} from "./contentValidation";

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
  headline: "96% 是字节跳动人",
  matchPercentage: 96,
  brandTags: ["节奏快", "内容感", "迭代力"],
  personaDescription: "你总能在热闹和新鲜感之间找到最来电的节奏。",
  keywords: ["推进快", "节奏在线", "反馈回路"],
  reasonBlocks: [
    { title: "你为什么像它", text: "你在行动节奏上的命中特别高。" },
    { title: "你的发光点", text: "只要氛围一热起来，你就会越玩越来劲。" },
  ],
  shareTone: "节奏快、想法快、开心来得也快。",
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

  it("accepts the shipped company display copy when it stays outside workplace language", () => {
    for (const baseProfile of companyBaseProfiles) {
      const copyProfile = companyCopyProfiles.find(
        (profile) => profile.companyId === baseProfile.id,
      );

      expect(copyProfile).toBeTruthy();

      expect(
        validateDisplayCopySemantics({
          companyId: baseProfile.id,
          texts: [
            copyProfile!.headline,
            copyProfile!.personaDescription,
            ...copyProfile!.keywords,
            ...copyProfile!.explanationTemplates,
            ...baseProfile.brandTags,
          ],
        }),
      ).toEqual([]);
    }
  });

  it("flags workplace-oriented display copy", () => {
    const issues = validateDisplayCopySemantics({
      companyId: "bad",
      texts: [
        "你像增长派",
        "你对业务结构和关键指标很敏感。",
        "平台协同",
      ],
    });

    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain("业务");
  });
});
