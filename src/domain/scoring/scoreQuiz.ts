import type { CompanyScoreProfile } from "../company/types";
import type {
  DimensionKey,
  Question,
  QuestionOption,
  QuizAnswers,
} from "../questions/types";
import type { RankedCompanyResult } from "./types";

type ScoreQuizInput = {
  answers: QuizAnswers;
  questions: Question[];
  companyScoreProfiles: CompanyScoreProfile[];
};

function getCoreDimensionScore(
  dimensionScores: Map<DimensionKey, number>,
  profile: CompanyScoreProfile,
) {
  return [...dimensionScores.entries()]
    .map(
      ([dimensionKey, rawScore]) =>
        rawScore * (profile.dimensionAffinity[dimensionKey] ?? 0),
    )
    .sort((left, right) => right - left)
    .slice(0, 3)
    .reduce((total, score) => total + score, 0);
}

function collectSelectedOptions(
  answers: QuizAnswers,
  questions: Question[],
) {
  const selectedOptions = new Map<string, QuestionOption>();

  for (const question of questions) {
    const optionId = answers[question.id];
    const option = question.options.find((candidate) => candidate.id === optionId);

    if (option) {
      selectedOptions.set(question.id, option);
    }
  }

  return selectedOptions;
}

export function scoreQuiz({
  answers,
  questions,
  companyScoreProfiles,
}: ScoreQuizInput): RankedCompanyResult[] {
  const selectedOptions = collectSelectedOptions(answers, questions);
  if (selectedOptions.size === 0) {
    return [];
  }

  const dimensionScores = new Map<DimensionKey, number>();
  const directCompanyScores = new Map<string, number>();
  const selectedKeywords = new Set<string>();

  for (const option of selectedOptions.values()) {
    for (const [dimensionKey, weight] of Object.entries(
      option.dimensionWeights,
    ) as [DimensionKey, number][]) {
      dimensionScores.set(
        dimensionKey,
        (dimensionScores.get(dimensionKey) ?? 0) + weight,
      );
    }

    for (const [companyId, weight] of Object.entries(option.companyWeights)) {
      directCompanyScores.set(
        companyId,
        (directCompanyScores.get(companyId) ?? 0) + weight,
      );
    }

    for (const keyword of option.keywords) {
      selectedKeywords.add(keyword);
    }
  }

  return [...companyScoreProfiles]
    .map((profile) => {
      let score = directCompanyScores.get(profile.companyId) ?? 0;
      let priorityHitScore = 0;

      dimensionScores.forEach((rawScore, dimensionKey) => {
        const affinity = profile.dimensionAffinity[dimensionKey] ?? 0;
        score += rawScore * affinity;
      });

      for (const [questionId, bonus] of Object.entries(profile.priorityQuestions ?? {})) {
        const selectedOption = selectedOptions.get(questionId);

        if (!selectedOption) {
          continue;
        }

        const priorityContribution =
          (selectedOption.companyWeights[profile.companyId] ?? 0) * bonus;
        score += priorityContribution;
        priorityHitScore += priorityContribution;
      }

      const matchedDimensions: { key: DimensionKey; score: number }[] = [];
      dimensionScores.forEach((rawScore, dimensionKey) => {
        const contribution = rawScore * (profile.dimensionAffinity[dimensionKey] ?? 0);

        if (contribution > 0) {
          matchedDimensions.push({
            key: dimensionKey,
            score: Number(contribution.toFixed(2)),
          });
        }
      });
      matchedDimensions.sort((left, right) => right.score - left.score);

      const coreDimensionScore = Number(
        getCoreDimensionScore(dimensionScores, profile).toFixed(2),
      );

      return {
        companyId: profile.companyId,
        score: Number(score.toFixed(2)),
        matchedDimensions,
        matchedKeywords: [...selectedKeywords].slice(0, 5),
        coreDimensionScore,
        priorityHitScore: Number(priorityHitScore.toFixed(2)),
        tieBreakWeight: profile.tieBreakWeight ?? 0,
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (right.coreDimensionScore !== left.coreDimensionScore) {
        return right.coreDimensionScore - left.coreDimensionScore;
      }

      if (right.priorityHitScore !== left.priorityHitScore) {
        return right.priorityHitScore - left.priorityHitScore;
      }

      if (right.tieBreakWeight !== left.tieBreakWeight) {
        return right.tieBreakWeight - left.tieBreakWeight;
      }

      return left.companyId.localeCompare(right.companyId);
    });
}
