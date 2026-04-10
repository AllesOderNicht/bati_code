import type { CompanyCopyProfile } from "../../domain/company/types";

const defaultTemplates = [
  "你在 {dimension} 这一项上的命中感很强，所以很容易呈现出这家公司的典型气质。",
  "当 {keyword} 这种状态出现时，你的选择会更像这一路线的做事方式。",
];

type CopySeed = Omit<CompanyCopyProfile, "explanationTemplates">;

const copySeeds: CopySeed[] = [
  { companyId: "byte", headline: "你像字节派", personaDescription: "你对反馈和节奏特别敏感，脑子里总有下一版要怎么更顺的冲动。", keywords: ["推进快", "内容感", "反应在线"] },
  { companyId: "baidu", headline: "你像百度派", personaDescription: "你更像那种先把信息摸清，再用方法把问题压住的人。", keywords: ["方法派", "信息密度", "技术底盘"] },
  { companyId: "alibaba", headline: "你像阿里派", personaDescription: "你天然会从业务结构和资源协同去看问题，越复杂越能找到路径。", keywords: ["商业感", "组织力", "平台思维"] },
  { companyId: "tencent", headline: "你像腾讯派", personaDescription: "你做事有连接感，既会顾及合作体验，也知道怎样把产品打磨得更稳。", keywords: ["连接感", "协作向", "产品稳"] },
  { companyId: "pdd", headline: "你像拼多多派", personaDescription: "你很看重结果落地，脑海里常常是怎么更快把关键指标推上去。", keywords: ["结果导向", "极致效率", "增长脑"] },
  { companyId: "xiaohongshu", headline: "你像小红书派", personaDescription: "你对氛围、审美和生活方式信号很敏锐，天然知道什么会让人愿意分享。", keywords: ["审美感", "社区感", "生活方式"] },
  { companyId: "dji", headline: "你像大疆派", personaDescription: "你喜欢把产品打磨到真正顺手，成品感和完成度对你很重要。", keywords: ["硬核打磨", "工程感", "完成度"] },
  { companyId: "minimax", headline: "你像 MiniMax 派", personaDescription: "你会被新技术和新想象点燃，尤其擅长把前沿感变成有画面的体验。", keywords: ["模型感", "前沿感", "想象力"] },
  { companyId: "meituan", headline: "你像美团派", personaDescription: "你有很强的地面执行感，擅长把复杂链路拆成能跑起来的动作。", keywords: ["地面感", "执行力", "本地服务"] },
  { companyId: "kuaishou", headline: "你像快手派", personaDescription: "你身上有一种真实又松弛的能量，能把内容和人之间的温度接起来。", keywords: ["真实感", "社区温度", "内容生命力"] },
  { companyId: "jd", headline: "你像京东派", personaDescription: "你信任可靠的交付和清晰的链路，属于越大盘越能稳住的人。", keywords: ["供应链感", "靠谱交付", "效率派"] },
  { companyId: "didi", headline: "你像滴滴派", personaDescription: "你很会处理实时变化的场景，遇到复杂调度反而会更进入状态。", keywords: ["调度感", "实时决策", "城市流动"] },
  { companyId: "bilibili", headline: "你像哔哩哔哩派", personaDescription: "你有很强的兴趣表达欲，愿意为热爱投入时间，也能带出社群氛围。", keywords: ["兴趣浓度", "表达欲", "社群气质"] },
  { companyId: "huawei", headline: "你像华为派", personaDescription: "你看问题会天然下沉到底层，喜欢搭真正经得住时间的能力。", keywords: ["系统硬实力", "长期主义", "底层能力"] },
  { companyId: "xiaomi", headline: "你像小米派", personaDescription: "你擅长在体验和效率之间找到平衡，让复杂产品变得更容易亲近。", keywords: ["产品亲和", "效率感", "生态协同"] },
  { companyId: "netease", headline: "你像网易派", personaDescription: "你有稳定的品味和节奏，不一定最吵，但总能把细节做得很顺。", keywords: ["审美稳定", "内容品味", "节奏从容"] },
  { companyId: "ant", headline: "你像蚂蚁派", personaDescription: "你自带一种风控和系统感，喜欢把复杂问题变成可信的规则。", keywords: ["金融科技", "风控感", "系统稳"] },
  { companyId: "ctrip", headline: "你像携程派", personaDescription: "你很懂服务体验的微妙之处，细节顺不顺会直接影响你的判断。", keywords: ["服务体验", "行程感", "细节控"] },
  { companyId: "lenovo", headline: "你像联想派", personaDescription: "你偏稳健协同型，擅长在多线程资源里保持整体交付。", keywords: ["全球交付", "硬件协同", "稳健派"] },
  { companyId: "beike", headline: "你像贝壳派", personaDescription: "你重视信任和流程透明，喜欢把服务链路做得让人放心。", keywords: ["服务链路", "用户信任", "流程感"] },
  { companyId: "boss", headline: "你像 BOSS 直聘派", personaDescription: "你说话和做事都偏直接有效，喜欢把机会和沟通成本同时拉低。", keywords: ["沟通效率", "机会连接", "直给感"] },
  { companyId: "yonyou", headline: "你像用友派", personaDescription: "你适合把流程和管理问题慢慢理顺，是典型的企业服务脑。", keywords: ["企业服务", "流程治理", "管理感"] },
  { companyId: "sensetime", headline: "你像商汤派", personaDescription: "你对视觉和模型世界有天然兴趣，喜欢把前沿能力往实际场景里推。", keywords: ["视觉智能", "科研感", "前沿底座"] },
  { companyId: "kingsoft", headline: "你像金山派", personaDescription: "你偏长期打磨型，愿意在工具和软件体验上慢慢把基本功做深。", keywords: ["工具感", "软件功底", "长期打磨"] },
  { companyId: "liAuto", headline: "你像理想派", personaDescription: "你很懂场景叙事，既会看体验也会看一个产品在真实生活里顺不顺。", keywords: ["家庭场景", "体验驱动", "产品叙事"] },
  { companyId: "nio", headline: "你像蔚来派", personaDescription: "你有很强的用户关系意识，愿意把服务和社区经营得更有温度。", keywords: ["用户运营", "服务感", "社区连接"] },
  { companyId: "xpeng", headline: "你像小鹏派", personaDescription: "你对新功能和前沿科技很来电，喜欢那种产品不断冒出新可能的感觉。", keywords: ["科技感", "自动驾驶", "新功能控"] },
  { companyId: "soul", headline: "你像 Soul 派", personaDescription: "你更在意表达有没有被接住，轻松和真诚对你来说很重要。", keywords: ["情绪连接", "表达自由", "轻社交"] },
  { companyId: "tongcheng", headline: "你像同程派", personaDescription: "你偏实用和顺手派，希望一切流程都能简单、稳定、少拐弯。", keywords: ["效率出行", "服务顺滑", "实用派"] },
  { companyId: "iflytek", headline: "你像讯飞派", personaDescription: "你会被技术转化成实际场景的那一刻打动，尤其在语音与教育方向。", keywords: ["语音智能", "教育科技", "技术转化"] },
  { companyId: "microsoft", headline: "你像微软派", personaDescription: "你自带一种平台和生产力气质，喜欢让系统更稳定、更通用、更耐用。", keywords: ["系统搭建", "生产力", "平台气质"] },
  { companyId: "amazon", headline: "你像亚马逊派", personaDescription: "你执行很强，也习惯在规模和成本之间快速做权衡。", keywords: ["规模执行", "基础设施", "结果导向"] },
  { companyId: "nvidia", headline: "你像 NVIDIA 派", personaDescription: "你看重性能上限和底层能力，越硬核的前沿问题越能激起你的兴趣。", keywords: ["算力引擎", "硬核前沿", "性能脑"] },
  { companyId: "google", headline: "你像谷歌派", personaDescription: "你对信息组织和工程理想有天然好感，喜欢从系统层把事情做漂亮。", keywords: ["信息组织", "工程理想", "探索欲"] },
  { companyId: "meta", headline: "你像 Meta 派", personaDescription: "你愿意大胆实验新产品，也擅长从连接和互动里找到机会。", keywords: ["连接世界", "产品实验", "社交底色"] },
  { companyId: "apple", headline: "你像苹果派", personaDescription: "你重视一体化完成度，喜欢那种简洁但处处有控制感的体验。", keywords: ["审美完成度", "产品整合", "细节控制"] },
  { companyId: "openai", headline: "你像 OpenAI 派", personaDescription: "你会被大模型和新范式的突破感激发，脑海里总有下一步想象。", keywords: ["前沿想象", "模型突破", "研究驱动"] },
  { companyId: "netflix", headline: "你像 Netflix 派", personaDescription: "你很会判断什么值得直接推进，表达清晰、节奏果断。", keywords: ["内容工业", "体验直接", "决策清晰"] },
  { companyId: "adobe", headline: "你像 Adobe 派", personaDescription: "你擅长在创意和工作流之间搭桥，既讲完成度也讲可用性。", keywords: ["创意工具", "工作流", "打磨稳定"] },
  { companyId: "salesforce", headline: "你像 Salesforce 派", personaDescription: "你很懂关系管理和平台协同，能把增长和组织配合一起盘顺。", keywords: ["企业增长", "关系管理", "平台协同"] },
];

export const companyCopyProfiles: CompanyCopyProfile[] = copySeeds.map((seed) => ({
  ...seed,
  explanationTemplates: defaultTemplates,
}));
