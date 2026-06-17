#!/usr/bin/env node
/**
 * 다국어 메시지 팩 생성 — en.ts 기반 + 언어별 UI 번역 오버라이드
 * 실행: node scripts/generate-i18n-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/i18n/messages");

const UI = {
  ja: {
    common: {
      openDocument: "ドキュメントを開く",
      open: "開く",
      opening: "開いています…",
      readMore: "詳細を見る →",
      seeMore: "もっと見る",
      searchLanguage: "国または言語を検索…",
      noLanguageResults: "該当する言語がありません",
      footerTagline: "インストール不要のオールインワン文書ツール",
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
      noResults: "結果がありません。別のキーワードをお試しください。",
    },
    workspace: {
      title: "編集から始める",
      desc: "文書を開いてすぐ編集。表示・注釈・書式・エクスポートまで。",
      upload: "クリックまたはドラッグしてアップロード",
      openLoffice: "Lofficeを開く",
      viewTools: "編集ツールを見る",
    },
    start: { title: "すぐに作業開始", desc: "作業を選ぶと最適な画面へ移動します。", more: "もっと見る" },
    nova: {
      title: "統合ドキュメントハブ",
      desc: "より多くの文書機能を一か所から開始。",
      openDocs: "マイドキュメントを開く →",
      tagAiChat: "AIチャット",
      tagDocWork: "文書作業",
      tagTranslate: "翻訳",
    },
    popular: { title: "人気のツール", desc: "多くのユーザーが選ぶ機能" },
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
      analyzeSearch: "検索結果 — 分析",
    },
    nav: { tools: "オフィスツール", updates: "アップデート", blog: "ブログ", myDocs: "マイ文書", settings: "設定", updatesFooter: "リリースノート" },
    updates: { title: "リリースノート" },
    blog: { title: "ブログ", desc: "loficeガイドとヒント" },
  },
  "zh-CN": {
    common: {
      openDocument: "打开文档",
      open: "打开",
      opening: "正在打开…",
      readMore: "了解更多 →",
      seeMore: "查看更多",
      searchLanguage: "搜索国家或语言…",
      noLanguageResults: "没有匹配的语言",
      footerTagline: "无需安装的浏览器全能文档工具",
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
      noResults: "没有结果，请尝试其他关键词。",
    },
    start: { title: "立即开始", desc: "选择任务即可跳转到最合适的界面。", more: "查看更多" },
    popular: { title: "最受欢迎的工具", desc: "用户首选的核心功能" },
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
      analyzeSearch: "搜索结果 — 分析",
    },
    nav: { tools: "办公工具", updates: "更新", blog: "博客", myDocs: "我的文档", settings: "设置", updatesFooter: "更新日志" },
    updates: { title: "更新日志" },
    blog: { title: "博客", desc: "lofice 使用指南与技巧" },
  },
  "zh-TW": {
    common: { openDocument: "開啟文件", open: "開啟", searchLanguage: "搜尋國家或語言…", footerTagline: "無需安裝的瀏覽器全能文件工具" },
    hero: { title: "免費線上文件編輯工具", searchLabel: "您想找什麼？", dropHint: "或將檔案拖放到此處" },
    start: { title: "立即開始", more: "查看更多" },
    nav: { tools: "辦公工具", updates: "更新", blog: "部落格", myDocs: "我的文件", settings: "設定" },
  },
  es: {
    common: { openDocument: "Abrir documento", open: "Abrir", opening: "Abriendo…", searchLanguage: "Buscar país o idioma…", footerTagline: "Herramientas documentales en el navegador sin instalar" },
    hero: { title: "Herramientas de documentos en línea gratis", subtitle: "Visores y editores potentes en el navegador, sin instalación", searchLabel: "¿Qué buscas?", searchPlaceholder: "Buscar por herramienta, función o etiqueta", dropHint: "O arrastra archivos aquí" },
    start: { title: "Empieza ya", desc: "Elige una tarea y ve a la pantalla adecuada.", more: "Ver más" },
    popular: { title: "Herramientas más populares", desc: "Favoritas de nuestros usuarios" },
    nav: { tools: "Herramientas", updates: "Actualizaciones", blog: "Blog", myDocs: "Mis documentos", settings: "Ajustes", updatesFooter: "Notas de versión" },
    updates: { title: "Notas de versión" },
    blog: { title: "Blog", desc: "Guías y consejos de lofice" },
  },
  fr: {
    common: { openDocument: "Ouvrir un document", open: "Ouvrir", searchLanguage: "Rechercher un pays ou une langue…", footerTagline: "Suite bureautique dans le navigateur, sans installation" },
    hero: { title: "Outils documentaires en ligne gratuits", subtitle: "Visionneuses et éditeurs puissants dans votre navigateur", searchLabel: "Que recherchez-vous ?", dropHint: "Ou déposez des fichiers ici" },
    start: { title: "Commencer", desc: "Choisissez une tâche pour accéder au bon écran.", more: "Voir plus" },
    popular: { title: "Outils populaires", desc: "Les favoris de nos utilisateurs" },
    nav: { tools: "Outils", updates: "Mises à jour", blog: "Blog", myDocs: "Mes documents", settings: "Paramètres" },
  },
  de: {
    common: { openDocument: "Dokument öffnen", open: "Öffnen", searchLanguage: "Land oder Sprache suchen…", footerTagline: "All-in-One-Dokumenttools im Browser ohne Installation" },
    hero: { title: "Kostenlose Online-Dokumenttools", subtitle: "Leistungsstarke Viewer und Editoren direkt im Browser", searchLabel: "Wonach suchen Sie?", dropHint: "Oder Dateien hier ablegen" },
    start: { title: "Direkt loslegen", desc: "Wählen Sie eine Aufgabe für den passenden Bildschirm.", more: "Mehr" },
    popular: { title: "Beliebte Tools", desc: "Top-Auswahl unserer Nutzer" },
    nav: { tools: "Tools", updates: "Updates", blog: "Blog", myDocs: "Meine Dokumente", settings: "Einstellungen" },
  },
  pt: {
    common: { openDocument: "Abrir documento", open: "Abrir", searchLanguage: "Pesquisar país ou idioma…" },
    hero: { title: "Ferramentas de documentos online grátis", searchLabel: "O que procura?", dropHint: "Ou arraste ficheiros aqui" },
    start: { title: "Começar agora", more: "Ver mais" },
    nav: { tools: "Ferramentas", updates: "Atualizações", blog: "Blog", myDocs: "Meus documentos", settings: "Definições" },
  },
  ru: {
    common: { openDocument: "Открыть документ", open: "Открыть", searchLanguage: "Поиск страны или языка…" },
    hero: { title: "Бесплатные онлайн-инструменты для документов", searchLabel: "Что вы ищете?", dropHint: "Или перетащите файлы сюда" },
    start: { title: "Начать работу", more: "Ещё" },
    nav: { tools: "Инструменты", updates: "Обновления", blog: "Блог", myDocs: "Мои документы", settings: "Настройки" },
  },
  ar: {
    common: { openDocument: "فتح مستند", open: "فتح", searchLanguage: "ابحث عن بلد أو لغة…" },
    hero: { title: "أدوات مستندات مجانية على الإنترنت", searchLabel: "ماذا تبحث عنه؟", dropHint: "أو اسحب الملفات هنا" },
    start: { title: "ابدأ الآن", more: "المزيد" },
    nav: { tools: "الأدوات", updates: "التحديثات", blog: "المدونة", myDocs: "مستنداتي", settings: "الإعدادات" },
  },
  hi: {
    common: { openDocument: "दस्तावेज़ खोलें", open: "खोलें", searchLanguage: "देश या भाषा खोजें…" },
    hero: { title: "मुफ़्त ऑनलाइन दस्तावेज़ टूल", searchLabel: "आप क्या ढूँढ रहे हैं?", dropHint: "या फ़ाइलें यहाँ खींचें" },
    start: { title: "तुरंत शुरू करें", more: "और देखें" },
    nav: { tools: "टूल", updates: "अपडेट", blog: "ब्लॉग", myDocs: "मेरे दस्तावेज़", settings: "सेटिंग" },
  },
  vi: {
    common: { openDocument: "Mở tài liệu", open: "Mở", searchLanguage: "Tìm quốc gia hoặc ngôn ngữ…" },
    hero: { title: "Công cụ tài liệu trực tuyến miễn phí", searchLabel: "Bạn đang tìm gì?", dropHint: "Hoặc kéo thả tệp vào đây" },
    start: { title: "Bắt đầu ngay", more: "Xem thêm" },
    nav: { tools: "Công cụ", updates: "Cập nhật", blog: "Blog", myDocs: "Tài liệu của tôi", settings: "Cài đặt" },
  },
  th: {
    common: { openDocument: "เปิดเอกสาร", open: "เปิด", searchLanguage: "ค้นหาประเทศหรือภาษา…" },
    hero: { title: "เครื่องมือเอกสารออนไลน์ฟรี", searchLabel: "คุณกำลังมองหาอะไร?", dropHint: "หรือลากไฟล์มาวางที่นี่" },
    start: { title: "เริ่มทันที", more: "ดูเพิ่ม" },
    nav: { tools: "เครื่องมือ", updates: "อัปเดต", blog: "บล็อก", myDocs: "เอกสารของฉัน", settings: "การตั้งค่า" },
  },
  id: {
    common: { openDocument: "Buka dokumen", open: "Buka", searchLanguage: "Cari negara atau bahasa…" },
    hero: { title: "Alat dokumen online gratis", searchLabel: "Apa yang Anda cari?", dropHint: "Atau seret file ke sini" },
    start: { title: "Mulai sekarang", more: "Lihat lainnya" },
    nav: { tools: "Alat", updates: "Pembaruan", blog: "Blog", myDocs: "Dokumen saya", settings: "Pengaturan" },
  },
  it: {
    common: { openDocument: "Apri documento", open: "Apri", searchLanguage: "Cerca paese o lingua…" },
    hero: { title: "Strumenti documentali online gratuiti", searchLabel: "Cosa stai cercando?", dropHint: "O trascina i file qui" },
    start: { title: "Inizia subito", more: "Altro" },
    nav: { tools: "Strumenti", updates: "Aggiornamenti", blog: "Blog", myDocs: "I miei documenti", settings: "Impostazioni" },
  },
  tr: {
    common: { openDocument: "Belge aç", open: "Aç", searchLanguage: "Ülke veya dil ara…" },
    hero: { title: "Ücretsiz çevrimiçi belge araçları", searchLabel: "Ne arıyorsunuz?", dropHint: "Veya dosyaları buraya sürükleyin" },
    start: { title: "Hemen başla", more: "Daha fazla" },
    nav: { tools: "Araçlar", updates: "Güncellemeler", blog: "Blog", myDocs: "Belgelerim", settings: "Ayarlar" },
  },
  nl: {
    common: { openDocument: "Document openen", open: "Openen", searchLanguage: "Zoek land of taal…" },
    hero: { title: "Gratis online documenttools", searchLabel: "Waar zoekt u naar?", dropHint: "Of sleep bestanden hierheen" },
    nav: { tools: "Tools", updates: "Updates", blog: "Blog", myDocs: "Mijn documenten", settings: "Instellingen" },
  },
  pl: {
    common: { openDocument: "Otwórz dokument", open: "Otwórz", searchLanguage: "Szukaj kraju lub języka…" },
    hero: { title: "Darmowe narzędzia dokumentów online", searchLabel: "Czego szukasz?", dropHint: "Lub upuść pliki tutaj" },
    nav: { tools: "Narzędzia", updates: "Aktualizacje", blog: "Blog", myDocs: "Moje dokumenty", settings: "Ustawienia" },
  },
  uk: {
    common: { openDocument: "Відкрити документ", open: "Відкрити", searchLanguage: "Пошук країни або мови…" },
    hero: { title: "Безкоштовні онлайн-інструменти для документів", searchLabel: "Що ви шукаєте?", dropHint: "Або перетягніть файли сюди" },
    nav: { tools: "Інструменти", updates: "Оновлення", blog: "Блог", myDocs: "Мої документи", settings: "Налаштування" },
  },
  sv: {
    common: { openDocument: "Öppna dokument", open: "Öppna", searchLanguage: "Sök land eller språk…" },
    hero: { title: "Gratis dokumentverktyg online", searchLabel: "Vad letar du efter?" },
    nav: { tools: "Verktyg", updates: "Uppdateringar", blog: "Blogg", myDocs: "Mina dokument", settings: "Inställningar" },
  },
  da: {
    common: { openDocument: "Åbn dokument", open: "Åbn", searchLanguage: "Søg land eller sprog…" },
    hero: { title: "Gratis online dokumentværktøjer", searchLabel: "Hvad leder du efter?" },
    nav: { tools: "Værktøjer", updates: "Opdateringer", blog: "Blog", myDocs: "Mine dokumenter", settings: "Indstillinger" },
  },
  fi: {
    common: { openDocument: "Avaa asiakirja", open: "Avaa", searchLanguage: "Etsi maata tai kieltä…" },
    hero: { title: "Ilmaiset verkkodokumenttityökalut", searchLabel: "Mitä etsit?" },
    nav: { tools: "Työkalut", updates: "Päivitykset", blog: "Blogi", myDocs: "Omat asiakirjat", settings: "Asetukset" },
  },
  no: {
    common: { openDocument: "Åpne dokument", open: "Åpne", searchLanguage: "Søk land eller språk…" },
    hero: { title: "Gratis dokumentverktøy på nett", searchLabel: "Hva leter du etter?" },
    nav: { tools: "Verktøy", updates: "Oppdateringer", blog: "Blogg", myDocs: "Mine dokumenter", settings: "Innstillinger" },
  },
  cs: {
    common: { openDocument: "Otevřít dokument", open: "Otevřít", searchLanguage: "Hledat zemi nebo jazyk…" },
    hero: { title: "Bezplatné online nástroje pro dokumenty", searchLabel: "Co hledáte?" },
    nav: { tools: "Nástroje", updates: "Aktualizace", blog: "Blog", myDocs: "Moje dokumenty", settings: "Nastavení" },
  },
  ro: {
    common: { openDocument: "Deschide document", open: "Deschide", searchLanguage: "Caută țară sau limbă…" },
    hero: { title: "Instrumente documente online gratuite", searchLabel: "Ce cauți?" },
    nav: { tools: "Instrumente", updates: "Actualizări", blog: "Blog", myDocs: "Documentele mele", settings: "Setări" },
  },
  hu: {
    common: { openDocument: "Dokumentum megnyitása", open: "Megnyitás", searchLanguage: "Ország vagy nyelv keresése…" },
    hero: { title: "Ingyenes online dokumentumeszközök", searchLabel: "Mit keres?" },
    nav: { tools: "Eszközök", updates: "Frissítések", blog: "Blog", myDocs: "Dokumentumaim", settings: "Beállítások" },
  },
  el: {
    common: { openDocument: "Άνοιγμα εγγράφου", open: "Άνοιγμα", searchLanguage: "Αναζήτηση χώρας ή γλώσσας…" },
    hero: { title: "Δωρεάν διαδικτυακά εργαλεία εγγράφων", searchLabel: "Τι ψάχνετε;" },
    nav: { tools: "Εργαλεία", updates: "Ενημερώσεις", blog: "Ιστολόγιο", myDocs: "Τα έγγραφά μου", settings: "Ρυθμίσεις" },
  },
  he: {
    common: { openDocument: "פתח מסמך", open: "פתח", searchLanguage: "חפש מדינה או שפה…" },
    hero: { title: "כלי מסמכים מקוונים בחינם", searchLabel: "מה אתה מחפש?" },
    nav: { tools: "כלים", updates: "עדכונים", blog: "בלוג", myDocs: "המסמכים שלי", settings: "הגדרות" },
  },
  ms: {
    common: { openDocument: "Buka dokumen", open: "Buka", searchLanguage: "Cari negara atau bahasa…" },
    hero: { title: "Alat dokumen dalam talian percuma", searchLabel: "Apa yang anda cari?" },
    nav: { tools: "Alat", updates: "Kemas kini", blog: "Blog", myDocs: "Dokumen saya", settings: "Tetapan" },
  },
  bn: {
    common: { openDocument: "নথি খুলুন", open: "খুলুন", searchLanguage: "দেশ বা ভাষা খুঁজুন…" },
    hero: { title: "বিনামূল্যে অনলাইন নথি সরঞ্জাম", searchLabel: "আপনি কী খুঁজছেন?" },
    nav: { tools: "সরঞ্জাম", updates: "আপডেট", blog: "ব্লগ", myDocs: "আমার নথি", settings: "সেটিংস" },
  },
  fa: {
    common: { openDocument: "باز کردن سند", open: "باز کردن", searchLanguage: "جستجوی کشور یا زبان…" },
    hero: { title: "ابزارهای رایگان اسناد آنلاین", searchLabel: "به دنبال چه هستید؟" },
    nav: { tools: "ابزارها", updates: "به‌روزرسانی‌ها", blog: "وبلاگ", myDocs: "اسناد من", settings: "تنظیمات" },
  },
  ur: {
    common: { openDocument: "دستاویز کھولیں", open: "کھولیں", searchLanguage: "ملک یا زبان تلاش کریں…" },
    hero: { title: "مفت آن لائن دستاویز ٹولز", searchLabel: "آپ کیا ڈھونڈ رہے ہیں؟" },
    nav: { tools: "ٹولز", updates: "اپڈیٹس", blog: "بلاگ", myDocs: "میری دستاویزات", settings: "ترتیبات" },
  },
  sw: {
    common: { openDocument: "Fungua hati", open: "Fungua", searchLanguage: "Tafuta nchi au lugha…" },
    hero: { title: "Zana za hati mtandaoni bila malipo", searchLabel: "Unatafuta nini?" },
    nav: { tools: "Zana", updates: "Sasisho", blog: "Blogu", myDocs: "Hati zangu", settings: "Mipangilio" },
  },
  fil: {
    common: { openDocument: "Buksan ang dokumento", open: "Buksan", searchLanguage: "Maghanap ng bansa o wika…" },
    hero: { title: "Libreng online na tool sa dokumento", searchLabel: "Ano ang hinahanap mo?" },
    nav: { tools: "Mga tool", updates: "Mga update", blog: "Blog", myDocs: "Aking mga dokumento", settings: "Mga setting" },
  },
};

function serialize(obj) {
  return JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:");
}

for (const [locale, patch] of Object.entries(UI)) {
  const varName = locale.replace(/-/g, "_");
  const content = `import type { Messages } from "../types";
import en from "./en";
import { mergeMessages } from "../utils";

const patch = ${serialize(patch)} as Partial<import("../types").Messages>;

const ${varName}: import("../types").Messages = mergeMessages(en, patch);
export default ${varName};
`;
  fs.writeFileSync(path.join(OUT, `${locale}.ts`), content, "utf8");
  console.log("wrote", `${locale}.ts`);
}

console.log("Done:", Object.keys(UI).length, "locale packs");
