import type { CompanyGovernanceProfile } from "../../domain/company/types";
import {
  validateResultContent,
  type ContentValidationIssue,
} from "../../domain/validation/contentValidation";
import type { ResultViewModel } from "./result-view-model";

export type ResultPageState = {
  status: "ready" | "empty" | "invalid";
  result?: ResultViewModel;
  issues?: ContentValidationIssue[];
};

type GuardResultPageStateInput = {
  companyId?: string;
  viewModel?: ResultViewModel | null;
  governanceProfile?: CompanyGovernanceProfile;
};

export function guardResultPageState({
  companyId,
  viewModel,
  governanceProfile,
}: GuardResultPageStateInput): ResultPageState {
  if (!companyId || !viewModel) {
    return {
      status: "empty",
      issues: [
        {
          companyId: companyId ?? "unknown",
          severity: "error",
          message: "当前没有可展示的结果。",
        },
      ],
    };
  }

  const issues = validateResultContent({
    companyId,
    viewModel,
    governanceProfile,
  });

  const hasBlockingIssue = issues.some((issue) => issue.severity === "error");

  return {
    status: hasBlockingIssue ? "invalid" : "ready",
    result: viewModel,
    issues,
  };
}
