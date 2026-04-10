import type {
  CompanyBaseProfile,
  CompanyScoreProfile,
} from "../../domain/company/types";
import type {
  DimensionKey,
  Question,
  QuestionOption,
} from "../../domain/questions/types";
import {
  getCompanyLogoFallback,
  getCompanyLogoUrl,
} from "../company/companyLogo";

export type CompanyCatalogItem = {
  companyId: string;
  displayNameZh: string;
  brandTags: string[];
  categoryLabel: string;
  regionLabel: string;
  probability: number;
  probabilityLabel: string;
  logoUrl?: string;
  logoFallback: string;
  isLeading: boolean;
};

type CreateCompanyCatalogItemsInput = {
  baseProfiles: CompanyBaseProfile[];
  questions: Question[];
  scoreProfiles: CompanyScoreProfile[];
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI",
  auto: "智能出行",
  "consumer-tech": "消费科技",
  ecommerce: "电商",
  enterprise: "企业服务",
  fintech: "金融科技",
  hardware: "硬件",
  mobility: "城市流动",
  platform: "平台",
  software: "软件工具",
  travel: "旅行",
};

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

function getRegionLabel(region: CompanyBaseProfile["region"]) {
  return region === "cn" ? "中国区" : "海外区";
}

function formatProbability(probability: number) {
  if (probability <= 0) {
    return "0%";
  }

  if (probability >= 10) {
    return `${probability.toFixed(0)}%`;
  }

  return `${probability.toFixed(1)}%`;
}

export function createCompanyCatalogItems({
  baseProfiles,
  questions,
  scoreProfiles,
}: CreateCompanyCatalogItemsInput): CompanyCatalogItem[] {
  const scoreProfileMap = new Map(
    scoreProfiles.map((profile) => [profile.companyId, profile]),
  );

  const companyScores = baseProfiles.map((profile) => {
    const scoreProfile = scoreProfileMap.get(profile.id);
    const score = scoreProfile
      ? getCatalogProbabilityScore(scoreProfile, questions)
      : 0;

    return {
      companyId: profile.id,
      score,
    };
  });
  const totalScore = companyScores.reduce((sum, item) => sum + item.score, 0);
  const leadingCompanyId = [...companyScores].sort(
    (left, right) => right.score - left.score,
  )[0]?.companyId;
  const companyScoreMap = new Map(
    companyScores.map((item) => [item.companyId, item.score]),
  );

  return [...baseProfiles]
    .map((profile) => {
      const score = companyScoreMap.get(profile.id) ?? 0;
      const probability =
        totalScore > 0
          ? (Math.max(score, 0) / totalScore) * 100
          : 0;

      return {
        companyId: profile.id,
        displayNameZh: profile.displayNameZh,
        brandTags: profile.brandTags.slice(0, 3),
        categoryLabel: getCategoryLabel(profile.category),
        regionLabel: getRegionLabel(profile.region),
        probability,
        probabilityLabel: formatProbability(probability),
        logoUrl: getCompanyLogoUrl(profile.displayNameZh),
        logoFallback: getCompanyLogoFallback(profile.displayNameZh),
        isLeading: profile.id === leadingCompanyId,
      };
    })
    .sort((left, right) => {
      if (right.probability !== left.probability) {
        return right.probability - left.probability;
      }

      return left.displayNameZh.localeCompare(right.displayNameZh, "zh-Hans-CN");
    });
}

function getCatalogProbabilityScore(
  profile: CompanyScoreProfile,
  questions: Question[],
) {
  const averageQuestionScore = questions.reduce((total, question) => {
    const optionScore =
      question.options.reduce(
        (sum, option) => sum + getOptionScore(option, question.id, profile),
        0,
      ) / question.options.length;

    return total + optionScore;
  }, 0);

  const rarityWeight = getRarityWeight(profile);
  const tieBreakWeight = profile.tieBreakWeight ?? 0;

  return Number(
    ((averageQuestionScore + tieBreakWeight * 0.35) * rarityWeight).toFixed(4),
  );
}

function getOptionScore(
  option: QuestionOption,
  questionId: string,
  profile: CompanyScoreProfile,
) {
  const directScore = option.companyWeights[profile.companyId] ?? 0;
  const dimensionScore = Object.entries(option.dimensionWeights).reduce(
    (sum, [dimensionKey, weight]) =>
      sum +
      weight *
        (profile.dimensionAffinity[dimensionKey as DimensionKey] ?? 0),
    0,
  );
  const priorityBonus =
    directScore * (profile.priorityQuestions?.[questionId] ?? 0);

  return directScore + dimensionScore + priorityBonus;
}

function getRarityWeight(profile: CompanyScoreProfile) {
  return (profile as CompanyScoreProfile & { rarityWeight?: number }).rarityWeight ?? 1;
}
