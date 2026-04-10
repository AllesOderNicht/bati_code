import { describe, expect, it } from "vitest";

import { validateQuestionBankSemantics } from "./questionBankValidation";
import { questionBank } from "./questionBank";
import { DIMENSION_LABELS } from "../../domain/questions/types";

describe("validateQuestionBankSemantics", () => {
  it("accepts the shipped question bank when all copy stays outside workplace language", () => {
    expect(() =>
      validateQuestionBankSemantics({
        questions: questionBank,
        dimensionLabels: DIMENSION_LABELS,
      }),
    ).not.toThrow();
  });

  it("enforces a 12-question bank with exactly 3 absurd options across all questions", () => {
    expect(questionBank).toHaveLength(12);

    let totalAbsurd = 0;

    for (const question of questionBank) {
      expect(question.options).toHaveLength(4);

      const absurdCount = question.options.filter(
        (option) => option.tone === "absurd",
      ).length;
      expect(absurdCount).toBeLessThanOrEqual(1);
      totalAbsurd += absurdCount;
    }

    expect(totalAbsurd).toBe(3);
  });

  it("rejects workplace-oriented language in titles, options, keywords, and dimensions", () => {
    const groundedOption = {
      id: "a",
      label: "说话直接，但很安心",
      tone: "grounded" as const,
      dimensionWeights: { peopleSense: 1 },
      companyWeights: {},
      keywords: ["安心感"],
    };

    const badQuestion = {
      id: "bad-q1",
      title: "你更欣赏哪种团队气质？",
      dimensionKey: "peopleSense" as const,
      options: [
        groundedOption,
        { ...groundedOption, id: "b", label: "一起磨细节也不累", keywords: ["团队协作"] },
        { ...groundedOption, id: "c" },
        { ...groundedOption, id: "d" },
      ],
    };

    const cleanQuestion = {
      id: "clean-q",
      title: "你更喜欢哪种周末？",
      dimensionKey: "peopleSense" as const,
      options: [
        groundedOption,
        { ...groundedOption, id: "b" },
        { ...groundedOption, id: "c" },
        { ...groundedOption, id: "d", tone: "absurd" as const },
      ],
    };

    expect(() =>
      validateQuestionBankSemantics({
        questions: [
          cleanQuestion,
          { ...cleanQuestion, id: "clean-q2" },
          { ...cleanQuestion, id: "clean-q3" },
          { ...badQuestion, id: "bad-q1" },
          ...Array.from({ length: 8 }, (_, index) => ({
            ...badQuestion,
            id: `bad-q${index + 2}`,
            title: "一个正常的题目",
          })),
        ] as typeof questionBank,
        dimensionLabels: {
          ...DIMENSION_LABELS,
          commercialFocus: "结果导向",
        },
      }),
    ).toThrow(/团队|结果导向/);
  });
});
