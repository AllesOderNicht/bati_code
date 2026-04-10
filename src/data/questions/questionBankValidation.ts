import type {
  DIMENSION_LABELS,
  Question,
} from "../../domain/questions/types";

const FORBIDDEN_WORKPLACE_PATTERNS = [
  "工作",
  "职场",
  "团队",
  "面试",
  "招聘",
  "需求",
  "项目",
  "业务",
  "增长",
  "管理",
  "组织",
  "流程",
  "工作流",
  "工具链",
  "交付",
  "汇报",
  "排期",
  "kpi",
  "roi",
  "面试官",
  "用户",
  "客户",
  "产品",
  "服务体系",
  "反馈回路",
  "版本",
  "迭代",
  "上线",
  "复盘",
  "赛道",
  "打法",
  "转化",
  "漏斗",
  "work",
  "workplace",
  "team",
  "interview",
  "recruit",
  "recruitment",
  "business",
  "growth",
  "management",
  "project",
  "workflow",
  "pipeline",
];

type ValidateQuestionBankSemanticsInput = {
  questions: Question[];
  dimensionLabels: Record<keyof typeof DIMENSION_LABELS, string>;
};

function findMatchedPattern(input: string) {
  const lowerCased = input.toLowerCase();

  return FORBIDDEN_WORKPLACE_PATTERNS.find((pattern) =>
    lowerCased.includes(pattern.toLowerCase()),
  );
}

export function validateQuestionBankSemantics({
  questions,
  dimensionLabels,
}: ValidateQuestionBankSemanticsInput) {
  if (questions.length !== 12) {
    throw new Error(`Question bank must contain exactly 12 questions, received ${questions.length}`);
  }

  for (const [dimensionKey, label] of Object.entries(dimensionLabels)) {
    const matchedPattern = findMatchedPattern(label);

    if (matchedPattern) {
      throw new Error(
        `Dimension label "${dimensionKey}" contains forbidden workplace language: ${matchedPattern}`,
      );
    }
  }

  const totalAbsurdCount = questions.reduce(
    (count, question) =>
      count + question.options.filter((opt) => opt.tone === "absurd").length,
    0,
  );

  if (totalAbsurdCount !== 3) {
    throw new Error(
      `Question bank must contain exactly 3 absurd options in total, found ${totalAbsurdCount}`,
    );
  }

  for (const question of questions) {
    if (question.options.length !== 4) {
      throw new Error(
        `Question "${question.id}" must contain exactly 4 options`,
      );
    }

    const absurdOptions = question.options.filter(
      (option) => option.tone === "absurd",
    );

    if (absurdOptions.length > 1) {
      throw new Error(
        `Question "${question.id}" must contain at most 1 absurd option, found ${absurdOptions.length}`,
      );
    }

    const matchedTitlePattern = findMatchedPattern(question.title);

    if (matchedTitlePattern) {
      throw new Error(
        `Question "${question.id}" title contains forbidden workplace language: ${matchedTitlePattern}`,
      );
    }

    for (const option of question.options) {
      const matchedOptionPattern = findMatchedPattern(option.label);

      if (matchedOptionPattern) {
        throw new Error(
          `Question "${question.id}" option "${option.id}" contains forbidden workplace language: ${matchedOptionPattern}`,
        );
      }

      for (const keyword of option.keywords) {
        const matchedKeywordPattern = findMatchedPattern(keyword);

        if (matchedKeywordPattern) {
          throw new Error(
            `Question "${question.id}" keyword contains forbidden workplace language: ${matchedKeywordPattern}`,
          );
        }
      }
    }
  }

  return true;
}
