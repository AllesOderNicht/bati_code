import type { CompanyCatalogItem } from "./company-catalog-view-model";

const WOBBLY_HERO = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_CARD = "95px 4px 92px 5px / 5px 80px 6px 95px";
const WOBBLY_BADGE = "255px 12px 245px 14px / 14px 210px 12px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";
const WOBBLY_LOGO = "28px 10px 26px 12px / 12px 24px 14px 26px";

type CompanyCatalogPageProps = {
  items: CompanyCatalogItem[];
  answeredCount: number;
  questionCount: number;
  onBackHome: () => void;
  onBackPrimary: () => void;
  backPrimaryLabel: string;
};

export function CompanyCatalogPage({
  items,
  answeredCount,
  questionCount,
  onBackHome,
  onBackPrimary,
  backPrimaryLabel,
}: CompanyCatalogPageProps) {
  const topCompany = items.find((item) => item.isLeading) ?? items[0];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section
          className="relative overflow-hidden border border-border bg-surface p-6 sm:p-8 animate-fade-in"
          style={{
            borderRadius: WOBBLY_HERO,
            boxShadow: "var(--shadow-sketch-md)",
          }}
          aria-labelledby="company-catalog-title"
        >
          <div
            className="pointer-events-none absolute -right-10 top-6 h-28 w-28 border border-border bg-accent-soft opacity-60"
            style={{ borderRadius: WOBBLY_BADGE, transform: "rotate(9deg)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-3 left-4 h-16 w-32 border border-border bg-[rgba(255,250,242,0.8)] opacity-70"
            style={{ borderRadius: WOBBLY_BADGE, transform: "rotate(-5deg)" }}
            aria-hidden="true"
          />

          <p className="m-0 font-mono text-[0.83rem] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
            BATI 全厂图谱
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1
                id="company-catalog-title"
                className="m-0 font-display text-[clamp(2rem,6vw,3.6rem)] leading-[1.03] text-foreground"
              >
                所有公司、标签和当前概率，一屏看完
              </h1>
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.8] text-muted">
                这是 BATI 的全厂手绘图谱页。这里的概率不是等你先答完题才出现，而是系统已经按题库、维度权重和公司画像模型自动统计出的基础命中占比。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
              <StatCard label="当前进度" value={`${answeredCount}/${questionCount}`} />
              <StatCard
                label="最像气质"
                value={topCompany?.displayNameZh ?? "待生成"}
              />
              <StatCard
                label="模型概率"
                value={topCompany?.probabilityLabel ?? "0%"}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="border bg-accent px-5 py-4 font-mono text-[0.98rem] font-bold text-accent-fg transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={onBackPrimary}
              type="button"
              style={{
                borderRadius: WOBBLY_BUTTON,
                borderColor: "var(--color-border-strong)",
                boxShadow: "var(--shadow-sketch)",
              }}
            >
              {backPrimaryLabel}
            </button>
            <button
              className="border border-border bg-surface px-5 py-4 font-mono text-[0.95rem] font-semibold text-foreground transition-all duration-200 hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={onBackHome}
              type="button"
              style={{
                borderRadius: WOBBLY_BUTTON,
                boxShadow: "var(--shadow-card)",
              }}
            >
              回到首页
            </button>
          </div>
        </section>

        <p
          className="m-0 border border-border bg-[rgba(255,250,242,0.85)] px-4 py-3 text-[0.94rem] leading-7 text-muted"
          style={{
            borderRadius: WOBBLY_BADGE,
            boxShadow: "var(--shadow-card)",
          }}
        >
          这些数值代表模型对整套题库的整体统计结果，用来展示每家公司的基础信号强度；你的个人测试结果仍然以答题页最终算出的匹配结果为准。
        </p>

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="公司图谱列表"
        >
          {items.map((item, index) => (
            <article
              key={item.companyId}
              className="relative overflow-hidden border border-border bg-surface p-5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow"
              style={{
                borderRadius: WOBBLY_CARD,
                boxShadow: item.isLeading
                  ? "var(--shadow-sketch-md)"
                  : "var(--shadow-card)",
                transform: `rotate(${index % 3 === 0 ? "-0.8deg" : index % 3 === 1 ? "0.65deg" : "-0.25deg"})`,
              }}
            >

              <div className="flex items-start gap-4">
                <div
                  className="grid h-[72px] w-[72px] shrink-0 place-items-center border bg-logo-surface p-2"
                  style={{
                    borderRadius: WOBBLY_LOGO,
                    borderColor: "var(--color-border-strong)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {item.logoUrl ? (
                    <img
                      alt={`${item.displayNameZh} logo`}
                      className="block h-full w-full object-contain"
                      decoding="async"
                      src={item.logoUrl}
                    />
                  ) : (
                    <span className="font-display text-[1rem] font-bold tracking-[0.12em] text-accent-secondary">
                      {item.logoFallback}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="m-0 font-mono text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-accent-secondary">
                        #{String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 text-[1.35rem] font-display leading-[1.15] text-foreground">
                        {item.displayNameZh}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="m-0 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-muted">
                        概率
                      </p>
                      <p className="m-0 mt-1 font-display text-[1.6rem] leading-none text-accent">
                        {item.probabilityLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden border border-border bg-surface-alt"
                    style={{ borderRadius: WOBBLY_BADGE }}
                    aria-hidden="true"
                  >
                    <span
                      className="block h-full bg-accent-secondary transition-[width] duration-300"
                      style={{
                        width: `${Math.max(item.probability, 2)}%`,
                        minWidth: item.probability > 0 ? "14px" : "0",
                        borderRadius: "inherit",
                        opacity: item.probability > 0 ? 1 : 0.35,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <MetaBadge label={item.regionLabel} tone="secondary" />
                <MetaBadge label={item.categoryLabel} tone="default" />
                {item.isLeading ? <MetaBadge label="当前领先" tone="accent" /> : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {item.brandTags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border bg-accent-soft px-3 py-1.5 text-[0.88rem] font-medium text-foreground"
                    style={{
                      borderRadius: WOBBLY_BADGE,
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="border border-border bg-[rgba(255,250,242,0.84)] px-4 py-3"
      style={{
        borderRadius: WOBBLY_BADGE,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p className="m-0 font-mono text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="m-0 mt-2 font-display text-[1.2rem] leading-none text-foreground">
        {value}
      </p>
    </div>
  );
}

type MetaBadgeProps = {
  label: string;
  tone: "default" | "secondary" | "accent";
};

function MetaBadge({ label, tone }: MetaBadgeProps) {
  const toneClass =
    tone === "accent"
      ? "bg-accent text-accent-fg border-border-strong"
      : tone === "secondary"
        ? "bg-accent-secondary-soft text-accent-secondary border-border"
        : "bg-surface-alt text-muted border-border";

  return (
    <span
      className={`border px-3 py-1 font-mono text-[0.76rem] font-semibold uppercase tracking-[0.12em] ${toneClass}`}
      style={{ borderRadius: WOBBLY_BADGE }}
    >
      {label}
    </span>
  );
}
