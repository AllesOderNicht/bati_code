import { useMemo, useState } from "react";

import type { PersonaGalleryItem } from "./company-catalog-view-model";
import { computeResultDistribution } from "./persona-distribution";

const WOBBLY_HERO = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_CARD = "95px 4px 92px 5px / 5px 80px 6px 95px";
const WOBBLY_CHIP = "255px 12px 245px 14px / 14px 210px 12px 255px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";

type PersonaGalleryPageProps = {
  items: PersonaGalleryItem[];
  onBackHome: () => void;
  onBackPrimary: () => void;
  backPrimaryLabel: string;
};

function buildExplanationParagraphs(item: PersonaGalleryItem) {
  const intro = item.rarity === "ssr"
    ? "SSR 隐藏人设，只有 1% 的人能触发。答完题之前，谁都不知道会不会被它选中。"
    : item.personaDescription;

  return [intro, item.memeOrigin].filter((paragraph, index, paragraphs) => {
    return paragraph.trim().length > 0 && paragraphs.indexOf(paragraph) === index;
  });
}

function RarityLabel({ rarity }: { rarity: PersonaGalleryItem["rarity"] }) {
  if (rarity === "ssr") {
    return (
      <span
        className="border border-border-strong bg-accent px-2.5 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-accent-fg"
        style={{ borderRadius: WOBBLY_CHIP }}
      >
        SSR
      </span>
    );
  }

  if (rarity === "concentration") {
    return (
      <span
        className="border border-border bg-accent-soft px-2.5 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.12em] text-accent"
        style={{ borderRadius: WOBBLY_CHIP }}
      >
        99.99%
      </span>
    );
  }

  return null;
}

export function CompanyCatalogPage({
  items,
  onBackHome,
  onBackPrimary,
  backPrimaryLabel,
}: PersonaGalleryPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const rateMap = useMemo(() => {
    const dist = computeResultDistribution(10000);
    return new Map(dist.entries.map((e) => [e.personaId, e.rate]));
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <section
          className="relative overflow-hidden border border-border bg-surface p-6 sm:p-8 animate-fade-in"
          style={{ borderRadius: WOBBLY_HERO, boxShadow: "var(--shadow-sketch-md)" }}
          aria-labelledby="gallery-title"
        >
          <p className="m-0 font-mono text-[0.83rem] font-semibold uppercase tracking-[0.16em] text-accent-secondary">
            BATI V2 人设图鉴
          </p>
          <h1
            id="gallery-title"
            className="mt-3 m-0 font-display text-[clamp(2rem,6vw,3.2rem)] leading-[1.08] text-foreground"
          >
            17 种大厂梗混搭人设，看看你会是谁
          </h1>
          <p className="mt-4 max-w-[56ch] text-[0.98rem] leading-[1.8] text-muted">
            每个人设都是两家或多家大厂文化梗的混搭。点击任意人设查看完整解读。SSR 人设触发概率仅 1%。
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="border bg-accent px-5 py-4 font-mono text-[0.98rem] font-bold text-accent-fg transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              onClick={onBackPrimary}
              type="button"
              style={{ borderRadius: WOBBLY_BUTTON, borderColor: "var(--color-border-strong)", boxShadow: "var(--shadow-sketch)" }}
            >
              {backPrimaryLabel}
            </button>
            <button
              className="border border-border bg-surface px-5 py-4 font-mono text-[0.95rem] font-semibold text-foreground transition-all duration-200 hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              onClick={onBackHome}
              type="button"
              style={{ borderRadius: WOBBLY_BUTTON, boxShadow: "var(--shadow-card)" }}
            >
              回到首页
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3" aria-label="人设列表">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.personaId;
            const explanationParagraphs = buildExplanationParagraphs(item);

            return (
              <article
                key={item.personaId}
                className="border border-border bg-surface overflow-hidden transition-all duration-200 hover:border-border-strong"
                style={{
                  borderRadius: WOBBLY_CARD,
                  boxShadow: isExpanded ? "var(--shadow-sketch-md)" : "var(--shadow-card)",
                }}
              >
                <button
                  className="w-full p-5 text-left flex items-center justify-between gap-3 cursor-pointer bg-transparent border-none"
                  onClick={() => setExpandedId(isExpanded ? null : item.personaId)}
                  type="button"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 font-mono text-[0.78rem] font-semibold text-muted">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="m-0 text-[1.15rem] font-display leading-[1.2] text-foreground truncate">
                      {item.displayName}
                    </h2>
                    <RarityLabel rarity={item.rarity} />
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[0.75rem] font-semibold text-accent tabular-nums">
                      {((rateMap.get(item.personaId) ?? 0) * 100).toFixed(1)}%
                    </span>
                    <span className="text-muted text-[1.2rem] transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "none" }}>
                      ▾
                    </span>
                  </div>
                </button>

                {isExpanded ? (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.relatedCompanies.map((company) => (
                        <span
                          key={company}
                          className="border border-border bg-accent-soft px-2.5 py-1 text-[0.82rem] font-medium text-foreground"
                          style={{ borderRadius: WOBBLY_CHIP }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>

                    <div
                      className="mt-3 rounded-[28px] border border-border bg-accent-soft px-4 py-4"
                      style={{ boxShadow: "var(--shadow-card)" }}
                    >
                      <p className="m-0 font-mono text-[0.78rem] font-semibold uppercase tracking-widest text-accent-secondary">
                        为什么像 / 梗解读
                      </p>
                      {explanationParagraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={`${item.personaId}-${paragraphIndex}`}
                          className={`m-0 ${
                            paragraphIndex === 0
                              ? "mt-3 text-[0.95rem] leading-[1.8] text-foreground"
                              : "mt-3 text-[0.88rem] leading-[1.7] text-muted"
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="border border-border bg-surface-alt px-2.5 py-1 text-[0.8rem] font-medium text-muted"
                          style={{ borderRadius: WOBBLY_CHIP }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

      </div>
    </main>
  );
}
