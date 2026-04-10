# PH-2: 数据模型、算法与配置系统

## Context Summary
本阶段建立首版真正决定结果质量和可维护性的业务中台层。默认前提是：前端应用骨架、单题答题流程和基础状态容器已经可用，页面可以承载真实数据输入。本阶段需要把题库、公司配置、规则加权算法、命中解释和白名单治理做成可测试、可批量维护、可扩展的配置系统，并为“国内前三十 + 国外前十”的目标公司池预留足够稳定的结构。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/domain/questions/types.ts` | CREATE | 定义题目、选项、维度映射的数据类型。 |
| `src/domain/company/types.ts` | CREATE | 定义公司基础资料、权重配置、文案配置、治理信息的分层 schema。 |
| `src/domain/scoring/types.ts` | CREATE | 定义评分结果、解释结果和排序结果类型。 |
| `src/domain/scoring/scoreQuiz.ts` | CREATE | 实现规则加权评分主流程。 |
| `src/domain/scoring/resolvePrimaryResult.ts` | CREATE | 处理白名单过滤、稳定 tie-break 和唯一 `Top1` 产出。 |
| `src/domain/scoring/buildExplanation.ts` | CREATE | 从答案和命中维度中提取“你为什么像它”的解释块。 |
| `src/domain/governance/companyGovernance.ts` | CREATE | 管理白名单、禁用状态、风险备注和中文展示名规则。 |
| `src/data/questions/questionBank.ts` | CREATE | 存放首版四选一题库配置。 |
| `src/data/companies/companyBaseProfiles.ts` | CREATE | 存放公司基础资料配置。 |
| `src/data/companies/companyScoreProfiles.ts` | CREATE | 存放公司算法权重配置。 |
| `src/data/companies/companyCopyProfiles.ts` | CREATE | 存放结果文案配置。 |
| `src/data/companies/companyGovernanceProfiles.ts` | CREATE | 存放白名单与治理配置。 |
| `src/domain/scoring/scoreQuiz.test.ts` | CREATE | 验证打分、排序和权重累计规则。 |
| `src/domain/scoring/resolvePrimaryResult.test.ts` | CREATE | 验证白名单过滤与 tie-break 逻辑。 |
| `src/domain/scoring/buildExplanation.test.ts` | CREATE | 验证解释输出是否对应高命中维度与关键词。 |
| `src/data/companies/schemaValidation.test.ts` | CREATE | 验证公司配置结构完整性与必填字段。 |

## Data Structure Design
- `Question`
  - `id: string`
  - `title: string`
  - `dimensionKey: string`
  - `options: QuestionOption[]`
- `QuestionOption`
  - `id: string`
  - `label: string`
  - `dimensionWeights: Record<string, number>`
  - `companyWeights: Record<string, number>`
  - `keywords: string[]`
- `CompanyBaseProfile`
  - `id: string`
  - `displayNameZh: string`
  - `brandTags: string[]`
  - `region: 'cn' | 'global'`
  - `category: string`
- `CompanyScoreProfile`
  - `companyId: string`
  - `dimensionAffinity: Record<string, number>`
  - `priorityQuestions?: Record<string, number>`
  - `tieBreakWeight?: number`
- `CompanyCopyProfile`
  - `companyId: string`
  - `headline: string`
  - `personaDescription: string`
  - `keywords: string[]`
  - `explanationTemplates: string[]`
- `CompanyGovernanceProfile`
  - `companyId: string`
  - `isWhitelisted: boolean`
  - `isEnabled: boolean`
  - `riskNotes: string[]`
  - `preferredDisplayNameZh: string`
  - `aliases: string[]`
- `RankedCompanyResult`
  - `companyId: string`
  - `score: number`
  - `matchedDimensions: { key: string; score: number }[]`
  - `matchedKeywords: string[]`
- `PrimaryCompanyResult`
  - `companyId: string`
  - `displayNameZh: string`
  - `score: number`
  - `reasonDimensions: string[]`
  - `reasonKeywords: string[]`

## State Transitions
1. 答题页提交完整 `answers` 记录后，进入评分流程。
2. `scoreQuiz()` 遍历题目和选项，为公司分数和维度分数分别累计权重。
3. `resolvePrimaryResult()` 读取治理信息，剔除未启用或未进入白名单的公司。
4. 若多个公司接近，按核心维度命中数、关键题权重和治理优先级执行稳定 tie-break。
5. 生成唯一主结果后，`buildExplanation()` 提取高命中维度与高频关键词，供结果页渲染。

## Sub-tasks
- [ ] 2.1 定义题目、公司、评分与治理的 TypeScript schema，确保数据职责分层清晰。
- [ ] 2.2 建立首版四选一题库结构和最小可运行的公司配置样例，再扩展到目标公司池。
- [ ] 2.3 实现规则加权评分引擎，区分维度解释分与公司结果分。
- [ ] 2.4 实现白名单过滤、禁用剔除和稳定 tie-break 规则，保证只输出唯一 `Top1`。
- [ ] 2.5 实现解释提取逻辑，保证结果页可以说明“你为什么像它”。
- [ ] 2.6 补充配置结构测试和算法单元测试，避免扩展公司池时引入隐性错误。

## Bugfix Addendum
- [ ] [BUGFIX] 全量重写 30 道题目，题干和选项只能围绕性格、生活、爱好、社交方式、审美、日常偏好、消费选择、情绪恢复和行为习惯等非工作场景表达。
- [ ] [BUGFIX] 建立题库禁用边界，明确禁止工作、职场、团队、增长、面试、招聘、项目、业务、管理、组织、流程、KPI 等题型与词族进入题目标题、选项文案、关键词和解释素材。
- [ ] [BUGFIX] 重审维度命名与维度标签，避免 `协作`、`结果导向`、`组织效率` 这类仍会把结果解释带回职场语境的命名残留。
- [ ] [BUGFIX] 重审题库关键词与公司权重配置，确保不是只替换题面文案，而是连同底层映射一起从职场语义迁移到生活化语义。
- [ ] [BUGFIX] 为题库增加语义边界校验与测试，覆盖题目标题、选项、关键词、维度标签和优先题配置，发现禁用词族或工作场景表达时必须失败。
- [ ] [BUGFIX] 补充题库审查样例和代表性答案样本，验证重写后的题库仍能稳定驱动 `Top1` 结果，但不再依赖工作语境信号。

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 维度与公司权重累计 | 一组固定答案 | 输出的公司分和维度分符合预期累计结果 |
| 白名单过滤 | 得分第一的公司未进入白名单 | 系统跳过该公司并返回下一可用结果 |
| 禁用公司剔除 | 得分第一的公司 `isEnabled=false` | 结果不返回该公司 |
| 稳定 tie-break | 两家公司总分接近 | 系统按约定优先级稳定选出同一个 `Top1` |
| 解释关键词提取 | 用户多次命中同类选项 | 解释结果包含对应维度和关键词 |
| 配置字段完整性 | 某家公司缺少中文展示名 | 校验失败并指出缺失字段 |
| 题库语义边界校验 | 题目或关键词出现团队、面试、增长、业务等禁用词族 | 校验失败并指出命中的工作化语义 |
| 维度命名去职场化 | 维度标签或解释字段仍残留协作、管理、结果导向等职场表达 | 校验失败并要求回到生活化命名 |

### Test Pseudo-code
```ts
test('scores answers into ranked companies', () => {
  // given: a question bank, company score profiles, and deterministic answers
  // when: scoreQuiz is executed
  // then: ranked company results contain expected scores and matched dimensions
});

test('filters out non-whitelisted companies before selecting top1', () => {
  // given: the highest-scoring company is not whitelisted
  // when: resolvePrimaryResult runs
  // then: the next valid company becomes the primary result
});

test('builds explanation from top matched dimensions and keywords', () => {
  // given: a primary result plus answer traces with repeated dimension hits
  // when: buildExplanation runs
  // then: explanation contains the strongest dimensions and relevant keywords
});

test('rejects question-bank copy that slips into workplace language', () => {
  // given: a question title, option label, or keyword contains team/interview/growth/business wording
  // when: question-bank semantic validation runs
  // then: the validation fails and points to the offending field
});
```

## Edge Cases
- 所有高分公司都未通过白名单 → 系统应返回可控的兜底空状态，而不是随意挑选未审核公司。
- 某题配置了维度权重但未配置公司权重 → 应允许存在，但必须保证解释层仍能工作。
- 某公司文案配置存在但算法配置缺失 → 校验失败，阻止该公司进入正式结果池。
- 多家公司使用高度相似模板 → 允许存在，但解释关键词和关键题加权必须保留最少差异。
- 题面改成生活化表达，但关键词、维度标签或优先题仍保留职场语义 → 应视为失败，不能算完成 bugfix。

## No-Touch List
| Item | Reason |
|------|--------|
| 页面视觉大改与重动画 | 本阶段聚焦业务数据和算法，不扩大 UI 范围。 |
| 海报生成、复制按钮和社交分享 SDK | 已明确排除在首版能力之外。 |
| 服务端持久化和用户历史记录 | 当前架构边界仍是纯前端。 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 2.1 | 验证非法配置会在类型或测试层报错 | 先建立最小 schema 和样例数据 |
| 2.2 | 验证题库与公司配置可被统一读取 | 先接入最小 question bank 与 company registry |
| 2.3 | 验证固定答案会产出确定分值 | 先实现最小累计逻辑，不做额外优化 |
| 2.4 | 验证白名单和 tie-break 行为稳定 | 先实现过滤，再加优先级规则 |
| 2.5 | 验证解释区能输出维度与关键词 | 先提取最高权重维度和去重关键词 |
| 2.6 | 验证缺字段或禁用公司会触发失败 | 先补结构测试与配置守卫 |
| [BUGFIX] 题库去职场化 | 验证题库标题、选项、关键词和维度命名不再命中工作语境 | 先建立语义边界校验，再批量重写题库和权重映射 |

## Required Skills
- `harness-task:tdd` — for each sub-task
- `harness-task:phase-review` — after all sub-tasks complete
