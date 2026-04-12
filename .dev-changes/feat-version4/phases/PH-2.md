# PH-2: 阈值调整、测试与验证

## Context Summary
PH-1 完成了题库重写和 keywords 对齐。本阶段负责调整浓度阈值、编写全面的权重分布自动化测试、更新受影响的现有测试，并验证全链路（答题→算分→结果）的正确性。

## Files to Modify
| File | Action | Purpose |
|------|--------|---------|
| `src/domain/scoring/concentrationDetect.ts` | MODIFY | 将 CONCENTRATION_THRESHOLD 从 0.35 降至 0.30 |
| `src/data/questions/questionBankValidation.ts` | MODIFY | 提升最低覆盖次数门槛从 3 到 8 |
| `src/data/questions/questionBankValidation.test.ts` | MODIFY | 更新测试以匹配新题库内容和新校验规则 |
| `src/domain/scoring/scorePersonaQuiz.test.ts` | MODIFY | 更新引用题库的测试用例 |
| `src/domain/scoring/ssrRoll.test.ts` | MODIFY | 更新引用题库的测试用例 |
| `src/domain/scoring/concentrationDetect.test.ts` | MODIFY | 调整测试以匹配新阈值 |
| `src/data/questions/questionBankWeightDistribution.test.ts` | CREATE | 新建权重分布自动化测试 |
| `src/App.test.tsx` | MODIFY | 更新 demoQuestionBank 相关断言 |

## Sub-tasks
- [ ] 2.1 将 CONCENTRATION_THRESHOLD 从 0.35 修改为 0.30
- [ ] 2.2 将 questionBankValidation 最低覆盖次数从 3 提升到 8
- [ ] 2.3 编写静态权重分布测试（总可获分均衡 < 20%、权重密度 3-5、出现次数 >= 8）
- [ ] 2.4 编写专属通路测试（为每个普通人设提供一组目标答案，验证稳定 Top1）
- [ ] 2.5 编写蒙特卡洛模拟测试（随机 10000 组答题，验证每个人设出现率在 1/12 ± 50%）
- [ ] 2.6 编写浓度可触发性测试和人设区分度测试
- [ ] 2.7 更新受影响的现有测试
- [ ] 2.8 运行全量测试套件，若模拟测试不均衡则回到 PH-1 微调权重

## Test Cases
| Test Name | Input | Expected Output |
|-----------|-------|-----------------|
| 总可获分均衡 | 统计所有人设的总可获分 | 最高/最低比值 < 1.2 |
| 权重密度检查 | 统计所有选项的人设数量 | 每选项 3-5 个人设 |
| 权重值域检查 | 检查所有 personaWeights 值 | 值均在 {1,2,3} 内 |
| 人设出现次数 | 统计每个人设出现的选项数 | 每个普通人设 >= 8 次 |
| 专属通路-penguin-water | 预设答案路径 | Top1 = penguin-water |
| 专属通路-heartless-ant | 预设答案路径 | Top1 = heartless-ant |
| （其余 10 个普通人设各一条通路测试） | ... | ... |
| 蒙特卡洛模拟 | 随机 10000 组答题 | 每个人设出现率在 4.2%-12.5% 范围内 |
| 浓度可触发性-阿里组 | 构造全选偏阿里的答案 | 阿里组浓度分 >= 0.30 |
| 浓度可触发性-字节组 | 构造全选偏字节的答案 | 字节组浓度分 >= 0.30 |
| 浓度可触发性-腾讯组 | 构造全选偏腾讯的答案 | 腾讯组浓度分 >= 0.30 |
| 相似人设区分 | penguin-water 通路答案 vs blessed-puppy 通路答案 | 结果不同 |
| 新阈值生效 | 使用 0.30-0.35 之间的浓度分 | 应触发浓度结果 |

### Test Pseudo-code
```ts
test('total obtainable scores are balanced (max/min < 1.2)', () => {
  const totals = computeTotalScoresPerPersona(questionBank);
  const values = Object.values(totals);
  expect(Math.max(...values) / Math.min(...values)).toBeLessThan(1.2);
});

test('each normal persona has a dedicated path leading to Top1', () => {
  for (const [personaId, answers] of Object.entries(DEDICATED_PATHS)) {
    const ranked = scorePersonaQuiz(answers, questionBank);
    expect(ranked[0].personaId).toBe(personaId);
  }
});

test('monte carlo: all personas appear within acceptable range', () => {
  const counts = new Map<string, number>();
  for (let i = 0; i < 10000; i++) {
    const answers = generateRandomAnswers(questionBank);
    const ranked = scorePersonaQuiz(answers, questionBank);
    if (ranked.length > 0) {
      counts.set(ranked[0].personaId, (counts.get(ranked[0].personaId) ?? 0) + 1);
    }
  }
  for (const [personaId, count] of counts) {
    const rate = count / 10000;
    expect(rate).toBeGreaterThan(0.042); // 1/12 * 0.5
    expect(rate).toBeLessThan(0.125);    // 1/12 * 1.5
  }
});

test('concentration is triggerable for each company group', () => {
  for (const [group, answers] of Object.entries(CONCENTRATION_PATHS)) {
    const ranked = scorePersonaQuiz(answers, questionBank);
    const result = detectConcentration(ranked);
    expect(result.triggered).toBe(true);
    expect(result.companyGroup).toBe(group);
  }
});
```

## Edge Cases
- 新阈值可能导致之前不触发的答题组合现在触发浓度结果
- 现有测试中硬编码的答案或预期值可能与新题库冲突
- demoQuestionBank 的选项标签变化可能影响 App.test.tsx 的断言

## No-Touch List
| Item | Reason |
|------|--------|
| 算分引擎核心逻辑 | 只改阈值，不改算法 |
| UI 组件和样式 | 不在范围内 |
| 人设文案字段 | PH-1 只改了 keywords |

## TDD Approach
| Sub-task | RED: Test to Write First | GREEN: Minimal Implementation |
|----------|--------------------------|------------------------------|
| 2.1 | 写阈值断言测试 | 修改常量值 |
| 2.2 | 写覆盖次数断言 | 修改校验函数 |
| 2.3 | 先写全部权重分布测试（会失败因为还没运行） | 运行并确认通过 |
| 2.4 | 检查现有测试失败项 | 逐一修复 |
| 2.5 | 运行全量测试 | 修复剩余问题 |
