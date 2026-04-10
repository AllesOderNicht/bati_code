type ProgressBarProps = {
  currentIndex: number;
  total: number;
};

export function ProgressBar({ currentIndex, total }: ProgressBarProps) {
  const currentStep = total === 0 ? 0 : currentIndex + 1;
  const progressValue = total === 0 ? 0 : Math.round((currentStep / total) * 100);

  return (
    <div className="progress-block">
      <div className="progress-header">
        <p className="eyebrow">厂味测压中</p>
        <p className="progress-copy">{`第 ${currentStep} / ${total} 题`}</p>
      </div>
      <div
        aria-label="答题进度"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressValue}
        className="progress-track"
        role="progressbar"
      >
        <span
          className="progress-fill"
          style={{
            width: `${progressValue}%`,
          }}
        />
      </div>
    </div>
  );
}
