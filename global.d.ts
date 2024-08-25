// global.d.ts

interface KakaoShare {
  sendDefault: (options: any) => void; // 적절한 옵션 타입을 정의합니다.
  createCustomButton: (options: any) => void;
}

interface KakaoType {
  init: (appKey: string) => void;
  Share: KakaoShare;
  isInitialized: () => boolean;
  Link: any;
}

interface Window {
  Kakao: KakaoType;
}

declare module "@analytics/mixpanel" {
  interface MixpanelPluginOptions {
    token: string;
  }

  function mixpanelPlugin(options: MixpanelPluginOptions): any;

  export default mixpanelPlugin;
}

declare module "@analytics/amplitude" {
  interface AmplitudePluginOptions {
    apiKey: string;
  }

  function amplitudePlugin(options: AmplitudePluginOptions): any;

  export default amplitudePlugin;
}

declare module "@analytics/google-analytics" {
  interface GoogleAnalyticsPluginOptions {
    measurementIds: string[];
  }

  function googleAnalytics(options: GoogleAnalyticsPluginOptions): any;

  export default googleAnalytics;
}
