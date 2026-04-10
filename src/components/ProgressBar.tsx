const WOBBLY_CHIP = "255px 12px 245px 14px / 14px 210px 12px 255px";

type ProgressBarProps = {
  currentIndex: number;
  total: number;
};

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const currentStep = total === 0 ? 0 : currentIndex + 1;
  const progressValue = total === 0 ? 0 : Math.round((currentStep / total) * 100);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-accent-secondary text-[0.8rem] font-mono font-medium tracking-[0.12em] uppercase">
          厂味测压中
        </p>
        <p className="m-0 text-muted text-[0.85rem] font-mono font-medium">
          {`第 ${currentStep} / ${total} 题`}
        </p>
      </div>
      <div
        aria-label="答题进度"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressValue}
        className="mt-3 h-2 bg-surface-alt border border-border overflow-hidden"
        role="progressbar"
        style={{ borderRadius: WOBBLY_CHIP }}
      >
        <span
          className="block h-full bg-accent transition-[width] duration-200 ease-out"
          style={{
            width: `${progressValue}%`,
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
}
