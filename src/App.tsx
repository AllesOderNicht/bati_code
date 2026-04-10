import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./app/router";
import { QuizSessionProvider } from "./app/state/quiz-session";

type AppProps = {
  title?: string;
};

export function App({ title = "BATI 大厂气质测试" }: AppProps) {
  return (
    <QuizSessionProvider>
      <BrowserRouter>
        <AppRouter title={title} />
      </BrowserRouter>
    </QuizSessionProvider>
  );
}
