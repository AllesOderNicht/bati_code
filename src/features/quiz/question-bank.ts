export type QuizSignalWeights = Record<string, number>;

export type QuestionOption = {
  id: string;
  label: string;
  dimensionWeights: QuizSignalWeights;
  companyWeights: QuizSignalWeights;
};

export type QuestionViewModel = {
  id: string;
  title: string;
  options: QuestionOption[];
};

export const questionBank: QuestionViewModel[] = [
  {
    id: "recharge",
    title: "周五晚上更想怎么回血？",
    options: [
      {
        id: "a",
        label: "约几个朋友来场夜宵复盘，聊到灵感上头",
        dimensionWeights: {
          expression: 2,
          collaboration: 1,
        },
        companyWeights: {
          tencent: 2,
          xiaohongshu: 1,
        },
      },
      {
        id: "b",
        label: "把收藏夹和桌面一起整理，重新掌控秩序",
        dimensionWeights: {
          order: 2,
          execution: 1,
        },
        companyWeights: {
          huawei: 2,
          bytedance: 1,
        },
      },
      {
        id: "c",
        label: "刷点有意思的新产品，顺手记几条观察",
        dimensionWeights: {
          curiosity: 2,
          productSense: 1,
        },
        companyWeights: {
          google: 2,
          meituan: 1,
        },
      },
      {
        id: "d",
        label: "窝在沙发里补番回血，谁也别叫我上线",
        dimensionWeights: {
          recovery: 2,
          autonomy: 1,
        },
        companyWeights: {
          bilibili: 2,
          nintendo: 1,
        },
      },
    ],
  },
  {
    id: "meeting",
    title: "一个临时需求拍过来，你第一反应是？",
    options: [
      {
        id: "a",
        label: "先问目标和影响面，再决定做法",
        dimensionWeights: {
          judgment: 2,
          collaboration: 1,
        },
        companyWeights: {
          alibaba: 2,
          amazon: 1,
        },
      },
      {
        id: "b",
        label: "先拆步骤，把时间线压出来",
        dimensionWeights: {
          execution: 2,
          order: 1,
        },
        companyWeights: {
          huawei: 2,
          bytedance: 1,
        },
      },
      {
        id: "c",
        label: "先看有没有更聪明的路径能省力",
        dimensionWeights: {
          efficiency: 2,
          productSense: 1,
        },
        companyWeights: {
          google: 2,
          meituan: 1,
        },
      },
      {
        id: "d",
        label: "先把坑点列清楚，避免返工爆炸",
        dimensionWeights: {
          riskControl: 2,
          execution: 1,
        },
        companyWeights: {
          microsoft: 2,
          huawei: 1,
        },
      },
    ],
  },
  {
    id: "workspace",
    title: "你的工位更像哪种画风？",
    options: [
      {
        id: "a",
        label: "两块屏幕加一堆便签，像在搭指挥台",
        dimensionWeights: {
          orchestration: 2,
          execution: 1,
        },
        companyWeights: {
          tencent: 2,
          alibaba: 1,
        },
      },
      {
        id: "b",
        label: "配色统一、物归原位，主打一个精致稳定",
        dimensionWeights: {
          order: 2,
          craft: 1,
        },
        companyWeights: {
          apple: 2,
          huawei: 1,
        },
      },
      {
        id: "c",
        label: "看起来随意，其实关键东西都秒拿到",
        dimensionWeights: {
          autonomy: 2,
          efficiency: 1,
        },
        companyWeights: {
          google: 2,
          nintendo: 1,
        },
      },
      {
        id: "d",
        label: "有点生活痕迹，但灵感来的时候特别能打",
        dimensionWeights: {
          creativity: 2,
          recovery: 1,
        },
        companyWeights: {
          xiaohongshu: 2,
          bilibili: 1,
        },
      },
    ],
  },
];
