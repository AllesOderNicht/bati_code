import type {
  CompanyBaseProfile,
  CompanyCopyProfile,
} from "../../domain/company/types";
import type {
  ExplanationBlock,
  PrimaryCompanyResult,
} from "../../domain/scoring/types";

export type ResultReasonBlock = {
  title: string;
  text: string;
};

export type ResultViewModel = {
  displayNameZh: string;
  headline: string;
  matchPercentage: number;
  brandTags: string[];
  personaDescription: string;
  keywords: string[];
  reasonBlocks: ResultReasonBlock[];
  shareTone: string;
};

type CreateResultViewModelInput = {
  primaryResult: PrimaryCompanyResult;
  explanation: ExplanationBlock;
  baseProfiles: CompanyBaseProfile[];
  copyProfiles: CompanyCopyProfile[];
};

const HIGH_MATCH_THRESHOLD = 86;
const MID_MATCH_THRESHOLD = 74;

type MatchTier = "high" | "mid" | "light";

function getMatchTier(matchPercentage: number): MatchTier {
  if (matchPercentage >= HIGH_MATCH_THRESHOLD) {
    return "high";
  }

  if (matchPercentage >= MID_MATCH_THRESHOLD) {
    return "mid";
  }

  return "light";
}

function buildShareTone(
  matchTier: MatchTier,
  displayNameZh: string,
  brandTags: string[],
) {
  const leadingTags = brandTags.slice(0, 2).join(" / ");

  switch (matchTier) {
    case "high":
      return leadingTags.length > 0
        ? `${leadingTags} 信号几乎拉满，这波属于 ${displayNameZh} 气质直接自动上号。`
        : `${displayNameZh} 气质信号已经拉满，截图发群都像自带注释。`;
    case "mid":
      return leadingTags.length > 0
        ? `${leadingTags} 已经很有辨识度，你和 ${displayNameZh} 这路频道属于高频同频。`
        : `你和 ${displayNameZh} 这路气质已经基本同频，一眼就能看出主色调。`;
    default:
      return leadingTags.length > 0
        ? `${leadingTags} 先抢到了 C 位，这一轮最像的还是 ${displayNameZh} 这挂。`
        : `你不是单线程人设，但这一轮里 ${displayNameZh} 气质稳稳占了上风。`;
  }
}

function buildPersonaDescription(
  matchTier: MatchTier,
  displayNameZh: string,
  brandTags: string[],
  personaDescription: string,
) {
  const leadingTags = brandTags.slice(0, 2).join("、");
  const tagFragment = leadingTags.length > 0
    ? `你身上的 ${leadingTags} 特征特别好认，`
    : "";

  switch (matchTier) {
    case "high":
      return `这波不是“沾点边”，更像气质系统已经默认把你分进了 ${displayNameZh} 频道。${tagFragment}${personaDescription}整体看下来，就是那种不用刻意切换、厂味也会自己冒出来的人。`;
    case "mid":
      return `你和 ${displayNameZh} 这路气质已经接上信号，不一定每分钟都满格，但一进入状态就很容易切到这套频道。${tagFragment}${personaDescription}朋友看一眼，大概率会说一句“这味儿对了”。`;
    default:
      return `你的气质不是单一模板，不过这一轮里 ${displayNameZh} 还是成功拿到了最高票。${tagFragment}${personaDescription}属于平时松弛，关键时刻会自动切到对味版本。`;
  }
}

export function createResultViewModel({
  primaryResult,
  explanation,
  baseProfiles,
  copyProfiles,
}: CreateResultViewModelInput): ResultViewModel | null {
  const baseProfile = baseProfiles.find(
    (profile) => profile.id === primaryResult.companyId,
  );
  const copyProfile = copyProfiles.find(
    (profile) => profile.companyId === primaryResult.companyId,
  );

  if (!baseProfile || !copyProfile) {
    return null;
  }

  const displayNameZh = primaryResult.displayNameZh.trim();
  const matchTier = getMatchTier(primaryResult.matchPercentage);
  const reasonBlocks = explanation.reasonBullets.slice(0, 2).map((text, index) => ({
    title: index === 0 ? "为什么像" : "你的隐藏配置",
    text,
  }));
  const brandTags = baseProfile.brandTags.slice(0, 3);

  return {
    displayNameZh,
    headline: `${primaryResult.matchPercentage}% 是${displayNameZh}人`,
    matchPercentage: primaryResult.matchPercentage,
    brandTags,
    personaDescription: buildPersonaDescription(
      matchTier,
      displayNameZh,
      brandTags,
      explanation.personaDescription,
    ),
    keywords: explanation.keywords.slice(0, 5),
    reasonBlocks,
    shareTone: buildShareTone(matchTier, displayNameZh, brandTags),
  };
}
