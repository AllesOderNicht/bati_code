import type { QuestionViewModel } from "../features/quiz/question-bank";

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
    <section className="quiz-card">
      <h1>{question.title}</h1>
      <div className="options-grid">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              aria-pressed={isSelected}
              className={`option-card${isSelected ? " option-card--selected" : ""}`}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
