import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { ResultPage } from "./ResultPage";
import { createResultViewModel } from "./result-view-model";
import type {
  FinalPersonaResult,
  PersonaExplanation,
} from "../../domain/scoring/types";

const sampleResult: FinalPersonaResult = {
  personaId: "penguin-water",
  source: "normal",
  score: 12,
  matchedKeywords: ["保温杯", "稳中带暖"],
};

const sampleExplanation: PersonaExplanation = {
  headline: "爱喝开水的企鹅",
  personaDescription: "你骨子里有一种稳稳的生活节奏感。",
  deepInsight:
    "你的稳，不是因为你不着急，而是因为你心里早就把所有事情排好了优先级。",
  funComment: "你朋友对你的终极评价大概是：靠谱得像个 App。",
  dailyHabits: [
    "出门前会默默检查天气",
    "保温杯从来不离手",
    "聚会时最先到最后走",
  ],
  funFacts: [
    "美团的内部文化号称无边界",
    "企鹅游泳时速可达 36 公里",
  ],
  keywords: ["保温杯人格", "稳中带暖", "生活节奏感", "社交恒温器"],
  memeOrigin: "开水团是美团的江湖绰号，企鹅是腾讯的吉祥物。",
  reasonText: "你的选择透露出一种把日子过得又顺又暖的能力。",
  rarity: "normal",
  relatedCompanies: ["美团", "腾讯"],
  ssrExclusiveNote: null,
};

describe("ResultPage view model", () => {
  it("creates a valid ResultViewModel with all fields", () => {
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
    expect(viewModel.deepInsight).toBeTruthy();
    expect(viewModel.funComment).toBeTruthy();
    expect(viewModel.dailyHabits.length).toBeGreaterThanOrEqual(3);
    expect(viewModel.funFacts.length).toBeGreaterThanOrEqual(2);
    expect(viewModel.ssrExclusiveNote).toBeNull();
  });

  it("renders the four-section MBTI-style result layout", () => {
    const viewModel = createResultViewModel(sampleResult, sampleExplanation);

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("爱喝开水的企鹅")).toBeInTheDocument();

    expect(screen.getByText("美团 × 腾讯")).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: "爱喝开水的企鹅角色插画" }),
    ).toBeInTheDocument();

    for (const kw of sampleExplanation.keywords) {
      expect(screen.getByText(kw)).toBeInTheDocument();
    }

    expect(screen.getByText("为什么像")).toBeInTheDocument();
    expect(
      screen.getByText(sampleExplanation.personaDescription),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleExplanation.reasonText),
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleExplanation.memeOrigin),
    ).toBeInTheDocument();
  });

  it("renders bottom action buttons (share, download, back home)", () => {
    const viewModel = createResultViewModel(sampleResult, sampleExplanation);

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(
      screen.getByRole("button", { name: "分享" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "保存图片" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "回到首页" }),
    ).toBeInTheDocument();
  });

  it("does not render exclusive note for normal personas", () => {
    const viewModel = createResultViewModel(sampleResult, sampleExplanation);

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.queryByText("✦ 隐藏档案 ✦")).not.toBeInTheDocument();
    expect(screen.queryByText("纯度报告")).not.toBeInTheDocument();
  });

  it("renders SSR badge and exclusive note", () => {
    const ssrResult: FinalPersonaResult = {
      personaId: "chosen-one",
      source: "ssr",
      score: 0,
      matchedKeywords: [],
    };
    const ssrExplanation: PersonaExplanation = {
      headline: "✦ 天选打工人 ✦",
      personaDescription: "恭喜你触发了隐藏人设！",
      deepInsight: "你的全属性在线不是因为你没有个性。",
      funComment: "你去面试任何一家大厂面试官都会说挺合适。",
      dailyHabits: [
        "能和任何人聊到一起",
        "学新东西上手极快",
        "经常被问你到底做什么的",
      ],
      funFacts: ["1% 的概率比抽到 SSR 卡还稀有"],
      keywords: ["SSR", "全属性在线", "超级适配", "万能体质", "1%的天选"],
      memeOrigin: "SSR 级稀有人设。",
      reasonText: "你的答题画像异常均衡。",
      rarity: "ssr",
      relatedCompanies: ["全部大厂"],
      ssrExclusiveNote: "隐藏档案——天选打工人是最稀有的结果之一。",
    };

    const viewModel = createResultViewModel(ssrResult, ssrExplanation);

    expect(viewModel.rarity).toBe("ssr");
    expect(viewModel.shareTone).toContain("隐藏款");
    expect(viewModel.ssrExclusiveNote).toBeTruthy();

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("✦ 隐藏档案 ✦")).toBeInTheDocument();
    expect(
      screen.getByText(ssrExplanation.ssrExclusiveNote!),
    ).toBeInTheDocument();
  });

  it("renders concentration bar and exclusive note for concentration results", () => {
    const concResult: FinalPersonaResult = {
      personaId: "pure-ali",
      source: "concentration",
      score: 0.8,
      matchedKeywords: [],
    };
    const concExplanation: PersonaExplanation = {
      headline: "99.99%浓度的阿里人",
      personaDescription: "你身上的阿里浓度已经到了无法稀释的程度。",
      deepInsight: "你的大局观不是空洞的概念。",
      funComment: "你可能是唯一一个点外卖都要画决策矩阵的人。",
      dailyHabits: [
        "做计划先想最坏情况",
        "说话先说结论再说原因",
      ],
      funFacts: ["阿里六脉神剑有一条叫拥抱变化"],
      keywords: ["阿里纯血", "大局观拉满", "果断务实", "99.99%浓度"],
      memeOrigin: "你的测试结果几乎全部指向阿里气质。",
      reasonText: "你的绝大多数选择都高度一致地指向同一种气质。",
      rarity: "concentration",
      relatedCompanies: ["阿里"],
      ssrExclusiveNote: "纯度报告——你的答题数据呈现极高一致性。",
    };

    const viewModel = createResultViewModel(concResult, concExplanation);

    expect(viewModel.rarity).toBe("concentration");
    expect(viewModel.shareTone).toContain("挂杯");

    render(
      <ResultPage
        state={{ status: "ready", result: viewModel }}
        onBackHome={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByLabelText("浓度指示器")).toBeInTheDocument();
    expect(screen.getByText("阿里浓度")).toBeInTheDocument();
    expect(screen.getByText("纯度报告")).toBeInTheDocument();
    expect(
      screen.getByText(concExplanation.ssrExclusiveNote!),
    ).toBeInTheDocument();
  });
});
