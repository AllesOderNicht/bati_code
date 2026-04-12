# PH-1: 题库设计与人设 Keywords 对齐

## Context Summary
BATI V4 的核心工作。当前 12 道题维度单一、权重稀疏、缺乏交叉验证。本阶段全量重写 12 道题（混合文案风格，每题覆盖 2-3 个隐性维度），每选项映射 3-5 个人设权重（1/2/3 三档），并同步调整人设 keywords 以确保结果页一致性。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/data/questions/questionBank.ts` | MODIFY | 全量重写 12 道题的 title、option label、personaWeights 和 keywords |
| `src/data/personas/personaProfiles.ts` | MODIFY | 调整所有 12 个普通人设的 keywords 字段，使其与新题库选项呼应 |

## Data Structure Design
题目结构不变，权重值范围扩展：
- `personaWeights: Record<string, number>` — 值域从 {1, 2} 扩展为 {1, 2, 3}
- 每选项 3-5 个 key，总权重约 8-12 分
- `keywords: string[]` — 每选项 2 个关键词，与主权重人设的 keywords 呼应

## 12 题维度覆盖矩阵（设计指导）

| 题号 | 文案风格 | 覆盖维度 | 主要区分方向 |
|------|---------|---------|-------------|
| q01 | 场景代入 | 社交驱动力 × 情绪表达 | 热闹社交型 vs 独处内敛型 |
| q02 | 直觉偏好 | 决策风格 × 新鲜感追求 | 理性谨慎型 vs 直觉冒险型 |
| q03 | 趣味选择 | 兴趣浓度 × 情绪表达 | 深度沉浸型 vs 广泛涉猎型 |
| q04 | 场景代入 | 价值坐标 × 生活节奏 | 务实性价比 vs 品质体验 vs 随性自由 |
| q05 | 直觉偏好 | 忠诚度 × 社交驱动力 | 全力付出型 vs 保持距离型 |
| q06 | 场景代入 | 生活节奏 × 决策风格 | 快节奏行动型 vs 慢节奏享受型 |
| q07 | 趣味选择 | 新鲜感追求 × 兴趣浓度 | 探索尝鲜型 vs 稳定舒适型 |
| q08 | 场景代入 | 情绪表达 × 忠诚度 | 外放关怀型 vs 理性支持型 |
| q09 | 直觉偏好 | 社交驱动力 × 价值坐标 | 群体归属型 vs 独立自主型 |
| q10 | 趣味选择 | 决策风格 × 生活节奏 | 计划控 vs 随机应变 |
| q11 | 场景代入 | 兴趣浓度 × 新鲜感追求 | 一件事做到极致 vs 什么都想试 |
| q12 | 趣味选择 | 综合交叉 | 全维度轻度覆盖，用于微调和校准 |

## 权重分配原则
- 每选项有且仅有 1 个权重为 3 的主命中人设
- 副权重（2分）1-2 个
- 弱权重（1分）1-2 个
- 同一人设在不同题中从不同维度获分
- 12 个普通人设的总可获分应在同一数量级（差异不超过 30%）

## Sub-tasks
- [ ] 1.1 设计完整的 12 题题面文案和选项文案（混合风格）
- [ ] 1.2 为每个选项精心分配 personaWeights（1/2/3 三档，3-5 个人设/选项）
- [ ] 1.3 为每个选项设计 keywords（与主权重人设 keywords 呼应）
- [ ] 1.4 调整 personaProfiles.ts 中 12 个普通人设的 keywords
- [ ] 1.5 验证权重矩阵的均衡性（手动检查每个人设的总可获分和出现次数）

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 题库结构校验 | 新题库数据 | 通过现有 validateQuestionBankSemantics 校验 |
| 每个人设出现次数 | 统计权重矩阵 | 每个普通人设至少出现 8 次 |
| 权重值范围 | 检查所有 personaWeights 值 | 所有值在 {1, 2, 3} 范围内 |
| Keywords 呼应 | 对比选项 keywords 与人设 keywords | 主权重人设的 keywords 至少有 1 个与选项 keywords 匹配 |

### Test Pseudo-code
```ts
test('all options have 3-5 persona weights in range 1-3', () => {
  for (const q of questionBank) {
    for (const opt of q.options) {
      const keys = Object.keys(opt.personaWeights);
      expect(keys.length).toBeGreaterThanOrEqual(3);
      expect(keys.length).toBeLessThanOrEqual(5);
      for (const w of Object.values(opt.personaWeights)) {
        expect([1, 2, 3]).toContain(w);
      }
    }
  }
});

test('each normal persona appears in at least 8 options', () => {
  // count appearances across all options
  // assert each >= 8
});
```

## Edge Cases
- 如果某个人设总可获分明显偏低，需要在弱权重中补充覆盖
- 如果 demoQuestionBank（前 3 题切片）的结构变化导致 App.test.tsx 需要调整

## No-Touch List
| Item | Reason |
|------|--------|
| 算分引擎（scorePersonaQuiz, ssrRoll, resolvePersonaResult） | 明确排除在改动范围外 |
| 人设文案字段（personaDescription, deepInsight 等） | 只改 keywords，不动文案 |
| UI 组件 | 不在本阶段范围内 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 1.1-1.3 | 写权重结构校验测试（选项数、权重范围、人设覆盖） | 逐题写入新题目数据直到测试通过 |
| 1.4 | 写 keywords 呼应测试 | 调整 personaProfiles keywords |
| 1.5 | 写权重均衡性断言 | 微调权重直到均衡 |
