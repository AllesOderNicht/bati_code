import { describe, expect, it } from "vitest";

import { resolvePersonaResult } from "./resolvePersonaResult";
import type {
  PersonaRankedResult,
  SSRResult,
  ConcentrationResult,
} from "./types";

const noSSR: SSRResult = {
  triggered: false,
  personaId: "",
  rolledProbability: 0.01,
  boosted: false,
};

const noConcentration: ConcentrationResult = {
  triggered: false,
  personaId: "",
  companyGroup: "",
  concentrationScore: 0,
};

const sampleRanked: PersonaRankedResult[] = [
  { personaId: "penguin-water", score: 10, matchedKeywords: ["保温杯"] },
  { personaId: "slash-bro", score: 5, matchedKeywords: ["保温杯"] },
];

describe("resolvePersonaResult", () => {
  it("returns SSR result when SSR is triggered (highest priority)", () => {
    const ssr: SSRResult = {
      triggered: true,
      personaId: "chosen-one",
      rolledProbability: 0.01,
      boosted: false,
    };
    const concentration: ConcentrationResult = {
      triggered: true,
      personaId: "pure-ali",
      companyGroup: "alibaba",
      concentrationScore: 0.8,
    };

    const result = resolvePersonaResult(sampleRanked, ssr, concentration);

    expect(result).not.toBeNull();
    expect(result!.source).toBe("ssr");
    expect(result!.personaId).toBe("chosen-one");
  });

  it("returns concentration result when no SSR but concentration triggered", () => {
    const concentration: ConcentrationResult = {
      triggered: true,
      personaId: "pure-goose",
      companyGroup: "tencent",
      concentrationScore: 0.75,
    };

    const result = resolvePersonaResult(sampleRanked, noSSR, concentration);

    expect(result).not.toBeNull();
    expect(result!.source).toBe("concentration");
    expect(result!.personaId).toBe("pure-goose");
  });

  it("returns normal top1 when neither SSR nor concentration triggered", () => {
    const result = resolvePersonaResult(sampleRanked, noSSR, noConcentration);

    expect(result).not.toBeNull();
    expect(result!.source).toBe("normal");
    expect(result!.personaId).toBe("penguin-water");
    expect(result!.score).toBe(10);
  });

  it("returns null when no results and nothing triggered", () => {
    const result = resolvePersonaResult([], noSSR, noConcentration);

    expect(result).toBeNull();
  });
});
