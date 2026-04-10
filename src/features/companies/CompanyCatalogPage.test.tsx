import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CompanyCatalogPage } from "./CompanyCatalogPage";
import type { CompanyCatalogItem } from "./company-catalog-view-model";

const items: CompanyCatalogItem[] = [
  {
    companyId: "byte",
    displayNameZh: "字节跳动",
    brandTags: ["节奏快", "内容感", "新鲜感"],
    categoryLabel: "消费科技",
    regionLabel: "中国区",
    probability: 63,
    probabilityLabel: "63%",
    logoUrl: undefined,
    logoFallback: "字节",
    isLeading: true,
  },
  {
    companyId: "microsoft",
    displayNameZh: "微软",
    brandTags: ["稳扎稳打", "耐用感", "万物归位"],
    categoryLabel: "平台",
    regionLabel: "海外区",
    probability: 37,
    probabilityLabel: "37%",
    logoUrl: undefined,
    logoFallback: "MSFT",
    isLeading: false,
  },
];

describe("CompanyCatalogPage", () => {
  it("renders the catalog hero and company cards", () => {
    render(
      <CompanyCatalogPage
        answeredCount={7}
        backPrimaryLabel="回到结果页"
        items={items}
        onBackHome={vi.fn()}
        onBackPrimary={vi.fn()}
        questionCount={30}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "所有公司、标签和当前概率，一屏看完" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "字节跳动" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "微软" })).toBeInTheDocument();
    expect(screen.getAllByText("63%")).toHaveLength(2);
    expect(screen.getByText("当前领先")).toBeInTheDocument();
    expect(screen.getByText("节奏快")).toBeInTheDocument();
    expect(
      screen.getByText(/系统已经按题库、维度权重和公司画像模型自动统计出的基础命中占比/),
    ).toBeInTheDocument();
  });

  it("handles the back actions", async () => {
    const user = userEvent.setup();
    const onBackHome = vi.fn();
    const onBackPrimary = vi.fn();

    render(
      <CompanyCatalogPage
        answeredCount={0}
        backPrimaryLabel="去开始答题"
        items={items}
        onBackHome={onBackHome}
        onBackPrimary={onBackPrimary}
        questionCount={30}
      />,
    );

    await user.click(screen.getByRole("button", { name: "去开始答题" }));
    await user.click(screen.getByRole("button", { name: "回到首页" }));

    expect(onBackPrimary).toHaveBeenCalledTimes(1);
    expect(onBackHome).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/这些数值代表模型对整套题库的整体统计结果/),
    ).toBeInTheDocument();
  });
});
