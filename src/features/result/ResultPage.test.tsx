import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResultPage } from "./ResultPage";
import type { ResultPageState } from "./result-copy-guard";

const readyState: ResultPageState = {
  status: "ready",
  result: {
    displayNameZh: "字节跳动",
    headline: "你像字节派",
    brandTags: ["节奏快", "内容感", "迭代力"],
    personaDescription: "你总能把想法快速推向下一版。",
    keywords: ["推进快", "内容感", "反馈回路"],
    reasonBlocks: [
      { title: "你为什么像它", text: "你在推进速度上的命中特别高。" },
      { title: "你的发光点", text: "一有反馈你就会越做越来劲。" },
    ],
    shareTone: "很适合截图给朋友看。",
  },
  issues: [],
};

describe("ResultPage", () => {
  it("renders the full result structure for a valid primary result", () => {
    render(
      <ResultPage
        onBackHome={vi.fn()}
        onRestart={vi.fn()}
        state={readyState}
      />,
    );

    expect(screen.getByRole("heading", { name: "你像字节派" })).toBeInTheDocument();
    expect(screen.getByText("字节跳动")).toBeInTheDocument();
    expect(screen.getByText("推进快")).toBeInTheDocument();
    expect(screen.getByText("你为什么像它")).toBeInTheDocument();
    expect(screen.getByText("一有反馈你就会越做越来劲。")).toBeInTheDocument();
  });

  it("supports restarting from the result page", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(
      <ResultPage
        onBackHome={vi.fn()}
        onRestart={onRestart}
        state={readyState}
      />,
    );

    await user.click(screen.getByRole("button", { name: "再测一次" }));

    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
