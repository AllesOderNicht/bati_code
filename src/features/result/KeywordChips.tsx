type KeywordChipsProps = {
  items: string[];
  title: string;
  variant?: "brand" | "keyword";
};

export function KeywordChips({
  items,
  title,
  variant = "keyword",
}: KeywordChipsProps) {
  return (
    <div aria-label={title} className="chip-group">
      {items.map((item) => (
        <span
          className={`result-chip result-chip--${variant}`}
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
