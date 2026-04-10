import type { CompanyGovernanceProfile } from "../company/types";
import { isCompanyEligible } from "../governance/companyGovernance";
import type { ResultViewModel } from "../../features/result/result-view-model";

export type ContentValidationIssue = {
  companyId: string;
  severity: "error" | "warning";
  message: string;
};

type ValidateResultContentInput = {
  companyId: string;
  viewModel: ResultViewModel;
  governanceProfile?: CompanyGovernanceProfile;
};

const RISKY_COPY_PATTERNS = [
  "压榨",
  "卷王",
  "福报",
  "鄙视链",
  "吊打",
  "入职",
  "offer",
  "招聘",
  "适合去这家",
  "加入这家",
  "业务",
  "增长",
  "团队",
  "协作",
  "交付",
  "流程",
  "管理",
  "工作流",
  "生产力",
  "平台协同",
  "关键指标",
  "企业服务",
  "用户运营",
  "用户关系",
  "服务链路",
  "业务结构",
  "资源协同",
  "系统搭建",
  "平台气质",
  "执行力",
  "规模执行",
  "关系管理",
];

function hasVisibleText(value: string): boolean {
  return value.trim().length > 0;
}

export function validateDisplayCopySemantics({
  companyId,
  texts,
}: {
  companyId: string;
  texts: string[];
}): ContentValidationIssue[] {
  const copyCorpus = texts.join("\n").toLowerCase();
  const matchedRiskPattern = RISKY_COPY_PATTERNS.find((pattern) =>
    copyCorpus.includes(pattern.toLowerCase()),
  );

  if (!matchedRiskPattern) {
    return [];
  }

  return [
    {
      companyId,
      severity: "error",
      message: `结果文案命中了高风险表达：${matchedRiskPattern}。`,
    },
  ];
}

export function validateResultContent({
  companyId,
  viewModel,
  governanceProfile,
}: ValidateResultContentInput): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];

  if (!isCompanyEligible(governanceProfile)) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果公司当前不可展示。",
    });
  }

  if (viewModel.keywords.length < 3 || viewModel.keywords.length > 5) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果关键词数量必须保持在 3 到 5 个之间。",
    });
  }

  if (
    !hasVisibleText(viewModel.displayNameZh)
    || !hasVisibleText(viewModel.headline)
    || !hasVisibleText(viewModel.personaDescription)
    || !hasVisibleText(viewModel.shareTone)
  ) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果页缺少必要展示文案字段。",
    });
  }

  if (
    viewModel.reasonBlocks.length === 0
    || viewModel.reasonBlocks.some(
      (block) => !hasVisibleText(block.title) || !hasVisibleText(block.text),
    )
  ) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果页缺少解释区内容。",
    });
  }

  issues.push(
    ...validateDisplayCopySemantics({
      companyId,
      texts: [
        viewModel.headline,
        viewModel.shareTone,
        viewModel.personaDescription,
        ...viewModel.keywords,
        ...viewModel.brandTags,
        ...viewModel.reasonBlocks.flatMap((block) => [block.title, block.text]),
      ],
    }),
  );

  if (viewModel.brandTags.length < 2) {
    issues.push({
      companyId,
      severity: "warning",
      message: "品牌标签偏少，分享感可能不足。",
    });
  }

  return issues;
}
