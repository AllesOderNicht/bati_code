import { describe, expect, it } from "vitest";

import { scorePersonaQuiz } from "./scorePersonaQuiz";
import { questionBank } from "../../data/questions/questionBank";
import type { QuizAnswers } from "../questions/types";

function buildAllAnswers(optionId: string): QuizAnswers {
  const answers: QuizAnswers = {};

  for (const question of questionBank) {
    answers[question.id] = optionId;
  }

  return answers;
}

describe("scorePersonaQuiz", () => {
  it("returns sorted persona results for a full set of answers", () => {
    const answers = buildAllAnswers("a");
    const results = scorePersonaQuiz(answers, questionBank);

    expect(results.length).toBeGreaterThan(0);

    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("returns empty array when no answers provided", () => {
    const results = scorePersonaQuiz({}, questionBank);
    expect(results).toEqual([]);
  });

  it("only includes normal personas in results", () => {
    const answers = buildAllAnswers("a");
    const results = scorePersonaQuiz(answers, questionBank);
    const ssrIds = ["chosen-one", "magician"];
    const concentrationIds = ["pure-ali", "pure-byte", "pure-goose"];

    for (const result of results) {
      expect(ssrIds).not.toContain(result.personaId);
      expect(concentrationIds).not.toContain(result.personaId);
    }
  });

  it("collects up to 5 matched keywords", () => {
    const answers = buildAllAnswers("b");
    const results = scorePersonaQuiz(answers, questionBank);

    for (const result of results) {
      expect(result.matchedKeywords.length).toBeLessThanOrEqual(5);
    }
  });
});
