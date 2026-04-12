import type { Question, QuestionOption } from "../../domain/questions/types";

function option(
  id: string,
  label: string,
  personaWeights: Record<string, number>,
  keywords: string[],
): QuestionOption {
  return { id, label, personaWeights, keywords };
}

export const questionBank: Question[] = [
  {
    id: "q01",
    title: "周末下午突然有了一段空闲时间，你第一反应是？",
    options: [
      option("a", "约朋友出来坐坐，好久没聊了", { "wechat-dog": 3, "happy-drunk": 2, "slash-bro": 1, "blessed-puppy": 1 }, ["找朋友聊", "社交充电"]),
      option("b", "窝在家研究最近迷上的东西", { "gacha-weeb": 3, "gaming-ali": 2, "heartless-ant": 1 }, ["宅家研究", "沉浸式"]),
      option("c", "出门逛逛，看看有什么新发现", { "starry-eyes": 3, "didi-delivery": 2, "chrysanthemum-dancer": 1 }, ["出门探索", "新发现"]),
      option("d", "泡杯茶，安静看会儿书或收拾屋子", { "penguin-water": 3, "zoo-director": 1, "blessed-puppy": 1 }, ["安静独处", "慢节奏"]),
    ],
  },
  {
    id: "q02",
    title: "做一个重要决定的时候，你通常怎么做？",
    options: [
      option("a", "列出所有选项，逐条分析利弊", { "heartless-ant": 3, "chrysanthemum-dancer": 2, "blessed-puppy": 1 }, ["列清单", "理性分析"]),
      option("b", "跟着直觉走，想多了反而纠结", { "happy-drunk": 3, "didi-delivery": 2, "starry-eyes": 1 }, ["跟着直觉", "不纠结"]),
      option("c", "问问身边信任的朋友怎么看", { "wechat-dog": 3, "penguin-water": 1, "slash-bro": 2 }, ["问朋友", "信任圈"]),
      option("d", "先查资料做足功课，信息越多越安心", { "zoo-director": 3, "gaming-ali": 2, "gacha-weeb": 1 }, ["做功课", "广泛调研"]),
    ],
  },
  {
    id: "q03",
    title: "发现了一个新的兴趣爱好，你通常会？",
    options: [
      option("a", "一头扎进去，不知不觉研究到天亮", { "gacha-weeb": 3, "chrysanthemum-dancer": 2, "gaming-ali": 1 }, ["深度研究", "不知不觉天亮"]),
      option("b", "开心地拉朋友一起入坑", { "happy-drunk": 3, "wechat-dog": 2, "slash-bro": 1 }, ["拉朋友入坑", "分享快乐"]),
      option("c", "浅尝一下收藏起来，以后有空再说", { "starry-eyes": 3, "zoo-director": 2, "didi-delivery": 1 }, ["浅尝收藏", "好奇心"]),
      option("d", "默默享受，不太会主动跟别人说", { "penguin-water": 3, "heartless-ant": 2, "blessed-puppy": 1 }, ["默默享受", "独自品味"]),
    ],
  },
  {
    id: "q04",
    title: "买东西的时候，什么最能打动你？",
    options: [
      option("a", "便宜实惠，花小钱办大事", { "slash-bro": 3, "didi-delivery": 2, "blessed-puppy": 1 }, ["性价比", "不花冤枉钱"]),
      option("b", "做工精良，经得起长时间使用", { "chrysanthemum-dancer": 3, "heartless-ant": 2, "penguin-water": 1 }, ["做工精良", "品质优先"]),
      option("c", "好看或有趣，让人眼前一亮", { "gacha-weeb": 3, "starry-eyes": 2, "happy-drunk": 1 }, ["好看有趣", "为颜值买单"]),
      option("d", "口碑好评价高，大家说好才入手", { "zoo-director": 3, "wechat-dog": 1, "gaming-ali": 1, "blessed-puppy": 1 }, ["看口碑", "综合评判"]),
    ],
  },
  {
    id: "q05",
    title: "朋友遇到麻烦找你帮忙，你的第一反应是？",
    options: [
      option("a", "二话不说先赶到再说", { "blessed-puppy": 3, "slash-bro": 2, "didi-delivery": 1 }, ["二话不说", "义不容辞"]),
      option("b", "先问清楚情况再想怎么帮", { "heartless-ant": 3, "gaming-ali": 2, "chrysanthemum-dancer": 1 }, ["了解情况", "冷静判断"]),
      option("c", "陪着聊聊，有时候倾听比行动重要", { "penguin-water": 3, "wechat-dog": 2, "happy-drunk": 1 }, ["陪伴倾听", "温暖支持"]),
      option("d", "帮他想各种解决方案，多一个思路多一条路", { "zoo-director": 3, "starry-eyes": 2, "gacha-weeb": 1 }, ["想方案", "多角度"]),
    ],
  },
  {
    id: "q06",
    title: "你对生活节奏的理想状态是？",
    options: [
      option("a", "充实紧凑，每天排满才踏实", { "didi-delivery": 3, "blessed-puppy": 2, "chrysanthemum-dancer": 1 }, ["排满日程", "闲不住"]),
      option("b", "有规律但不紧张，按自己的节奏来", { "heartless-ant": 3, "penguin-water": 2, "zoo-director": 1 }, ["有规律", "按节奏来"]),
      option("c", "随性一点，不想被计划绑住", { "happy-drunk": 3, "starry-eyes": 2, "slash-bro": 1 }, ["随性自在", "不被绑住"]),
      option("d", "忙一阵歇一阵，松紧交替最舒服", { "gaming-ali": 3, "gacha-weeb": 2, "wechat-dog": 1 }, ["松紧交替", "张弛有度"]),
    ],
  },
  {
    id: "q07",
    title: "你最喜欢的获取信息的方式是？",
    options: [
      option("a", "刷短视频和热搜，什么火看什么", { "starry-eyes": 3, "didi-delivery": 1, "happy-drunk": 1, "slash-bro": 1 }, ["刷热搜", "追新鲜"]),
      option("b", "朋友推荐的，信得过的人说好才看", { "wechat-dog": 3, "slash-bro": 2, "blessed-puppy": 1 }, ["朋友推荐", "口碑信赖"]),
      option("c", "长文章、播客或纪录片，要有深度", { "chrysanthemum-dancer": 3, "heartless-ant": 2, "gacha-weeb": 1 }, ["深度内容", "有质量"]),
      option("d", "什么都看一点，涉猎面越广越好", { "zoo-director": 3, "penguin-water": 1, "gaming-ali": 2 }, ["广泛涉猎", "什么都看"]),
    ],
  },
  {
    id: "q08",
    title: "在社交场合中，你更像哪种角色？",
    options: [
      option("a", "气氛担当，负责让大家嗨起来", { "happy-drunk": 3, "slash-bro": 2, "wechat-dog": 1 }, ["气氛担当", "让大家嗨"]),
      option("b", "倾听者，大家都愿意跟你说心里话", { "penguin-water": 3, "blessed-puppy": 2, "wechat-dog": 1 }, ["倾听者", "让人安心"]),
      option("c", "旁观者，默默观察但不太主动搭话", { "gaming-ali": 3, "heartless-ant": 1, "gacha-weeb": 1, "chrysanthemum-dancer": 1 }, ["旁观者", "默默观察"]),
      option("d", "张罗的人，喜欢把大家安排得明明白白", { "didi-delivery": 3, "zoo-director": 2, "starry-eyes": 1 }, ["爱张罗", "安排达人"]),
    ],
  },
  {
    id: "q09",
    title: "你花钱时最容易在什么上面「上头」？",
    options: [
      option("a", "请朋友吃饭或者社交聚会", { "slash-bro": 3, "wechat-dog": 2, "happy-drunk": 1 }, ["请朋友吃饭", "义气消费"]),
      option("b", "限定款、联名款或者收藏品", { "gacha-weeb": 3, "starry-eyes": 2, "gaming-ali": 1 }, ["限定款", "为爱买单"]),
      option("c", "提升生活品质的好物", { "chrysanthemum-dancer": 3, "penguin-water": 1, "blessed-puppy": 2 }, ["提升品质", "生活美学"]),
      option("d", "很少冲动消费，基本都是计划好的", { "heartless-ant": 3, "didi-delivery": 2, "gaming-ali": 1 }, ["计划消费", "不冲动"]),
    ],
  },
  {
    id: "q10",
    title: "出去旅行你更喜欢哪种方式？",
    options: [
      option("a", "提前做好攻略，行程安排得明明白白", { "blessed-puppy": 3, "chrysanthemum-dancer": 2, "heartless-ant": 1 }, ["做攻略", "安排妥当"]),
      option("b", "说走就走，到了再看怎么玩", { "didi-delivery": 3, "starry-eyes": 1, "happy-drunk": 2 }, ["说走就走", "随时出发"]),
      option("c", "跟着朋友走就行，去哪都开心", { "wechat-dog": 3, "slash-bro": 2, "penguin-water": 1 }, ["跟朋友走", "一起开心"]),
      option("d", "边走边查，灵活调整路线", { "gaming-ali": 3, "zoo-director": 1, "gacha-weeb": 1, "starry-eyes": 1 }, ["边走边查", "灵活应变"]),
    ],
  },
  {
    id: "q11",
    title: "什么时候你会觉得特别满足？",
    options: [
      option("a", "通关了一个很难的游戏或者追完一部神作", { "gacha-weeb": 3, "gaming-ali": 1, "happy-drunk": 1, "heartless-ant": 1 }, ["通关满足", "沉浸心流"]),
      option("b", "发现了一个全新的领域并且入了门", { "zoo-director": 3, "starry-eyes": 1, "chrysanthemum-dancer": 1, "didi-delivery": 1 }, ["新领域", "入门探索"]),
      option("c", "和好朋友深聊到忘记时间", { "penguin-water": 3, "wechat-dog": 1, "happy-drunk": 1, "blessed-puppy": 1 }, ["深聊忘时间", "知心好友"]),
      option("d", "安安静静地做完一件手工或创作", { "blessed-puppy": 3, "slash-bro": 2, "chrysanthemum-dancer": 1 }, ["做到极致", "专注完成"]),
    ],
  },
  {
    id: "q12",
    title: "最后一题：选一个最能代表你的符号",
    options: [
      option("a", "🔥 火焰——停不下来的热情和能量", { "starry-eyes": 3, "didi-delivery": 2, "chrysanthemum-dancer": 1 }, ["热情能量", "停不下来"]),
      option("b", "🍻 干杯——朋友和快乐最重要", { "slash-bro": 3, "wechat-dog": 2, "happy-drunk": 1 }, ["朋友快乐", "干杯精神"]),
      option("c", "🐶 小狗——温暖、忠诚、让人安心", { "penguin-water": 3, "blessed-puppy": 1, "heartless-ant": 1, "zoo-director": 1 }, ["温暖忠诚", "安心力量"]),
      option("d", "🎮 游戏手柄——沉浸在自己的世界里", { "gacha-weeb": 3, "gaming-ali": 2, "zoo-director": 1 }, ["沉浸世界", "为爱发电"]),
    ],
  },
];

export const demoQuestionBank = questionBank.slice(0, 3);
