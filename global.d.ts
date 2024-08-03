// global.d.ts

interface KakaoShare {
  sendDefault: (options: any) => void; // 적절한 옵션 타입을 정의합니다.
}

interface KakaoType {
  init: (appKey: string) => void;
  Share: KakaoShare;
}

interface Window {
  Kakao: KakaoType;
}
