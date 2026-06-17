import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "เปิดเอกสาร",
    open: "เปิด",
    searchLanguage: "ค้นหาประเทศหรือภาษา…"
  },
  hero: {
    title: "เครื่องมือเอกสารออนไลน์ฟรี",
    searchLabel: "คุณกำลังมองหาอะไร?",
    dropHint: "หรือลากไฟล์มาวางที่นี่"
  },
  start: {
    title: "เริ่มทันที",
    more: "ดูเพิ่ม"
  },
  nav: {
    tools: "เครื่องมือ",
    updates: "อัปเดต",
    blog: "บล็อก",
    myDocs: "เอกสารของฉัน",
    settings: "การตั้งค่า"
  }
} as Partial<import("../types").Messages>;

const th: import("../types").Messages = mergeMessages(en, patch);
export default th;
