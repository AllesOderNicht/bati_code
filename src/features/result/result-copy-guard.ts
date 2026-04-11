import type { ResultViewModel } from "./result-view-model";

export type ResultPageState = {
  status: "ready" | "empty" | "invalid";
  result?: ResultViewModel;
};

export function guardResultPageState(
  viewModel: ResultViewModel | null,
): ResultPageState {
  if (!viewModel) {
    return { status: "empty" };
  }

  if (!viewModel.headline || !viewModel.personaDescription) {
    return { status: "invalid" };
  }

  return { status: "ready", result: viewModel };
}
