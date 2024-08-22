import Analytics from "analytics";
import mixpanelPlugin from "@analytics/mixpanel";
import amplitudePlugin from "@analytics/amplitude";
import googleAnalytics from "@analytics/google-analytics";

const analytics = Analytics({
  app: "my-app", // 애플리케이션 이름
  version: "1.0.0", // 애플리케이션 버전
  plugins: [
    mixpanelPlugin({
      token: "d3bfa0fbaf36efc0214ad29ea84a25e9", // Mixpanel 프로젝트 토큰
    }) as any,
    amplitudePlugin({
      apiKey: "963718076ebf081c31c2c37cd75e8583", // Amplitude API 키
    }) as any,
    // googleAnalytics({
    //   trackingId: "G-LZ5H0PZ44Z", // Google Analytics 추적 ID
    // }) as any,
  ],
});

export default analytics;
