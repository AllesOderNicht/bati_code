import { describe, expect, it } from "vitest";

import type { CompanyScoreProfile } from "../company/types";
import type { Question } from "../questions/types";
import { scoreQuiz } from "./scoreQuiz";

const questions: Question[] = [
  {
    id: "q1",
    title: "你更喜欢哪种推进方式？",
    dimensionKey: "shipFast",
    options: [
      {
        id: "a",
        label: "先跑起来再打磨",
        dimensionWeights: { shipFast: 2 },
        companyWeights: { byte: 1 },
        keywords: ["推进快", "先上线"],
      },
      {
        id: "b",
        label: "先把细节打磨到位",
        dimensionWeights: { craftDepth: 2 },
        companyWeights: { msft: 1 },
        keywords: ["打磨感"],
      },
    ],
  },
  {
    id: "q2",
    title: "碰到新问题时你会怎么做？",
    dimensionKey: "craftDepth",
    options: [
      {
        id: "a",
        label: "先拆清楚再动",
        dimensionWeights: { craftDepth: 1 },
        companyWeights: {},
        keywords: ["拆解力"],
      },
      {
        id: "b",
        label: "先试一版看看反馈",
        dimensionWeights: { shipFast: 1 },
        companyWeights: { byte: 1 },
        keywords: ["反馈感"],
      },
    ],
  },
];

const companyScoreProfiles: CompanyScoreProfile[] = [
  {
    companyId: "byte",
    dimensionAffinity: {
      shipFast: 2,
      craftDepth: 0.5,
    },
    tieBreakWeight: 1,
  },
  {
    companyId: "msft",
    dimensionAffinity: {
      shipFast: 0.5,
      craftDepth: 2,
    },
    tieBreakWeight: 0.5,
  },
];

describe("scoreQuiz", () => {
  it("accumulates company and dimension scores into ranked results", () => {
    const rankedResults = scoreQuiz({
      answers: {
        q1: "a",
        q2: "b",
      },
      questions,
      companyScoreProfiles,
    });

    expect(rankedResults[0].companyId).toBe("byte");
    expect(rankedResults[0].score).toBe(8);
    expect(rankedResults[0].matchedKeywords).toEqual(["推进快", "先上线", "反馈感"]);
    expect(rankedResults[0].matchedDimensions[0]).toEqual({
      key: "shipFast",
      score: 6,
    });
    expect(rankedResults[1].companyId).toBe("msft");
  });
});
