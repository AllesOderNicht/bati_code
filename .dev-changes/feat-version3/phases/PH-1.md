# PH-1: 数据模型扩展与 17 种人设文案重写

## Context Summary
BATI V2 当前有 17 种梗人设，每个人设的文案内容单薄（1 段人格描述 + 1 段梗来源）。本阶段需要扩展数据模型并全量重写所有人设的文案，使每个人设都有独特的、深度的、有梗的内容。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/domain/persona/types.ts` | MODIFY | 扩展 PersonaProfile 类型，新增字段 |
| `src/data/personas/personaProfiles.ts` | MODIFY | 全量重写 17 种人设的丰富文案内容 |
| `src/domain/scoring/types.ts` | MODIFY | 扩展 PersonaExplanation 类型以传递新字段 |
| `src/domain/scoring/buildPersonaExplanation.ts` | MODIFY | 更新解释构建逻辑以包含新字段 |
| `src/features/result/result-view-model.ts` | MODIFY | 扩展 ResultViewModel 以传递新字段到视图 |

## Data Structure Design

### PersonaProfile 新增字段
```ts
type PersonaProfile = {
  // 现有字段保留
  id: string;
  displayName: string;
  rarity: PersonaRarity;
  relatedCompanies: string[];
  memeOrigin: string;       // 扩充为更详细的梗解读
  headline: string;
  personaDescription: string; // 保持为核心性格段
  keywords: string[];
  reasonTemplate: string;
  ssrBaseProbability?: number;
  concentrationCompanyGroup?: string;
  // 新增字段
  deepInsight: string;        // 深层性格洞察（~80-120字）
  funComment: string;         // 趣味点评收尾（~40-80字）
  dailyHabits: string[];      // 日常行为特征（3-4条）
  funFacts: string[];         // 趣味冷知识/公司文化梗（2-3条）
  ssrExclusiveNote?: string;  // SSR/浓度专属内容（仅特殊人设）
};
```

### ResultViewModel 新增字段
```ts
type ResultViewModel = {
  // 现有字段保留
  // 新增
  deepInsight: string;
  funComment: string;
  dailyHabits: string[];
  funFacts: string[];
  ssrExclusiveNote: string | null;
};
```

## Sub-tasks
- [ ] 1.1 扩展 PersonaProfile 类型定义，新增 deepInsight、funComment、dailyHabits、funFacts、ssrExclusiveNote 字段
- [ ] 1.2 重写 12 种普通人设的全量文案（扩充 personaDescription + 新增 deepInsight、funComment、dailyHabits、funFacts、memeOrigin 扩写）
- [ ] 1.3 重写 2 种 SSR 人设文案（含 ssrExclusiveNote 专属内容）
- [ ] 1.4 重写 3 种浓度人设文案（含 ssrExclusiveNote 专属内容）
- [ ] 1.5 扩展 PersonaExplanation、ResultViewModel 类型并更新构建逻辑
- [ ] 1.6 更新现有测试以适配新字段

## 文案写作指南

### personaDescription（核心性格段，~80-120字）
- 保持一段式
- 描述这个人设最核心的性格特质
- 用画面感强的语言

### deepInsight（深层洞察段，~80-120字）
- 揭示性格背后的深层逻辑和行为动机
- 让用户觉得"被看穿了"
- 用洞察力强的语气

### funComment（趣味点评，~40-80字）
- 轻松幽默的收尾
- 可以用夸张或反转的手法
- 让人会心一笑

### dailyHabits（日常特征，3-4条）
- 短句形式，每条 10-20 字
- 具体可感知的行为描写
- 让用户觉得"你怎么知道的"

### funFacts（趣味冷知识，2-3条）
- 与对应公司文化相关的有趣事实
- 轻度玩梗，通俗易懂
- 不熟悉互联网的人也能看懂

### ssrExclusiveNote（专属内容，仅 SSR/浓度人设）
- SSR 人设：写成"隐藏档案"风格
- 浓度人设：写成"纯度报告"风格
- 增强稀有感和特别感

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| PersonaProfile 新字段完整性 | 每个人设配置 | 所有 17 个人设都有 deepInsight、funComment、dailyHabits（3-4条）、funFacts（2-3条）|
| SSR/浓度人设有专属内容 | SSR 和浓度人设 | ssrExclusiveNote 非空 |
| 普通人设无专属内容 | 普通人设 | ssrExclusiveNote 为 undefined |
| ResultViewModel 传递新字段 | 完整人设数据 | viewModel 包含所有新字段 |
| 文案去职场化校验 | 所有人设文案 | 不包含工作、职场、招聘等禁用词 |

## Edge Cases
- 某个人设的 dailyHabits 少于 3 条 → 校验应报错
- funFacts 为空数组 → 校验应报错
- deepInsight 或 funComment 为空字符串 → 校验应报错

## No-Touch List
| Item | Reason |
|------|--------|
| 算分逻辑（scoring engine） | 不修改人设匹配机制 |
| 题库（questionBank） | 不修改题目内容 |
| 结果页 UI 组件 | 本阶段只改数据，UI 在 PH-2 修改 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 1.1 | 测试 PersonaProfile 类型包含新字段 | 扩展类型定义 |
| 1.2-1.4 | 测试每个人设的新字段非空且长度合理 | 逐个填写文案 |
| 1.5 | 测试 ResultViewModel 包含新字段 | 更新构建函数 |
| 1.6 | 运行现有测试确认不破坏 | 修复断言适配 |
