import { useState } from "react";

import type { ResultPageState } from "./result-copy-guard";
import type { ResultViewModel } from "./result-view-model";

const SVG_WIDTH = 1080;
const SVG_HEIGHT = 1920;
const SHARE_URL = "www.alleschen.com/bati";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(value: string, maxChars: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const lines: string[] = [];
  let currentLine = "";

  for (const character of normalized) {
    currentLine += character;

    if (currentLine.length >= maxChars && /[，。！？；,.]/.test(character)) {
      lines.push(currentLine.trim());
      currentLine = "";
      continue;
    }

    if (currentLine.length >= maxChars) {
      lines.push(currentLine.trim());
      currentLine = "";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());
  return lines;
}

function buildShareText(result: ResultViewModel) {
  return [result.shareTone, SHARE_URL].join("\n");
}

function buildResultCardSvg(result: ResultViewModel) {
  const descLines = wrapText(result.personaDescription, 22);
  const reasonLines = wrapText(
    result.reasonText || result.memeOrigin,
    22,
  );
  const companiesLine = escapeXml(result.relatedCompanies.join("  ×  "));
  const keywordLine = escapeXml(result.keywords.slice(0, 4).join("  ·  "));

  const descText = descLines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const reasonText = reasonLines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const rarityBadge =
    result.rarity === "ssr"
      ? `<rect x="60" y="120" width="120" height="44" rx="22" fill="#d4a853" /><text x="120" y="150" text-anchor="middle" fill="#1a1510" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700">✦ SSR</text>`
      : result.rarity === "concentration"
        ? `<rect x="60" y="120" width="200" height="44" rx="22" fill="rgba(185,134,67,0.15)" stroke="#b98643" /><text x="160" y="150" text-anchor="middle" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700">99.99%</text>`
        : "";

  const descStartY = 1220;
  const reasonStartY = descStartY + descLines.length * 44 + 80;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="#f7f4ed" />
  <text x="60" y="80" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="28" font-weight="700" letter-spacing="4">BATI V2</text>
  ${rarityBadge}
  <text x="60" y="200" fill="#3b3025" font-family="JetBrains Mono, monospace" font-size="64" font-weight="700">${escapeXml(result.headline)}</text>
  <text x="60" y="260" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="28" font-weight="500">${companiesLine}</text>
  <rect x="60" y="300" width="960" height="860" rx="24" fill="#efe7da" />
  <text x="60" y="${descStartY}" fill="#3b3025" font-family="Geist Sans, sans-serif" font-size="30" font-weight="500">${descText}</text>
  <rect x="60" y="${descStartY + descLines.length * 44 + 30}" width="960" height="2" fill="rgba(125,96,67,0.12)" />
  <text x="80" y="${reasonStartY}" fill="#7f6f5d" font-family="Geist Sans, sans-serif" font-size="28" font-weight="400">${reasonText}</text>
  <text x="60" y="${SVG_HEIGHT - 120}" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="24" font-weight="600">${keywordLine}</text>
  <text x="60" y="${SVG_HEIGHT - 60}" fill="rgba(59,48,37,0.45)" font-family="JetBrains Mono, monospace" font-size="22">不是 MBTI，是 BATI V2  ·  ${SHARE_URL}</text>
</svg>`;
}

function loadImageFromUrl(sourceUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Poster image failed to load."));
    image.src = sourceUrl;
  });
}

async function buildPosterPngBlob(result: ResultViewModel) {
  const svgMarkup = buildResultCardSvg(result);
  const svgBlob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgObjectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImageFromUrl(svgObjectUrl);
    const canvas = document.createElement("canvas");
    const scale = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    canvas.width = SVG_WIDTH * scale;
    canvas.height = SVG_HEIGHT * scale;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas rendering is unavailable.");

    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, SVG_WIDTH, SVG_HEIGHT);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Poster PNG export failed."));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(svgObjectUrl);
  }
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

function downloadBlob(filename: string, blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

async function sharePosterFile(file: File, headline: string) {
  if (!navigator.share || typeof navigator.canShare !== "function") return false;
  if (!navigator.canShare({ files: [file] })) return false;

  await navigator.share({
    title: headline,
    text: "BATI V2 结果海报",
    files: [file],
  });
  return true;
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

  const handleDownload = async () => {
    try {
      const fileName = `bati-v2-${result.personaId}.png`;
      const posterBlob = await buildPosterPngBlob(result);
      const posterFile = new File([posterBlob], fileName, {
        type: "image/png",
      });

      if (await sharePosterFile(posterFile, result.headline)) {
        setFeedbackMessage("已打开图片保存面板");
        return;
      }

      downloadBlob(fileName, posterBlob);
      setFeedbackMessage("结果图已开始下载");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedbackMessage("下载暂未成功，请稍后再试");
    }
  };

  return (
    <section className="result-page w-full max-w-[480px] mx-auto animate-fade-in">
      <style>{`
        @keyframes concentration-fill {
          from { width: 0%; }
          to { width: 99.99%; }
        }
      `}</style>

      {/* ─── Part 1: Title ─── */}
      <header className="result-header px-5 pt-2 pb-4 text-center">


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

        <h1 className="mt-3 m-0 font-display text-[clamp(2rem,7vw,3rem)] leading-[1.08] text-foreground">
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
              alt={result.characterImageAlt ?? `${result.headline}角色插画`}
              className="block w-full h-full object-cover"
              decoding="async"
            />
          </div>
        </div>
      ) : null}

      {/* ─── Part 3: Tags / Keywords ─── */}
      <div className="result-tags px-5 mt-5" aria-label="命中关键词">
        <div className="flex flex-wrap justify-center gap-2">
          {result.keywords.map((keyword, i) => (
            <span
              key={`kw-${i}`}
              className="inline-block px-3 py-1.5 font-mono text-[0.78rem] font-medium border border-border bg-surface text-foreground rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Part 4: Why You're Like This ─── */}
      <article className="result-why px-5 mt-6">
        <h2 className="m-0 font-mono text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-accent">
          为什么像
        </h2>

        <p className="mt-3 m-0 text-[0.95rem] leading-[1.78] text-foreground">
          {result.personaDescription}
        </p>

        {result.reasonText ? (
          <p className="mt-2.5 m-0 text-[0.88rem] leading-[1.75] text-muted">
            {result.reasonText}
          </p>
        ) : null}

        <p className="mt-2.5 m-0 text-[0.85rem] leading-[1.72] text-muted italic">
          {result.memeOrigin}
        </p>
      </article>



      {/* ─── Bottom Actions ─── */}
      <nav className="result-actions px-5 mt-8 pb-10">
        <div className="flex gap-3">
          <button
            className="result-action-btn result-action-btn--primary flex-1"
            type="button"
            onClick={handleShare}
          >
            分享
          </button>
          <button
            className="result-action-btn result-action-btn--secondary flex-1"
            type="button"
            onClick={handleDownload}
          >
            保存图片
          </button>
        </div>
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
      </nav>
    </section>
  );
}
