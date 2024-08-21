"use client";
import React, { useEffect } from "react";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { getMealTypeKorean } from "@/lib/utils";

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
  result,
  uploadedImageUrl,
}: KakaoShareButtonProps) => {
  const description = `${result.items
    .split(", ")
    .map((item) => `# ${item}`)
    .join(" ")}`;

  useEffect(() => {
    if (typeof window !== "undefined" && window.Kakao) {
      // Kakao SDK가 로드되었는지 확인 후, 커스텀 버튼 생성
      window.Kakao.Share.createCustomButton({
        container: "#kakaotalk-sharing-btn",
        templateId: 111057, // 실제 사용중인 템플릿 ID로 대체해야 합니다.
        templateArgs: {
          title: `칼로리: ${result.total_calories} kcal`,
          description: description,
          imageUrl: uploadedImageUrl || "",
          imageWidth: 200,
          imageHeight: 200,
          SC: "(200,200)",
        },
      });
    }
  }, []); // 빈 배열을 사용하여 마운트 시에만 실행되도록 설정

  return (
    <div
      id="kakaotalk-sharing-btn"
      className="bg-light-pink text-white py-2 px-4 rounded-full cursor-pointer text-sm font-medium shadow-md"
      style={{ backgroundColor: "var(--light-pink)", display: "inline-block" }}
    >
      인증하기
    </div>
  );
};

export default KakaoShareButton;
