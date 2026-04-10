import { describe, expect, it } from "vitest";

import type {
  CompanyBaseProfile,
  CompanyScoreProfile,
} from "../../domain/company/types";
import type { Question } from "../../domain/questions/types";
import { createCompanyCatalogItems } from "./company-catalog-view-model";

const baseProfiles: CompanyBaseProfile[] = [
  {
    id: "alpha",
    displayNameZh: "阿尔法",
    brandTags: ["快", "准", "稳"],
    region: "cn",
    category: "platform",
  },
  {
    id: "beta",
    displayNameZh: "贝塔",
    brandTags: ["新", "稳", "顺"],
    region: "global",
    category: "ai",
  },
];

const questions: Question[] = [
  {
    id: "q01",
    title: "测试题一",
    dimensionKey: "shipFast",
    options: [
      {
        id: "a",
        label: "选项 A",
        tone: "grounded",
        dimensionWeights: { shipFast: 2 },
        companyWeights: { alpha: 2 },
        keywords: ["快"],
      },
      {
        id: "b",
        label: "选项 B",
        tone: "grounded",
        dimensionWeights: { systemThinking: 1 },
        companyWeights: { beta: 1 },
        keywords: ["稳"],
      },
      {
        id: "c",
        label: "选项 C",
        tone: "grounded",
        dimensionWeights: { frontierDrive: 1 },
        companyWeights: { beta: 1 },
        keywords: ["新"],
      },
      {
        id: "d",
        label: "选项 D",
        tone: "grounded",
        dimensionWeights: { commercialFocus: 1 },
        companyWeights: {},
        keywords: ["顺"],
      },
    ],
  },
];

const scoreProfiles: CompanyScoreProfile[] = [
  {
    companyId: "alpha",
    dimensionAffinity: {
      shipFast: 1,
      systemThinking: 0.2,
    },
    priorityQuestions: {
      q01: 0.5,
    },
    tieBreakWeight: 0.6,
  },
  {
    companyId: "beta",
    dimensionAffinity: {
      frontierDrive: 0.8,
      systemThinking: 0.7,
    },
    tieBreakWeight: 0.3,
  },
];

describe("createCompanyCatalogItems", () => {
  it("builds non-zero model probabilities from question and weight data", () => {
    const items = createCompanyCatalogItems({
      baseProfiles,
      questions,
      scoreProfiles,
    });

    expect(items).toHaveLength(2);
    expect(items[0]?.displayNameZh).toBe("阿尔法");
    expect(items[0]?.probability).toBeGreaterThan(items[1]?.probability ?? 0);
    expect(items[0]?.probability).toBeGreaterThan(0);
    expect(items[1]?.probability).toBeGreaterThan(0);
    expect(
      Number(
        items.reduce((sum, item) => sum + item.probability, 0).toFixed(2),
      ),
    ).toBe(100);
  });
});
