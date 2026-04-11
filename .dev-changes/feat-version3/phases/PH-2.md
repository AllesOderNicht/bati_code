# PH-2: 结果页内容展示增强与 SSR/浓度视觉重塑

## Context Summary
PH-1 完成后，17 种人设已有丰富的多段文案和新字段。本阶段将更新结果页组件以展示全部新内容，并为 SSR 人设打造暗金色专属主题，为浓度人设实现动态浓度进度条和配色偏移。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/features/result/ResultPage.tsx` | MODIFY | 展示多段人格描述、日常特征、趣味冷知识、融入 reasonTemplate、SSR/浓度专属区块 |
| `src/features/result/KeywordChips.tsx` | MODIFY | 可能需要适配新的展示需求 |
| `src/features/result/RestartActions.tsx` | MINOR | 微调以适配新的卡片风格 |
| `src/features/result/result-copy-guard.ts` | MODIFY | 增加新字段的校验逻辑 |
| `src/styles/global.css` | MODIFY | 新增 SSR 暗金主题的 CSS token 和浓度主题变量 |
| `src/features/result/ResultPage.test.tsx` | MODIFY | 更新测试以验证新内容和视觉效果 |

## Data Structure Design

### SSR 主题 CSS Token
```css
--color-ssr-bg: #1a1510;
--color-ssr-surface: #2a2218;
--color-ssr-gold: #d4a853;
--color-ssr-gold-soft: rgba(212, 168, 83, 0.15);
--color-ssr-border: rgba(212, 168, 83, 0.4);
--shadow-ssr-glow: 0 0 20px rgba(212, 168, 83, 0.25);
```

### 浓度主题配色
```
阿里: 橙色系 (#ff6a00 主色)
字节: 蓝色系 (#3370ff 主色)
腾讯: 绿色系 (#07c160 主色)
```

## Sub-tasks
- [ ] 2.1 重构结果页主体内容区，展示三段人格描述（核心 + 洞察 + 趣味点评）
- [ ] 2.2 添加日常行为特征展示列表
- [ ] 2.3 添加趣味冷知识卡片展示
- [ ] 2.4 将 reasonTemplate 融入"为什么像/梗解读"面板
- [ ] 2.5 实现 SSR 暗金色主题（深色背景、金色边框、微光动效）
- [ ] 2.6 实现浓度人设视觉强化（浓度进度条、配色偏移）
- [ ] 2.7 SSR/浓度专属内容区块（隐藏档案/纯度报告）
- [ ] 2.8 确保移动端阅读体验和 reduced-motion 兼容
- [ ] 2.9 更新海报 SVG 生成适配新内容（如有时间）
- [ ] 2.10 更新测试和校验

## State Transitions
1. 普通人设 → 展示标准暖色调卡片 + 扩充内容
2. SSR 人设 → 切换为暗金色主题卡片 + 专属「隐藏档案」
3. 浓度人设 → 标准卡片基础上加浓度进度条 + 配色偏移 + 专属「纯度报告」

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 普通人设展示三段描述 | 普通人设 ResultViewModel | 页面展示核心描述 + 深层洞察 + 趣味点评 |
| 日常特征列表渲染 | dailyHabits 数组 | 渲染为列表项 |
| 趣味冷知识展示 | funFacts 数组 | 渲染为趣味卡片 |
| reasonTemplate 融入面板 | 含 reasonText 的 viewModel | 在梗解读面板中可见 |
| SSR 暗金色主题 | rarity=ssr 的 viewModel | 卡片背景为暗色，文字为金色 |
| 浓度进度条 | rarity=concentration 的 viewModel | 渲染浓度进度条组件 |
| SSR 专属内容 | SSR viewModel | 显示「隐藏档案」区块 |
| 浓度专属内容 | 浓度 viewModel | 显示「纯度报告」区块 |
| reduced-motion 兼容 | prefers-reduced-motion | 动效降级但内容完整 |
| 移动端布局 | 小屏视口 | 所有内容可正常阅读无溢出 |

## Edge Cases
- SSR 人设的暗金色主题在低对比度设备上需要确保可读性
- 浓度进度条动画在低性能设备上应降级
- 超长 funFacts 内容不应撑破卡片布局
- dailyHabits 文字过长时应折行处理

## No-Touch List
| Item | Reason |
|------|--------|
| 人设数据内容 | PH-1 已冻结文案 |
| 算分引擎 | 不修改匹配逻辑 |
| 答题流程和题库 | 不在本次范围 |
| 首页和图鉴页面 | 仅修改结果页 |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 2.1 | 验证三段描述在页面中渲染 | 先添加内容区域，再样式 |
| 2.2 | 验证日常特征列表渲染 | 最小列表组件 |
| 2.3 | 验证趣味冷知识渲染 | 最小卡片组件 |
| 2.4 | 验证 reasonText 在面板中可见 | 添加到面板 |
| 2.5 | 验证 SSR 卡片有暗色背景 | 条件样式切换 |
| 2.6 | 验证浓度进度条存在 | 最小进度条组件 |
| 2.7 | 验证专属内容区块渲染 | 条件内容区块 |
| 2.8 | 验证 reduced-motion 下无动画 | CSS media query |
