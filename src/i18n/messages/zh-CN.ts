import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "打开文档",
    open: "打开",
    opening: "正在打开…",
    readMore: "了解更多 →",
    seeMore: "查看更多",
    searchLanguage: "搜索国家或语言…",
    noLanguageResults: "没有匹配的语言",
    footerTagline: "无需安装的浏览器全能文档工具"
  },
  hero: {
    title: "免费在线文档编辑工具",
    subtitle: "无需安装，在浏览器中即可使用的强大文档查看与编辑工具",
    chipBrowser: "浏览器处理",
    chipInstant: "即刻开始",
    chipShortcut: "快捷操作",
    searchLabel: "您想找什么？",
    searchPlaceholder: "按工具名、功能或标签搜索",
    dropHint: "或将文件拖放到此处",
    cloudNote: "在浏览器中编辑和保存 — 无需安装",
    noResults: "没有结果，请尝试其他关键词。"
  },
  start: {
    title: "立即开始",
    desc: "选择任务即可跳转到最合适的界面。",
    more: "查看更多"
  },
  popular: {
    title: "最受欢迎的工具",
    desc: "用户首选的核心功能"
  },
  sections: {
    docTitle: "文档编辑",
    docDesc: "常用编辑工具集中在一处。",
    docSearch: "搜索结果 — 文档",
    aiTitle: "AI 工具",
    aiDesc: "摘要、翻译与文档对话。",
    aiSearch: "搜索结果 — AI",
    convertTitle: "转换与创建",
    convertDesc: "格式转换与新建文档一站式完成。",
    convertSearch: "搜索结果 — 转换",
    analyzeTitle: "文档分析",
    analyzeDesc: "结构、元数据与安全洞察。",
    analyzeSearch: "搜索结果 — 分析"
  },
  nav: {
    tools: "办公工具",
    updates: "更新",
    blog: "博客",
    myDocs: "我的文档",
    settings: "设置",
    updatesFooter: "更新日志"
  },
  updates: {
    title: "更新日志"
  },
  blog: {
    title: "博客",
    desc: "lofice 使用指南与技巧"
  }
} as Partial<import("../types").Messages>;

const zh_CN: import("../types").Messages = mergeMessages(en, patch);
export default zh_CN;
