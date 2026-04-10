import "./result.css";
import "../../styles/motion.css";

import { ExplanationSection } from "./ExplanationSection";
import { KeywordChips } from "./KeywordChips";
import { RestartActions } from "./RestartActions";
import type { ResultPageState } from "./result-copy-guard";

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
  if (state.status !== "ready" || !state.result) {
    return (
      <section className="result-card result-card--fallback">
        <p className="eyebrow">结果暂时未就绪</p>
        <h1>这次先别急着盖章</h1>
        <p className="hero-copy">
          当前结果还没通过展示守卫，我们先把页面收在安全状态里。
        </p>
        <RestartActions onBackHome={onBackHome} onRestart={onRestart} />
      </section>
    );
  }

  return (
    <section className="result-card result-card--ready">
      <p className="eyebrow">{state.result.displayNameZh}</p>
      <h1>{state.result.headline}</h1>
      <p className="result-share-tone">{state.result.shareTone}</p>

      <KeywordChips
        items={state.result.brandTags}
        title="品牌标签"
        variant="brand"
      />

      <p className="result-persona">{state.result.personaDescription}</p>

      <KeywordChips
        items={state.result.keywords}
        title="结果关键词"
      />

      <ExplanationSection blocks={state.result.reasonBlocks} />

      <RestartActions onBackHome={onBackHome} onRestart={onRestart} />
    </section>
  );
}
