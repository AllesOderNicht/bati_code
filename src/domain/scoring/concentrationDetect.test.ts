import { describe, expect, it } from "vitest";

import { detectConcentration } from "./concentrationDetect";
import type { PersonaRankedResult } from "./types";

describe("detectConcentration", () => {
  it("triggers for alibaba when alibaba-group personas dominate", () => {
    const results: PersonaRankedResult[] = [
      { personaId: "blessed-puppy", score: 10, matchedKeywords: [] },
      { personaId: "gaming-ali", score: 8, matchedKeywords: [] },
      { personaId: "heartless-ant", score: 7, matchedKeywords: [] },
      { personaId: "penguin-water", score: 2, matchedKeywords: [] },
    ];

    const result = detectConcentration(results);

    expect(result.triggered).toBe(true);
    expect(result.personaId).toBe("pure-ali");
    expect(result.companyGroup).toBe("alibaba");
  });

  it("triggers for tencent when tencent-group personas dominate", () => {
    const results: PersonaRankedResult[] = [
      { personaId: "penguin-water", score: 10, matchedKeywords: [] },
      { personaId: "wechat-dog", score: 9, matchedKeywords: [] },
      { personaId: "happy-drunk", score: 8, matchedKeywords: [] },
      { personaId: "heartless-ant", score: 1, matchedKeywords: [] },
    ];

    const result = detectConcentration(results);

    expect(result.triggered).toBe(true);
    expect(result.personaId).toBe("pure-goose");
  });

  it("does not trigger when scores are evenly distributed", () => {
    const results: PersonaRankedResult[] = [
      { personaId: "penguin-water", score: 3, matchedKeywords: [] },
      { personaId: "heartless-ant", score: 3, matchedKeywords: [] },
      { personaId: "slash-bro", score: 3, matchedKeywords: [] },
      { personaId: "gacha-weeb", score: 3, matchedKeywords: [] },
      { personaId: "didi-delivery", score: 3, matchedKeywords: [] },
      { personaId: "blessed-puppy", score: 3, matchedKeywords: [] },
    ];

    const result = detectConcentration(results);

    expect(result.triggered).toBe(false);
  });

  it("does not trigger with empty results", () => {
    const result = detectConcentration([]);

    expect(result.triggered).toBe(false);
  });
});
