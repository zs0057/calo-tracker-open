import Analytics from "analytics";
import mixpanelPlugin from "@analytics/mixpanel";
import amplitudePlugin from "@analytics/amplitude";
import googleAnalytics from "@analytics/google-analytics";

const analytics = Analytics({
  app: "my-app", // 애플리케이션 이름
  version: "1.0.0", // 애플리케이션 버전
  plugins: [
    mixpanelPlugin({
      token: process.env.MIXPENEL_ID as string, // Mixpanel 프로젝트 토큰
    }) as any,
    amplitudePlugin({
      apiKey: process.env.AMPLITUDE_ID as string, // Amplitude API 키
    }) as any,
    googleAnalytics({
      measurementIds: [process.env.GOOGLE_ANALYTICS_ID as string],
    }),
  ],
});

export default analytics;
