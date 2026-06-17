/** Loffice i18n 메시지 스키마 */

export type ToolMessages = {
  name: string;
  desc: string;
  tags: string;
};

export type Messages = {
  common: {
    brand: string;
    brandSubtitle: string;
    openDocument: string;
    open: string;
    opening: string;
    remove: string;
    readMore: string;
    seeMore: string;
    themeToggle: string;
    language: string;
    searchLanguage: string;
    noLanguageResults: string;
    copyright: string;
    footerTagline: string;
  };
  hero: {
    title: string;
    subtitle: string;
    chipBrowser: string;
    chipInstant: string;
    chipShortcut: string;
    searchLabel: string;
    searchPlaceholder: string;
    dropHint: string;
    formats: string;
    cloudNote: string;
    noResults: string;
  };
  workspace: {
    label: string;
    title: string;
    desc: string;
    upload: string;
    uploading: string;
    openLoffice: string;
    viewTools: string;
  };
  start: {
    title: string;
    desc: string;
    more: string;
  };
  nova: {
    label: string;
    title: string;
    desc: string;
    openDocs: string;
    tagAiChat: string;
    tagDocWork: string;
    tagTranslate: string;
  };
  quick: {
    secureAiTag: string;
    secureAiTitle: string;
    secureAiDesc: string;
    secureAiCta: string;
    summaryTag: string;
    summaryTitle: string;
    summaryDesc: string;
    summaryCta: string;
    convertTag: string;
    convertTitle: string;
    convertDesc: string;
    convertCta: string;
  };
  popular: {
    title: string;
    desc: string;
  };
  sections: {
    docTitle: string;
    docDesc: string;
    docSearch: string;
    aiTitle: string;
    aiDesc: string;
    aiSearch: string;
    convertTitle: string;
    convertDesc: string;
    convertSearch: string;
    analyzeTitle: string;
    analyzeDesc: string;
    analyzeSearch: string;
  };
  nav: {
    tools: string;
    updates: string;
    blog: string;
    myDocs: string;
    settings: string;
    updatesFooter: string;
  };
  updates: {
    title: string;
    v219: string;
    v218: string;
    v217: string;
    v216: string;
    v212: string;
    v211: string;
    v210: string;
    v207: string;
  };
  blog: {
    title: string;
    desc: string;
    tagGuide: string;
    tagAi: string;
    tagTools: string;
    tagPdf: string;
    post1: string;
    post2: string;
    post3: string;
    post4: string;
  };
  polaris: {
    novaBadge: string;
    novaTitle: string;
    novaSubtitle: string;
    suggest1: string;
    suggest2: string;
    suggest3: string;
    integrationTitle: string;
    integrationSubtitle: string;
    useCaseBadge: string;
    useCaseTitle: string;
    useCaseStudent: string;
    useCaseStudentDesc: string;
    useCaseOffice: string;
    useCaseOfficeDesc: string;
    featStyleTitle: string;
    featStyleDesc: string;
    featPptTitle: string;
    featPptDesc: string;
    featTranslateTitle: string;
    featTranslateDesc: string;
    featVoiceTitle: string;
    featVoiceDesc: string;
    personaFreelancer: string;
    personaFreelancerDesc: string;
    personaParent: string;
    personaParentDesc: string;
    globalTitle: string;
    statDownloads: string;
    statCountries: string;
    statFormats: string;
    platformWeb: string;
    platformWin: string;
    platformAndroid: string;
    platformFiles: string;
    platformSettings: string;
    newsTitle: string;
    newsSubtitle: string;
    newsViewAll: string;
    news1Title: string;
    news2Title: string;
    news3Title: string;
    news4Title: string;
    tagGuide: string;
    tagInsight: string;
    tagNews: string;
    tagUsage: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    login: string;
    myFiles: string;
    newBadge: string;
    popularBadge: string;
  };
  tools: Record<string, ToolMessages>;
};

export type LocaleCode = string;

export type LocaleDefinition = {
  code: LocaleCode;
  messageLocale: string;
  nativeName: string;
  englishName: string;
  region: string;
  flag: string;
  searchTerms: string[];
};
