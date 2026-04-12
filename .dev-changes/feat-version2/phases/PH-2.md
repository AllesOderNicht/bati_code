# PH-2: 算分引擎与结果决策

## Context Summary
数据模型和人设配置已在 PH-1 完成。本阶段需要替换原有的公司维度加权算分引擎，实现全新的人设匹配逻辑：人设权重聚合 → SSR 概率触发 → 浓度检测 → 结果决策。同时需要构建新的解释生成器，输出有洞察+玩梗风格的「为什么像」文案。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/domain/scoring/scorePersonaQuiz.ts` | CREATE | 人设权重聚合算法 |
| `src/domain/scoring/ssrRoll.ts` | CREATE | SSR 概率计算和掷骰子逻辑 |
| `src/domain/scoring/concentrationDetect.ts` | CREATE | 浓度检测算法 |
| `src/domain/scoring/resolvePersonaResult.ts` | CREATE | 最终结果决策：SSR > 浓度 > 普通 Top1 |
| `src/domain/scoring/buildPersonaExplanation.ts` | CREATE | 基于人设和选择轨迹生成解释 |
| `src/domain/scoring/types.ts` | REWRITE | 替换为人设匹配相关类型 |
| `src/domain/scoring/scorePersonaQuiz.test.ts` | CREATE | 算分引擎测试 |
| `src/domain/scoring/ssrRoll.test.ts` | CREATE | SSR 触发逻辑测试 |
| `src/domain/scoring/concentrationDetect.test.ts` | CREATE | 浓度检测测试 |
| `src/domain/scoring/resolvePersonaResult.test.ts` | CREATE | 结果决策测试 |

## Data Structure Design

### PersonaRankedResult
```
{
  personaId: string
  score: number
  matchedKeywords: string[]
}
```

### SSRResult
```
{
  triggered: boolean
  personaId: string      // 'chosen-one' | 'magician'
  rolledProbability: number
  boosted: boolean
}
```

### ConcentrationResult
```
{
  triggered: boolean
  personaId: string      // 'pure-ali' | 'pure-byte' | 'pure-goose'
  companyGroup: string
  concentrationScore: number
}
```

### FinalPersonaResult
```
{
  personaId: string
  source: 'ssr' | 'concentration' | 'normal'
  score: number
  matchedKeywords: string[]
}
```

### PersonaExplanation
```
{
  headline: string
  personaDescription: string
  keywords: string[]
  memeOrigin: string
  reasonText: string
}
```

## Algorithm Design

### 权重聚合
对每道已答题目，取用户选择的选项的 personaWeights，按 personaId 累加。只累加 rarity='normal' 的 12 种普通人设。

### SSR 掷骰
1. 基础概率：1%（0.01）
2. 答题加成：检测特定选项组合模式（如选项分布特别均匀、或多次选到特定关键词），每命中一个模式加 0.5%
3. 最终概率上限 5%
4. 若触发，随机选择 chosen-one 或 magician
5. SSR 判定优先于一切普通结果

### 浓度检测
1. 将 12 种普通人设按关联公司族群分组：阿里族（blessed-puppy, gaming-ali 等含阿里权重的）、字节族、腾讯族
2. 统计每个族群的总权重占比
3. 若某族群占比 >= 70%（即大部分答案都偏向一家），触发对应 99.99% 浓度人设
4. 浓度结果优先级低于 SSR 但高于普通结果

### 结果决策优先级
SSR 触发 > 浓度触发 > 普通 Top1

## Sub-tasks
- [ ] 2.1 实现 scorePersonaQuiz 权重聚合算法
- [ ] 2.2 实现 SSR 概率计算和触发逻辑
- [ ] 2.3 实现浓度检测算法
- [ ] 2.4 实现 resolvePersonaResult 结果决策
- [ ] 2.5 实现 buildPersonaExplanation 解释生成器
- [ ] 2.6 替换旧的 scoring types

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 权重聚合基础 | 全部 12 题答案 | 返回按分数排序的人设列表，分数>0 |
| SSR 不触发 | 固定随机种子(>0.05) | triggered=false |
| SSR 触发 | 固定随机种子(<0.01) | triggered=true，返回 chosen-one 或 magician |
| SSR 加成 | 均匀分布答案 + 种子(<0.03) | 加成后概率突破基础值，触发 SSR |
| 浓度触发阿里 | 大量偏阿里选项 | triggered=true，personaId='pure-ali' |
| 浓度不触发 | 均匀分布答案 | triggered=false |
| 决策优先级 SSR>浓度 | SSR 和浓度都触发 | 最终结果为 SSR |
| 决策优先级 浓度>普通 | 浓度触发，SSR 未触发 | 最终结果为浓度人设 |
| 解释生成 | 合法的 FinalPersonaResult | 返回非空的 headline、description 和 reasonText |

## Edge Cases
- 所有题目权重完全平均导致无法区分 → 使用 tie-break（按人设 ID 字典序）
- SSR 随机数生成需支持注入，测试时可控
- 浓度检测阈值边界：恰好 70% 时应触发
- 用户只答了部分题就到结果页（中途跳转）→ 按已答题目计算

## No-Touch List
| Item | Reason |
|------|--------|
| ResultPage.tsx | PH-3 再改 |
| CompanyCatalogPage.tsx | PH-3 再改 |
| App.tsx | PH-3 再改 |
| 分享海报逻辑 | PH-3 再改 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|-------------------------------|
| 2.1 | 验证给定答案能返回排序后的人设分数列表 | 实现权重聚合循环 |
| 2.2 | 验证固定种子下 SSR 触发/不触发行为 | 实现概率计算+掷骰子 |
| 2.3 | 验证偏向单一族群的答案触发浓度 | 实现族群分组+占比计算 |
| 2.4 | 验证三种优先级场景的决策输出 | 实现 if-else 优先级链 |
| 2.5 | 验证解释输出包含人设名和梗来源 | 实现模板填充 |
| 2.6 | 验证旧类型不再被导入 | 删除旧类型，替换新类型 |
