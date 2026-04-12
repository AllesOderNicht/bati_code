export type QuestionOption = {
  id: string;
  label: string;
  personaWeights: Record<string, number>;
  keywords: string[];
};

export type Question = {
  id: string;
  title: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
};

export type QuizAnswers = Record<string, string>;
