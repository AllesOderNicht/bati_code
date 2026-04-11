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
    title: "周末早上醒来，你的第一反应是？",
    options: [
      option("a", "先烧一壶热水，泡杯茶慢慢规划今天干什么", { "penguin-water": 2, "zoo-director": 1, "blessed-puppy": 1 }, ["保温杯", "慢节奏"]),
      option("b", "打开手机看看有没有什么新消息、新活动", { "starry-eyes": 2, "wechat-dog": 1, "happy-drunk": 1 }, ["新鲜感", "信息敏感"]),
      option("c", "继续赖床，周末就是要什么都不干", { "magician": 1, "happy-drunk": 1, "gaming-ali": 1 }, ["佛系", "松弛"]),
      option("d", "立刻起来，闲着不如出去找点事做", { "didi-delivery": 2, "slash-bro": 1, "chrysanthemum-dancer": 1 }, ["闲不住", "行动派"]),
    ],
  },
  {
    id: "q02",
    title: "朋友群里突然有人发了一个拼团链接，你会？",
    options: [
      option("a", "帮忙砍一刀，举手之劳嘛", { "slash-bro": 2, "wechat-dog": 1, "blessed-puppy": 1 }, ["义气", "帮忙"]),
      option("b", "看看是什么东西，有意思就自己也买一个", { "starry-eyes": 1, "didi-delivery": 1, "gaming-ali": 1 }, ["好奇", "冲动消费"]),
      option("c", "默默看一眼就划走了，这种事不太想参与", { "heartless-ant": 2, "chrysanthemum-dancer": 1 }, ["冷静", "不跟风"]),
      option("d", "转发到其他群帮朋友拉人，顺便活跃一下气氛", { "wechat-dog": 2, "happy-drunk": 1, "zoo-director": 1 }, ["社交达人", "热心"]),
    ],
  },
  {
    id: "q03",
    title: "你手机里下载最多的是哪类 APP？",
    options: [
      option("a", "社交和聊天类，和朋友保持联系最重要", { "wechat-dog": 2, "happy-drunk": 1, "penguin-water": 1 }, ["社交控", "联系感"]),
      option("b", "游戏和二次元相关，快乐才是第一生产力", { "gacha-weeb": 2, "gaming-ali": 2, "happy-drunk": 1 }, ["游戏党", "为爱发电"]),
      option("c", "外卖、打车、生活服务类，效率就是一切", { "didi-delivery": 2, "penguin-water": 1, "slash-bro": 1 }, ["生活效率", "城市生存"]),
      option("d", "各种新出的 APP 都会下来试试，不好用再删", { "starry-eyes": 2, "chrysanthemum-dancer": 1, "zoo-director": 1 }, ["尝鲜控", "什么都试"]),
    ],
  },
  {
    id: "q04",
    title: "买东西时你最看重什么？",
    options: [
      option("a", "性价比，花最少的钱办最大的事", { "slash-bro": 2, "blessed-puppy": 1, "didi-delivery": 1 }, ["性价比", "精打细算"]),
      option("b", "品质和耐久度，宁可贵一点也要好用", { "chrysanthemum-dancer": 2, "heartless-ant": 1, "penguin-water": 1 }, ["品质控", "耐用优先"]),
      option("c", "看心情，喜欢就买，不纠结太多", { "happy-drunk": 1, "starry-eyes": 1, "gaming-ali": 1, "gacha-weeb": 1 }, ["随性", "不纠结"]),
      option("d", "先做功课，看完评测和对比再下单", { "heartless-ant": 2, "zoo-director": 1, "blessed-puppy": 1 }, ["理性消费", "做功课"]),
    ],
  },
  {
    id: "q05",
    title: "晚上 11 点了你还没睡，最可能在干什么？",
    options: [
      option("a", "在游戏里奋战，或者在追番、刷弹幕", { "gacha-weeb": 2, "gaming-ali": 2, "happy-drunk": 1 }, ["夜猫子", "深夜快乐"]),
      option("b", "和朋友在微信上聊天，不知不觉就到这个点了", { "wechat-dog": 2, "penguin-water": 1, "happy-drunk": 1 }, ["深夜话题", "聊不完"]),
      option("c", "在研究明天的计划或者复盘今天做的事", { "heartless-ant": 2, "blessed-puppy": 1, "chrysanthemum-dancer": 1 }, ["复盘", "计划控"]),
      option("d", "刷短视频或者看新出的什么东西，停不下来", { "starry-eyes": 2, "didi-delivery": 1, "slash-bro": 1 }, ["信息流", "停不下来"]),
    ],
  },
  {
    id: "q06",
    title: "你的朋友圈风格更接近？",
    options: [
      option("a", "经常发，什么开心的事都想分享", { "happy-drunk": 2, "wechat-dog": 2, "gacha-weeb": 1 }, ["分享欲", "记录生活"]),
      option("b", "偶尔发，只发自己觉得有意思的内容", { "penguin-water": 1, "zoo-director": 1, "chrysanthemum-dancer": 1, "heartless-ant": 1 }, ["精选内容", "低调"]),
      option("c", "基本不发，但会默默给朋友点赞", { "blessed-puppy": 2, "slash-bro": 1, "heartless-ant": 1 }, ["默默关注", "潜水党"]),
      option("d", "设置了三天可见，看心情发", { "gaming-ali": 2, "starry-eyes": 1, "didi-delivery": 1 }, ["边界感", "随性"]),
    ],
  },
  {
    id: "q07",
    title: "突然放假三天，你最想做什么？",
    options: [
      option("a", "约上朋友出去吃喝玩乐，假期就是要热闹", { "happy-drunk": 2, "wechat-dog": 1, "slash-bro": 1 }, ["热闹", "一起玩"]),
      option("b", "出门探索一个没去过的地方", { "starry-eyes": 2, "didi-delivery": 2, "chrysanthemum-dancer": 1 }, ["探索", "新地方"]),
      option("c", "在家躺平，打游戏看剧补觉", { "gacha-weeb": 2, "gaming-ali": 1, "magician": 1 }, ["宅", "充电"]),
      option("d", "把一直想做但没时间做的事情安排上", { "blessed-puppy": 2, "heartless-ant": 1, "zoo-director": 1, "penguin-water": 1 }, ["计划清单", "不浪费"]),
    ],
  },
  {
    id: "q08",
    title: "朋友遇到烦心事找你倾诉，你的反应是？",
    options: [
      option("a", "先听完，然后帮忙分析问题出在哪", { "heartless-ant": 2, "zoo-director": 1, "chrysanthemum-dancer": 1 }, ["理性分析", "找原因"]),
      option("b", "陪着聊，让对方先把情绪说出来最重要", { "penguin-water": 2, "wechat-dog": 1, "blessed-puppy": 1 }, ["陪伴", "情绪支持"]),
      option("c", "直接说「走，出去吃点好的，不开心就别想了」", { "happy-drunk": 2, "slash-bro": 1, "didi-delivery": 1 }, ["行动治愈", "不纠结"]),
      option("d", "默默给对方点了个外卖或者发了个红包", { "blessed-puppy": 1, "wechat-dog": 1, "gaming-ali": 1, "penguin-water": 1 }, ["默默关心", "实际行动"]),
    ],
  },
  {
    id: "q09",
    title: "如果你是一种动物，你觉得自己更像？",
    options: [
      option("a", "企鹅——看起来慢悠悠，其实内心很丰富", { "penguin-water": 2, "heartless-ant": 1, "blessed-puppy": 1 }, ["外冷内热", "低调"]),
      option("b", "小狗——热情、忠诚、看到朋友就摇尾巴", { "wechat-dog": 2, "blessed-puppy": 2, "slash-bro": 1 }, ["热情", "忠诚"]),
      option("c", "猫——独立、有自己的节奏、不太在意别人的看法", { "heartless-ant": 1, "gaming-ali": 2, "gacha-weeb": 1, "magician": 1 }, ["独立", "自我节奏"]),
      option("d", "猴子——好动、好奇、什么都想试", { "starry-eyes": 2, "didi-delivery": 1, "happy-drunk": 1, "gacha-weeb": 1 }, ["好动", "好奇心"]),
    ],
  },
  {
    id: "q10",
    title: "你觉得最理想的周末是？",
    options: [
      option("a", "和三五好友聚在一起，吃火锅打牌聊天", { "slash-bro": 2, "happy-drunk": 1, "wechat-dog": 1 }, ["朋友聚会", "烟火气"]),
      option("b", "一个人安安静静，泡杯茶看本书或者发呆", { "penguin-water": 2, "heartless-ant": 1, "magician": 1 }, ["独处", "安静"]),
      option("c", "在城市里到处逛，走到哪算哪", { "didi-delivery": 2, "starry-eyes": 1, "chrysanthemum-dancer": 1 }, ["随性探索", "城市漫步"]),
      option("d", "沉浸在自己的爱好里，可以是游戏、画画、写东西", { "gacha-weeb": 2, "gaming-ali": 1, "zoo-director": 1 }, ["沉浸式爱好", "心流"]),
    ],
  },
  {
    id: "q11",
    title: "别人夸你的时候，你最希望听到哪句？",
    options: [
      option("a", "「你这个人特别靠谱，什么事交给你都放心」", { "blessed-puppy": 2, "chrysanthemum-dancer": 1, "heartless-ant": 1 }, ["靠谱", "值得信赖"]),
      option("b", "「跟你在一起特别开心，笑点太合了」", { "happy-drunk": 2, "wechat-dog": 1, "slash-bro": 1 }, ["快乐制造机", "合拍"]),
      option("c", "「你怎么什么都懂一点，兴趣也太广了吧」", { "zoo-director": 2, "starry-eyes": 1, "gacha-weeb": 1 }, ["兴趣广", "博学"]),
      option("d", "「你做事好有效率，一般人真做不到这么快」", { "didi-delivery": 2, "heartless-ant": 1, "gaming-ali": 1 }, ["效率高", "执行力"]),
    ],
  },
  {
    id: "q12",
    title: "最后一题：选一个你最喜欢的 emoji",
    options: [
      option("a", "🔥 火焰——热情、能量、停不下来", { "starry-eyes": 2, "didi-delivery": 1, "chrysanthemum-dancer": 1, "gacha-weeb": 1 }, ["热情", "能量"]),
      option("b", "🍻 干杯——快乐、分享、一起嗨", { "happy-drunk": 2, "slash-bro": 1, "wechat-dog": 1 }, ["干杯", "分享快乐"]),
      option("c", "🐶 小狗——忠诚、可爱、暖暖的", { "blessed-puppy": 2, "wechat-dog": 1, "penguin-water": 1 }, ["忠诚", "温暖"]),
      option("d", "🎮 游戏手柄——好玩、自由、沉浸", { "gacha-weeb": 2, "gaming-ali": 2, "magician": 1 }, ["好玩", "自由"]),
    ],
  },
];

export const demoQuestionBank = questionBank.slice(0, 3);
