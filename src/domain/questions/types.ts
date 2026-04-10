export const DIMENSION_LABELS = {
  shipFast: "推进速度",
  craftDepth: "打磨深度",
  peopleSense: "协作感知",
  systemThinking: "系统思维",
  frontierDrive: "前沿探索",
  commercialFocus: "结果导向",
} as const;

export type DimensionKey = keyof typeof DIMENSION_LABELS;

export type QuestionOption = {
  id: string;
  label: string;
  dimensionWeights: Partial<Record<DimensionKey, number>>;
  companyWeights: Record<string, number>;
  keywords: string[];
};

export type Question = {
  id: string;
  title: string;
  dimensionKey: DimensionKey;
  options: QuestionOption[];
};

export type QuizAnswers = Record<string, string>;
