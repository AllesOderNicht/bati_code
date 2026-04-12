# PH-1: 数据模型与人设配置

## Context Summary
从零建立 V2 的数据层基础。当前系统使用 CompanyBaseProfile / CompanyScoreProfile / CompanyCopyProfile / CompanyGovernanceProfile 四层公司 schema，以及基于 dimensionWeights + companyWeights 的题目结构。本阶段需要将整套数据模型替换为以「梗人设」为核心单元的新结构，包括类型定义、17 种人设配置和 12 道重写题目。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/domain/persona/types.ts` | CREATE | 定义 PersonaProfile、PersonaRarity、PersonaCopyConfig 等核心类型 |
| `src/data/personas/personaProfiles.ts` | CREATE | 17 种梗人设的完整配置数据 |
| `src/data/questions/questionBank.ts` | REWRITE | 重写 12 道题，选项使用 personaWeights |
| `src/domain/questions/types.ts` | MODIFY | 将 QuestionOption 的 companyWeights 和 dimensionWeights 替换为 personaWeights |
| `src/domain/persona/types.test.ts` | CREATE | 验证类型结构和配置完整性 |
| `src/data/questions/questionBankValidation.ts` | MODIFY | 更新校验逻辑适配新的人设权重结构 |
| `src/data/questions/questionBankValidation.test.ts` | MODIFY | 更新测试适配新结构 |

## Data Structure Design

### PersonaProfile
```
{
  id: string                    // 如 'penguin-water'
  displayName: string           // 如 '爱喝开水的企鹅'
  rarity: 'normal' | 'ssr' | 'concentration'
  relatedCompanies: string[]    // 如 ['美团', '腾讯']
  memeOrigin: string            // 梗解读文案
  headline: string              // 结果页主标题
  personaDescription: string    // 有洞察+玩梗的人格描述
  keywords: string[]            // 3-5 个关键词
  reasonTemplate: string        // 「为什么像」解释模板
  ssrBaseProbability?: number   // SSR 专用：基础概率（如 0.01）
  concentrationCompanyGroup?: string  // 浓度专用：关联公司族群 ID
}
```

### QuestionOption (modified)
```
{
  id: string
  label: string
  personaWeights: Record<string, number>  // personaId → weight
  keywords: string[]
}
```

### Question (simplified)
```
{
  id: string
  title: string
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption]
}
```

## Sub-tasks
- [ ] 1.1 定义 PersonaProfile 类型和相关枚举
- [ ] 1.2 创建 17 种梗人设的完整配置数据（ID、显示名、梗来源、文案、关键词）
- [ ] 1.3 简化 QuestionOption 类型，移除 dimensionWeights 和 companyWeights，替换为 personaWeights
- [ ] 1.4 重写 12 道题目，每个选项携带人设权重映射
- [ ] 1.5 更新题库校验逻辑，确保人设权重覆盖度和题目风格合规
- [ ] 1.6 配置完整性测试：验证所有人设 ID 在题库中至少被引用一次

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 人设配置完整性 | 17 种人设配置 | 每种都有必填字段、关键词 3-5 个、梗解读非空 |
| 题目结构合规 | 12 道题 | 每题 4 个选项，每选项有 personaWeights |
| 人设权重覆盖 | 全部题目选项 | 每个人设 ID 至少在 3 个选项中出现 |
| SSR 人设标记 | chosen-one, magician | rarity 为 'ssr'，有 ssrBaseProbability |
| 浓度人设标记 | pure-ali, pure-byte, pure-goose | rarity 为 'concentration'，有 concentrationCompanyGroup |
| 题目文案非职场 | 所有题目标题和选项 | 不含工作、团队、面试等职场关键词 |

## Edge Cases
- 某些人设可能在题目中权重分布不均，需要确保不会出现某个人设永远无法被选中的死角
- SSR 人设不应出现在正常权重打分中，它们只通过概率触发
- 浓度人设的触发依赖公司族群映射，需要在人设配置中明确定义族群关系

## No-Touch List
| Item | Reason |
|------|--------|
| 视觉样式文件 | 本阶段只改数据模型，不动 UI |
| App.tsx 路由逻辑 | PH-3 再改 |
| ResultPage.tsx | PH-3 再改 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|-------------------------------|
| 1.1 | 验证 PersonaProfile 类型导出且包含必填字段 | 创建类型定义文件 |
| 1.2 | 验证 17 种人设配置数组长度和字段完整性 | 创建人设配置数据 |
| 1.3 | 验证新 QuestionOption 有 personaWeights 且无旧字段 | 修改类型定义 |
| 1.4 | 验证题库长度 12，每题 4 选项，选项有 personaWeights | 重写题目数据 |
| 1.5 | 验证题库文案不含禁用词 | 更新校验函数 |
| 1.6 | 验证每个人设 ID 至少出现在 3 个选项中 | 完成权重分布 |
