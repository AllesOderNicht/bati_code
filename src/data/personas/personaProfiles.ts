import type { PersonaProfile } from "../../domain/persona/types";

export const personaProfiles: PersonaProfile[] = [
  {
    id: "penguin-water",
    displayName: "爱喝开水的企鹅",
    rarity: "normal",
    relatedCompanies: ["美团", "腾讯"],
    memeOrigin: "开水团是美团的江湖绰号，企鹅是腾讯的吉祥物——你身上同时住着一只端保温杯的企鹅。",
    headline: "爱喝开水的企鹅",
    personaDescription:
      "你骨子里有一种稳稳的生活节奏感，不急不躁但什么都安排得妥妥的。同时你天然会照顾周围人的感受，像企鹅一样看起来慢悠悠，实际上水下脚蹼划得飞快。你的朋友圈里你永远是那个默默把事情办好、手里还端着热水的人。",
    keywords: ["保温杯人格", "稳中带暖", "生活节奏感", "社交恒温器"],
    reasonTemplate:
      "你的选择透露出一种把日子过得又顺又暖的能力，既懂安排又会照顾人——这不就是端着保温杯的企鹅本鹅吗。",
  },
  {
    id: "heartless-ant",
    displayName: "没有心跳的蚂蚁",
    rarity: "normal",
    relatedCompanies: ["字节跳动", "蚂蚁金服"],
    memeOrigin: "没有心「跳」戳的是字节跳动，蚂蚁指的是蚂蚁金服——你是一只冷静到连心跳都省了的蚂蚁。",
    headline: "没有心跳的蚂蚁",
    personaDescription:
      "你做事极度理性，别人还在纠结情绪的时候你已经把利弊算清楚了。你的冷静不是冷漠，而是一种自带 CPU 的高效处理模式。朋友都知道找你拿主意最靠谱，因为你永远不会被情绪带偏。",
    keywords: ["理性派", "冷静 CPU", "利弊清单", "反情绪化"],
    reasonTemplate:
      "你的答题轨迹显示出极强的理性偏好和条理感，情绪波动对你几乎没有干扰——标准的没有心跳的蚂蚁体质。",
  },
  {
    id: "wechat-dog",
    displayName: "爱玩微信的修狗",
    rarity: "normal",
    relatedCompanies: ["腾讯", "京东"],
    memeOrigin: "微信是腾讯的国民应用，修狗是京东吉祥物 Joy 的网络昵称——你是一只社交能力拉满的小狗。",
    headline: "爱玩微信的修狗",
    personaDescription:
      "你特别享受和朋友保持联系的感觉，群聊里你是最活跃的那个，朋友圈点赞从不缺席。同时你有一种靠谱的忠诚感，答应的事就一定办到。你的社交风格就像一只热情的小狗——看到谁都开心，但最忠诚的永远是自己人。",
    keywords: ["社交活跃", "忠诚靠谱", "群聊达人", "热情小狗"],
    reasonTemplate:
      "你的选择里充满了对社交联系和可靠承诺的偏好，活泼又靠谱——完美的微信修狗人格。",
  },
  {
    id: "chrysanthemum-dancer",
    displayName: "手捧菊花的舞者",
    rarity: "normal",
    relatedCompanies: ["华为", "字节跳动"],
    memeOrigin: "菊花是华为 Logo 的标志形象，舞者来自字节「跳动」——你是一个拿着硬核装备跳舞的人。",
    headline: "手捧菊花的舞者",
    personaDescription:
      "你身上有一种反差萌：看起来很扎实稳重，但骨子里节奏感极强。你既追求东西的品质和耐久度，又不甘于一成不变，总想在稳定的基础上搞点新花样。朋友对你的评价大概是——靠得住，但偶尔也很野。",
    keywords: ["反差萌", "硬核节奏", "稳中带浪", "品质与速度并存"],
    reasonTemplate:
      "你同时偏好扎实品质和快速节奏，这种稳重和跳脱的反差组合，就是手捧菊花跳舞的画面感。",
  },
  {
    id: "didi-delivery",
    displayName: "跑滴滴的外卖员",
    rarity: "normal",
    relatedCompanies: ["滴滴", "美团"],
    memeOrigin: "滴滴是出行平台，外卖员是美团的标志——你是一个永远在路上、停不下来的城市行者。",
    headline: "跑滴滴的外卖员",
    personaDescription:
      "你最怕的就是闲着没事干。你的生活永远排得满满当当，从一个地方赶到另一个地方，效率就是你的快乐源泉。你不挑活儿，什么都能适应，随遇而安但绝不慢悠悠。朋友约你最大的挑战是——你到底什么时候有空？",
    keywords: ["永远在路上", "闲不住", "效率狂", "城市游侠"],
    reasonTemplate:
      "你的答题风格透露出一种停不下来的行动力和适应力，忙碌本身就是你的舒适区——典型的跑滴滴的外卖员。",
  },
  {
    id: "slash-bro",
    displayName: "多砍几刀的铁子",
    rarity: "normal",
    relatedCompanies: ["拼多多", "快手"],
    memeOrigin: "砍一刀是拼多多的名场面，铁子/老铁是快手的社交暗号——你是一个又实在又讲义气的人。",
    headline: "多砍几刀的铁子",
    personaDescription:
      "你不喜欢虚的，追求实打实的性价比和兄弟义气。你买东西从来不看品牌只看值不值，交朋友也是一样——不看对方什么背景，合得来就是铁子。你的社交圈不大但个个都是真朋友，帮忙从来不含糊。",
    keywords: ["性价比之王", "铁子文化", "实在人", "义气满格"],
    reasonTemplate:
      "你的选择一直围绕着实惠和真诚两个关键词，不整虚的、只认实在——这就是多砍几刀的铁子精神。",
  },
  {
    id: "zoo-director",
    displayName: "开动物园的厂长",
    rarity: "normal",
    relatedCompanies: ["网易", "百度", "腾讯"],
    memeOrigin: "网易养猪、百度的熊掌标志、腾讯的企鹅——你管理着一整个互联网动物园。",
    headline: "开动物园的厂长",
    personaDescription:
      "你有一种天生的大管家气质，什么都想照顾到、什么都能兼顾。你的兴趣广泛到像在经营一个动物园——养猪的同时还能遛熊和逗企鹅。你不是某个单一领域的极致选手，但你是那个把所有事情都安排得井井有条的全能厂长。",
    keywords: ["全能管家", "兴趣杂食", "大局观", "什么都能兼顾"],
    reasonTemplate:
      "你的答题覆盖面特别广，不偏科不极端，每个方向都有涉猎——这种全面兼顾的气质，就是动物园厂长的格局。",
  },
  {
    id: "gacha-weeb",
    displayName: "熬夜抽卡的二次元鼻祖",
    rarity: "normal",
    relatedCompanies: ["网易", "bilibili"],
    memeOrigin: "网易是国内抽卡手游大户，bilibili 是二次元文化大本营——你是一个为爱发电到凌晨的人。",
    headline: "熬夜抽卡的二次元鼻祖",
    personaDescription:
      "你一旦喜欢上什么，投入的程度会让周围人震惊。你可以为一个冷门爱好研究到天亮，也可以为了抽到想要的角色氪到吃土。你的快乐不需要别人理解，但一旦遇到同好，你们能聊到宇宙尽头。你活在自己的热爱里，这本身就是一种超能力。",
    keywords: ["为爱氪金", "深夜战士", "兴趣浓度MAX", "同好就是一切"],
    reasonTemplate:
      "你的答题显示出极强的兴趣沉浸感和表达欲，一旦进入心流状态就不管时间——标准的熬夜抽卡二次元体质。",
  },
  {
    id: "blessed-puppy",
    displayName: "福报小狗",
    rarity: "normal",
    relatedCompanies: ["阿里", "京东"],
    memeOrigin: "福报是阿里的经典名言梗，小狗是京东吉祥物——你是一只努力到感动自己的小狗。",
    headline: "福报小狗",
    personaDescription:
      "你特别能吃苦也特别能坚持，别人觉得累的事情你反而觉得是一种修行。你有一种天然的忠诚感和使命感，一旦认定了方向就会一直跑下去。你相信付出总有回报，即使暂时看不到结果也不会停下脚步。朋友都说你是最靠谱的那个人。",
    keywords: ["坚持就是福报", "忠诚小狗", "使命感", "不言放弃"],
    reasonTemplate:
      "你的选择透露出强烈的坚持感和忠诚度，认准了就不回头——这不就是努力奔跑的福报小狗吗。",
  },
  {
    id: "gaming-ali",
    displayName: "爱玩游戏的阿里人",
    rarity: "normal",
    relatedCompanies: ["腾讯", "阿里"],
    memeOrigin: "腾讯是游戏帝国，阿里人以务实著称——你是一个看起来在搞正事、其实在偷偷玩游戏的人。",
    headline: "爱玩游戏的阿里人",
    personaDescription:
      "你表面上是那个最靠谱、最有规划的人，但私底下有一颗狂野的娱乐心。你白天把事情安排得井井有条，晚上就变成了另一个人——打游戏、追剧、刷视频，快乐得像脱了缰。你的双面人格不是矛盾，而是一种平衡的智慧。",
    keywords: ["白天搞事业晚上打游戏", "表里反差", "规划与放飞", "隐藏玩家"],
    reasonTemplate:
      "你同时展现出强烈的规划感和娱乐欲望，工作和玩乐切换自如——典型的爱玩游戏的阿里人格。",
  },
  {
    id: "starry-eyes",
    displayName: "你的眼里看到的全是星星",
    rarity: "normal",
    relatedCompanies: ["字节跳动"],
    memeOrigin: "100% 浓度暗示宇宙厂（字节跳动的江湖别名）——你的眼里全是星辰大海。",
    headline: "你的眼里看到的全是星星",
    personaDescription:
      "你天生对新鲜事物有极强的好奇心和热情，什么都想试、什么都想了解。你的精力仿佛是无限的，每天都活得像在探索一个新世界。你的朋友都羡慕你那双发光的眼睛——不管看到什么，你都能找到让自己兴奋的点。",
    keywords: ["好奇心无限", "星星眼", "探索欲爆棚", "什么都想试"],
    reasonTemplate:
      "你的每一个选择都充满了对新鲜感和可能性的追求，浓度拉满——你的眼里确实全是星星。",
  },
  {
    id: "happy-drunk",
    displayName: "开心的酒鬼",
    rarity: "normal",
    relatedCompanies: ["腾讯", "bilibili"],
    memeOrigin: "腾讯以上班开心著称，干杯是 bilibili 的经典弹幕文化——你是一个快乐到自带微醺的人。",
    headline: "开心的酒鬼",
    personaDescription:
      "你是那种走到哪里都能带来快乐的人，你的开心不是装出来的，而是一种天然的体质。你喜欢和朋友一起分享快乐，干杯是你最爱的仪式感。你相信人生苦短，不开心的事情不值得花时间——所以你把每一天都活成了小型庆功宴。",
    keywords: ["快乐体质", "干杯文化", "氛围担当", "天生乐观"],
    reasonTemplate:
      "你的选择充满了对快乐和分享的热爱，开心是你的默认状态——不折不扣的开心酒鬼。",
  },
  {
    id: "chosen-one",
    displayName: "天选打工人",
    rarity: "ssr",
    relatedCompanies: ["全部大厂"],
    memeOrigin: "SSR 级稀有人设——你是被互联网之神选中的打工人，适配所有大厂，走到哪里都能发光。",
    headline: "✦ 天选打工人 ✦",
    personaDescription:
      "恭喜你触发了隐藏人设！你是那种不管被放到什么环境都能适应的超级物种。你身上同时具备了所有大厂气质的精华：腾讯的社交感、字节的节奏感、阿里的大局观、美团的执行力……你不属于任何一家，你属于所有地方。这个结果的触发概率只有 1%，截图留念吧。",
    keywords: ["SSR", "全属性在线", "超级适配", "万能体质", "1%的天选"],
    reasonTemplate:
      "你的答题画像异常均衡，各个维度都有亮点——互联网之神选中了你，你就是那 1% 的天选打工人。",
    ssrBaseProbability: 0.01,
  },
  {
    id: "magician",
    displayName: "魔术师",
    rarity: "ssr",
    relatedCompanies: ["外企"],
    memeOrigin: "SSR 级稀有人设——佛尔思沃尔（Forceful）的音译梗，你是最佛系又最有力量的人，天生适合外企。",
    headline: "✦ 魔术师 ✦",
    personaDescription:
      "恭喜你触发了隐藏人设！你是那种看起来什么都不在意，但最后总能把事情变出最好结果的人。你的佛系不是摆烂，而是一种深层的自信——你知道自己不需要焦虑，因为该来的都会来。你的气质最适合外企那种松弛又高效的节奏。这个结果的触发概率只有 1%，你就是那个魔术师。",
    keywords: ["SSR", "佛系大佬", "松弛感", "四两拨千斤", "1%的魔术师"],
    reasonTemplate:
      "你的答题画像透露出一种罕见的松弛与从容，这种不焦虑的力量极为稀有——你就是那 1% 的魔术师。",
    ssrBaseProbability: 0.01,
  },
  {
    id: "pure-ali",
    displayName: "99.99%浓度的阿里人",
    rarity: "concentration",
    relatedCompanies: ["阿里"],
    memeOrigin: "你的测试结果几乎全部指向阿里气质，纯度高达 99.99%——你就是阿里本里。",
    headline: "99.99%浓度的阿里人",
    personaDescription:
      "你身上的阿里浓度已经到了无法稀释的程度。你天生有大局观，做选择时永远先看全局再看细节。你果断、务实、擅长在复杂局面里找到最优解。你的朋友可能已经习惯了你那种「我来安排」的气场——因为你安排的，确实都挺好。",
    keywords: ["阿里纯血", "大局观拉满", "果断务实", "99.99%浓度"],
    reasonTemplate:
      "你的绝大多数选择都高度一致地指向同一种气质——不用混搭了，你就是 99.99% 浓度的阿里人。",
    concentrationCompanyGroup: "alibaba",
  },
  {
    id: "pure-byte",
    displayName: "99.99%浓度的字节人",
    rarity: "concentration",
    relatedCompanies: ["字节跳动"],
    memeOrigin: "你的测试结果几乎全部指向字节气质，纯度高达 99.99%——你就是宇宙厂本厂。",
    headline: "99.99%浓度的字节人",
    personaDescription:
      "你身上的字节浓度已经到了无法稀释的程度。你对新鲜事物的嗅觉极其灵敏，节奏永远比周围人快半拍。你不怕变化，反而觉得不变才是最大的风险。你的朋友圈里你永远是第一个发现新梗、第一个用上新 App 的人。",
    keywords: ["字节纯血", "节奏拉满", "新鲜感猎手", "99.99%浓度"],
    reasonTemplate:
      "你的绝大多数选择都高度一致地指向同一种气质——不用混搭了，你就是 99.99% 浓度的字节人。",
    concentrationCompanyGroup: "byte",
  },
  {
    id: "pure-goose",
    displayName: "99.99%浓度的鹅",
    rarity: "concentration",
    relatedCompanies: ["腾讯"],
    memeOrigin: "鹅是腾讯的吉祥物，你的测试结果几乎全部指向腾讯气质——你就是鹅本鹅。",
    headline: "99.99%浓度的鹅",
    personaDescription:
      "你身上的腾讯浓度已经到了无法稀释的程度。你天然擅长维护关系、照顾氛围，走到哪里都能让人觉得舒服。你的社交直觉极强，知道什么时候该热情什么时候该留白。你的朋友圈里你是那个默默连接所有人的中间节点——标准的鹅本鹅。",
    keywords: ["鹅纯血", "社交天赋", "氛围大师", "99.99%浓度"],
    reasonTemplate:
      "你的绝大多数选择都高度一致地指向同一种气质——不用混搭了，你就是 99.99% 浓度的鹅。",
    concentrationCompanyGroup: "tencent",
  },
];
