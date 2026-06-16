/** Office Tool Plus ko-kr.xaml 네비·기능 라벨 (lofice 적용) */
export const OTP_NAV = {
  home: "홈",
  toolbox: "도구 상자",
  convert: "문서 변환",
  hashChecker: "해시 체크",
  settings: "설정",
  about: "정보",
} as const;

export const OTP_TOOLBOX = {
  general: "일반 도구",
  repair: "복구",
  resetPreferences: "환경설정 재설정",
  resetPreferencesDesc: "lofice 테마·뷰어 기본값을 초기화합니다.",
  clearCache: "로컬 캐시 지우기",
  clearCacheDesc: "IndexedDB에 저장된 모든 문서를 삭제합니다.",
  exportSettings: "설정 내보내기",
  importSettings: "설정 가져오기",
} as const;

export const OTP_CONVERT = {
  title: "문서 변환",
  inputFormat: "입력 형식",
  outputFormat: "출력 형식",
  fileList: "파일 목록",
  start: "변환",
  clearList: "목록 지우기",
  selectFiles: "파일 선택",
} as const;
