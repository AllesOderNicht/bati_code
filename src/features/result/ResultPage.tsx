import { useState } from "react";

import { KeywordChips } from "./KeywordChips";
import { RestartActions } from "./RestartActions";
import type { ResultPageState } from "./result-copy-guard";
import type { ResultViewModel } from "./result-view-model";

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_PANEL = "95px 4px 92px 5px / 5px 80px 6px 95px";
const WOBBLY_CHIP = "255px 12px 245px 14px / 14px 210px 12px 255px";
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 1330;
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

function compactTextParts(parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter((part, index, allParts) => part.length > 0 && allParts.indexOf(part) === index);
}

function buildPageExplanationParagraphs(result: ResultViewModel) {
  return compactTextParts([result.personaDescription, result.memeOrigin]);
}

function buildShareText(result: ResultViewModel) {
  return [result.shareTone, SHARE_URL].join("\n");
}

function buildResultCardSvg(result: ResultViewModel) {
  const explanationLines = wrapText(
    compactTextParts([result.personaDescription, result.memeOrigin]).join(" "),
    20,
  );
  const companiesLine = escapeXml(result.relatedCompanies.join("  ×  "));
  const keywordLine = escapeXml(result.keywords.slice(0, 4).join("  /  "));

  const explanationText = explanationLines
    .map(
      (line, index) =>
        `<tspan x="120" dy="${index === 0 ? 0 : 42}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const rarityBadge = result.rarity === "ssr"
    ? `<rect x="88" y="148" width="120" height="44" rx="22" ry="22" fill="#b98643" /><text x="148" y="178" text-anchor="middle" fill="#fffaf2" font-family="JetBrains Mono, monospace" font-size="24" font-weight="700">SSR</text>`
    : result.rarity === "concentration"
      ? `<rect x="88" y="148" width="200" height="44" rx="22" ry="22" fill="rgba(185,134,67,0.2)" stroke="#b98643" /><text x="188" y="178" text-anchor="middle" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700">99.99%</text>`
      : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
  <defs>
    <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffaf2" />
      <stop offset="100%" stop-color="#f4ede2" />
    </linearGradient>
  </defs>
  <rect width="1200" height="1330" fill="#f7f4ed" />
  <rect x="42" y="42" width="1116" height="1246" rx="40" ry="40" fill="url(#panel)" stroke="rgba(125,96,67,0.32)" stroke-width="3" />
  <text x="88" y="128" fill="#9f6b50" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" letter-spacing="5">BATI V2</text>
  ${rarityBadge}
  <text x="88" y="260" fill="#3b3025" font-family="JetBrains Mono, monospace" font-size="72" font-weight="700">${escapeXml(result.headline)}</text>
  <text x="88" y="320" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="30" font-weight="600">${companiesLine}</text>
  <rect x="88" y="420" width="1024" height="520" rx="28" ry="28" fill="rgba(159,107,80,0.08)" stroke="rgba(159,107,80,0.22)" />
  <text x="120" y="480" fill="#9f6b50" font-family="JetBrains Mono, monospace" font-size="26" font-weight="700">为什么像 / 梗解读</text>
  <text x="120" y="540" fill="#3b3025" font-family="Geist Sans, sans-serif" font-size="30" font-weight="500">${explanationText}</text>
  <rect x="88" y="1020" width="1024" height="90" rx="24" ry="24" fill="rgba(255,250,242,0.98)" stroke="rgba(125,96,67,0.18)" />
  <text x="120" y="1077" fill="#3b3025" font-family="JetBrains Mono, monospace" font-size="26" font-weight="600">${keywordLine}</text>
  <text x="88" y="1200" fill="rgba(59,48,37,0.6)" font-family="JetBrains Mono, monospace" font-size="24">不是 MBTI，是 BATI V2</text>
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
        if (blob) { resolve(blob); return; }
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

  await navigator.share({ title: headline, text: "BATI V2 结果海报", files: [file] });
  return true;
}

function RarityBadge({ rarity }: { rarity: ResultViewModel["rarity"] }) {
  if (rarity === "ssr") {
    return (
      <span
        className="inline-block px-4 py-1.5 bg-accent text-accent-fg font-mono text-[0.82rem] font-bold tracking-[0.14em] uppercase"
        style={{ borderRadius: WOBBLY_CHIP }}
      >
        ✦ SSR ✦
      </span>
    );
  }

  if (rarity === "concentration") {
    return (
      <span
        className="inline-block px-4 py-1.5 border border-border-strong bg-accent-soft text-accent font-mono text-[0.82rem] font-bold tracking-[0.14em]"
        style={{ borderRadius: WOBBLY_CHIP }}
      >
        99.99% 浓度
      </span>
    );
  }

  return null;
}

type ResultPageProps = {
  state: ResultPageState;
  onRestart: () => void;
  onBackHome: () => void;
};

export function ResultPage({
  state,
  onRestart,
  onBackHome,
}: ResultPageProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (state.status !== "ready" || !state.result) {
    return (
      <section
        className="w-full max-w-[560px] p-8 bg-surface border border-border animate-fade-in"
        style={{ borderRadius: WOBBLY_CARD, boxShadow: "var(--shadow-sketch-md)" }}
      >
        <p className="m-0 mb-3 font-mono text-accent text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
          结果暂时未就绪
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] text-foreground">
          这次先别急着盖章
        </h1>
        <p className="mt-4 text-muted text-[1.05rem] leading-relaxed">
          当前结果还没准备好，请先完成答题再回来看看。
        </p>
        <RestartActions onBackHome={onBackHome} onRestart={onRestart} />
      </section>
    );
  }

  const result = state.result;
  const shareText = buildShareText(result);
  const explanationParagraphs = buildPageExplanationParagraphs(result);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: result.headline, text: shareText });
        setFeedbackMessage("系统分享面板已打开，可以直接转给朋友。");
        return;
      }

      const copied = await copyTextToClipboard(shareText);
      setFeedbackMessage(copied ? "分享文案已复制，直接去粘贴就行。" : "当前环境不支持系统分享，先试试手动复制页面链接。");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedbackMessage("分享暂时没成功，稍后再试一次。");
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `bati-v2-${result.personaId}.png`;
      const posterBlob = await buildPosterPngBlob(result);
      const posterFile = new File([posterBlob], fileName, { type: "image/png" });

      if (await sharePosterFile(posterFile, result.headline)) {
        setFeedbackMessage("系统图片面板已打开，可以直接保存到相册。");
        return;
      }

      downloadBlob(fileName, posterBlob);
      setFeedbackMessage("结果卡已开始下载。");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFeedbackMessage("下载暂时没成功，稍后再试一次。");
    }
  };

  return (
    <section
      className="w-full max-w-[640px] p-8 bg-surface border border-border animate-fade-in"
      style={{ borderRadius: WOBBLY_CARD, boxShadow: "var(--shadow-sketch-md)" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <p className="m-0 font-mono text-accent-secondary text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
          BATI V2 结果
        </p>
        <RarityBadge rarity={result.rarity} />
      </div>

      <h1 className="m-0 font-display text-[clamp(2.1rem,7vw,3.5rem)] leading-[1.08] text-foreground">
        {result.headline}
      </h1>

      <div className="mt-3 flex flex-wrap gap-2">
        {result.relatedCompanies.map((company) => (
          <span
            key={company}
            className="border border-border bg-accent-soft px-3 py-1.5 text-[0.88rem] font-medium text-foreground"
            style={{ borderRadius: WOBBLY_CHIP, boxShadow: "var(--shadow-card)" }}
          >
            {company}
          </span>
        ))}
      </div>

      <p className="mt-3.5 font-mono text-accent text-[1.02rem] font-semibold leading-[1.65]">
        {result.shareTone}
      </p>

      {result.characterImageSrc ? (
        <div
          className="mt-6 overflow-hidden border border-border bg-accent-soft p-3"
          style={{ borderRadius: WOBBLY_PANEL, boxShadow: "var(--shadow-card)" }}
        >
          <div
            className="overflow-hidden border border-[rgba(125,96,67,0.14)] bg-[linear-gradient(180deg,#fffaf2_0%,#f3ead9_100%)]"
            style={{ borderRadius: WOBBLY_CARD }}
          >
            <img
              src={result.characterImageSrc}
              alt={result.characterImageAlt ?? `${result.headline}角色插画`}
              className="block mx-auto w-full max-w-[360px] h-auto object-contain"
              decoding="async"
            />
          </div>
        </div>
      ) : null}

      <KeywordChips items={result.keywords} title="命中关键词" />

      <article
        className="mt-6 p-5 bg-accent-soft border border-border"
        style={{ borderRadius: WOBBLY_PANEL, boxShadow: "var(--shadow-card)" }}
      >
        <p className="m-0 font-mono text-[0.82rem] font-semibold tracking-[0.12em] uppercase text-accent">
          为什么像 / 梗解读
        </p>
        {explanationParagraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph.slice(0, 12)}`}
            className={`m-0 ${
              index === 0
                ? "mt-3 text-[rgba(59,48,37,0.84)] text-[1.02rem]"
                : "mt-3 text-muted text-[0.95rem]"
            } leading-[1.82]`}
          >
            {paragraph}
          </p>
        ))}
      </article>

      <RestartActions
        feedbackMessage={feedbackMessage}
        onBackHome={onBackHome}
        onDownload={handleDownload}
        onRestart={onRestart}
        onShare={handleShare}
      />
    </section>
  );
}
