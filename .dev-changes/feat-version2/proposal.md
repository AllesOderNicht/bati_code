# Proposal: BATI V2 — 大厂梗文化混搭人设测试

## Goal
将 BATI 从「你像哪家大厂」的单公司匹配模式，重构为「你是哪种大厂梗混搭人设」的趣味测试。17 种结果均为两家或多家大厂文化梗元素的组合（如「爱喝开水的企鹅」= 美团×腾讯），附带 2 种 SSR 稀有人设和 3 种 99.99% 纯浓度结果，提供更强的分享感和命中感。

## Background
当前系统基于 33 家公司的维度加权打分模型，输出单一公司作为结果。V2 需要将结果单元从「公司」切换到「梗人设」，每个人设是多家公司文化元素的混搭。这不是在原有系统上加层，而是需要替换核心数据模型、算分逻辑和结果展示。

## User Stories
- 作为答题用户，我希望最终结果是一个有趣的、有大厂梗文化的混搭人设名（如「福报小狗」），而不是单纯的公司名。
- 作为答题用户，我希望每次答题都有极小概率触发 SSR 稀有结果，带来惊喜感。
- 作为答题用户，我希望结果页有清晰的梗解读，让我和朋友都能看懂背后的公司文化关联。
- 作为分享用户，我希望结果海报适配新的梗人设内容，截图分享时有辨识度。
- 作为浏览用户，我希望能在「人设图鉴」页看到所有 17 种人设的完整列表。

## 17 种梗人设定义

### 普通人设（12 种）
| ID | 人设名 | 梗来源 |
|----|--------|--------|
| penguin-water | 爱喝开水的企鹅 | 开水团=美团 + 企鹅=腾讯 |
| heartless-ant | 没有心跳的蚂蚁 | 没有心跳→字节跳动 + 蚂蚁=蚂蚁金服 |
| wechat-dog | 爱玩微信的修狗 | 微信=腾讯 + 修狗=京东 |
| chrysanthemum-dancer | 手捧菊花的舞者 | 菊花=华为 + 舞者=字节跳动 |
| didi-delivery | 跑滴滴的外卖员 | 滴滴=滴滴 + 外卖员=美团 |
| slash-bro | 多砍几刀的铁子 | 砍一刀=拼多多 + 铁子=快手 |
| zoo-director | 开动物园的厂长 | 猪=网易 + 熊=百度 + 鹅=腾讯 |
| gacha-weeb | 熬夜抽卡的二次元鼻祖 | 抽卡=网易 + 二次元=B站 |
| blessed-puppy | 福报小狗 | 福报=阿里 + 小狗=京东 |
| gaming-ali | 爱玩游戏的阿里人 | 游戏=腾讯 + 阿里人=阿里 |
| starry-eyes | 你的眼里看到的全是星星 | 100%浓度→宇宙厂→字节 |
| happy-drunk | 开心的酒鬼 | 开心=腾讯 + 干杯=bilibili |

### SSR 稀有人设（2 种，1% 基础概率 + 答题组合提升）
| ID | 人设名 | 梗来源 |
|----|--------|--------|
| chosen-one | 天选打工人 | 适合任何互联网大厂 |
| magician | 魔术师 | 最佛系，适合外企，佛尔思沃尔 |

### 99.99% 纯浓度人设（3 种，特定答题组合触发）
| ID | 人设名 | 触发条件 |
|----|--------|----------|
| pure-ali | 99.99%浓度的阿里人 | 大多数答题偏向阿里气质 |
| pure-byte | 99.99%浓度的字节人 | 大多数答题偏向字节气质 |
| pure-goose | 99.99%浓度的鹅 | 大多数答题偏向腾讯气质 |

## Technical Approach

### PersonaRegistry
替代原有的 CompanyProfileRegistry，管理 17 种梗人设的全部配置。每个人设包含：基础信息（ID、显示名、关联公司标签、稀有度等级）、文案配置（标题、人格描述、关键词、梗解读、「为什么像」模板）、算分权重配置。

### QuestionBank
保留 12 道四选一题目的交互形式，重新设计题目内容和选项。每个选项携带人设权重（personaWeights）替代原有的 companyWeights 和 dimensionWeights，直接映射到 17 种人设。

### ScoringEngine
替换原有的公司维度加权算法，新引擎流程：
1. 聚合用户选项的人设权重，得到每个人设的累计分数
2. SSR 检测：计算基础 1% 概率 + 答题组合加成，掷骰子决定是否触发 SSR
3. 浓度检测：检查是否有单一公司族群（阿里/字节/腾讯）的权重远超其他，触发 99.99% 纯浓度结果
4. 若未触发 SSR 或浓度，按累计分数排序取 Top1 普通人设

### ExplanationBuilder
基于命中人设的梗来源和用户选择轨迹，生成「为什么像」的解释。采用有洞察+玩梗的语气：先描述性格特点，再用梗元素串联。

### PersonaGallery
将原有 CompanyCatalogPage 改造为纵向滚动的人设图鉴列表，展示全部 17 种人设。点击可展开查看详细描述和梗来源解读。SSR 人设用特殊标识区分。

### ResultComposer
将算分结果 + 文案配置组装为 ResultViewModel，适配卡片风格展示：梗人设名为主标题，关联公司为小标签，配趣味解释。

### SharePoster
保留并增强分享海报功能，适配新的梗人设内容。海报突出人设名和梗解读，增强截图传播的辨识度。

## 推荐接口边界
- `scorePersonaQuiz(answers, questions) => PersonaRankedResult[]`
- `rollSSR(answers, questions) => SSRResult | null`
- `detectConcentration(answers, questions) => ConcentrationResult | null`
- `resolvePersonaResult(ranked, ssrResult, concentrationResult) => FinalPersonaResult`
- `buildPersonaExplanation(finalResult, answers, questions) => PersonaExplanation`
- `composePersonaResultView(finalResult, explanation, personaConfig) => ResultViewModel`

## Product Goals And Non-Goals

### In Scope (MUST)
- MUST: 实现 17 种梗人设的完整数据配置和文案
- MUST: 重写 12 道题，每个选项携带人设权重
- MUST: 替换算分引擎为人设匹配 + SSR + 浓度检测
- MUST: 结果页以卡片风格展示梗人设名、关联公司标签和趣味解释
- MUST: 将全厂图谱改造为人设图鉴（纵向滚动列表）
- MUST: 分享海报适配新的梗人设内容

### Out of Scope (MUST NOT)
- MUST NOT: 保留旧的 33 家公司匹配系统
- MUST NOT: 修改现有视觉风格（保留深色金色+手绘边框）
- MUST NOT: 引入后端服务或数据库
- MUST NOT: 添加登录或历史记录功能

### Optional (MAY)
- MAY: 后续版本增加更多梗人设
- MAY: 增加人设收集/解锁机制
- MAY: 增加人设之间的对比功能

## Phase Overview
| Phase | Title | Description |
|-------|-------|-------------|
| PH-1 | 数据模型与人设配置 | 定义新的人设类型系统，创建 17 种人设配置，重写 12 道题目，建立人设注册中心 |
| PH-2 | 算分引擎与结果决策 | 实现人设权重聚合、SSR 概率触发、浓度检测和结果决策逻辑 |
| PH-3 | 结果页、图鉴与分享适配 | 更新结果页卡片展示、改造人设图鉴页面、适配分享海报、集成测试 |
