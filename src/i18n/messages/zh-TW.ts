import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "開啟文件",
    open: "開啟",
    searchLanguage: "搜尋國家或語言…",
    footerTagline: "無需安裝的瀏覽器全能文件工具"
  },
  hero: {
    title: "免費線上文件編輯工具",
    searchLabel: "您想找什麼？",
    dropHint: "或將檔案拖放到此處"
  },
  start: {
    title: "立即開始",
    more: "查看更多"
  },
  nav: {
    tools: "辦公工具",
    updates: "更新",
    blog: "部落格",
    myDocs: "我的文件",
    settings: "設定"
  }
} as Partial<import("../types").Messages>;

const zh_TW: import("../types").Messages = mergeMessages(en, patch);
export default zh_TW;
