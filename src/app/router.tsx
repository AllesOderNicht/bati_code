import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "../features/home/HomePage";
import { QuizPage } from "../features/quiz/QuizPage";
import { ResultPlaceholderPage } from "../features/result/ResultPlaceholderPage";

type AppRouterProps = {
  title: string;
};

export function AppRouter({ title }: AppRouterProps) {
  return (
    <Routes>
      <Route element={<HomePage title={title} />} path="/" />
      <Route element={<QuizPage />} path="/quiz" />
      <Route element={<ResultPlaceholderPage />} path="/result" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
