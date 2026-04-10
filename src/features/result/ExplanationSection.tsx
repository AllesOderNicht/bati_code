import type { ResultReasonBlock } from "./result-view-model";

type ExplanationSectionProps = {
  blocks: ResultReasonBlock[];
};

export function ExplanationSection({
  blocks,
}: ExplanationSectionProps) {
  return (
    <section aria-label="解释区" className="result-section">
      <div className="explanation-grid">
        {blocks.map((block) => (
          <article className="explanation-card" key={block.title}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
