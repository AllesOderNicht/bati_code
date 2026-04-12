# PH-3: 结果页、图鉴与分享适配

## Context Summary
数据模型（PH-1）和算分引擎（PH-2）已完成。本阶段需要将所有 UI 组件适配新的梗人设系统：结果页展示卡片风格的人设结果、全厂图谱改造为人设图鉴、分享海报适配新内容、App.tsx 串联新的算分流程。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/features/result/result-view-model.ts` | REWRITE | 组装人设结果为 ResultViewModel |
| `src/features/result/ResultPage.tsx` | MODIFY | 适配新卡片格式：人设名主标题、公司标签、梗解读 |
| `src/features/result/result-copy-guard.ts` | MODIFY | 更新守卫逻辑适配人设结果 |
| `src/features/result/KeywordChips.tsx` | KEEP | 关键词展示组件可复用 |
| `src/features/result/RestartActions.tsx` | KEEP | 回流操作可复用 |
| `src/features/result/ExplanationSection.tsx` | MODIFY or CREATE | 展示梗来源解读和「为什么像」 |
| `src/features/companies/CompanyCatalogPage.tsx` | REWRITE → PersonaGalleryPage | 改造为人设图鉴纵向列表 |
| `src/features/companies/company-catalog-view-model.ts` | REWRITE → persona-gallery-view-model | 适配人设图鉴数据 |
| `src/App.tsx` | MODIFY | 串联新算分引擎，移除旧公司 registry 依赖 |
| `src/features/result/ResultPage.test.tsx` | REWRITE | 适配新的结果数据结构 |
| `src/App.test.tsx` | MODIFY | 适配新的测试流程 |

## Data Structure Design

### ResultViewModel (updated)
```
{
  personaId: string
  displayName: string        // '爱喝开水的企鹅'
  headline: string           // 主标题
  relatedCompanies: string[] // ['美团', '腾讯']
  memeOrigin: string         // 梗来源解读
  rarity: 'normal' | 'ssr' | 'concentration'
  personaDescription: string
  keywords: string[]
  reasonText: string         // 为什么像
  shareTone: string
}
```

### PersonaGalleryItem
```
{
  personaId: string
  displayName: string
  relatedCompanies: string[]
  memeOrigin: string
  rarity: 'normal' | 'ssr' | 'concentration'
  keywords: string[]
  isExpanded: boolean
}
```

## Sub-tasks
- [ ] 3.1 重写 result-view-model.ts，从 FinalPersonaResult + PersonaProfile 组装 ResultViewModel
- [ ] 3.2 更新 ResultPage.tsx 卡片展示：人设名主标题 + 关联公司标签 + 稀有度徽章 + 梗来源 + 为什么像
- [ ] 3.3 更新分享海报 SVG 和文案适配梗人设内容
- [ ] 3.4 改造 CompanyCatalogPage → PersonaGalleryPage（纵向滚动列表 + 点击展开）
- [ ] 3.5 更新 App.tsx：串联新引擎（scorePersonaQuiz + ssrRoll + concentrationDetect + resolvePersonaResult），移除旧 company registry
- [ ] 3.6 更新 result-copy-guard.ts 适配人设结果校验
- [ ] 3.7 清理旧的公司相关数据和类型文件
- [ ] 3.8 结果页测试和集成测试

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 结果页展示普通人设 | FinalPersonaResult(source='normal') | 显示人设名、公司标签、梗来源、为什么像 |
| 结果页展示 SSR | FinalPersonaResult(source='ssr') | 显示 SSR 徽章和稀有人设专属样式 |
| 结果页展示浓度 | FinalPersonaResult(source='concentration') | 显示浓度标签和专属描述 |
| 图鉴页展示全部人设 | 17 种人设配置 | 列表展示 17 项，SSR 有特殊标记 |
| 图鉴展开交互 | 点击某个人设 | 展开显示详细描述和梗来源 |
| 分享文案生成 | 合法 ResultViewModel | 生成包含人设名和梗的分享文本 |
| 分享海报生成 | 合法 ResultViewModel | SVG 包含人设名和关联公司 |
| 完整流程集成 | 用户答完 12 题 | 从答题到结果页一路通畅 |
| 重新测试 | 结果页点击重新测试 | 清空状态回到答题起点 |

## Edge Cases
- SSR 结果没有匹配分数的概念 → 结果页需要隐藏匹配百分比，用 SSR 徽章替代
- 浓度结果的分享文案需要突出「纯」的概念
- 人设图鉴中 SSR 人设不应直接暴露完整描述，保留一定神秘感
- 旧的公司 logo 引用需要移除或替换

## No-Touch List
| Item | Reason |
|------|--------|
| 整体视觉风格（深色金色+手绘边框） | 用户明确要求保留 |
| 基础组件（KeywordChips, RestartActions） | 可直接复用 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|-------------------------------|
| 3.1 | 验证 PersonaProfile 能被转为 ResultViewModel | 实现组装函数 |
| 3.2 | 验证结果页渲染人设名和公司标签 | 更新 JSX 结构 |
| 3.3 | 验证分享文案包含人设名和梗 | 更新 buildShareText |
| 3.4 | 验证图鉴页渲染 17 项列表 | 重写列表组件 |
| 3.5 | 验证 App 能串联新引擎产出结果 | 替换 App 内的 scoring 调用 |
| 3.6 | 验证守卫逻辑能处理人设结果 | 更新校验函数 |
| 3.7 | 验证旧公司文件不再被引用 | 删除旧文件 |
| 3.8 | 验证完整答题到结果流程 | 补充集成测试 |
