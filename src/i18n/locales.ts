import type { LocaleDefinition } from "./types";

function L(
  code: string,
  messageLocale: string,
  nativeName: string,
  englishName: string,
  region: string,
  flag: string,
  searchTerms: string[],
): LocaleDefinition {
  return { code, messageLocale, nativeName, englishName, region, flag, searchTerms };
}

/** 글로벌 언어·지역 목록 (80+) — messageLocale로 메시지 팩 매핑 */
export const LOCALE_DEFINITIONS: LocaleDefinition[] = [
  L("ko", "ko", "한국어", "Korean", "South Korea", "🇰🇷", ["korea", "south korea", "한국", "대한민국", "korean", "한국어"]),
  L("en", "en", "English", "English", "United States", "🇺🇸", ["usa", "america", "united states", "english", "미국", "영어"]),
  L("en-GB", "en", "English (UK)", "English UK", "United Kingdom", "🇬🇧", ["uk", "britain", "england", "united kingdom", "영국"]),
  L("en-AU", "en", "English (AU)", "English Australia", "Australia", "🇦🇺", ["australia", "aussie", "호주"]),
  L("en-CA", "en", "English (CA)", "English Canada", "Canada", "🇨🇦", ["canada", "캐나다"]),
  L("en-IN", "en", "English (IN)", "English India", "India", "🇮🇳", ["india english", "인도 영어"]),
  L("ja", "ja", "日本語", "Japanese", "Japan", "🇯🇵", ["japan", "japanese", "일본", "日本", "にほん"]),
  L("zh-CN", "zh-CN", "简体中文", "Chinese Simplified", "China", "🇨🇳", ["china", "chinese", "中国", "简体", "중국", "간체"]),
  L("zh-TW", "zh-TW", "繁體中文", "Chinese Traditional", "Taiwan", "🇹🇼", ["taiwan", "hong kong", "台灣", "繁體", "대만", "홍콩"]),
  L("zh-HK", "zh-TW", "繁體中文 (HK)", "Chinese HK", "Hong Kong", "🇭🇰", ["hong kong", "홍콩"]),
  L("es", "es", "Español", "Spanish", "Spain", "🇪🇸", ["spain", "spanish", "españa", "스페인", "스페인어"]),
  L("es-MX", "es", "Español (MX)", "Spanish Mexico", "Mexico", "🇲🇽", ["mexico", "méxico", "멕시코"]),
  L("es-AR", "es", "Español (AR)", "Spanish Argentina", "Argentina", "🇦🇷", ["argentina", "아르헨티나"]),
  L("es-CO", "es", "Español (CO)", "Spanish Colombia", "Colombia", "🇨🇴", ["colombia", "콜롬비아"]),
  L("fr", "fr", "Français", "French", "France", "🇫🇷", ["france", "french", "français", "프랑스", "프랑스어"]),
  L("fr-CA", "fr", "Français (CA)", "French Canada", "Canada", "🇨🇦", ["french canada", "quebec", "퀘벡"]),
  L("de", "de", "Deutsch", "German", "Germany", "🇩🇪", ["germany", "german", "deutsch", "독일", "독일어"]),
  L("de-AT", "de", "Deutsch (AT)", "German Austria", "Austria", "🇦🇹", ["austria", "österreich", "오스트리아"]),
  L("de-CH", "de", "Deutsch (CH)", "German Switzerland", "Switzerland", "🇨🇭", ["switzerland", "swiss", "스위스"]),
  L("pt", "pt", "Português", "Portuguese", "Portugal", "🇵🇹", ["portugal", "portuguese", "포르투갈"]),
  L("pt-BR", "pt", "Português (BR)", "Portuguese Brazil", "Brazil", "🇧🇷", ["brazil", "brasil", "브라질", "포르투갈어"]),
  L("ru", "ru", "Русский", "Russian", "Russia", "🇷🇺", ["russia", "russian", "россия", "러시아", "러시아어"]),
  L("uk", "uk", "Українська", "Ukrainian", "Ukraine", "🇺🇦", ["ukraine", "ukrainian", "우크라이나"]),
  L("ar", "ar", "العربية", "Arabic", "Saudi Arabia", "🇸🇦", ["arabic", "saudi", "arab", "아랍", "아랍어", "사우디"]),
  L("ar-EG", "ar", "العربية (EG)", "Arabic Egypt", "Egypt", "🇪🇬", ["egypt", "مصر", "이집트"]),
  L("ar-AE", "ar", "العربية (AE)", "Arabic UAE", "UAE", "🇦🇪", ["uae", "dubai", "두바이", "아랍에미리트"]),
  L("hi", "hi", "हिन्दी", "Hindi", "India", "🇮🇳", ["hindi", "india", "हिन्दी", "힌디", "인도"]),
  L("bn", "bn", "বাংলা", "Bengali", "Bangladesh", "🇧🇩", ["bengali", "bangladesh", "벵골"]),
  L("ur", "ur", "اردو", "Urdu", "Pakistan", "🇵🇰", ["urdu", "pakistan", "파키스탄"]),
  L("fa", "fa", "فارسی", "Persian", "Iran", "🇮🇷", ["persian", "farsi", "iran", "이란", "페르시아"]),
  L("he", "he", "עברית", "Hebrew", "Israel", "🇮🇱", ["hebrew", "israel", "이스라엘"]),
  L("tr", "tr", "Türkçe", "Turkish", "Turkey", "🇹🇷", ["turkey", "turkish", "türkiye", "터키", "터키어"]),
  L("vi", "vi", "Tiếng Việt", "Vietnamese", "Vietnam", "🇻🇳", ["vietnam", "vietnamese", "베트남", "베트남어"]),
  L("th", "th", "ไทย", "Thai", "Thailand", "🇹🇭", ["thailand", "thai", "태국", "태국어"]),
  L("id", "id", "Bahasa Indonesia", "Indonesian", "Indonesia", "🇮🇩", ["indonesia", "indonesian", "인도네시아"]),
  L("ms", "ms", "Bahasa Melayu", "Malay", "Malaysia", "🇲🇾", ["malaysia", "malay", "말레이시아"]),
  L("fil", "fil", "Filipino", "Filipino", "Philippines", "🇵🇭", ["philippines", "filipino", "tagalog", "필리핀"]),
  L("it", "it", "Italiano", "Italian", "Italy", "🇮🇹", ["italy", "italian", "italia", "이탈리아", "이탈리아어"]),
  L("nl", "nl", "Nederlands", "Dutch", "Netherlands", "🇳🇱", ["netherlands", "dutch", "holland", "네덜란드"]),
  L("pl", "pl", "Polski", "Polish", "Poland", "🇵🇱", ["poland", "polish", "polska", "폴란드"]),
  L("cs", "cs", "Čeština", "Czech", "Czechia", "🇨🇿", ["czech", "czechia", "체코"]),
  L("sk", "en", "Slovenčina", "Slovak", "Slovakia", "🇸🇰", ["slovak", "slovakia", "슬로바키아"]),
  L("hu", "hu", "Magyar", "Hungarian", "Hungary", "🇭🇺", ["hungary", "hungarian", "헝가리"]),
  L("ro", "ro", "Română", "Romanian", "Romania", "🇷🇴", ["romania", "romanian", "루마니아"]),
  L("bg", "en", "Български", "Bulgarian", "Bulgaria", "🇧🇬", ["bulgaria", "bulgarian", "불가리아"]),
  L("hr", "en", "Hrvatski", "Croatian", "Croatia", "🇭🇷", ["croatia", "croatian", "크로아티아"]),
  L("sr", "en", "Српски", "Serbian", "Serbia", "🇷🇸", ["serbia", "serbian", "세르비아"]),
  L("sl", "en", "Slovenščina", "Slovenian", "Slovenia", "🇸🇮", ["slovenia", "slovenian", "슬로베니아"]),
  L("el", "el", "Ελληνικά", "Greek", "Greece", "🇬🇷", ["greece", "greek", "그리스"]),
  L("sv", "sv", "Svenska", "Swedish", "Sweden", "🇸🇪", ["sweden", "swedish", "스웨덴"]),
  L("da", "da", "Dansk", "Danish", "Denmark", "🇩🇰", ["denmark", "danish", "덴마크"]),
  L("fi", "fi", "Suomi", "Finnish", "Finland", "🇫🇮", ["finland", "finnish", "핀란드"]),
  L("no", "no", "Norsk", "Norwegian", "Norway", "🇳🇴", ["norway", "norwegian", "노르웨이"]),
  L("is", "en", "Íslenska", "Icelandic", "Iceland", "🇮🇸", ["iceland", "icelandic", "아이슬란드"]),
  L("et", "en", "Eesti", "Estonian", "Estonia", "🇪🇪", ["estonia", "estonian", "에스토니아"]),
  L("lv", "en", "Latviešu", "Latvian", "Latvia", "🇱🇻", ["latvia", "latvian", "라트비아"]),
  L("lt", "en", "Lietuvių", "Lithuanian", "Lithuania", "🇱🇹", ["lithuania", "lithuanian", "리투아니아"]),
  L("sw", "sw", "Kiswahili", "Swahili", "Kenya", "🇰🇪", ["swahili", "kenya", "tanzania", "스와힐리"]),
  L("af", "en", "Afrikaans", "Afrikaans", "South Africa", "🇿🇦", ["afrikaans", "south africa", "남아공"]),
  L("am", "en", "አማርኛ", "Amharic", "Ethiopia", "🇪🇹", ["amharic", "ethiopia", "에티오피아"]),
  L("km", "en", "ខ្មែរ", "Khmer", "Cambodia", "🇰🇭", ["khmer", "cambodia", "캄보디아"]),
  L("lo", "en", "ລາວ", "Lao", "Laos", "🇱🇦", ["lao", "laos", "라오스"]),
  L("my", "en", "မြန်မာ", "Burmese", "Myanmar", "🇲🇲", ["myanmar", "burmese", "미얀마"]),
  L("ne", "en", "नेपाली", "Nepali", "Nepal", "🇳🇵", ["nepal", "nepali", "네팔"]),
  L("si", "en", "සිංහල", "Sinhala", "Sri Lanka", "🇱🇰", ["sinhala", "sri lanka", "스리랑카"]),
  L("ta", "en", "தமிழ்", "Tamil", "India", "🇮🇳", ["tamil", "타밀"]),
  L("te", "en", "తెలుగు", "Telugu", "India", "🇮🇳", ["telugu", "텔루구"]),
  L("mr", "en", "मराठी", "Marathi", "India", "🇮🇳", ["marathi", "마라티"]),
  L("gu", "en", "ગુજરાતી", "Gujarati", "India", "🇮🇳", ["gujarati", "구자라트"]),
  L("kn", "en", "ಕನ್ನಡ", "Kannada", "India", "🇮🇳", ["kannada", "칸나다"]),
  L("ml", "en", "മലയാളം", "Malayalam", "India", "🇮🇳", ["malayalam", "말라얄람"]),
  L("pa", "en", "ਪੰਜਾਬੀ", "Punjabi", "India", "🇮🇳", ["punjabi", "펀자브"]),
  L("ka", "en", "ქართული", "Georgian", "Georgia", "🇬🇪", ["georgia", "georgian", "조지아"]),
  L("hy", "en", "Հայերեն", "Armenian", "Armenia", "🇦🇲", ["armenia", "armenian", "아르메니아"]),
  L("az", "en", "Azərbaycan", "Azerbaijani", "Azerbaijan", "🇦🇿", ["azerbaijan", "azerbaijani", "아제르바이잔"]),
  L("kk", "en", "Қазақ", "Kazakh", "Kazakhstan", "🇰🇿", ["kazakh", "kazakhstan", "카자흐"]),
  L("uz", "en", "Oʻzbek", "Uzbek", "Uzbekistan", "🇺🇿", ["uzbek", "uzbekistan", "우즈베키스탄"]),
  L("mn", "en", "Монгол", "Mongolian", "Mongolia", "🇲🇳", ["mongolia", "mongolian", "몽골"]),
  L("ca", "es", "Català", "Catalan", "Spain", "🇪🇸", ["catalan", "catalonia", "카탈루냐"]),
  L("eu", "en", "Euskara", "Basque", "Spain", "🇪🇸", ["basque", "euskara", "바스크"]),
  L("gl", "en", "Galego", "Galician", "Spain", "🇪🇸", ["galician", "갈리시아"]),
  L("sq", "en", "Shqip", "Albanian", "Albania", "🇦🇱", ["albania", "albanian", "알바니아"]),
  L("mk", "en", "Македонски", "Macedonian", "North Macedonia", "🇲🇰", ["macedonia", "마케도니아"]),
  L("bs", "en", "Bosanski", "Bosnian", "Bosnia", "🇧🇦", ["bosnia", "보스니아"]),
  L("be", "ru", "Беларуская", "Belarusian", "Belarus", "🇧🇾", ["belarus", "belarusian", "벨라루스"]),
  L("ga", "en", "Gaeilge", "Irish", "Ireland", "🇮🇪", ["ireland", "irish", "아일랜드"]),
  L("cy", "en", "Cymraeg", "Welsh", "Wales", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", ["wales", "welsh", "웨일스"]),
  L("mt", "en", "Malti", "Maltese", "Malta", "🇲🇹", ["malta", "maltese", "몰타"]),
  L("lb", "de", "Lëtzebuergesch", "Luxembourgish", "Luxembourg", "🇱🇺", ["luxembourg", "룩셈부르크"]),
  L("jv", "id", "Basa Jawa", "Javanese", "Indonesia", "🇮🇩", ["javanese", "자바"]),
  L("su", "id", "Basa Sunda", "Sundanese", "Indonesia", "🇮🇩", ["sundanese", "순다"]),
  L("ha", "en", "Hausa", "Hausa", "Nigeria", "🇳🇬", ["hausa", "nigeria", "나이지리아"]),
  L("yo", "en", "Yorùbá", "Yoruba", "Nigeria", "🇳🇬", ["yoruba", "요루바"]),
  L("ig", "en", "Igbo", "Igbo", "Nigeria", "🇳🇬", ["igbo", "이그보"]),
  L("zu", "en", "isiZulu", "Zulu", "South Africa", "🇿🇦", ["zulu", "줄루"]),
  L("xh", "en", "isiXhosa", "Xhosa", "South Africa", "🇿🇦", ["xhosa", "코사"]),
  L("ps", "fa", "پښتو", "Pashto", "Afghanistan", "🇦🇫", ["pashto", "afghanistan", "아프가니스탄"]),
  L("ku", "en", "Kurdî", "Kurdish", "Iraq", "🇮🇶", ["kurdish", "kurd", "쿠르드"]),
  L("tg", "ru", "Тоҷикӣ", "Tajik", "Tajikistan", "🇹🇯", ["tajik", "타지키스탄"]),
  L("tk", "ru", "Türkmen", "Turkmen", "Turkmenistan", "🇹🇲", ["turkmen", "투르크메니스탄"]),
  L("ug", "en", "ئۇيغۇرچە", "Uyghur", "China", "🇨🇳", ["uyghur", "위구르"]),
  L("bo", "zh-CN", "བོད་ཡིག", "Tibetan", "China", "🇨🇳", ["tibet", "tibetan", "티베트"]),
  L("dz", "en", "རྫོང་ཁ", "Dzongkha", "Bhutan", "🇧🇹", ["bhutan", "dzongkha", "부탄"]),
];

export const DEFAULT_LOCALE = "ko";
export const LOCALE_STORAGE_KEY = "lofice-locale";

export function findLocale(code: string): LocaleDefinition | undefined {
  return LOCALE_DEFINITIONS.find((l) => l.code === code);
}

export function filterLocales(query: string): LocaleDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return LOCALE_DEFINITIONS;
  return LOCALE_DEFINITIONS.filter(
    (l) =>
      l.code.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.englishName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.searchTerms.some((t) => t.toLowerCase().includes(q)),
  );
}

export function resolveMessageLocale(code: string): string {
  return findLocale(code)?.messageLocale ?? code.split("-")[0] ?? "en";
}
