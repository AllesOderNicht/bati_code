import type { CompanyGovernanceProfile } from "../../domain/company/types";
import { companyBaseProfiles } from "./companyBaseProfiles";

const aliasMap: Record<string, string[]> = {
  byte: ["字节", "ByteDance"],
  baidu: ["Baidu"],
  alibaba: ["阿里", "Alibaba"],
  tencent: ["鹅厂", "Tencent"],
  pdd: ["PDD", "拼夕夕"],
  xiaohongshu: ["小红薯", "RED"],
  dji: ["DJI"],
  minimax: ["MiniMax"],
  meituan: ["美团"],
  kuaishou: ["快手"],
  jd: ["京东", "JD"],
  didi: ["滴滴", "DiDi"],
  bilibili: ["B站", "Bilibili"],
  huawei: ["华为", "Huawei"],
  xiaomi: ["小米", "Xiaomi"],
  netease: ["网易", "NetEase"],
  ant: ["蚂蚁", "Ant Group"],
  ctrip: ["携程", "Trip.com"],
  lenovo: ["联想", "Lenovo"],
  beike: ["贝壳"],
  boss: ["BOSS", "BOSS直聘"],
  liAuto: ["理想", "Li Auto"],
  nio: ["蔚来", "NIO"],
  xpeng: ["小鹏", "XPeng"],
  soul: ["Soul"],
  microsoft: ["Microsoft", "微软"],
  amazon: ["Amazon", "亚麻"],
  nvidia: ["英伟达", "NVIDIA"],
  google: ["Google", "谷歌"],
  meta: ["Facebook", "Meta"],
  apple: ["Apple", "苹果"],
  openai: ["OpenAI"],
  adobe: ["Adobe"],
};

export const companyGovernanceProfiles: CompanyGovernanceProfile[] =
  companyBaseProfiles.map((profile) => ({
    companyId: profile.id,
    isWhitelisted: true,
    isEnabled: true,
    riskNotes: [],
    preferredDisplayNameZh: profile.displayNameZh,
    aliases: aliasMap[profile.id] ?? [profile.displayNameZh],
  }));
