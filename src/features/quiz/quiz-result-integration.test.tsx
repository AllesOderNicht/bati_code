import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "../../App";
import type { CompanyProfileRegistry } from "../../domain/company/types";
import { demoQuestionBank } from "../../data/questions/questionBank";

const registry: CompanyProfileRegistry = {
  baseProfiles: [
    {
      id: "byte",
      displayNameZh: "字节跳动",
      brandTags: ["节奏快", "内容感", "迭代力"],
      region: "cn",
      category: "consumer-tech",
    },
    {
      id: "microsoft",
      displayNameZh: "微软",
      brandTags: ["系统搭建", "生产力", "平台气质"],
      region: "global",
      category: "platform",
    },
  ],
  scoreProfiles: [
    {
      companyId: "byte",
      dimensionAffinity: {
        shipFast: 0.95,
        frontierDrive: 0.45,
        peopleSense: 0.35,
      },
      priorityQuestions: {
        q01: 0.5,
      },
      tieBreakWeight: 0.8,
    },
    {
      companyId: "microsoft",
      dimensionAffinity: {
        craftDepth: 0.8,
        systemThinking: 0.95,
      },
      tieBreakWeight: 0.6,
    },
  ],
  copyProfiles: [
    {
      companyId: "byte",
      headline: "你像字节派",
      personaDescription: "你总能快速推进并持续吃到反馈。",
      keywords: ["推进快", "内容感", "反馈回路"],
      explanationTemplates: [
        "你在 {dimension} 上命中特别高。",
        "一旦出现 {keyword}，你就会更有手感。",
      ],
    },
    {
      companyId: "microsoft",
      headline: "你像微软派",
      personaDescription: "你更喜欢把系统搭稳再往前推。",
      keywords: ["系统搭建", "生产力", "稳定感"],
      explanationTemplates: [
        "你在 {dimension} 上更像稳健型选手。",
        "{keyword} 对你来说是一种默认追求。",
      ],
    },
  ],
  governanceProfiles: [
    {
      companyId: "byte",
      isWhitelisted: true,
      isEnabled: true,
      riskNotes: [],
      preferredDisplayNameZh: "字节跳动",
      aliases: ["字节"],
    },
    {
      companyId: "microsoft",
      isWhitelisted: true,
      isEnabled: true,
      riskNotes: [],
      preferredDisplayNameZh: "微软",
      aliases: ["Microsoft"],
    },
  ],
};

describe("quiz to result integration", () => {
  it("shows a company result after the quiz is completed", async () => {
    const user = userEvent.setup();

    render(<App questions={demoQuestionBank} registry={registry} />);

    await user.click(screen.getByRole("button", { name: "开始测你的厂味" }));
    await user.click(
      screen.getByRole("button", {
        name: "看看约的是什么，听着有意思就换计划",
      }),
    );
    await user.click(screen.getByRole("button", { name: "下一题" }));
    await user.click(
      screen.getByRole("button", { name: "直接下载或点开，好不好试了才知道" }),
    );
    await user.click(screen.getByRole("button", { name: "下一题" }));
    await user.click(
      screen.getByRole("button", {
        name: "找个有意思的背景或构图，拍出点不一样的感觉",
      }),
    );
    await user.click(screen.getByRole("button", { name: "查看结果" }));

    expect(
      screen.getByRole("heading", { name: "96% 是字节跳动人" }),
    ).toBeInTheDocument();
    expect(screen.getByText("BATI 结果已出炉")).toBeInTheDocument();
    expect(screen.getByText("推进快")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "再测一次" }));

    expect(
      screen.getByRole("heading", { name: "周末朋友突然约你出门，但你已经有自己的安排了，你会？" }),
    ).toBeInTheDocument();
  });
});
