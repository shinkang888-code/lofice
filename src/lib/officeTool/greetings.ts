/** Office Tool Plus 시간대별 인사 (ko-kr.xaml) */
export function getOfficeToolGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 22 || h < 5) return "늦었어요, 좋은 꿈 꾸세요!";
  if (h < 6) return "새벽이 다 되었는데 일어날 준비가 되셨나요?";
  if (h < 11) return "좋은 아침이에요";
  if (h < 18) return "좋은 오후예요";
  if (h < 22) return "좋은 저녁입니다";
  return "안녕하세요!";
}
