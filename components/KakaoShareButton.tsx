"use client";
import React from "react";
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
  mealType,
  uploadedImageUrl,
}: KakaoShareButtonProps) => {
  const description = `# ${getMealTypeKorean(mealType)} ${result.items
    .split(", ")
    .map((item) => `# ${item}`)
    .join(" ")}`;

  const handleShare = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `칼로리: ${result.total_calories} kcal`,
          description: description,
          imageUrl: uploadedImageUrl,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-light-pink text-white py-2 px-4 rounded-full cursor-pointer text-sm font-medium shadow-md"
      style={{ backgroundColor: "var(--light-pink)" }}
    >
      인증하기
    </button>
  );
};

export default KakaoShareButton;
