import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { ResultPage } from "./ResultPage";
import { createResultViewModel } from "./result-view-model";
import type { FinalPersonaResult, PersonaExplanation } from "../../domain/scoring/types";

const sampleResult: FinalPersonaResult = {
  personaId: "penguin-water",
  source: "normal",
  score: 12,
  matchedKeywords: ["保温杯", "稳中带暖"],
};

const sampleExplanation: PersonaExplanation = {
  headline: "爱喝开水的企鹅",
  personaDescription: "你骨子里有一种稳稳的生活节奏感。",
  keywords: ["保温杯人格", "稳中带暖", "生活节奏感", "社交恒温器"],
  memeOrigin: "开水团是美团的江湖绰号，企鹅是腾讯的吉祥物。",
  reasonText: "你的选择透露出一种把日子过得又顺又暖的能力。",
  rarity: "normal",
  relatedCompanies: ["美团", "腾讯"],
};

describe("ResultPage view model", () => {
  it("creates a valid ResultViewModel from persona result", () => {
    const viewModel = createResultViewModel(sampleResult, sampleExplanation);

    expect(viewModel.personaId).toBe("penguin-water");
    expect(viewModel.headline).toBe("爱喝开水的企鹅");
    expect(viewModel.characterImageSrc).toBeTruthy();
    expect(viewModel.characterImageAlt).toBe("爱喝开水的企鹅角色插画");
    expect(viewModel.relatedCompanies).toContain("美团");
    expect(viewModel.relatedCompanies).toContain("腾讯");
    expect(viewModel.memeOrigin).toBeTruthy();
    expect(viewModel.keywords.length).toBeGreaterThanOrEqual(3);
    expect(viewModel.shareTone).toContain("我是「爱喝开水的企鹅」");
  });

  it("renders a merged explanation section on the result page", () => {
    const viewModel = createResultViewModel(sampleResult, sampleExplanation);

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("为什么像 / 梗解读")).toBeInTheDocument();
    expect(screen.getByText(sampleExplanation.personaDescription)).toBeInTheDocument();
    expect(screen.getByText(sampleExplanation.memeOrigin)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "爱喝开水的企鹅角色插画" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^梗解读$/)).not.toBeInTheDocument();
  });

  it("generates SSR share tone for SSR results", () => {
    const ssrResult: FinalPersonaResult = {
      personaId: "chosen-one",
      source: "ssr",
      score: 0,
      matchedKeywords: [],
    };
    const ssrExplanation: PersonaExplanation = {
      headline: "✦ 天选打工人 ✦",
      personaDescription: "恭喜你触发了隐藏人设！",
      keywords: ["SSR", "全属性在线", "超级适配", "万能体质", "1%的天选"],
      memeOrigin: "SSR 级稀有人设。",
      reasonText: "你的答题画像异常均衡。",
      rarity: "ssr",
      relatedCompanies: ["全部大厂"],
    };

    const viewModel = createResultViewModel(ssrResult, ssrExplanation);

    expect(viewModel.rarity).toBe("ssr");
    expect(viewModel.shareTone).toContain("我是「✦ 天选打工人 ✦」");
    expect(viewModel.shareTone).toContain("隐藏款");
  });

  it("generates concentration share tone for concentration results", () => {
    const concResult: FinalPersonaResult = {
      personaId: "pure-ali",
      source: "concentration",
      score: 0.8,
      matchedKeywords: [],
    };
    const concExplanation: PersonaExplanation = {
      headline: "99.99%浓度的阿里人",
      personaDescription: "你身上的阿里浓度已经到了无法稀释的程度。",
      keywords: ["阿里纯血", "大局观拉满", "果断务实", "99.99%浓度"],
      memeOrigin: "你的测试结果几乎全部指向阿里气质。",
      reasonText: "你的绝大多数选择都高度一致地指向同一种气质。",
      rarity: "concentration",
      relatedCompanies: ["阿里"],
    };

    const viewModel = createResultViewModel(concResult, concExplanation);

    expect(viewModel.rarity).toBe("concentration");
    expect(viewModel.shareTone).toContain("我是「99.99%浓度的阿里人」");
    expect(viewModel.shareTone).toContain("挂杯");
  });
});
