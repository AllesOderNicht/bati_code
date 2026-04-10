import type {
  DimensionKey,
  Question,
  QuestionOption,
} from "../../domain/questions/types";

function option(
  id: string,
  label: string,
  dimensionWeights: Partial<Record<DimensionKey, number>>,
  keywords: string[],
  companyWeights: Record<string, number> = {},
): QuestionOption {
  return {
    id,
    label,
    dimensionWeights,
    companyWeights,
    keywords,
  };
}

export const questionBank: Question[] = [
  {
    id: "q01",
    title: "周五晚上更想怎么回血？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "约几个朋友来场夜宵复盘，聊到灵感上头", { peopleSense: 2, shipFast: 1 }, ["热启动", "灵感流"], { byte: 1, tencent: 1, bilibili: 1 }),
      option("b", "把收藏夹和桌面一起整理，重新掌控秩序", { systemThinking: 2, craftDepth: 1 }, ["秩序感", "整理力"], { microsoft: 1, huawei: 1, baidu: 1 }),
      option("c", "刷点有意思的新产品，顺手记几条观察", { frontierDrive: 2, shipFast: 1 }, ["新东西雷达", "观察欲"], { minimax: 1, openai: 1, xiaohongshu: 1 }),
      option("d", "窝在沙发里补番回血，谁也别叫我上线", { craftDepth: 1, peopleSense: 1 }, ["慢充电", "自我恢复"], { netease: 1, netflix: 1, soul: 1 }),
    ],
  },
  {
    id: "q02",
    title: "一个临时需求拍过来，你第一反应是？",
    dimensionKey: "shipFast",
    options: [
      option("a", "先问目标和影响面，再决定做法", { systemThinking: 2, commercialFocus: 1 }, ["先看目标", "影响面"], { alibaba: 1, jd: 1, amazon: 1 }),
      option("b", "先拆步骤，把时间线压出来", { commercialFocus: 2, shipFast: 1 }, ["时间线", "推进感"], { pdd: 1, meituan: 1, amazon: 1 }),
      option("c", "先看有没有更聪明的路径能省力", { frontierDrive: 1, systemThinking: 1, shipFast: 1 }, ["省力解", "聪明路径"], { byte: 1, google: 1, xiaomi: 1 }),
      option("d", "先把坑点列清楚，避免返工爆炸", { craftDepth: 2, systemThinking: 1 }, ["避坑脑", "返工敏感"], { dji: 1, apple: 1, huawei: 1 }),
    ],
  },
  {
    id: "q03",
    title: "你的工位更像哪种画风？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "两块屏幕加一堆便签，像在搭指挥台", { systemThinking: 2, shipFast: 1 }, ["指挥台", "多线程"], { huawei: 1, microsoft: 1, lenovo: 1 }),
      option("b", "配色统一、物归原位，主打一个精致稳定", { craftDepth: 2, systemThinking: 1 }, ["精致稳定", "成品感"], { dji: 1, apple: 1, adobe: 1 }),
      option("c", "看起来随意，其实关键东西都秒拿到", { shipFast: 2, systemThinking: 1 }, ["秒响应", "高效率"], { byte: 1, pdd: 1, meituan: 1 }),
      option("d", "有点生活痕迹，但灵感来的时候特别能打", { peopleSense: 1, frontierDrive: 1, craftDepth: 1 }, ["灵感感", "有生活味"], { xiaohongshu: 1, bilibili: 1, netease: 1 }),
    ],
  },
  {
    id: "q04",
    title: "别人做完一个分享后，你最容易关注什么？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "结构顺不顺，一眼能不能跟上", { systemThinking: 2 }, ["结构感", "信息清晰"], { baidu: 1, google: 1 }),
      option("b", "风格稳不稳，有没有让人想截图", { craftDepth: 2, peopleSense: 1 }, ["画面感", "想截图"], { xiaohongshu: 1, adobe: 1, apple: 1 }),
      option("c", "有没有新角度，听完就想继续聊", { frontierDrive: 2, peopleSense: 1 }, ["新角度", "继续聊"], { minimax: 1, openai: 1, bilibili: 1 }),
      option("d", "结论能不能直接拿去做事", { commercialFocus: 2, shipFast: 1 }, ["拿来即用", "结论导向"], { pdd: 1, alibaba: 1, jd: 1 }),
    ],
  },
  {
    id: "q05",
    title: "进一个新群聊时，你通常先观察什么？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "谁是信息中心，谁来拍板", { systemThinking: 1, commercialFocus: 1 }, ["角色感", "拍板点"], { tencent: 1, boss: 1 }),
      option("b", "大家说话是不是轻松、真诚、好接梗", { peopleSense: 2 }, ["气氛敏感", "接梗"], { soul: 1, kuaishou: 1, meta: 1 }),
      option("c", "这个群里会不会很快跑出新东西", { shipFast: 2, frontierDrive: 1 }, ["快跑", "新东西"], { byte: 1, meta: 1, minimax: 1 }),
      option("d", "资料和沉淀有没有放得清清楚楚", { craftDepth: 1, systemThinking: 2 }, ["沉淀感", "资料整齐"], { microsoft: 1, yonyou: 1, huawei: 1 }),
    ],
  },
  {
    id: "q06",
    title: "如果给你一张前沿技术体验券，你会先想玩什么？",
    dimensionKey: "frontierDrive",
    options: [
      option("a", "看模型到底能不能把想法变成新工作流", { frontierDrive: 2, systemThinking: 1 }, ["模型工作流", "前沿试验"], { openai: 1, minimax: 1 }),
      option("b", "试试硬件性能上限能拉到什么程度", { frontierDrive: 2, craftDepth: 1 }, ["性能拉满", "硬核体验"], { nvidia: 1, dji: 1 }),
      option("c", "感受技术能不能真的改善真实生活", { commercialFocus: 1, frontierDrive: 1, peopleSense: 1 }, ["技术落地", "真实改善"], { iflytek: 1, xpeng: 1 }),
      option("d", "先看资料、demo 和 benchmark，再决定值不值得上手", { craftDepth: 1, systemThinking: 2 }, ["先看证据", "benchmark"], { sensetime: 1, google: 1 }),
    ],
  },
  {
    id: "q07",
    title: "做一个个人 side project，你最享受哪一步？",
    dimensionKey: "shipFast",
    options: [
      option("a", "起第一版，把想法先跑起来", { shipFast: 2 }, ["先上线", "有版本感"], { byte: 1, xiaomi: 1 }),
      option("b", "把底层结构搭顺，让后面不容易崩", { systemThinking: 2, craftDepth: 1 }, ["底层顺", "可持续"], { microsoft: 1, huawei: 1 }),
      option("c", "把视觉和细节抛光到很舒服", { craftDepth: 2 }, ["抛光", "舒服"], { adobe: 1, apple: 1 }),
      option("d", "看别人用了之后会怎么反馈和再创作", { peopleSense: 2, commercialFocus: 1 }, ["反馈回路", "再创作"], { xiaohongshu: 1, kuaishou: 1, tencent: 1 }),
    ],
  },
  {
    id: "q08",
    title: "你更容易被哪类问题吸住注意力？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "信息为什么会这样被组织起来", { systemThinking: 2, frontierDrive: 1 }, ["组织信息", "认知结构"], { google: 1, baidu: 1 }),
      option("b", "一个复杂系统为什么能稳定跑这么久", { systemThinking: 2, craftDepth: 1 }, ["系统稳定", "架构感"], { microsoft: 1, huawei: 1 }),
      option("c", "怎么把复杂功能讲给更多人听懂", { peopleSense: 2, systemThinking: 1 }, ["翻译能力", "讲清楚"], { tencent: 1, salesforce: 1 }),
      option("d", "如果换个路径，能不能更快抵达结果", { shipFast: 2, commercialFocus: 1 }, ["换路径", "更快到达"], { byte: 1, pdd: 1 }),
    ],
  },
  {
    id: "q09",
    title: "遇到特别复杂的线下流程时，你更像哪类人？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "先把人和环节都串起来，再逐个疏通", { commercialFocus: 2, peopleSense: 1 }, ["串流程", "疏通"], { meituan: 1, didi: 1 }),
      option("b", "先找关键瓶颈，别把精力撒太开", { commercialFocus: 2, systemThinking: 1 }, ["找瓶颈", "抓主轴"], { pdd: 1, amazon: 1 }),
      option("c", "先安顿好现场体验，别让人慌", { peopleSense: 2, commercialFocus: 1 }, ["现场感", "不慌"], { ctrip: 1, beike: 1 }),
      option("d", "先拉个板子，把状态全看见", { systemThinking: 2, craftDepth: 1 }, ["可视化", "全局感"], { jd: 1, yonyou: 1 }),
    ],
  },
  {
    id: "q10",
    title: "看到一个新内容爆了，你最先想到什么？",
    dimensionKey: "shipFast",
    options: [
      option("a", "这个反馈回路为什么这么顺", { shipFast: 2, commercialFocus: 1 }, ["反馈回路", "起量"], { byte: 1, netflix: 1 }),
      option("b", "它到底戳中了哪种人的表达欲", { peopleSense: 2 }, ["表达欲", "群体感"], { bilibili: 1, kuaishou: 1 }),
      option("c", "有没有可复用的结构或分发机制", { systemThinking: 2, commercialFocus: 1 }, ["机制感", "可复用"], { tencent: 1, google: 1 }),
      option("d", "如果再做一版，视觉和节奏还能怎么更顺", { craftDepth: 2, shipFast: 1 }, ["再做一版", "节奏优化"], { xiaohongshu: 1, apple: 1 }),
    ],
  },
  {
    id: "q11",
    title: "你心中的好生意更像哪种状态？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "规模起来以后仍然很能打", { commercialFocus: 2, systemThinking: 1 }, ["规模感", "还能打"], { amazon: 1, alibaba: 1 }),
      option("b", "从第一天起就知道最该盯什么", { commercialFocus: 2, shipFast: 1 }, ["盯关键", "聚焦"], { pdd: 1, meituan: 1 }),
      option("c", "体验稳、信任稳、关系也稳", { peopleSense: 2, craftDepth: 1 }, ["信任感", "稳体验"], { beike: 1, ant: 1 }),
      option("d", "技术和服务一起往上抬", { frontierDrive: 1, commercialFocus: 1, systemThinking: 1 }, ["技术增益", "服务放大"], { salesforce: 1, iflytek: 1 }),
    ],
  },
  {
    id: "q12",
    title: "朋友找你规划一次出行或大件体验时，你更像哪种顾问？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "先问你最在意哪段体验", { peopleSense: 2, craftDepth: 1 }, ["先问感受", "体验优先"], { ctrip: 1, liAuto: 1 }),
      option("b", "先把预算、时间、风险全算清楚", { systemThinking: 2, commercialFocus: 1 }, ["先算清楚", "风险感"], { ant: 1, beike: 1 }),
      option("c", "先给你一个能马上出发的方案", { shipFast: 2, commercialFocus: 1 }, ["马上出发", "先成行"], { tongcheng: 1, meituan: 1 }),
      option("d", "先想怎么让这次体验更有记忆点", { frontierDrive: 1, peopleSense: 1, craftDepth: 1 }, ["有记忆点", "体验设计"], { nio: 1, xiaohongshu: 1 }),
    ],
  },
  {
    id: "q13",
    title: "面试别人时，你最看重哪个瞬间？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "对方能不能把问题讲得很直给", { peopleSense: 1, commercialFocus: 1 }, ["直给表达", "不绕弯"], { boss: 1, salesforce: 1 }),
      option("b", "有没有自己的方法论，不只是会背答案", { systemThinking: 2 }, ["方法论", "不是背题"], { baidu: 1, microsoft: 1 }),
      option("c", "能不能看出他真的做过、跑过、扛过", { shipFast: 2, commercialFocus: 1 }, ["真做过", "能扛事"], { pdd: 1, byte: 1 }),
      option("d", "是不是愿意继续成长，眼里还有光", { frontierDrive: 1, peopleSense: 1 }, ["成长性", "眼里有光"], { minimax: 1, openai: 1 }),
    ],
  },
  {
    id: "q14",
    title: "你最偏爱的产品质感是哪一种？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "看起来轻松，但每个细节都很讲究", { craftDepth: 2 }, ["轻松但讲究", "细节在线"], { apple: 1, adobe: 1 }),
      option("b", "有生活方式气息，愿意让人停下来多看两眼", { craftDepth: 1, peopleSense: 2 }, ["生活方式", "愿意停留"], { xiaohongshu: 1, netease: 1 }),
      option("c", "工业完成度高，一上手就知道稳", { craftDepth: 2, systemThinking: 1 }, ["工业感", "一上手就稳"], { dji: 1, huawei: 1 }),
      option("d", "不一定花哨，但上手成本极低", { commercialFocus: 1, craftDepth: 1, shipFast: 1 }, ["低门槛", "马上会用"], { xiaomi: 1, tongcheng: 1 }),
    ],
  },
  {
    id: "q15",
    title: "看到一个工具类产品时，你最想吐槽或表扬哪一点？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "快捷键和信息架构做得真顺", { systemThinking: 2, craftDepth: 1 }, ["快捷键脑", "架构顺"], { microsoft: 1, kingsoft: 1 }),
      option("b", "细节舒服，像被认真照顾到了", { craftDepth: 2 }, ["被照顾感", "舒服"], { adobe: 1, apple: 1 }),
      option("c", "上手快，根本不用花很多解释成本", { shipFast: 2, commercialFocus: 1 }, ["上手快", "不用解释"], { xiaomi: 1, byte: 1 }),
      option("d", "能不能扛复杂场景，比漂亮更重要", { craftDepth: 1, systemThinking: 2 }, ["扛复杂", "稳定第一"], { huawei: 1, dji: 1 }),
    ],
  },
  {
    id: "q16",
    title: "如果让你接手一个老系统，你最想先做什么？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "画出依赖图，不然根本无从下手", { systemThinking: 2, craftDepth: 1 }, ["依赖图", "先摸清"], { jd: 1, amazon: 1 }),
      option("b", "先找最影响体验的那几个点", { commercialFocus: 2, shipFast: 1 }, ["先抓痛点", "影响体验"], { byte: 1, meituan: 1 }),
      option("c", "先补一层过渡方案，别让业务停摆", { commercialFocus: 1, peopleSense: 1, systemThinking: 1 }, ["过渡方案", "先稳住"], { lenovo: 1, yonyou: 1 }),
      option("d", "先看能不能顺手把工具链也升级一遍", { frontierDrive: 1, systemThinking: 1, craftDepth: 1 }, ["顺手升级", "工具链"], { google: 1, kingsoft: 1 }),
    ],
  },
  {
    id: "q17",
    title: "在服务型场景里，你最容易共情谁？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "被流程卡住、只想快点搞定的人", { commercialFocus: 2, peopleSense: 1 }, ["卡住了", "快解决"], { meituan: 1, tongcheng: 1 }),
      option("b", "对体验细节很敏感、会在意被不被照顾的人", { peopleSense: 2, craftDepth: 1 }, ["被照顾", "细节敏感"], { ctrip: 1, beike: 1 }),
      option("c", "愿意为专业方案多花一点时间的人", { craftDepth: 2, peopleSense: 1 }, ["专业方案", "不怕慢一点"], { liAuto: 1, ant: 1 }),
      option("d", "想知道这个系统背后到底是怎么跑起来的人", { systemThinking: 2 }, ["想看底层", "怎么跑起来"], { didi: 1, jd: 1 }),
    ],
  },
  {
    id: "q18",
    title: "你对“规则”最理想的感受是什么？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "清晰透明，让人知道边界在哪", { systemThinking: 2, peopleSense: 1 }, ["清晰边界", "透明"], { ant: 1, beike: 1 }),
      option("b", "够灵活，关键时刻别把人卡死", { peopleSense: 2, commercialFocus: 1 }, ["别卡死", "有人味"], { tencent: 1, salesforce: 1 }),
      option("c", "能服务增长，而不是只为了管理", { commercialFocus: 2, systemThinking: 1 }, ["服务增长", "不只管理"], { alibaba: 1, yonyou: 1 }),
      option("d", "最好还能反向积累成组织资产", { systemThinking: 2, craftDepth: 1 }, ["组织资产", "可积累"], { microsoft: 1, amazon: 1 }),
    ],
  },
  {
    id: "q19",
    title: "朋友找你开脑暴会时，你更常扮演什么角色？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "我来帮你找方向和路径", { commercialFocus: 1, systemThinking: 1, peopleSense: 1 }, ["找方向", "帮定路"], { alibaba: 1, salesforce: 1 }),
      option("b", "我来判断哪件事最值得先做", { commercialFocus: 2 }, ["先做什么", "优先级"], { pdd: 1, amazon: 1 }),
      option("c", "我来想有没有更新一点的打法", { frontierDrive: 2, shipFast: 1 }, ["更新打法", "别太旧"], { byte: 1, openai: 1 }),
      option("d", "我来保证想法能落在一个稳的框架里", { systemThinking: 2, craftDepth: 1 }, ["稳框架", "不跑偏"], { baidu: 1, huawei: 1 }),
    ],
  },
  {
    id: "q20",
    title: "当项目复杂到容易失控时，你更想抓哪根绳子？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "先抓总控盘和风险面", { systemThinking: 2, commercialFocus: 1 }, ["总控盘", "风险面"], { didi: 1, yonyou: 1 }),
      option("b", "先抓执行节奏，别停", { shipFast: 2, commercialFocus: 1 }, ["别停", "推进节奏"], { meituan: 1, pdd: 1 }),
      option("c", "先抓团队共识，不然容易散", { peopleSense: 2, systemThinking: 1 }, ["共识感", "别散"], { tencent: 1, boss: 1 }),
      option("d", "先抓质量底线，别把后面坑大了", { craftDepth: 2, systemThinking: 1 }, ["质量底线", "后面别炸"], { huawei: 1, dji: 1 }),
    ],
  },
  {
    id: "q21",
    title: "看到一篇很长的技术文档，你第一反应更像哪句心里话？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "先看目录，判断它的认知骨架", { systemThinking: 2 }, ["先看目录", "认知骨架"], { google: 1, baidu: 1 }),
      option("b", "先找关键结论，再决定要不要细读", { commercialFocus: 2, shipFast: 1 }, ["先看结论", "效率读法"], { byte: 1, pdd: 1 }),
      option("c", "如果写得很清楚，我会对作者瞬间加分", { craftDepth: 2, peopleSense: 1 }, ["表达清楚", "瞬间加分"], { microsoft: 1, adobe: 1 }),
      option("d", "我更想知道它背后解决了什么真实问题", { peopleSense: 1, commercialFocus: 1, frontierDrive: 1 }, ["真实问题", "别空转"], { iflytek: 1, salesforce: 1 }),
    ],
  },
  {
    id: "q22",
    title: "你更欣赏哪种团队气质？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "沟通直接，但彼此都很可靠", { peopleSense: 2, commercialFocus: 1 }, ["直接可靠", "说到做到"], { boss: 1, tencent: 1 }),
      option("b", "能一起磨产品，也愿意尊重体验细节", { craftDepth: 2, peopleSense: 1 }, ["一起磨", "尊重细节"], { apple: 1, xiaohongshu: 1 }),
      option("c", "目标感特别强，大家都知道往哪冲", { shipFast: 2, commercialFocus: 1 }, ["目标感", "往前冲"], { byte: 1, meituan: 1 }),
      option("d", "组织再复杂也能配合顺滑", { systemThinking: 2, peopleSense: 1 }, ["配合顺滑", "组织协同"], { salesforce: 1, beike: 1 }),
    ],
  },
  {
    id: "q23",
    title: "给你一个昂贵又复杂的新设备，你更想先试哪里？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "性能和极限能力到底有多顶", { frontierDrive: 2, craftDepth: 1 }, ["极限能力", "上限"], { nvidia: 1, huawei: 1 }),
      option("b", "常用场景是不是真的顺手", { craftDepth: 2, peopleSense: 1 }, ["顺手感", "常用场景"], { apple: 1, xiaomi: 1 }),
      option("c", "系统设置和底层逻辑是不是清清楚楚", { systemThinking: 2, craftDepth: 1 }, ["底层逻辑", "设置清楚"], { microsoft: 1, lenovo: 1 }),
      option("d", "有没有什么超出预期的新玩法", { frontierDrive: 2, shipFast: 1 }, ["新玩法", "超预期"], { xpeng: 1, minimax: 1 }),
    ],
  },
  {
    id: "q24",
    title: "面对一个增长机会，你最想先验证什么？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "是不是对准了真正有反应的人群", { commercialFocus: 1, peopleSense: 2 }, ["找对人", "真实反应"], { pdd: 1, xiaohongshu: 1 }),
      option("b", "投入产出比是不是够漂亮", { commercialFocus: 2 }, ["投入产出", "够不够划算"], { alibaba: 1, tongcheng: 1 }),
      option("c", "能不能很快做出第一轮反馈", { shipFast: 2, commercialFocus: 1 }, ["第一轮反馈", "先验证"], { byte: 1, pdd: 1 }),
      option("d", "后续放大时会不会卡在流程和系统上", { systemThinking: 2, commercialFocus: 1 }, ["放大成本", "系统卡点"], { amazon: 1, jd: 1 }),
    ],
  },
  {
    id: "q25",
    title: "如果未来三年只能深挖一种能力，你更想选哪类？",
    dimensionKey: "frontierDrive",
    options: [
      option("a", "和模型、算法、智能体一起进化", { frontierDrive: 2, systemThinking: 1 }, ["模型协作", "智能体"], { openai: 1, minimax: 1, nvidia: 1 }),
      option("b", "把复杂知识讲得更清楚、更有用", { peopleSense: 2, systemThinking: 1 }, ["讲清楚", "知识转译"], { iflytek: 1, salesforce: 1 }),
      option("c", "把产品和技术真正接到真实业务里", { commercialFocus: 2, frontierDrive: 1 }, ["技术转业务", "真落地"], { sensetime: 1, ant: 1 }),
      option("d", "把底层工具和系统继续磨深", { craftDepth: 2, systemThinking: 1 }, ["继续磨深", "底层工具"], { google: 1, microsoft: 1 }),
    ],
  },
  {
    id: "q26",
    title: "你对“稳定感”的理解更像哪种？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "规则清楚、边界清楚、风险看得见", { systemThinking: 2, craftDepth: 1 }, ["边界清楚", "风险可见"], { ant: 1, huawei: 1 }),
      option("b", "体验顺滑，用户几乎不用想太多", { craftDepth: 2, peopleSense: 1 }, ["体验顺滑", "不用多想"], { apple: 1, ctrip: 1 }),
      option("c", "组织再忙也能维持推进效率", { commercialFocus: 2, shipFast: 1 }, ["忙而不乱", "推进效率"], { meituan: 1, amazon: 1 }),
      option("d", "即使新事物很多，也能一直保有学习速度", { frontierDrive: 2, systemThinking: 1 }, ["学习速度", "不怕新"], { openai: 1, google: 1 }),
    ],
  },
  {
    id: "q27",
    title: "你发一条动态时，最希望收到哪种反馈？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "有人说这也太有共鸣了", { peopleSense: 2 }, ["有共鸣", "被接住"], { kuaishou: 1, soul: 1 }),
      option("b", "有人马上就去试了，并且回来告诉我结果", { shipFast: 2, commercialFocus: 1 }, ["马上试", "回来反馈"], { byte: 1, meituan: 1 }),
      option("c", "有人夸这个视角很新", { frontierDrive: 2 }, ["视角新", "脑洞"], { minimax: 1, bilibili: 1 }),
      option("d", "有人说内容和排版都很舒服", { craftDepth: 2, peopleSense: 1 }, ["排版舒服", "内容顺"], { xiaohongshu: 1, adobe: 1 }),
    ],
  },
  {
    id: "q28",
    title: "你最想把哪种能力练成“看家本领”？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "把复杂内容做得既深又好懂", { craftDepth: 2, peopleSense: 1 }, ["又深又好懂", "表达完成度"], { netease: 1, netflix: 1 }),
      option("b", "让产品一上线就有存在感", { shipFast: 2, frontierDrive: 1 }, ["上线即有感", "存在感"], { byte: 1, bilibili: 1 }),
      option("c", "把用户和社区关系经营得很稳", { peopleSense: 2, commercialFocus: 1 }, ["经营关系", "社区稳"], { tencent: 1, nio: 1 }),
      option("d", "把一个系统从工具变成习惯", { systemThinking: 2, commercialFocus: 1 }, ["从工具到习惯", "系统养成"], { microsoft: 1, adobe: 1 }),
    ],
  },
  {
    id: "q29",
    title: "如果做一辆理想中的智能车，你更想先把什么做到极致？",
    dimensionKey: "frontierDrive",
    options: [
      option("a", "新功能和科技体验一直有惊喜", { frontierDrive: 2, shipFast: 1 }, ["科技惊喜", "不断上新"], { xpeng: 1, nvidia: 1 }),
      option("b", "家庭和日常场景都特别顺手", { peopleSense: 2, craftDepth: 1 }, ["家庭顺手", "日常体验"], { liAuto: 1, apple: 1 }),
      option("c", "服务体系和用户关系都很完整", { peopleSense: 2, commercialFocus: 1 }, ["完整服务", "用户关系"], { nio: 1, beike: 1 }),
      option("d", "系统、传感和工程能力都很扎实", { systemThinking: 2, craftDepth: 1 }, ["工程扎实", "系统整合"], { huawei: 1, dji: 1 }),
    ],
  },
  {
    id: "q30",
    title: "如果把自己比作一个互联网角色，你更像哪种隐藏属性？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "社交场里能让陌生人迅速放松", { peopleSense: 2 }, ["让人放松", "轻社交"], { soul: 1, meta: 1 }),
      option("b", "新产品刚出来就忍不住去试", { frontierDrive: 2, shipFast: 1 }, ["试新快", "好奇心"], { meta: 1, minimax: 1 }),
      option("c", "大家乱的时候我能把节奏收回来", { commercialFocus: 2, systemThinking: 1 }, ["收节奏", "稳住局面"], { tencent: 1, salesforce: 1 }),
      option("d", "我不一定最吵，但总能在关键处给出有用判断", { craftDepth: 1, systemThinking: 1, peopleSense: 1 }, ["关键判断", "有用但不吵"], { baidu: 1, netease: 1 }),
    ],
  },
];

export const demoQuestionBank = questionBank.slice(0, 3);
