# PH-1: 基础前端骨架与答题流程

## Context Summary
当前仓库还没有任何可运行前端工程。本阶段的目标是从零建立 `Vite + React + TypeScript` 应用骨架，并先把首版最关键的移动端答题主流程跑通：首页进入、单题一步式作答、进度展示、答案暂存、跳转到结果占位页。此阶段不处理真实算法和全量公司内容，但必须为后续数据与结果接入预留清晰接口。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `package.json` | CREATE | 定义前端依赖、脚本与测试命令。 |
| `tsconfig.json` | CREATE | 建立 TypeScript 编译规则。 |
| `vite.config.ts` | CREATE | 初始化 Vite 配置。 |
| `index.html` | CREATE | 提供应用挂载入口。 |
| `src/main.tsx` | CREATE | 挂载应用和全局样式。 |
| `src/App.tsx` | CREATE | 组合页面路由与全局壳层。 |
| `src/app/router.tsx` | CREATE | 管理首页、答题页、结果页的路由流转。 |
| `src/app/state/quiz-session.tsx` | CREATE | 管理当前题号、已选答案和流程跳转。 |
| `src/features/home/HomePage.tsx` | CREATE | 展示产品定位和开始答题入口。 |
| `src/features/quiz/QuizPage.tsx` | CREATE | 承载单题一步式答题流程。 |
| `src/features/result/ResultPlaceholderPage.tsx` | CREATE | 在算法接入前先提供结果占位与回流出口。 |
| `src/components/QuestionCard.tsx` | CREATE | 封装题目文案、四选项和点击反馈。 |
| `src/components/ProgressBar.tsx` | CREATE | 展示移动端进度反馈。 |
| `src/styles/tokens.css` | CREATE | 定义基础圆角、颜色、阴影、间距等设计 token。 |
| `src/styles/global.css` | CREATE | 定义全局排版、背景和移动端布局基础。 |
| `src/test/setup.ts` | CREATE | 初始化测试运行环境。 |
| `src/features/quiz/QuizPage.test.tsx` | CREATE | 验证答题流程、进度与跳转行为。 |

## Data Structure Design
- `QuizAnswer`
  - `questionId: string`
  - `optionId: string`
- `QuizSessionState`
  - `currentIndex: number`
  - `answers: Record<string, string>`
  - `status: 'idle' | 'answering' | 'completed'`
- `AppRoute`
  - `home`
  - `quiz`
  - `result`
- `QuestionViewModel`
  - `id: string`
  - `title: string`
  - `options: { id: string; label: string }[]`

本阶段可以先使用一组最小假数据驱动页面，但数据结构必须与后续真实题库保持兼容。

## State Transitions
1. 用户进入首页，`QuizSessionState.status` 为 `idle`。
2. 用户点击开始答题后进入答题页，状态切换为 `answering`，`currentIndex` 指向第一题。
3. 用户选择某个选项后，答案写入 `answers[questionId]`。
4. 用户进入下一题时，`currentIndex += 1`，进度条同步更新。
5. 最后一题完成后，状态切换为 `completed`，路由跳到结果占位页。
6. 用户从结果占位页点击重新测试时，状态重置为初始值。

## Sub-tasks
- [ ] 1.1 初始化 `Vite + React + TypeScript` 工程、测试脚本和基础目录结构。
- [ ] 1.2 建立全局路由与 `QuizSessionState`，保证首页、答题页、结果页能正确跳转。
- [ ] 1.3 实现移动端优先的单题一步式答题界面，包括四选项、进度条和禁用态。
- [ ] 1.4 设计基础视觉 token，让页面具备圆润、轻快、有梗但不过度复杂的首版气质。
- [ ] 1.5 补充流程测试，验证从开始答题到进入结果占位页的主路径稳定可用。

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 首页开始跳转 | 用户点击开始按钮 | 路由进入答题页，状态切换为 `answering` |
| 单题选择写入答案 | 用户在第 1 题点击某个选项 | 对应答案被记录，按钮反馈可见 |
| 进度条更新 | 用户从第 1 题进入第 2 题 | 进度显示从 `1 / N` 更新为 `2 / N` |
| 最后一题完成跳转 | 用户完成最后一题 | 状态变为 `completed`，进入结果占位页 |
| 重新测试重置 | 用户在结果占位页点击重测 | `currentIndex` 清零，答案记录被清空 |

### Test Pseudo-code
```ts
test('starts quiz from home page', () => {
  // given: app renders on home page with empty session state
  // when: user taps the start button
  // then: quiz route is shown and progress starts at the first question
});

test('records answer and advances to the next question', () => {
  // given: user is on question 1
  // when: user selects one of four options and continues
  // then: the answer is stored and question 2 is rendered
});

test('navigates to result placeholder after last question', () => {
  // given: user is answering the final question
  // when: user selects an option and submits
  // then: session status becomes completed and the result placeholder page appears
});
```

## Edge Cases
- 用户未选择选项就尝试继续 → 下一步按钮保持禁用，避免空答案进入状态机。
- 浏览器刷新发生在答题中 → 若未实现持久化，可安全回到首页；不要产生半残缺状态。
- 题目总数为 1 → 仍应正确显示 `1 / 1` 进度并直接跳到结果占位页。
- 文案较长的选项出现在小屏设备 → 卡片高度可增长，但不能导致按钮被遮挡。

## No-Touch List
| Item | Reason |
|------|--------|
| `.dev-changes/main/proposal.md` | 提案已冻结为产品级边界说明，执行阶段不应随意改写。 |
| 公司算法与真实结果文案细节 | 属于后续阶段工作，PH-1 只提供承载容器。 |
| 海报生成与复制分享能力 | 已明确不在首版范围内。 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 1.1 | 验证应用能成功挂载并渲染首页标题 | 先建立最小应用壳与入口文件 |
| 1.2 | 验证点击开始按钮后进入答题页 | 先接好最小路由和 session provider |
| 1.3 | 验证选择选项后能记录答案并推进进度 | 先实现单题卡片和本地状态写入 |
| 1.4 | 验证关键按钮和卡片存在统一类名或 token 引用 | 先落基础 token 与最少样式 |
| 1.5 | 验证完整答题流最终跳到结果占位页 | 先串起从首页到结果页的最短 happy path |

## Required Skills
- `harness-task:tdd` — for each sub-task
- `harness-task:phase-review` — after all sub-tasks complete
