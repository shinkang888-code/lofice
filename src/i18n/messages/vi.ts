import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "Mở tài liệu",
    open: "Mở",
    searchLanguage: "Tìm quốc gia hoặc ngôn ngữ…"
  },
  hero: {
    title: "Công cụ tài liệu trực tuyến miễn phí",
    searchLabel: "Bạn đang tìm gì?",
    dropHint: "Hoặc kéo thả tệp vào đây"
  },
  start: {
    title: "Bắt đầu ngay",
    more: "Xem thêm"
  },
  nav: {
    tools: "Công cụ",
    updates: "Cập nhật",
    blog: "Blog",
    myDocs: "Tài liệu của tôi",
    settings: "Cài đặt"
  }
} as Partial<import("../types").Messages>;

const vi: import("../types").Messages = mergeMessages(en, patch);
export default vi;
