import { useState } from "react";

import { getCompanyLogoUrl } from "../company/companyLogo";
import { KeywordChips } from "./KeywordChips";
import { RestartActions } from "./RestartActions";
import type { ResultPageState } from "./result-copy-guard";
import type { ResultViewModel } from "./result-view-model";

const WOBBLY_CARD = "255px 15px 225px 15px / 15px 225px 15px 255px";
const WOBBLY_PANEL = "95px 4px 92px 5px / 5px 80px 6px 95px";
const WOBBLY_LOGO = "28px 10px 26px 12px / 12px 24px 14px 26px";
const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";
const SVG_WIDTH = 1200;
const SVG_HEIGHT = 1330;

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

  if (!normalized) {
    return [];
  }

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

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines;
}

function buildShareText(result: ResultViewModel) {
  const tags = result.brandTags.slice(0, 3).join(" / ");
  const keywords = result.keywords.slice(0, 4).join(" / ");
  const reasonText = result.reasonBlocks[0]?.text ?? result.personaDescription;

  return [
    result.headline,
    result.shareTone,
    tags.length > 0 ? `标签：${tags}` : "",
    keywords.length > 0 ? `关键词：${keywords}` : "",
    `为什么像：${reasonText}`,
  ]
    .filter((item) => item.length > 0)
    .join("\n");
}

function buildResultCardSvg(result: ResultViewModel) {
  const personaLines = wrapText(result.personaDescription, 20);
  const hiddenLines = wrapText(result.reasonBlocks[1]?.text ?? "", 20);
  const tagsLine = escapeXml(result.brandTags.slice(0, 3).join("  /  "));
  const keywordLine = escapeXml(result.keywords.slice(0, 4).join("  /  "));

  const personaText = personaLines
    .map(
      (line, index) =>
        `<tspan x="88" dy="${index === 0 ? 0 : 48}">${escapeXml(line)}</tspan>`,
    )
    .join("");
  const hiddenText = hiddenLines
    .map(
      (line, index) =>
        `<tspan x="120" dy="${index === 0 ? 0 : 42}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
  <defs>
    <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffaf2" />
      <stop offset="100%" stop-color="#f4ede2" />
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(125,96,67,0.08)" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="1200" height="1330" fill="#f7f4ed" />
  <rect width="1200" height="1330" fill="url(#grid)" />
  <rect x="42" y="42" width="1116" height="1246" rx="40" ry="40" fill="url(#panel)" stroke="rgba(125,96,67,0.32)" stroke-width="3" />
  <rect x="62" y="62" width="1116" height="1246" rx="40" ry="40" fill="none" stroke="rgba(159,107,80,0.14)" stroke-width="2" />
  <text x="88" y="128" fill="#9f6b50" font-family="JetBrains Mono, monospace" font-size="32" font-weight="700" letter-spacing="5">BATI RESULT</text>
  <text x="88" y="236" fill="#3b3025" font-family="JetBrains Mono, monospace" font-size="86" font-weight="700">${escapeXml(result.headline)}</text>
  <text x="88" y="304" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="32" font-weight="600">${escapeXml(result.shareTone)}</text>
  <rect x="88" y="356" width="1024" height="76" rx="24" ry="24" fill="rgba(185,134,67,0.1)" stroke="rgba(125,96,67,0.18)" />
  <text x="120" y="403" fill="#9f6b50" font-family="JetBrains Mono, monospace" font-size="28" font-weight="600">${tagsLine}</text>
  <text x="88" y="508" fill="#b98643" font-family="JetBrains Mono, monospace" font-size="30" font-weight="700">为什么像</text>
  <text x="88" y="572" fill="#3b3025" font-family="Geist Sans, sans-serif" font-size="36" font-weight="500">${personaText}</text>
  <rect x="88" y="792" width="1024" height="240" rx="28" ry="28" fill="rgba(159,107,80,0.08)" stroke="rgba(159,107,80,0.22)" />
  <text x="120" y="852" fill="#9f6b50" font-family="JetBrains Mono, monospace" font-size="28" font-weight="700">${escapeXml(result.reasonBlocks[1]?.title ?? "你的隐藏配置")}</text>
  <text x="120" y="906" fill="#3b3025" font-family="Geist Sans, sans-serif" font-size="32" font-weight="500">${hiddenText}</text>
  <rect x="88" y="1088" width="1024" height="90" rx="24" ry="24" fill="rgba(255,250,242,0.98)" stroke="rgba(125,96,67,0.18)" />
  <text x="120" y="1145" fill="#3b3025" font-family="JetBrains Mono, monospace" font-size="26" font-weight="600">${keywordLine}</text>
  <text x="88" y="1234" fill="rgba(59,48,37,0.6)" font-family="JetBrains Mono, monospace" font-size="24">不是 MBTI，是 BATI</text>
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

    if (!context) {
      throw new Error("Canvas rendering is unavailable.");
    }

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
  if (!navigator.share || typeof navigator.canShare !== "function") {
    return false;
  }

  if (!navigator.canShare({ files: [file] })) {
    return false;
  }

  await navigator.share({
    title: headline,
    text: "BATI 结果海报",
    files: [file],
  });

  return true;
}

type ResultPageProps = {
  state: ResultPageState;
  onRestart: () => void;
  onBackHome: () => void;
  onOpenCatalog: () => void;
};

export function ResultPage({
  state,
  onRestart,
  onBackHome,
  onOpenCatalog,
}: ResultPageProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (state.status !== "ready" || !state.result) {
    return (
      <section
        className="w-full max-w-[560px] p-8 bg-surface border border-border animate-fade-in"
        style={{
          borderRadius: WOBBLY_CARD,
          boxShadow: "var(--shadow-sketch-md)",
        }}
      >
        <p className="m-0 mb-3 font-mono text-accent text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
          结果暂时未就绪
        </p>
        <h1 className="m-0 font-display text-[clamp(2rem,6vw,3.25rem)] leading-[1.1] text-foreground">
          这次先别急着盖章
        </h1>
        <p className="mt-4 text-muted text-[1.05rem] leading-relaxed">
          当前结果还没通过展示守卫，我们先把页面收在安全状态里。
        </p>
        <RestartActions onBackHome={onBackHome} onRestart={onRestart} />
      </section>
    );
  }

  const result = state.result;
  const shareText = buildShareText(result);
  const resultLogoUrl = getCompanyLogoUrl(result.displayNameZh);

  const handleShare = async () => {
    try {
      const sharePayload = {
        title: result.headline,
        text: shareText,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(sharePayload);
        setFeedbackMessage("系统分享面板已打开，可以直接转给朋友。");
        return;
      }

      const copied = await copyTextToClipboard(
        `${shareText}\n${window.location.href}`,
      );
      setFeedbackMessage(
        copied
          ? "分享文案和页面链接已复制，直接去粘贴就行。"
          : "当前环境不支持系统分享，先试试手动复制页面链接。",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setFeedbackMessage("分享暂时没成功，稍后再试一次。");
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `bati-${result.displayNameZh}.png`;
      const posterBlob = await buildPosterPngBlob(result);
      const posterFile = new File([posterBlob], fileName, {
        type: "image/png",
      });

      if (await sharePosterFile(posterFile, result.headline)) {
        setFeedbackMessage("系统图片面板已打开，可以直接保存到相册或图库。");
        return;
      }

      downloadBlob(fileName, posterBlob);
      setFeedbackMessage(
        "结果卡已开始下载，手机端通常可从系统下载列表继续保存到相册或图库。",
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setFeedbackMessage("下载暂时没成功，稍后再试一次。");
    }
  };

  return (
    <section
      className="w-full max-w-[640px] p-8 bg-surface border border-border animate-fade-in"
      style={{
        borderRadius: WOBBLY_CARD,
        boxShadow: "var(--shadow-sketch-md)",
      }}
    >
      <p className="m-0 mb-2 font-mono text-accent-secondary text-[0.85rem] font-semibold tracking-[0.15em] uppercase">
        BATI 结果已出炉
      </p>
      <div className="flex items-start justify-between gap-4">
        <h1 className="m-0 flex-1 font-display text-[clamp(2.1rem,7vw,3.5rem)] leading-[1.08] text-foreground">
          {result.headline}
        </h1>
        {resultLogoUrl ? (
          <div
            className="shrink-0 p-2.5 bg-logo-surface border"
            style={{
              borderRadius: WOBBLY_LOGO,
              borderColor: "var(--color-border-strong)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <img
              alt={`${result.displayNameZh} logo`}
              className="block h-19 w-19 object-contain sm:h-22 sm:w-22"
              decoding="async"
              src={resultLogoUrl}
            />
          </div>
        ) : null}
      </div>
      <p className="mt-3.5 font-mono text-accent text-[1.02rem] font-semibold leading-[1.65]">
        {result.shareTone}
      </p>

      <KeywordChips items={result.keywords} title="命中关键词" />

      <article
        className="mt-6 p-5 bg-accent-soft border border-border"
        style={{
          borderRadius: WOBBLY_PANEL,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p className="m-0 font-mono text-[0.82rem] font-semibold tracking-[0.12em] uppercase text-accent">
          为什么像
        </p>
        <p className="m-0 mt-3 text-[rgba(59,48,37,0.84)] text-[1.02rem] leading-[1.82]">
          {result.personaDescription}
        </p>
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
