import type {
  DimensionKey,
  Question,
  QuestionOption,
} from "../../domain/questions/types";

function option(
  id: string,
  label: string,
  tone: QuestionOption["tone"],
  dimensionWeights: Partial<Record<DimensionKey, number>>,
  keywords: string[],
  companyWeights: Record<string, number> = {},
): QuestionOption {
  return {
    id,
    label,
    tone,
    dimensionWeights,
    companyWeights,
    keywords,
  };
}

export const questionBank: Question[] = [
  {
    id: "q01",
    title: "周末朋友突然约你出门，但你已经有自己的安排了，你会？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "答应下来，朋友开口了就不好拒绝，自己的计划改天再说", "grounded", { peopleSense: 2, shipFast: 1 }, ["够朋友", "说改就改"], { tencent: 1, soul: 1, kuaishou: 1 }),
      option("b", "看看约的是什么，听着有意思就换计划", "grounded", { frontierDrive: 2, peopleSense: 1 }, ["看情况", "有意思就去"], { byte: 1, minimax: 1, bilibili: 1 }),
      option("c", "这次先不了，但会主动约好下次时间", "grounded", { systemThinking: 2, peopleSense: 1 }, ["先放一放", "约好下次"], { microsoft: 1, huawei: 1, ant: 1 }),
      option("d", "看当时心情，如果刚好做完手头的事就顺便去", "grounded", { commercialFocus: 2, shipFast: 1 }, ["随缘", "看心情走"], { meituan: 1, xiaomi: 1, liAuto: 1 }),
    ],
  },
  {
    id: "q02",
    title: "看到一个刚出的新 APP 或新剧，你一般会？",
    dimensionKey: "shipFast",
    options: [
      option("a", "直接下载或点开，好不好试了才知道", "grounded", { shipFast: 2, frontierDrive: 1 }, ["说试就试", "第一手体验"], { byte: 1, pdd: 1, meituan: 1 }),
      option("b", "先搜搜评价和口碑，确认值得花时间再说", "grounded", { commercialFocus: 2, systemThinking: 1 }, ["先看口碑", "不踩雷"], { jd: 1, amazon: 1, baidu: 1 }),
      option("c", "先问问身边朋友有没有人看过，一起聊更有意思", "grounded", { peopleSense: 2, commercialFocus: 1 }, ["一起聊才好玩", "等朋友一起"], { tencent: 1, bilibili: 1, kuaishou: 1 }),
      option("d", "加到收藏夹等有空再看，手上还有没追完的", "grounded", { systemThinking: 2, craftDepth: 1 }, ["先收藏", "不着急"], { netease: 1, microsoft: 1, adobe: 1 }),
    ],
  },
  {
    id: "q03",
    title: "帮朋友拍一张照片，你更在意什么？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "光线和角度要好看，起码让画面看着舒服", "grounded", { craftDepth: 2, systemThinking: 1 }, ["角度讲究", "画面舒服"], { apple: 1, dji: 1 }),
      option("b", "表情自然最重要，抓到真实的那一刻就够了", "grounded", { peopleSense: 2, shipFast: 1 }, ["自然真实", "抓到瞬间"], { kuaishou: 1, soul: 1, meta: 1 }),
      option("c", "找个有意思的背景或构图，拍出点不一样的感觉", "grounded", { frontierDrive: 2, craftDepth: 1 }, ["不走寻常路", "拍出新感觉"], { xiaohongshu: 1, xpeng: 1, openai: 1 }),
      option("d", "速战速决，多拍几张让对方自己挑", "grounded", { shipFast: 2, commercialFocus: 1 }, ["速战速决", "多拍几张"], { byte: 1, pdd: 1, amazon: 1 }),
    ],
  },
  {
    id: "q04",
    title: "你手机相册现在更接近哪种状态？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "按时间或主题分好了相册，想找什么很快能翻到", "grounded", { systemThinking: 2, craftDepth: 1 }, ["分类有序", "想找就找"], { huawei: 1, google: 1, microsoft: 1 }),
      option("b", "全堆在一起，要找的时候靠搜索或记忆", "grounded", { shipFast: 2, frontierDrive: 1 }, ["全堆一起", "靠搜索"], { byte: 1, xiaomi: 1, pdd: 1 }),
      option("c", "隔段时间整理一波，主要是删掉不满意的", "grounded", { craftDepth: 2, commercialFocus: 1 }, ["定期清理", "留好看的"], { apple: 1, adobe: 1, xiaohongshu: 1 }),
      option("d", "你觉得照片有自己的社交圈，它们会自己找到对的相册安顿下来", "absurd", { frontierDrive: 2, peopleSense: 1 }, ["照片自理", "相册自由"], { soul: 1, openai: 1, meta: 1 }),
    ],
  },
  {
    id: "q05",
    title: "路过一家从没见过的店，你第一反应？",
    dimensionKey: "frontierDrive",
    options: [
      option("a", "直接推门进去，有意思没意思看了才知道", "grounded", { frontierDrive: 2, shipFast: 1 }, ["直接进去", "看了再说"], { byte: 1, xpeng: 1 }),
      option("b", "先看看门口有没有介绍或评分，心里有数再进去", "grounded", { systemThinking: 2, commercialFocus: 1 }, ["先摸底", "有数再进"], { baidu: 1, amazon: 1, ant: 1 }),
      option("c", "拍个照或定位发给朋友，问问有没有人去过", "grounded", { peopleSense: 2, commercialFocus: 1 }, ["问问朋友", "发个定位"], { xiaohongshu: 1, tencent: 1, beike: 1 }),
      option("d", "扫一眼装修和氛围，合眼缘就进去坐坐", "grounded", { craftDepth: 2, frontierDrive: 1 }, ["看氛围", "合眼缘"], { apple: 1, dji: 1, netease: 1 }),
    ],
  },
  {
    id: "q06",
    title: "同一样东西在不同平台差了几十块，你会？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "挑最便宜的下单，能省一点是一点", "grounded", { commercialFocus: 2, shipFast: 1 }, ["挑最便宜", "能省则省"], { pdd: 1, meituan: 1 }),
      option("b", "比一比售后和物流，便宜不是唯一标准", "grounded", { systemThinking: 2, commercialFocus: 1 }, ["看售后", "综合考虑"], { jd: 1, amazon: 1, ant: 1 }),
      option("c", "哪个 APP 顺手就在哪买，懒得来回比了", "grounded", { shipFast: 2, craftDepth: 1 }, ["哪个顺手", "懒得比"], { byte: 1, xiaomi: 1, didi: 1 }),
      option("d", "看看朋友有没有推荐链接，顺手帮人攒个人情", "grounded", { peopleSense: 2, commercialFocus: 1 }, ["朋友链接", "顺手人情"], { tencent: 1, kuaishou: 1, beike: 1 }),
    ],
  },
  {
    id: "q07",
    title: "聚会上认识了一个挺聊得来的新朋友，之后你更可能？",
    dimensionKey: "peopleSense",
    options: [
      option("a", "加个联系方式，之后偶尔互动慢慢熟起来", "grounded", { peopleSense: 2, systemThinking: 1 }, ["慢慢熟", "偶尔互动"], { tencent: 1, beike: 1 }),
      option("b", "趁热打铁，当场就约下次一起玩的事", "grounded", { shipFast: 2, peopleSense: 1 }, ["趁热打铁", "当场约"], { byte: 1, meta: 1, boss: 1 }),
      option("c", "回去翻翻对方的社交主页，看看还有什么共同爱好", "grounded", { frontierDrive: 2, peopleSense: 1 }, ["看主页", "找共同爱好"], { xiaohongshu: 1, bilibili: 1, soul: 1 }),
      option("d", "在脑子里给TA建一份完整人物档案，包括隐藏超能力和命运支线", "absurd", { frontierDrive: 2, craftDepth: 1 }, ["人物档案", "命运支线"], { openai: 1, minimax: 1 }),
    ],
  },
  {
    id: "q08",
    title: "要去一个没去过的城市玩，出发前你怎么准备？",
    dimensionKey: "systemThinking",
    options: [
      option("a", "做个大致攻略，每天去哪心里有个框架", "grounded", { systemThinking: 2, craftDepth: 1 }, ["做攻略", "心里有数"], { huawei: 1, microsoft: 1 }),
      option("b", "只订好住的地方，其他到了再随机应变", "grounded", { shipFast: 2, frontierDrive: 1 }, ["大方向定好", "到了再说"], { byte: 1, xpeng: 1, didi: 1 }),
      option("c", "先算好大概预算，吃住玩分别能花多少", "grounded", { commercialFocus: 2, systemThinking: 1 }, ["算好预算", "分配清楚"], { jd: 1, alibaba: 1, amazon: 1 }),
      option("d", "搜搜当地博主的推荐，跟着本地人的路线走", "grounded", { peopleSense: 2, frontierDrive: 1 }, ["跟着博主", "本地推荐"], { xiaohongshu: 1, kuaishou: 1, ctrip: 1 }),
    ],
  },
  {
    id: "q09",
    title: "给自己选一个新手机壳，你最在意？",
    dimensionKey: "craftDepth",
    options: [
      option("a", "颜色和材质要顺眼，拿在手里要有质感", "grounded", { craftDepth: 2, peopleSense: 1 }, ["材质手感", "拿着有感觉"], { apple: 1, dji: 1, adobe: 1 }),
      option("b", "耐摔耐用就行，好不好看是其次", "grounded", { commercialFocus: 2, systemThinking: 1 }, ["耐用优先", "好用就好"], { huawei: 1, lenovo: 1, jd: 1 }),
      option("c", "选当季最新的款式或联名，过段时间再换新的", "grounded", { frontierDrive: 2, shipFast: 1 }, ["最新款式", "换着玩"], { minimax: 1, xpeng: 1, byte: 1 }),
      option("d", "让朋友推荐或者看看大家都在用什么", "grounded", { peopleSense: 2, shipFast: 1 }, ["朋友推荐", "大家在用"], { tencent: 1, soul: 1, kuaishou: 1 }),
    ],
  },
  {
    id: "q10",
    title: "突然多出一个完全空闲的下午，你最想？",
    dimensionKey: "frontierDrive",
    options: [
      option("a", "去一个之前一直想去但没去成的地方看看", "grounded", { frontierDrive: 2, shipFast: 1 }, ["去新地方", "一直想去"], { nvidia: 1, openai: 1, xpeng: 1 }),
      option("b", "在家把一直想整理的东西好好收拾一遍", "grounded", { systemThinking: 2, craftDepth: 1 }, ["在家整理", "慢慢收拾"], { microsoft: 1, huawei: 1, ant: 1 }),
      option("c", "约个朋友出来随便走走聊聊天", "grounded", { peopleSense: 2, shipFast: 1 }, ["约人出来", "走走聊聊"], { tencent: 1, meta: 1 }),
      option("d", "下载一个从没用过的 APP，随机跟着陌生人的推荐清单过完这个下午", "absurd", { frontierDrive: 2, peopleSense: 1 }, ["随机清单", "陌生人推荐"], { soul: 1, minimax: 1, bilibili: 1 }),
    ],
  },
  {
    id: "q11",
    title: "朋友想借你一样挺喜欢的东西，你心里第一反应？",
    dimensionKey: "commercialFocus",
    options: [
      option("a", "借啊，朋友之间不用计较这些", "grounded", { peopleSense: 2, shipFast: 1 }, ["爽快借", "不计较"], { tencent: 1, kuaishou: 1, soul: 1 }),
      option("b", "可以借，但会随口提一下什么时候还", "grounded", { systemThinking: 2, commercialFocus: 1 }, ["说好归还", "有始有终"], { ant: 1, huawei: 1, jd: 1 }),
      option("c", "看跟谁借的，不太熟的会有点犹豫", "grounded", { commercialFocus: 2, peopleSense: 1 }, ["看关系远近", "有点犹豫"], { alibaba: 1, beike: 1 }),
      option("d", "直接帮对方买一个新的，自己的不太想动", "grounded", { craftDepth: 2, commercialFocus: 1 }, ["买个新的", "自己的不动"], { apple: 1, dji: 1, nio: 1 }),
    ],
  },
  {
    id: "q12",
    title: "想学一样新东西（乐器、画画、做饭），你的风格更像？",
    dimensionKey: "shipFast",
    options: [
      option("a", "先上手试，不会的边做边查", "grounded", { shipFast: 2, frontierDrive: 1 }, ["先上手", "边做边学"], { byte: 1, pdd: 1, xiaomi: 1 }),
      option("b", "先看完一套完整教程，搞懂原理再动手", "grounded", { systemThinking: 2, craftDepth: 1 }, ["先搞懂原理", "完整教程"], { google: 1, baidu: 1 }),
      option("c", "找个会的朋友带着学，有人陪更有动力", "grounded", { peopleSense: 2, craftDepth: 1 }, ["找人一起", "有伴有动力"], { tencent: 1, bilibili: 1, soul: 1 }),
      option("d", "一个作品反复打磨到自己满意为止再做下一个", "grounded", { craftDepth: 2, systemThinking: 1 }, ["打磨到满意", "慢工细活"], { apple: 1, adobe: 1, dji: 1 }),
    ],
  },
];

export const demoQuestionBank = questionBank.slice(0, 3);
