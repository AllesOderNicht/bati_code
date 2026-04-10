const COMPANY_LOGO_MODULES = import.meta.glob(
  "../../assets/cropped_characters_with_bg/*.png",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const COMPANY_LOGO_FILENAMES: Record<string, string> = {
  字节跳动: "01_ByteDance.png",
  百度: "02_Baidu.png",
  阿里巴巴: "03_Alibaba.png",
  腾讯: "04_Tencent.png",
  拼多多: "05_PDD.png",
  小红书: "06_Xiaohongshu.png",
  大疆: "07_DJI.png",
  MiniMax: "08_MiniMax.png",
  美团: "09_Meituan.png",
  快手: "10_Kuaishou.png",
  京东: "11_JD.png",
  滴滴: "12_DiDi.png",
  哔哩哔哩: "13_Bilibili.png",
  华为: "14_Huawei.png",
  小米: "15_Xiaomi.png",
  网易: "16_NetEase.png",
  蚂蚁集团: "17_Ant_Group.png",
  携程: "18_Trip_com.png",
  联想: "19_Lenovo.png",
  贝壳: "20_Beike.png",
  BOSS直聘: "21_BOSS_Zhipin.png",
  理想汽车: "25_Li_Auto.png",
  蔚来: "26_NIO.png",
  小鹏汽车: "27_XPeng.png",
  Soul: "28_Soul.png",
  微软: "31_Microsoft.png",
  亚马逊: "32_Amazon.png",
  NVIDIA: "33_NVIDIA.png",
  谷歌: "34_Google.png",
  苹果: "35_Apple.png",
  OpenAI: "36_OpenAI.png",
  Adobe: "38_Adobe.png",
};

export function getCompanyLogoUrl(displayNameZh: string) {
  const filename = COMPANY_LOGO_FILENAMES[displayNameZh];

  if (!filename) {
    return undefined;
  }

  return COMPANY_LOGO_MODULES[
    `../../assets/cropped_characters_with_bg/${filename}`
  ];
}

export function getCompanyLogoFallback(displayNameZh: string) {
  const asciiMatch = displayNameZh.match(/[A-Za-z]+/g);

  if (asciiMatch?.length) {
    return asciiMatch.join("").slice(0, 4).toUpperCase();
  }

  return displayNameZh.slice(0, 2);
}
