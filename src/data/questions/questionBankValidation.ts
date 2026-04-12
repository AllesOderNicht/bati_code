import type { Question } from "../../domain/questions/types";
import { personaProfiles } from "../personas/personaProfiles";

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

function findMatchedPattern(input: string) {
  const lowerCased = input.toLowerCase();

  return FORBIDDEN_WORKPLACE_PATTERNS.find((pattern) =>
    lowerCased.includes(pattern.toLowerCase()),
  );
}

const NORMAL_PERSONA_IDS = new Set(
  personaProfiles
    .filter((p) => p.rarity === "normal")
    .map((p) => p.id),
);

export function validateQuestionBankSemantics(questions: Question[]) {
  if (questions.length !== 12) {
    throw new Error(
      `Question bank must contain exactly 12 questions, received ${questions.length}`,
    );
  }

  const personaCoverage = new Map<string, number>();

  for (const question of questions) {
    if (question.options.length !== 4) {
      throw new Error(
        `Question "${question.id}" must contain exactly 4 options`,
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

      for (const personaId of Object.keys(option.personaWeights)) {
        personaCoverage.set(
          personaId,
          (personaCoverage.get(personaId) ?? 0) + 1,
        );
      }
    }
  }

  for (const personaId of NORMAL_PERSONA_IDS) {
    const count = personaCoverage.get(personaId) ?? 0;

    if (count < 8) {
      throw new Error(
        `Normal persona "${personaId}" must appear in at least 8 options, found ${count}`,
      );
    }
  }

  return true;
}
