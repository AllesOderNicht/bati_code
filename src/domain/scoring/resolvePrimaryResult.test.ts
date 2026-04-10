import { describe, expect, it } from "vitest";

import type {
  CompanyBaseProfile,
  CompanyGovernanceProfile,
} from "../company/types";
import type { RankedCompanyResult } from "./types";
import { resolvePrimaryResult } from "./resolvePrimaryResult";

const companyBaseProfiles: CompanyBaseProfile[] = [
  {
    id: "byte",
    displayNameZh: "字节跳动",
    brandTags: ["反应快"],
    region: "cn",
    category: "consumer-tech",
  },
  {
    id: "msft",
    displayNameZh: "微软",
    brandTags: ["系统感"],
    region: "global",
    category: "platform",
  },
];

describe("resolvePrimaryResult", () => {
  it("skips companies that are not whitelisted", () => {
    const rankedResults: RankedCompanyResult[] = [
      {
        companyId: "byte",
        score: 9,
        matchedDimensions: [{ key: "shipFast", score: 4 }],
        matchedKeywords: ["推进快"],
        coreDimensionScore: 4,
        priorityHitScore: 0,
        tieBreakWeight: 1,
      },
      {
        companyId: "msft",
        score: 8,
        matchedDimensions: [{ key: "craftDepth", score: 3 }],
        matchedKeywords: ["系统感"],
        coreDimensionScore: 3,
        priorityHitScore: 0,
        tieBreakWeight: 0.5,
      },
    ];

    const governanceProfiles: CompanyGovernanceProfile[] = [
      {
        companyId: "byte",
        isWhitelisted: false,
        isEnabled: true,
        riskNotes: ["待审核"],
        preferredDisplayNameZh: "字节跳动",
        aliases: ["字节"],
      },
      {
        companyId: "msft",
        isWhitelisted: true,
        isEnabled: true,
        riskNotes: [],
        preferredDisplayNameZh: "微软",
        aliases: ["Microsoft"],
      },
    ];

    const result = resolvePrimaryResult({
      rankedResults,
      companyBaseProfiles,
      governanceProfiles,
    });

    expect(result?.companyId).toBe("msft");
    expect(result?.displayNameZh).toBe("微软");
    expect(result?.matchPercentage).toBe(92);
  });

  it("uses matched dimensions and tie break weight for stable selection", () => {
    const rankedResults: RankedCompanyResult[] = [
      {
        companyId: "byte",
        score: 10,
        matchedDimensions: [{ key: "shipFast", score: 4 }],
        matchedKeywords: ["推进快"],
        coreDimensionScore: 4,
        priorityHitScore: 0,
        tieBreakWeight: 1,
      },
      {
        companyId: "msft",
        score: 10,
        matchedDimensions: [
          { key: "craftDepth", score: 3 },
          { key: "systemThinking", score: 2 },
        ],
        matchedKeywords: ["系统感"],
        coreDimensionScore: 5,
        priorityHitScore: 0,
        tieBreakWeight: 0.2,
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
      {
        companyId: "msft",
        isWhitelisted: true,
        isEnabled: true,
        riskNotes: [],
        preferredDisplayNameZh: "微软",
        aliases: ["Microsoft"],
      },
    ];

    const result = resolvePrimaryResult({
      rankedResults,
      companyBaseProfiles,
      governanceProfiles,
    });

    expect(result?.companyId).toBe("msft");
    expect(result?.matchPercentage).toBe(73);
    expect(result?.reasonDimensions).toEqual(["craftDepth", "systemThinking"]);
  });
});
