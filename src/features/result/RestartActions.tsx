const WOBBLY_BUTTON = "15px 225px 15px 255px / 255px 15px 225px 15px";

type RestartActionsProps = {
  onRestart: () => void;
  onBackHome: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  feedbackMessage?: string | null;
};

export function RestartActions({
  onRestart,
  onBackHome,
  onShare,
  onDownload,
  feedbackMessage,
}: RestartActionsProps) {
  return (
    <div className="mt-8">
      {onShare || onDownload ? (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {onShare ? (
            <button
              className="w-full py-[16px] px-5 border bg-accent text-accent-fg text-[1rem] font-mono font-bold transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={onShare}
              type="button"
              style={{
                borderRadius: WOBBLY_BUTTON,
                borderColor: "var(--color-border-strong)",
                boxShadow: "var(--shadow-sketch)",
              }}
            >
              分享结果页
            </button>
          ) : null}
          {onDownload ? (
            <button
              className="w-full py-[16px] px-5 border bg-accent-secondary-soft text-accent-secondary text-[1rem] font-mono font-bold transition-all duration-200 hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent-secondary focus-visible:outline-offset-2"
              onClick={onDownload}
              type="button"
              style={{
                borderRadius: WOBBLY_BUTTON,
                borderColor: "var(--color-accent-secondary-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              下载结果卡
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-3.5 mt-3.5 sm:grid-cols-2">
        <button
          className="w-full py-4 px-5 border border-border bg-surface text-foreground text-[0.95rem] font-mono font-semibold transition-all duration-200 hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          onClick={onRestart}
          type="button"
          style={{
            borderRadius: WOBBLY_BUTTON,
            boxShadow: "var(--shadow-card)",
          }}
        >
          再测一次
        </button>
        <button
          className="w-full py-4 px-5 border border-border bg-surface text-foreground text-[0.95rem] font-mono font-semibold transition-all duration-200 hover:border-border-strong hover:shadow-glow active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
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

      {feedbackMessage ? (
        <p className="m-0 mt-4 text-[0.86rem] leading-6 text-[rgba(59,48,37,0.7)]">
          {feedbackMessage}
        </p>
      ) : null}
    </div>
  );
}
