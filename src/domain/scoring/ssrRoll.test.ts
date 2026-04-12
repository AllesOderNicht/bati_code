import { describe, expect, it } from "vitest";

import { rollSSR } from "./ssrRoll";
import { questionBank } from "../../data/questions/questionBank";
import type { QuizAnswers } from "../questions/types";

function buildAllAnswers(optionId: string): QuizAnswers {
  const answers: QuizAnswers = {};

  for (const question of questionBank) {
    answers[question.id] = optionId;
  }

  return answers;
}

describe("rollSSR", () => {
  it("does not trigger when random roll is above probability", () => {
    const answers = buildAllAnswers("a");
    const result = rollSSR(answers, questionBank, () => 0.5);

    expect(result.triggered).toBe(false);
    expect(result.personaId).toBe("");
  });

  it("triggers when random roll is below base probability", () => {
    const answers = buildAllAnswers("a");
    let callCount = 0;
    const result = rollSSR(answers, questionBank, () => {
      callCount++;
      return callCount === 1 ? 0.005 : 0.3;
    });

    expect(result.triggered).toBe(true);
    expect(["chosen-one", "magician"]).toContain(result.personaId);
  });

  it("selects chosen-one when second roll < 0.5", () => {
    const answers = buildAllAnswers("a");
    let callCount = 0;
    const result = rollSSR(answers, questionBank, () => {
      callCount++;
      return callCount === 1 ? 0.001 : 0.2;
    });

    expect(result.personaId).toBe("chosen-one");
  });

  it("selects magician when second roll >= 0.5", () => {
    const answers = buildAllAnswers("a");
    let callCount = 0;
    const result = rollSSR(answers, questionBank, () => {
      callCount++;
      return callCount === 1 ? 0.001 : 0.8;
    });

    expect(result.personaId).toBe("magician");
  });

  it("boosts probability with balanced answers", () => {
    const answers: QuizAnswers = {};
    const optionIds = ["a", "b", "c", "d"];

    for (let i = 0; i < questionBank.length; i++) {
      answers[questionBank[i].id] = optionIds[i % 4];
    }

    const result = rollSSR(answers, questionBank, () => 0.5);

    expect(result.rolledProbability).toBeGreaterThan(0.01);
    expect(result.boosted).toBe(true);
  });

  it("caps probability at 5%", () => {
    const answers: QuizAnswers = {};
    const optionIds = ["a", "b", "c", "d"];

    for (let i = 0; i < questionBank.length; i++) {
      answers[questionBank[i].id] = optionIds[i % 4];
    }

    const result = rollSSR(answers, questionBank, () => 0.999);

    expect(result.rolledProbability).toBeLessThanOrEqual(0.05);
  });
});
