import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";

import { App } from "./App";
import { demoQuestionBank } from "./data/questions/questionBank";
import * as preloadImageModule from "./features/result/preloadImage";

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/bati");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the home hero before the quiz starts", () => {
    render(<App questions={demoQuestionBank} />);

    expect(
      screen.getByRole("heading", { name: "BATI 大厂气质测试" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开始测你的厂味" }),
    ).toBeInTheDocument();
  });

  it("starts the quiz and shows the first question with progress", async () => {
    const user = userEvent.setup();

    render(<App questions={demoQuestionBank} />);

    await user.click(screen.getByRole("button", { name: "开始测你的厂味" }));

    expect(
      screen.getByRole("heading", { name: demoQuestionBank[0].title }),
    ).toBeInTheDocument();
    expect(screen.getByText("第 1 / 3 题")).toBeInTheDocument();
  });

  it("records the selected answer and advances to the next question", async () => {
    const user = userEvent.setup();

    render(<App questions={demoQuestionBank} />);

    await user.click(screen.getByRole("button", { name: "开始测你的厂味" }));

    const nextButton = screen.getByRole("button", { name: "下一题" });
    expect(nextButton).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: demoQuestionBank[0].options[0].label }),
    );
    expect(nextButton).toBeEnabled();

    await user.click(nextButton);
    expect(screen.getByText("第 2 / 3 题")).toBeInTheDocument();
  });

  it("finishes the quiz and shows a persona result", async () => {
    const user = userEvent.setup();

    render(<App questions={demoQuestionBank} />);

    await user.click(screen.getByRole("button", { name: "开始测你的厂味" }));

    for (let i = 0; i < demoQuestionBank.length; i++) {
      await user.click(
        screen.getByRole("button", { name: demoQuestionBank[i].options[0].label }),
      );
      const actionLabel = i === demoQuestionBank.length - 1 ? "查看结果" : "下一题";
      await user.click(screen.getByRole("button", { name: actionLabel }));
    }

    expect(screen.getByRole("button", { name: "回到首页" })).toBeInTheDocument();
  });

  it("preloads the resolved result image on the final question", async () => {
    const user = userEvent.setup();
    const preloadSpy = vi.spyOn(preloadImageModule, "preloadImage");

    render(<App questions={demoQuestionBank} />);

    await user.click(screen.getByRole("button", { name: "开始测你的厂味" }));

    for (let i = 0; i < demoQuestionBank.length - 1; i++) {
      await user.click(
        screen.getByRole("button", { name: demoQuestionBank[i].options[0].label }),
      );
      await user.click(screen.getByRole("button", { name: "下一题" }));
    }

    expect(preloadSpy).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: demoQuestionBank[demoQuestionBank.length - 1].options[0].label,
      }),
    );

    await waitFor(() => {
      expect(preloadSpy).toHaveBeenCalledTimes(1);
    });
    expect(preloadSpy.mock.calls[0]?.[0]).toEqual(expect.any(String));
    expect(preloadSpy.mock.calls[0]?.[1]).toContain("960w");
    expect(preloadSpy.mock.calls[0]?.[2]).toContain("100vw");
  });

  it("renders the persona gallery route via /bati/companies", () => {
    window.history.pushState({}, "", "/bati/companies");
 
    render(<App questions={demoQuestionBank} />);
 
    expect(
      screen.getByRole("heading", { name: /17 种大厂梗混搭人设/ }),
    ).toBeInTheDocument();
  });

  it("keeps the legacy /bati/gallery route working", () => {
    window.history.pushState({}, "", "/bati/gallery");

    render(<App questions={demoQuestionBank} />);

    expect(
      screen.getByRole("heading", { name: /17 种大厂梗混搭人设/ }),
    ).toBeInTheDocument();
  });
});
