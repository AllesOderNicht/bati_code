import { describe, expect, it } from "vitest";

import type { CompanyScoreProfile } from "../company/types";
import type { Question } from "../questions/types";
import { scoreQuiz } from "./scoreQuiz";

const questions: Question[] = [
  {
    id: "q1",
    title: "你更容易被哪种周末状态点亮？",
    dimensionKey: "shipFast",
    options: [
      {
        id: "a",
        label: "临时起意就想马上出门试试新东西",
        tone: "grounded",
        dimensionWeights: { shipFast: 2 },
        companyWeights: { byte: 1 },
        keywords: ["推进快", "先上线"],
      },
      {
        id: "b",
        label: "先把环境和细节都收拾顺再慢慢享受",
        tone: "grounded",
        dimensionWeights: { craftDepth: 2 },
        companyWeights: { microsoft: 1 },
        keywords: ["打磨感"],
      },
      {
        id: "c",
        label: "先看看朋友们都在玩什么，再决定跟哪条线",
        tone: "grounded",
        dimensionWeights: { peopleSense: 1 },
        companyWeights: {},
        keywords: ["看气氛"],
      },
      {
        id: "d",
        label: "给阳台植物做即兴采访，问它今天适合不适合出门",
        tone: "absurd",
        dimensionWeights: { frontierDrive: 1 },
        companyWeights: {},
        keywords: ["植物采访"],
      },
    ],
  },
  {
    id: "q2",
    title: "看到一个新玩意时你会怎么反应？",
    dimensionKey: "craftDepth",
    options: [
      {
        id: "a",
        label: "先拆清楚再决定值不值得带回家",
        tone: "grounded",
        dimensionWeights: { craftDepth: 1 },
        companyWeights: {},
        keywords: ["拆解力"],
      },
      {
        id: "b",
        label: "先试一手，喜欢再说",
        tone: "grounded",
        dimensionWeights: { shipFast: 1 },
        companyWeights: { byte: 1 },
        keywords: ["反馈感"],
      },
      {
        id: "c",
        label: "如果外形很顺眼，你会先拍照再想要不要买",
        tone: "grounded",
        dimensionWeights: { craftDepth: 1 },
        companyWeights: { microsoft: 1 },
        keywords: ["顺眼感"],
      },
      {
        id: "d",
        label: "把它举到耳边，认真听听它有没有在偷偷说话",
        tone: "absurd",
        dimensionWeights: { frontierDrive: 1 },
        companyWeights: {},
        keywords: ["会说话"],
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
    companyId: "microsoft",
    dimensionAffinity: {
      shipFast: 0.5,
      craftDepth: 2,
    },
    tieBreakWeight: 0.5,
    rarityWeight: 0.68,
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
    expect(rankedResults[1].companyId).toBe("microsoft");
  });

  it("makes global companies harder to surface on close matches", () => {
    const rankedResults = scoreQuiz({
      answers: {
        q1: "a",
        q2: "a",
      },
      questions,
      companyScoreProfiles: [
        {
          companyId: "byte",
          dimensionAffinity: {
            shipFast: 1.8,
            craftDepth: 1.1,
          },
          tieBreakWeight: 0.8,
        },
        {
          companyId: "google",
          dimensionAffinity: {
            shipFast: 2.25,
            craftDepth: 1.3,
          },
          tieBreakWeight: 0.8,
          rarityWeight: 0.8,
        },
      ],
    });

    expect(rankedResults[0].companyId).toBe("byte");
    expect(rankedResults[1].companyId).toBe("google");
  });

  it("keeps microsoft as a rarer outcome by lowering close-match scores", () => {
    const rankedResults = scoreQuiz({
      answers: {
        q1: "b",
        q2: "c",
      },
      questions,
      companyScoreProfiles,
    });

    expect(rankedResults[0].companyId).toBe("microsoft");
    expect(rankedResults[0].score).toBeLessThan(6);
  });
});
