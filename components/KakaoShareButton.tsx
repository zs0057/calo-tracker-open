"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  selectedImage,
  uploadedImageUrl,
}: KakaoShareButtonProps) => {
  // const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // const uploadImage = async () => {
  //   if (selectedImage) {
  //     const imageUrl = await uploadImageToSupabase(selectedImage);
  //     setUploadedImageUrl(imageUrl);
  //   }
  // };

  const description = `# ${getMealTypeKorean(mealType)} ${result.items
    .split(", ")
    .map((item) => `# ${item}`)
    .join(" ")}`;

  const handleShare = () => {
    // uploadImage();
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
        //   {
        //     title: "앱으로 보기",
        //     link: {
        //       mobileWebUrl: window.location.href,
        //       webUrl: window.location.href,
        //     },
        //   },
      });
    }
  };

  return (
    <div onClick={handleShare}>
      <Image
        className="w-10 h-10 cursor-pointer"
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유 이미지"
        width={50}
        height={50}
      />
    </div>
  );
};

export default KakaoShareButton;
