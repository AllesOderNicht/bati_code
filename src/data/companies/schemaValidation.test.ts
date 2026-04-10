import { describe, expect, it } from "vitest";

import type {
  CompanyBaseProfile,
  CompanyCopyProfile,
  CompanyGovernanceProfile,
  CompanyScoreProfile,
} from "../../domain/company/types";
import { validateCompanyProfiles } from "../../domain/governance/companyGovernance";
import { companyBaseProfiles } from "./companyBaseProfiles";
import { companyCopyProfiles } from "./companyCopyProfiles";
import { companyGovernanceProfiles } from "./companyGovernanceProfiles";
import { companyScoreProfiles } from "./companyScoreProfiles";
import { questionBank } from "../questions/questionBank";

const baseProfiles: CompanyBaseProfile[] = [
  {
    id: "byte",
    displayNameZh: "字节跳动",
    brandTags: ["反应快", "内容感"],
    region: "cn",
    category: "consumer-tech",
  },
];

const scoreProfiles: CompanyScoreProfile[] = [
  {
    companyId: "byte",
    dimensionAffinity: {
      shipFast: 2,
      craftDepth: 1,
    },
    priorityQuestions: {
      q1: 1.5,
    },
    tieBreakWeight: 1,
  },
];

const copyProfiles: CompanyCopyProfile[] = [
  {
    companyId: "byte",
    headline: "你像字节派",
    personaDescription: "节奏在线，点子也在线。",
    keywords: ["有冲劲", "会迭代", "反应快"],
    explanationTemplates: ["你总能把想法很快推到下一步。"],
  },
];

const governanceProfiles: CompanyGovernanceProfile[] = [
  {
    companyId: "byte",
    isWhitelisted: true,
    isEnabled: true,
    riskNotes: [],
    preferredDisplayNameZh: "字节跳动",
    aliases: ["字节"],
  },
];

describe("validateCompanyProfiles", () => {
  it("accepts a complete layered company registry", () => {
    expect(() =>
      validateCompanyProfiles({
        baseProfiles,
        scoreProfiles,
        copyProfiles,
        governanceProfiles,
      }),
    ).not.toThrow();
  });

  it("fails when a company is missing its Chinese display name", () => {
    expect(() =>
      validateCompanyProfiles({
        baseProfiles: [{ ...baseProfiles[0], displayNameZh: "" }],
        scoreProfiles,
        copyProfiles,
        governanceProfiles,
      }),
    ).toThrow(/displayNameZh/);
  });

  it("keeps the shipped company registry and question bank complete", () => {
    expect(companyBaseProfiles).toHaveLength(40);
    expect(questionBank).toHaveLength(30);

    expect(() =>
      validateCompanyProfiles({
        baseProfiles: companyBaseProfiles,
        scoreProfiles: companyScoreProfiles,
        copyProfiles: companyCopyProfiles,
        governanceProfiles: companyGovernanceProfiles,
      }),
    ).not.toThrow();
  });
});
