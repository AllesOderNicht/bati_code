import { describe, it, expect } from "vitest";
import { questionBank } from "./questionBank";
import { personaProfiles } from "../personas/personaProfiles";
import { scorePersonaQuiz } from "../../domain/scoring/scorePersonaQuiz";
import { detectConcentration } from "../../domain/scoring/concentrationDetect";
import type { QuizAnswers } from "../../domain/questions/types";

const NORMAL_IDS = new Set(
  personaProfiles.filter((p) => p.rarity === "normal").map((p) => p.id),
);

function computeTotals() {
  const totals = new Map<string, number>();
  const appearances = new Map<string, number>();
  for (const q of questionBank) {
    for (const opt of q.options) {
      for (const [pid, w] of Object.entries(opt.personaWeights)) {
        if (NORMAL_IDS.has(pid)) {
          totals.set(pid, (totals.get(pid) ?? 0) + w);
          appearances.set(pid, (appearances.get(pid) ?? 0) + 1);
        }
      }
    }
  }
  return { totals, appearances };
}

function buildAnswers(optionPicks: Record<string, string>): QuizAnswers {
  return optionPicks;
}

function findBestOptionForPersona(questionId: string, personaId: string): string {
  const q = questionBank.find((q) => q.id === questionId)!;
  let bestOpt = "a";
  let bestWeight = -1;
  for (const opt of q.options) {
    const w = opt.personaWeights[personaId] ?? 0;
    if (w > bestWeight) {
      bestWeight = w;
      bestOpt = opt.id;
    }
  }
  return bestOpt;
}

function buildDedicatedPath(personaId: string): QuizAnswers {
  const answers: QuizAnswers = {};
  for (const q of questionBank) {
    answers[q.id] = findBestOptionForPersona(q.id, personaId);
  }
  return answers;
}

function generateRandomAnswers(): QuizAnswers {
  const answers: QuizAnswers = {};
  const optionIds = ["a", "b", "c", "d"];
  for (const q of questionBank) {
    answers[q.id] = optionIds[Math.floor(Math.random() * 4)];
  }
  return answers;
}

describe("static weight distribution", () => {
  it("total obtainable scores are balanced (max/min < 1.2)", () => {
    const { totals } = computeTotals();
    const vals = [...totals.values()];
    const ratio = Math.max(...vals) / Math.min(...vals);
    expect(ratio).toBeLessThan(1.2);
  });

  it("all options have 3-5 personas with weights in {1,2,3}", () => {
    for (const q of questionBank) {
      for (const opt of q.options) {
        const keys = Object.keys(opt.personaWeights);
        expect(keys.length).toBeGreaterThanOrEqual(3);
        expect(keys.length).toBeLessThanOrEqual(5);
        for (const w of Object.values(opt.personaWeights)) {
          expect([1, 2, 3]).toContain(w);
        }
      }
    }
  });

  it("each normal persona appears in at least 8 options", () => {
    const { appearances } = computeTotals();
    for (const pid of NORMAL_IDS) {
      expect(appearances.get(pid) ?? 0).toBeGreaterThanOrEqual(8);
    }
  });
});

describe("dedicated path tests", () => {
  const normalPersonas = personaProfiles.filter((p) => p.rarity === "normal");

  for (const persona of normalPersonas) {
    it(`dedicated path for ${persona.id} produces Top1`, () => {
      const answers = buildDedicatedPath(persona.id);
      const ranked = scorePersonaQuiz(answers, questionBank);
      expect(ranked.length).toBeGreaterThan(0);
      expect(ranked[0].personaId).toBe(persona.id);
    });
  }
});

describe("monte carlo simulation", () => {
  it("all personas appear within acceptable range (1/12 ± 50%)", () => {
    const TRIALS = 10000;
    const counts = new Map<string, number>();

    for (let i = 0; i < TRIALS; i++) {
      const answers = generateRandomAnswers();
      const ranked = scorePersonaQuiz(answers, questionBank);
      if (ranked.length > 0) {
        const top = ranked[0].personaId;
        counts.set(top, (counts.get(top) ?? 0) + 1);
      }
    }

    for (const pid of NORMAL_IDS) {
      const count = counts.get(pid) ?? 0;
      const rate = count / TRIALS;
      expect(
        rate,
        `${pid} appeared ${count}/${TRIALS} (${(rate * 100).toFixed(1)}%), expected 3.5%-14%`,
      ).toBeGreaterThan(0.035);
      expect(
        rate,
        `${pid} appeared ${count}/${TRIALS} (${(rate * 100).toFixed(1)}%), expected 3.5%-14%`,
      ).toBeLessThan(0.14);
    }
  });
});

describe("concentration triggerability", () => {
  const ALIBABA_MEMBERS = ["blessed-puppy", "gaming-ali", "heartless-ant"];
  const BYTE_MEMBERS = ["starry-eyes", "chrysanthemum-dancer", "heartless-ant", "didi-delivery"];
  const TENCENT_MEMBERS = ["penguin-water", "wechat-dog", "happy-drunk", "gaming-ali", "zoo-director"];

  function buildConcentrationPath(memberIds: string[]): QuizAnswers {
    const answers: QuizAnswers = {};
    for (const q of questionBank) {
      let bestOpt = "a";
      let bestScore = -1;
      for (const opt of q.options) {
        let score = 0;
        for (const pid of memberIds) {
          score += opt.personaWeights[pid] ?? 0;
        }
        if (score > bestScore) {
          bestScore = score;
          bestOpt = opt.id;
        }
      }
      answers[q.id] = bestOpt;
    }
    return answers;
  }

  it("alibaba concentration is triggerable", () => {
    const answers = buildConcentrationPath(ALIBABA_MEMBERS);
    const ranked = scorePersonaQuiz(answers, questionBank);
    const result = detectConcentration(ranked);
    expect(result.triggered).toBe(true);
    expect(result.companyGroup).toBe("alibaba");
  });

  it("byte concentration is triggerable", () => {
    const answers = buildConcentrationPath(BYTE_MEMBERS);
    const ranked = scorePersonaQuiz(answers, questionBank);
    const result = detectConcentration(ranked);
    expect(result.triggered).toBe(true);
    expect(result.companyGroup).toBe("byte");
  });

  it("tencent concentration is triggerable", () => {
    const answers = buildConcentrationPath(TENCENT_MEMBERS);
    const ranked = scorePersonaQuiz(answers, questionBank);
    const result = detectConcentration(ranked);
    expect(result.triggered).toBe(true);
    expect(result.companyGroup).toBe("tencent");
  });
});

describe("persona distinction", () => {
  it("penguin-water and blessed-puppy have different Top1 on their dedicated paths", () => {
    const pathA = buildDedicatedPath("penguin-water");
    const pathB = buildDedicatedPath("blessed-puppy");
    const rankedA = scorePersonaQuiz(pathA, questionBank);
    const rankedB = scorePersonaQuiz(pathB, questionBank);
    expect(rankedA[0].personaId).not.toBe(rankedB[0].personaId);
  });

  it("wechat-dog and happy-drunk have different Top1 on their dedicated paths", () => {
    const pathA = buildDedicatedPath("wechat-dog");
    const pathB = buildDedicatedPath("happy-drunk");
    const rankedA = scorePersonaQuiz(pathA, questionBank);
    const rankedB = scorePersonaQuiz(pathB, questionBank);
    expect(rankedA[0].personaId).not.toBe(rankedB[0].personaId);
  });
});
