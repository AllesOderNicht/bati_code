# Proposal: BATI V4 — 多维度题库重构与权重精调

## Goal
将 BATI 的 12 道题从"单维度直球映射"升级为"多维度隐性交叉验证"的题库体系。每道题自然覆盖多个性格/生活维度，每个选项映射 3-5 个人设权重（使用 1-2-3 三档分值），确保用户答完题后看到结果时产生强烈的"这也太准了"的契合感。

## Background
当前 12 道题的问题：
- 维度单一——大部分题集中在"社交方式"和"消费习惯"两个领域
- 权重稀疏——每选项只映射 1-3 个人设（权重 1-2），部分人设（如 chrysanthemum-dancer、zoo-director）得分机会偏少
- 缺乏交叉验证——一个人设的最终得分往往被 1-2 道"直球题"决定，缺少多角度确认
- keywords 与人设 keywords 脱节——选项的 keywords 是独立设计的行为标签，没有与人设配置呼应

V4 的改动范围限定在题库数据层（questionBank.ts）、人设 keywords（personaProfiles.ts）和浓度阈值（concentrationDetect.ts），不改动算分引擎核心逻辑。

## User Stories
- 作为答题用户，我希望每道题都让我觉得"每个选项都挺像我"但又有微妙差异，选择过程有真实的自我探索感。
- 作为看结果的用户，我希望结果描述和关键词精准匹配我答题时的感受，产生"被看穿了"的惊喜。
- 作为浓度结果用户，我希望如果我的选择确实高度一致，系统能识别出来给我一个浓度结果，而不是因为阈值太高而错过。
- 作为重复测试的用户，我希望不同答题路径能稳定地导向不同人设，而不是大家选什么都差不多。

## 八维度框架

题库设计基于以下 8 个隐性维度，每道题覆盖 2-3 个维度的交叉判断：

| 维度 | 两极 | 主要区分的人设方向 |
|------|------|-------------------|
| 社交驱动力 | 热闹社交 ↔ 独处充电 | wechat-dog / happy-drunk vs heartless-ant / gaming-ali |
| 决策风格 | 理性分析 ↔ 直觉行动 | heartless-ant / chrysanthemum-dancer vs happy-drunk / starry-eyes |
| 新鲜感追求 | 探索尝鲜 ↔ 稳定舒适 | starry-eyes / didi-delivery vs penguin-water / blessed-puppy |
| 兴趣浓度 | 深度沉浸 ↔ 广泛涉猎 | gacha-weeb / gaming-ali vs zoo-director / starry-eyes |
| 情绪表达 | 外放分享 ↔ 内敛消化 | happy-drunk / wechat-dog vs heartless-ant / penguin-water |
| 生活节奏 | 快节奏行动 ↔ 慢节奏享受 | didi-delivery / slash-bro vs penguin-water / magician |
| 价值坐标 | 务实性价比 ↔ 品质体验 ↔ 随性自由 | slash-bro vs chrysanthemum-dancer vs happy-drunk |
| 忠诚度与边界 | 全力付出 ↔ 保持距离 | blessed-puppy / wechat-dog vs gaming-ali / heartless-ant |

## Technical Approach

### QuestionBank 重写
- 12 道题全量重写，混合三种文案风格（场景代入、直觉偏好、趣味选择）
- 每道题隐性覆盖 2-3 个维度
- 每个选项映射 3-5 个人设权重，使用 1/2/3 三档分值（3=强命中，2=中等相关，1=弱相关）
- 确保每个普通人设在整套题库中至少出现 8 次（当前校验最低 3 次，新标准更高）

### 权重矩阵设计原则
- **主权重**（3分）：每选项有 1 个主命中人设，代表该选项最核心的气质
- **副权重**（2分）：1-2 个与主命中气质接近的人设
- **弱权重**（1分）：1-2 个有部分相关性的人设
- **交叉验证**：同一人设在不同题目中从不同维度获得分数，确保最终高分人设是多维度综合匹配的结果

### 结果概率均衡性保障（关键新增）
目标：除 SSR（概率极低）外，所有 12 个普通人设和 3 个浓度结果在真实用户群体中应有大致均等的出现概率。

**设计手段**：
1. **专属通路设计**：为每个普通人设预先设计一条"目标答题路径"（12 个特定选项），沿此路径答题时该人设稳定成为 Top1。这确保每个人设都是"可达的"，不会出现某个人设理论上无法被选中的死角。
2. **权重区域独立性**：权重矩阵设计时避免"人设绑定"——即偏向人设 A 的选项组合不应同时大量给人设 B 加分，否则 B 会"搭便车"挤占 A 的结果位。通过控制每对人设的权重共现度来实现。
3. **蒙特卡洛模拟验证**：在测试中随机生成 10000 组答题组合，统计每个人设成为 Top1 的频率。要求每个普通人设的出现率在 1/12 ± 50% 范围内（即 ~4.2% - ~12.5%），不允许出现极端冷门或极端热门人设。
4. **总可获分均衡**：所有普通人设的总可获分（把题库中所有含该人设权重的选项加总）差异不超过 20%。

### PersonaProfile Keywords 调整
- 将人设的 keywords 与新题库选项的 keywords 对齐
- 确保结果页展示的关键词能呼应用户在答题时选择的行为标签
- 不改动人设的其他文案字段（personaDescription, deepInsight 等）

### 浓度阈值调整
- CONCENTRATION_THRESHOLD 从 0.35 降至 0.30
- 原因：中等密度权重（3-5 人设/选项）会让分数更分散，需要降低阈值保证浓度结果有合理触发率

### 验证体系
- **静态权重分布测试**：验证每个人设的总可获分（差异 < 20%）、出现次数（>= 8）、权重密度（3-5 人设/选项）
- **专属通路测试**：为每个普通人设提供一组固定答案，验证该答案路径下该人设稳定 Top1
- **蒙特卡洛模拟测试**：随机 10000 组答题，验证每个人设出现率在 1/12 ± 50% 范围内
- **浓度可触发性测试**：构造极端答题路径，验证阿里/字节/腾讯三组都有可触发的答题组合
- **人设区分度测试**：验证相似人设对（如 penguin-water vs blessed-puppy）在特定答题路径下能被区分

## Product Goals And Non-Goals

### In Scope (MUST)
- MUST: 全量重写 12 道题的题面、选项文案和 personaWeights（使用 1-2-3 三档）
- MUST: 每选项映射 3-5 个人设，每个普通人设至少出现 8 次
- MUST: 调整 personaProfiles 中所有普通人设的 keywords 与新题库呼应
- MUST: 将 CONCENTRATION_THRESHOLD 从 0.35 降至 0.30
- MUST: 编写权重分布自动化测试（含蒙特卡洛模拟验证结果概率均衡性）
- MUST: 为每个普通人设设计一条专属答题通路，保证该人设可达

### Out of Scope (MUST NOT)
- MUST NOT: 修改算分引擎核心逻辑（scorePersonaQuiz, ssrRoll, resolvePersonaResult）
- MUST NOT: 修改人设的文案字段（personaDescription, deepInsight, funComment 等）
- MUST NOT: 改变题目数量（保持 12 道）或选项数量（保持 4 个）
- MUST NOT: 修改 UI 组件或页面结构

### Optional (MAY)
- MAY: 更新 questionBankValidation.ts 中的最低覆盖次数门槛（从 3 提升到 8）
- MAY: 调整 demoQuestionBank 切片逻辑（如果前 3 题结构变化）

## Phase Overview
| Phase | Title | Description |
|-------|-------|-------------|
| PH-1 | 题库设计与人设 Keywords 对齐 | 设计 12 道多维度题目和权重矩阵，重写 questionBank.ts，调整 personaProfiles.ts 中的 keywords |
| PH-2 | 阈值调整、测试与验证 | 调整浓度阈值，编写权重分布测试，更新现有测试，验证全链路 |
