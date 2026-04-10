import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResultPage } from "./ResultPage";
import type { ResultPageState } from "./result-copy-guard";

const readyState: ResultPageState = {
  status: "ready",
  result: {
    displayNameZh: "字节跳动",
    headline: "96% 是字节跳动人",
    matchPercentage: 96,
    brandTags: ["节奏快", "内容感", "迭代力"],
    personaDescription: "你总能在热闹和新鲜感之间找到最来电的节奏。",
    keywords: ["推进快", "内容感", "反馈回路"],
    reasonBlocks: [
      { title: "为什么像", text: "你在行动节奏上的命中特别高。" },
      { title: "你的隐藏配置", text: "一有反馈你就会越玩越来劲。" },
    ],
    shareTone: "节奏快 / 内容感 信号几乎拉满，这波属于 字节跳动 气质直接自动上号。",
  },
  issues: [],
};

const mockCanvasContext = {
  drawImage: vi.fn(),
  setTransform: vi.fn(),
  imageSmoothingEnabled: true,
  imageSmoothingQuality: "high" as const,
};

class MockPosterImage {
  decoding = "async";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;

  set src(_value: string) {
    this.onload?.();
  }
}

describe("ResultPage", () => {
  beforeEach(() => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-poster");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.stubGlobal("Image", MockPosterImage);

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      mockCanvasContext as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback: BlobCallback) => {
        callback(new Blob(["png"], { type: "image/png" }));
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the full result structure for a valid primary result", () => {
    render(
      <ResultPage
        onBackHome={vi.fn()}
        onOpenCatalog={vi.fn()}
        onRestart={vi.fn()}
        state={readyState}
      />,
    );

    expect(screen.getByRole("heading", { name: "96% 是字节跳动人" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "字节跳动 logo" })).toBeInTheDocument();
    expect(screen.getByText("BATI 结果已出炉")).toBeInTheDocument();
    expect(screen.getByText("推进快")).toBeInTheDocument();
    expect(screen.getByText("为什么像")).toBeInTheDocument();
    expect(
      screen.getByText("你总能在热闹和新鲜感之间找到最来电的节奏。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "分享结果页" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "下载结果卡" }),
    ).toBeInTheDocument();
  });

  it("supports restarting from the result page", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(
      <ResultPage
        onBackHome={vi.fn()}
        onOpenCatalog={vi.fn()}
        onRestart={onRestart}
        state={readyState}
      />,
    );

    await user.click(screen.getByRole("button", { name: "再测一次" }));

    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("exports a png poster through the mobile share sheet when files are supported", async () => {
    const user = userEvent.setup();
    const shareSpy = vi.fn().mockResolvedValue(undefined);
    const canShareSpy = vi.fn().mockReturnValue(true);

    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: shareSpy,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: canShareSpy,
    });

    render(
      <ResultPage
        onBackHome={vi.fn()}
        onOpenCatalog={vi.fn()}
        onRestart={vi.fn()}
        state={readyState}
      />,
    );

    await user.click(screen.getByRole("button", { name: "下载结果卡" }));

    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledTimes(1);
    });

    const [sharePayload] = shareSpy.mock.calls[0] as [
      { files?: File[]; text?: string; title?: string },
    ];

    expect(canShareSpy).toHaveBeenCalledWith({
      files: expect.arrayContaining([expect.any(File)]),
    });
    expect(sharePayload.files).toHaveLength(1);
    expect(sharePayload.files?.[0]?.name).toBe("bati-字节跳动.png");
    expect(sharePayload.files?.[0]?.type).toBe("image/png");
    expect(sharePayload.title).toBe("96% 是字节跳动人");
    expect(
      screen.getByText("系统图片面板已打开，可以直接保存到相册或图库。"),
    ).toBeInTheDocument();
  });

  it("opens the company catalog route entry from the result page", async () => {
    const user = userEvent.setup();
    const onOpenCatalog = vi.fn();

    render(
      <ResultPage
        onBackHome={vi.fn()}
        onOpenCatalog={onOpenCatalog}
        onRestart={vi.fn()}
        state={readyState}
      />,
    );

    await user.click(screen.getByRole("button", { name: /查看全厂图谱/i }));

    expect(onOpenCatalog).toHaveBeenCalledTimes(1);
  });
});
