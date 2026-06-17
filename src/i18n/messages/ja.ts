import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = {
  common: {
    openDocument: "ドキュメントを開く",
    open: "開く",
    opening: "開いています…",
    readMore: "詳細を見る →",
    seeMore: "もっと見る",
    searchLanguage: "国または言語を検索…",
    noLanguageResults: "該当する言語がありません",
    footerTagline: "インストール不要のオールインワン文書ツール"
  },
  hero: {
    title: "無料オンライン文書編集ツール",
    subtitle: "ブラウザですぐ使える強力な文書ビューア・エディター",
    chipBrowser: "ブラウザ処理",
    chipInstant: "すぐに開始",
    chipShortcut: "クイックアクション",
    searchLabel: "何をお探しですか？",
    searchPlaceholder: "ツール名・機能・ハッシュタグで検索",
    dropHint: "またはファイルをここにドロップ",
    cloudNote: "ブラウザで編集・保存 — インストール不要",
    noResults: "結果がありません。別のキーワードをお試しください。"
  },
  workspace: {
    title: "編集から始める",
    desc: "文書を開いてすぐ編集。表示・注釈・書式・エクスポートまで。",
    upload: "クリックまたはドラッグしてアップロード",
    openLoffice: "Lofficeを開く",
    viewTools: "編集ツールを見る"
  },
  start: {
    title: "すぐに作業開始",
    desc: "作業を選ぶと最適な画面へ移動します。",
    more: "もっと見る"
  },
  nova: {
    title: "統合ドキュメントハブ",
    desc: "より多くの文書機能を一か所から開始。",
    openDocs: "マイドキュメントを開く →",
    tagAiChat: "AIチャット",
    tagDocWork: "文書作業",
    tagTranslate: "翻訳"
  },
  popular: {
    title: "人気のツール",
    desc: "多くのユーザーが選ぶ機能"
  },
  sections: {
    docTitle: "文書編集",
    docDesc: "よく使う編集ツールを一か所に。",
    docSearch: "検索結果 — 文書",
    aiTitle: "AIツール",
    aiDesc: "要約・翻訳・文書チャットで作業を加速。",
    aiSearch: "検索結果 — AI",
    convertTitle: "変換・作成",
    convertDesc: "フォーマット変換と新規作成を一度に。",
    convertSearch: "検索結果 — 変換",
    analyzeTitle: "文書分析",
    analyzeDesc: "構造・メタデータ・セキュリティを深く分析。",
    analyzeSearch: "検索結果 — 分析"
  },
  nav: {
    tools: "オフィスツール",
    updates: "アップデート",
    blog: "ブログ",
    myDocs: "マイ文書",
    settings: "設定",
    updatesFooter: "リリースノート"
  },
  updates: {
    title: "リリースノート"
  },
  blog: {
    title: "ブログ",
    desc: "loficeガイドとヒント"
  }
} as Partial<import("../types").Messages>;

const ja: import("../types").Messages = mergeMessages(en, patch);
export default ja;
