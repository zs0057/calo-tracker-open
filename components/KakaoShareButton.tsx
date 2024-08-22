"use client";
import analytics from "@/lib/analytics";
import { getMealTypeKorean } from "@/lib/utils";
import React, { useEffect } from "react";

type KakaoShareButtonProps = {
  mealType: string;
  result: {
    total_calories: number;
    items: string;
  };
  selectedImage: string | null;
  uploadedImageUrl: string | null;
};

const KakaoShareButton = ({
  mealType,
  result,
  uploadedImageUrl,
}: KakaoShareButtonProps) => {
  const description = `# ${getMealTypeKorean(mealType)} ${result.items
    .split(", ")
    .map((item) => `# ${item}`)
    .join(" ")}`;

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY as string); // 실제 카카오 앱 키로 대체하세요
    }
  }, []);

  const handleShareClick = () => {
    analytics.track("공유버튼클릭");
    if (window.Kakao) {
      window.Kakao.Link.sendCustom({
        templateId: 110972, // 실제 사용중인 템플릿 ID로 대체해야 합니다.
        templateArgs: {
          title: `칼로리: ${result.total_calories} kcal`,
          description: description,
          imageUrl: uploadedImageUrl || "",
          imageWidth: 200,
          imageHeight: 200,
        },
      });
    }
  };

  return (
    <div
      id="kakaotalk-sharing-btn"
      onClick={handleShareClick} // 클릭 이벤트 핸들러 연결
      className="bg-light-pink text-white py-2 px-4 rounded-full cursor-pointer text-sm font-medium shadow-md"
      style={{ backgroundColor: "var(--light-pink)", display: "inline-block" }}
    >
      인증하기
    </div>
  );
};

export default KakaoShareButton;
