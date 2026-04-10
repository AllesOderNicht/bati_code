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

  if (!viewModel.headline || !viewModel.personaDescription) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果页缺少必要主文案字段。",
    });
  }

  if (viewModel.reasonBlocks.length === 0) {
    issues.push({
      companyId,
      severity: "error",
      message: "结果页缺少解释区内容。",
    });
  }

  if (viewModel.brandTags.length < 2) {
    issues.push({
      companyId,
      severity: "warning",
      message: "品牌标签偏少，分享感可能不足。",
    });
  }

  return issues;
}
