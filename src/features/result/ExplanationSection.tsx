import type { ResultReasonBlock } from "./result-view-model";

const WOBBLY_OPTION = "95px 4px 92px 5px / 5px 80px 6px 95px";

type ExplanationSectionProps = {
  blocks: ResultReasonBlock[];
};

export function ExplanationSection({
  blocks,
}: ExplanationSectionProps) {
  return (
    <section aria-label="解释区" className="mt-8">
      <div className="grid gap-4">
        {blocks.map((block) => (
          <article
            className="p-5 bg-surface border border-border transition-all duration-200 hover:border-border-strong hover:shadow-glow"
            key={block.title}
            style={{
              borderRadius: WOBBLY_OPTION,
              boxShadow: "3px 3px 0px 0px rgba(251, 191, 36, 0.1)",
            }}
          >
            <h3 className="m-0 font-mono text-accent text-[0.95rem] font-semibold">
              {block.title}
            </h3>
            <p className="mt-2.5 text-[rgba(229,229,229,0.7)] leading-[1.7]">
              {block.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
