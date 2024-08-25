"use client";
import Analytics from "analytics";
import mixpanelPlugin from "@analytics/mixpanel";
import amplitudePlugin from "@analytics/amplitude";
import googleAnalytics from "@analytics/google-analytics";
const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_ID || "";
const amplitudeApiKey = process.env.NEXT_PUBLIC_AMPLITUDE_ID || "";
const googleAnalyticsId = process.env.NEXT_PUBLIC_MIXPANEL_ID || "";

const analytics = Analytics({
  app: "my-app", // 애플리케이션 이름
  version: "1.0.0", // 애플리케이션 버전
  plugins: [
    mixpanelPlugin({
      token: mixpanelToken, // Mixpanel 프로젝트 토큰
    }) as any,
    amplitudePlugin({
      apiKey: amplitudeApiKey, // Amplitude API 키
    }) as any,
    googleAnalytics({
      measurementIds: [googleAnalyticsId],
    }),
  ],
});

export default analytics;
