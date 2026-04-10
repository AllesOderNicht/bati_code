export const DIMENSION_LABELS = {
  shipFast: "行动节奏",
  craftDepth: "细节讲究",
  peopleSense: "人群雷达",
  systemThinking: "秩序偏好",
  frontierDrive: "新鲜浓度",
  commercialFocus: "现实取向",
} as const;

export type DimensionKey = keyof typeof DIMENSION_LABELS;

export type QuestionOption = {
  id: string;
  label: string;
  tone: "grounded" | "absurd";
  dimensionWeights: Partial<Record<DimensionKey, number>>;
  companyWeights: Record<string, number>;
  keywords: string[];
};

export type Question = {
  id: string;
  title: string;
  dimensionKey: DimensionKey;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
};

export type QuizAnswers = Record<string, string>;
