import type { QuestionViewModel } from "../features/quiz/question-bank";

const WOBBLY_OPTION = "95px 4px 92px 5px / 5px 80px 6px 95px";

type QuestionCardProps = {
  question: QuestionViewModel;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
};

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  return (
    <section>
      <h1 className="m-0 font-display text-[clamp(1.5rem,4vw,2.1rem)] leading-[1.35] text-foreground">
        {question.title}
      </h1>
      <div className="grid gap-3.5 mt-6" role="list" aria-label="可选答案">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              aria-pressed={isSelected}
              className={`w-full p-4 border text-left font-sans text-[0.95rem] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                isSelected
                  ? "bg-[rgba(251,191,36,0.08)] text-accent border-border-strong"
                  : "bg-surface text-foreground border-border hover:border-border-strong hover:shadow-glow hover:translate-x-px hover:translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              }`}
              onClick={() => onSelect(option.id)}
              type="button"
              style={{
                borderRadius: WOBBLY_OPTION,
                boxShadow: isSelected
                  ? "none"
                  : "3px 3px 0px 0px rgba(251, 191, 36, 0.1)",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
