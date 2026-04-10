type RestartActionsProps = {
  onRestart: () => void;
  onBackHome: () => void;
};

export function RestartActions({
  onRestart,
  onBackHome,
}: RestartActionsProps) {
  return (
    <div className="result-actions">
      <button className="primary-button" onClick={onRestart} type="button">
        再测一次
      </button>
      <button className="secondary-button" onClick={onBackHome} type="button">
        回到首页
      </button>
    </div>
  );
}
