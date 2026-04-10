# PH-3: 结果页表达、校验与体验收尾

## Context Summary
本阶段面向首版用户真正感知到的“完成度”。默认前提是：应用骨架已建立，题库和公司配置系统已可产出稳定的 `Top1` 结果与解释数据。本阶段要把算法输出转换成可截图、可传播、但不越界的结果体验，同时补上内容校验、移动端细节和基础验收闭环，确保首版在不做复杂分享工具的前提下依然具备足够强的命中感与分享感。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/features/result/ResultPage.tsx` | CREATE | 渲染正式结果页而非占位页。 |
| `src/features/result/result-view-model.ts` | CREATE | 把算法结果与文案配置组装为页面可消费数据。 |
| `src/features/result/ExplanationSection.tsx` | CREATE | 展示“你为什么像它”的维度和关键词解释。 |
| `src/features/result/KeywordChips.tsx` | CREATE | 展示 3-5 个关键词和品牌标签。 |
| `src/features/result/RestartActions.tsx` | CREATE | 提供重新测试和返回首页等回流动作。 |
| `src/features/result/result-copy-guard.ts` | CREATE | 约束结果页文案结构与风险字段。 |
| `src/styles/result.css` | CREATE | 定义结果页卡片、标签、解释区和分享感排版。 |
| `src/styles/motion.css` | CREATE | 定义基础过渡效果和 reduced-motion 兼容。 |
| `src/domain/validation/contentValidation.ts` | CREATE | 校验公司文案、关键词数量、白名单结果可用性。 |
| `src/domain/validation/contentValidation.test.ts` | CREATE | 验证内容和治理校验规则。 |
| `src/features/result/ResultPage.test.tsx` | CREATE | 验证结果页展示结构和回流行为。 |
| `src/features/quiz/quiz-result-integration.test.tsx` | CREATE | 验证答题完成后到结果页的集成流程。 |

## Data Structure Design
- `ResultViewModel`
  - `displayNameZh: string`
  - `headline: string`
  - `brandTags: string[]`
  - `personaDescription: string`
  - `keywords: string[]`
  - `reasonBlocks: { title: string; text: string }[]`
  - `shareTone: string`
- `ContentValidationIssue`
  - `companyId: string`
  - `severity: 'error' | 'warning'`
  - `message: string`
- `ResultPageState`
  - `status: 'ready' | 'empty' | 'invalid'`
  - `result?: ResultViewModel`
  - `issues?: ContentValidationIssue[]`

## State Transitions
1. 用户完成答题并得到 `PrimaryCompanyResult` 后，系统生成 `ResultViewModel`。
2. `contentValidation` 校验文案结构、关键词数量和治理状态。
3. 若校验通过，结果页进入 `ready` 状态并展示完整内容。
4. 若结果缺少必要文案或命中公司不可展示，进入 `invalid` 或 `empty` 兜底状态。
5. 用户点击重新测试后，答题状态与结果页状态一并重置。

## Sub-tasks
- [ ] 3.1 将算法输出组装为结果页可消费的 `ResultViewModel`，统一结果展示入口。
- [ ] 3.2 实现正式结果页结构，包括主标题、标签、人格描述、关键词区和解释区。
- [ ] 3.3 打磨移动端视觉和基础动效，强化截图分享感，但不引入海报生成或复制按钮。
- [ ] 3.4 建立内容校验与风险守卫，保证关键词数量、文案字段和白名单状态满足上线要求。
- [ ] 3.5 完成答题到结果页的集成测试、移动端细节检查和首版验收清单。

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 结果页结构完整 | 一条合法的 `ResultViewModel` | 页面展示标题、标签、描述、关键词和解释区 |
| 关键词数量校验 | 某公司关键词少于 3 个或多于 5 个 | 校验返回错误，阻止进入正式结果展示 |
| 白名单失效兜底 | 主结果公司被标记为不可展示 | 页面进入兜底状态，不输出危险结果 |
| 重新测试回流 | 用户点击重新测试 | 清空结果并回到答题起点 |
| 集成主路径 | 用户完成答题后进入结果页 | 展示与算法结果一致的中文公司名和解释信息 |

### Test Pseudo-code
```ts
test('renders a valid primary result with explanation blocks', () => {
  // given: a complete ResultViewModel generated from a valid company profile
  // when: ResultPage renders
  // then: the page shows headline, tags, keywords, and explanation content
});

test('blocks invalid result content when keyword count is outside range', () => {
  // given: a company copy config with an invalid number of keywords
  // when: content validation runs
  // then: an error issue is returned and the page cannot enter ready state
});

test('restarts the quiz from the final result page', () => {
  // given: the user is viewing a valid result
  // when: the restart action is triggered
  // then: result state clears and quiz session resets to the beginning
});
```

## Edge Cases
- 算法返回了公司结果，但对应文案尚未补齐 → 页面应给出受控兜底，而不是渲染残缺卡片。
- 某公司标签过长导致结果卡片换行拥挤 → 允许折行，但不能压坏主信息层级。
- 用户在低性能设备上打开结果页 → 动效必须降级为基础过渡，不影响阅读。
- `prefers-reduced-motion` 开启 → 结果切换仍清晰可辨，但不使用弹跳或位移动效。

## No-Touch List
| Item | Reason |
|------|--------|
| 海报生成器和图片导出链路 | 已被明确排除，不应在收尾阶段偷偷扩 scope。 |
| 复杂社交分享 SDK 接入 | 首版传播性依赖结果页表达，而非外部平台深度集成。 |
| 公司 schema 基础字段定义 | 该部分已在 PH-2 冻结，PH-3 只消费，不重构。 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 3.1 | 验证算法结果可被转换为完整 `ResultViewModel` | 先写最小组装函数，满足结果页必填字段 |
| 3.2 | 验证结果页能展示固定五段式内容结构 | 先渲染最小 UI 结构，再逐步补样式 |
| 3.3 | 验证关键卡片、标签和解释区在移动端可见 | 先添加基础布局和轻量过渡 |
| 3.4 | 验证非法关键词数量或未白名单公司会被拦截 | 先实现内容校验守卫和兜底状态 |
| 3.5 | 验证完整主路径从答题到结果页稳定可用 | 先补集成测试，再修正边缘状态 |

## Required Skills
- `harness-task:tdd` — for each sub-task
- `harness-task:phase-review` — after all sub-tasks complete
