import { describe, expect, it } from "vitest";

import { validateQuestionBankSemantics } from "./questionBankValidation";
import { questionBank } from "./questionBank";
import { personaProfiles } from "../personas/personaProfiles";

describe("validateQuestionBankSemantics", () => {
  it("accepts the shipped question bank", () => {
    expect(() => validateQuestionBankSemantics(questionBank)).not.toThrow();
  });

  it("enforces 12 questions with 4 options each", () => {
    expect(questionBank).toHaveLength(12);

    for (const question of questionBank) {
      expect(question.options).toHaveLength(4);
    }
  });

  it("ensures every normal persona is referenced in at least 3 options", () => {
    const normalPersonas = personaProfiles
      .filter((p) => p.rarity === "normal")
      .map((p) => p.id);

    const coverage = new Map<string, number>();

    for (const question of questionBank) {
      for (const option of question.options) {
        for (const personaId of Object.keys(option.personaWeights)) {
          coverage.set(personaId, (coverage.get(personaId) ?? 0) + 1);
        }
      }
    }

    for (const personaId of normalPersonas) {
      expect(coverage.get(personaId) ?? 0).toBeGreaterThanOrEqual(3);
    }
  });

  it("rejects workplace-oriented language in titles, options, and keywords", () => {
    const cleanOption = {
      id: "a",
      label: "说话直接，但很安心",
      personaWeights: { "penguin-water": 1 },
      keywords: ["安心感"],
    };

    const badQuestion = {
      id: "bad-q1",
      title: "你更欣赏哪种团队气质？",
      options: [
        cleanOption,
        { ...cleanOption, id: "b" },
        { ...cleanOption, id: "c" },
        { ...cleanOption, id: "d" },
      ] as [typeof cleanOption, typeof cleanOption, typeof cleanOption, typeof cleanOption],
    };

    const cleanQuestion = {
      id: "clean-q",
      title: "你更喜欢哪种周末？",
      options: [
        cleanOption,
        { ...cleanOption, id: "b" },
        { ...cleanOption, id: "c" },
        { ...cleanOption, id: "d" },
      ] as [typeof cleanOption, typeof cleanOption, typeof cleanOption, typeof cleanOption],
    };

    expect(() =>
      validateQuestionBankSemantics([
        cleanQuestion,
        { ...cleanQuestion, id: "clean-q2" },
        { ...cleanQuestion, id: "clean-q3" },
        { ...badQuestion, id: "bad-q1" },
        ...Array.from({ length: 8 }, (_, index) => ({
          ...cleanQuestion,
          id: `clean-q${index + 4}`,
        })),
      ]),
    ).toThrow(/团队/);
  });

  it("validates persona profile completeness", () => {
    expect(personaProfiles).toHaveLength(17);

    for (const profile of personaProfiles) {
      expect(profile.id).toBeTruthy();
      expect(profile.displayName).toBeTruthy();
      expect(profile.memeOrigin).toBeTruthy();
      expect(profile.personaDescription).toBeTruthy();
      expect(profile.keywords.length).toBeGreaterThanOrEqual(3);
      expect(profile.keywords.length).toBeLessThanOrEqual(5);
      expect(profile.reasonTemplate).toBeTruthy();
    }
  });

  it("validates SSR personas have ssrBaseProbability", () => {
    const ssrPersonas = personaProfiles.filter((p) => p.rarity === "ssr");
    expect(ssrPersonas).toHaveLength(2);

    for (const persona of ssrPersonas) {
      expect(persona.ssrBaseProbability).toBeDefined();
      expect(persona.ssrBaseProbability).toBeGreaterThan(0);
      expect(persona.ssrBaseProbability).toBeLessThanOrEqual(0.05);
    }
  });

  it("validates concentration personas have concentrationCompanyGroup", () => {
    const concentrationPersonas = personaProfiles.filter(
      (p) => p.rarity === "concentration",
    );
    expect(concentrationPersonas).toHaveLength(3);

    for (const persona of concentrationPersonas) {
      expect(persona.concentrationCompanyGroup).toBeTruthy();
    }
  });
});
