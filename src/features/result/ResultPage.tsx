import { useState } from "react";

import type { ResultPageState } from "./result-copy-guard";
import type { ResultViewModel } from "./result-view-model";

const SHARE_URL = "https://www.alleschen.com/bati/";
const REPO_URL = "https://github.com/AllesOderNicht/bati_code";
const WOBBLY_PANEL_RADIUS = "28px 18px 30px 16px / 16px 30px 18px 28px";
const WOBBLY_CHIP_RADIUS = "999px 22px 999px 18px / 22px 999px 18px 999px";

function buildShareText(result: ResultViewModel) {
  return [result.shareTone, SHARE_URL].join("\n");
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}

/* ─── Concentration color mapping ─── */
const CONCENTRATION_COLORS: Record<
  string,
  { primary: string; glow: string; label: string }
> = {
  "pure-ali": {
    primary: "#ff6a00",
    glow: "rgba(255, 106, 0, 0.3)",
    label: "阿里浓度",
  },
  "pure-byte": {
    primary: "#3370ff",
    glow: "rgba(51, 112, 255, 0.3)",
    label: "字节浓度",
  },
  "pure-goose": {
    primary: "#07c160",
    glow: "rgba(7, 193, 96, 0.3)",
    label: "腾讯浓度",
  },
};

/* ─── Component ─── */

type ResultPageProps = {
  state: ResultPageState;
  onRestart: () => void;
  onBackHome: () => void;
};

export function ResultPage({ state, onRestart, onBackHome }: ResultPageProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (state.status !== "ready" || !state.result) {
    return (
      <section className="w-full max-w-[460px] mx-auto px-5 py-16 text-center animate-fade-in">
        <h1 className="mt-3 m-0 font-display text-[clamp(1.8rem,5vw,2.8rem)] leading-[1.12] text-foreground">
          结果暂时未就绪
        </h1>
        <p className="mt-4 text-muted text-[0.95rem] leading-relaxed">
          请先完成答题再回来看看。
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            className="result-action-btn result-action-btn--primary"
            type="button"
            onClick={onRestart}
          >
            去答题
          </button>
          <button
            className="result-action-btn result-action-btn--ghost"
            type="button"
            onClick={onBackHome}
          >
            回到首页
          </button>
        </div>
      </section>
    );
  }

  const result = state.result;
  const isSSR = result.rarity === "ssr";
  const isConcentration = result.rarity === "concentration";
  const concentrationColor = isConcentration
    ? CONCENTRATION_COLORS[result.personaId]
    : null;

  const shareText = buildShareText(result);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: result.headline, text: shareText });
        setFeedbackMessage("已打开分享面板");
        return;
      }
      const copied = await copyTextToClipboard(shareText);
      setFeedbackMessage(
        copied ? "分享文案已复制" : "当前环境不支持分享，请手动复制链接",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedbackMessage("分享暂未成功，请稍后再试");
    }
  };

  return (
    <section className="result-page w-full max-w-[480px] overflow-x-clip mx-auto animate-fade-in">
      <style>{`
        @keyframes concentration-fill {
          from { width: 0%; }
          to { width: 99.99%; }
        }
      `}</style>

      {/* ─── Part 1: Title ─── */}
      <header className="result-header min-w-0 px-5 pt-2 pb-4 text-center">


        {isSSR ? (
          <span
            className="inline-block mt-2 px-4 py-1 font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase rounded-full"
            style={{
              background: "linear-gradient(135deg, #d4a853, #b98643)",
              color: "#1a1510",
              boxShadow: "0 0 14px rgba(212, 168, 83, 0.35)",
            }}
            aria-label="SSR 稀有人设"
          >
            ✦ SSR ✦
          </span>
        ) : null}

        <h1 className="mt-3 m-0 font-display text-[clamp(2rem,7vw,3rem)] leading-[1.08] text-foreground wrap-anywhere">
          {result.headline}
        </h1>

      </header>

      {/* ─── Part 2: Character Image ─── */}
      {result.characterImageSrc ? (
        <div className="result-image px-4">
          <div
            className="w-full overflow-hidden rounded-2xl"
            style={{ aspectRatio: "2 / 3" }}
          >
            <img
              src={result.characterImageSrc}
              srcSet={result.characterImageSrcSet ?? undefined}
              sizes={result.characterImageSizes ?? undefined}
              alt={result.characterImageAlt ?? `${result.headline}角色插画`}
              className="block w-full h-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </div>
      ) : null}

      {/* ─── Part 3: Tags / Keywords ─── */}
      <div className="result-tags min-w-0 px-5 mt-5" aria-label="命中关键词">
        <div className="flex flex-wrap justify-center gap-2">
          {result.keywords.map((keyword, i) => (
            <span
              key={`kw-${i}`}
              className="inline-block max-w-full px-3 py-1.5 font-mono text-[0.78rem] font-medium text-center border border-border bg-surface text-foreground rounded-full wrap-anywhere"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Part 4: Why You're Like This ─── */}
      <article className="result-why min-w-0 px-5 mt-6">
        <h2 className="m-0 font-mono text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-accent">
          为什么像
        </h2>

        <p className="mt-3 m-0 text-[0.95rem] leading-[1.78] text-foreground wrap-anywhere">
          {result.personaDescription}
        </p>

        {result.reasonText ? (
          <p className="mt-2.5 m-0 text-[0.88rem] leading-[1.75] text-muted wrap-anywhere">
            {result.reasonText}
          </p>
        ) : null}

        <p className="mt-2.5 m-0 text-[0.85rem] leading-[1.72] text-muted italic wrap-anywhere">
          {result.memeOrigin}
        </p>
      </article>


      {result.relatedCompanies.length > 0 ? (
        <div className="px-4 mt-3">
          <div
            className="relative overflow-hidden border px-4 py-3"
            aria-label="相关公司"
            style={{
              borderRadius: WOBBLY_PANEL_RADIUS,
              borderColor: "var(--color-border)",
              background:
                "linear-gradient(180deg, rgba(255, 250, 242, 0.96) 0%, rgba(239, 231, 218, 0.92) 100%)",
              boxShadow: "3px 3px 0 0 rgba(125, 96, 67, 0.1)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative z-10 flex items-start gap-3">
              <span
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0"
                aria-hidden="true"
                style={{
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-secondary) 100%)",
                  boxShadow: "0 0 0 3px rgba(185, 134, 67, 0.12)",
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="m-0 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  关联公司
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.relatedCompanies.map((company) => (
                    <span
                      key={company}
                      className="inline-flex max-w-full items-center border px-3 py-1.5 font-mono text-[0.76rem] font-medium text-foreground wrap-anywhere"
                      style={{
                        borderRadius: WOBBLY_CHIP_RADIUS,
                        borderColor: "var(--color-border)",
                        background:
                          "linear-gradient(135deg, rgba(185, 134, 67, 0.12) 0%, rgba(255, 250, 242, 0.92) 100%)",
                      }}
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}


      {/* ─── Bottom Actions ─── */}
      <nav className="result-actions min-w-0 px-5 mt-8 pb-10">
        <div className="flex flex-col gap-3">
          <button
            className="result-action-btn result-action-btn--primary w-full min-w-0"
            type="button"
            onClick={handleShare}
          >
            分享
          </button>
        </div>
        <p className="m-0 mt-3 text-center text-[0.82rem] leading-[1.65] text-muted">
          长按结果卡保存图片
        </p>
        <button
          className="result-action-btn result-action-btn--ghost w-full mt-3"
          type="button"
          onClick={onBackHome}
        >
          回到首页
        </button>

        {feedbackMessage ? (
          <p className="m-0 mt-3 text-center text-[0.8rem] text-muted">
            {feedbackMessage}
          </p>
        ) : null}
        <p className="m-0 mt-5 text-center text-[0.76rem] leading-[1.7] text-muted">
          项目已开源：
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center text-accent underline decoration-[rgba(185,134,67,0.45)] underline-offset-4"
          >
            GitHub · AllesOderNicht/bati_code
          </a>
        </p>
      </nav>
    </section>
  );
}
