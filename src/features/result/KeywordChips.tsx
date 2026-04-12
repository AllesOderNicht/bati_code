const WOBBLY_CHIP = "255px 12px 245px 14px / 14px 210px 12px 255px";

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
    <div aria-label={title} className="flex flex-wrap gap-2.5 mt-[18px]">
      {items.map((item, index) => (
        <span
          className={`inline-flex items-center py-2 px-3.5 text-[0.82rem] font-mono font-semibold border ${
            variant === "brand"
              ? "bg-accent-secondary-soft text-accent-secondary border-accent-secondary-border"
              : "bg-accent-soft text-accent border-border"
          }`}
          key={`${title}-${item}-${index}`}
          style={{
            borderRadius: WOBBLY_CHIP,
            boxShadow: "0 2px 0 rgba(125, 96, 67, 0.08)",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
