"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import styles from "./Home.module.css";
import {
  estimateCal,
  FormDataType,
  SaveFormDataType,
  saveMeal,
} from "@/lib/apiClient";
import { getMealTypeKorean, resizeImage } from "@/lib/utils";
import KakaoShareButton from "@/components/KakaoShareButton";
import { uploadImageToSupabase } from "@/lib/uploadImage";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useStore from "@/lib/store";
import { checkAndInsertKakaoEmail } from "@/lib/checkUser";
import Head from "next/head";

export default function Home() {
  const [mealType, setMealType] = useState<string>("breakfast");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textarea, setTextarea] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    ai_text: string;
    total_calories: number;
    items: string;
  }>({ total_calories: 0, items: "", ai_text: "" });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const { kakaoEmail, setkakaoEmail } = useStore();
  const [isClient, setIsClient] = useState(false);

  // Steps for the Joyride tour
  const steps: Step[] = [
    {
      target: '[data-tour="1"]', // Select the reportButton by class
      content: "Hi1: This is where you can view your report.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="2"]', // Use the data-tour attribute for inputContainer
      content: "Hi2: Upload your meal image here.",
    },
    {
      target: '[data-tour="3"]', // Use the data-tour attribute for textareaContainer
      content: "Hi3: Describe your meal in this text area.",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      // Do something after the tour ends
    }
  };

  useEffect(() => {
    async function signInWithKakao() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "kakao",
          options: {
            scopes: "profile_image,account_email",
          },
        });

        if (error) {
          console.error("Error signing in:", error);
        } else {
          console.log("Signed in successfully:", data);
        }
      } else {
        if (typeof session.user.email === "string") {
          console.log(session.user.email);
          setkakaoEmail(session.user.email);
          // 함수 호출 예시
          const check = await checkAndInsertKakaoEmail(session.user.email);
          if (check == 0) {
            setIsClient(true);
          }
        }
      }
    }

    signInWithKakao();
  }, []);

  const uploadImage = async () => {
    if (selectedImage) {
      const imageUrl = await uploadImageToSupabase(selectedImage);
      setUploadedImageUrl(imageUrl);
      return imageUrl;
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      let convertedImage: string | ArrayBuffer | null = null;

      if (file.type === "image/heic" || file.type === "image/heif") {
        try {
          const heic2any = (await import("heic2any")).default;
          const conversionResult = await heic2any({
            blob: file,
            toType: "image/jpeg",
          });
          convertedImage = await convertBlobToDataURL(conversionResult as Blob);
        } catch (error) {
          console.error("Error converting HEIC image:", error);
          return;
        }
      } else {
        convertedImage = await readFileAsDataURL(file);
      }

      if (convertedImage) {
        resizeImage(convertedImage as string, 512, 512, (resizedDataUrl) => {
          setSelectedImage(resizedDataUrl);
        });
      }
    }
  };

  const convertBlobToDataURL = (
    blob: Blob
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const readFileAsDataURL = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData: FormDataType = {
      mealType,
      selectedImage: selectedImage,
      description: textarea,
    };

    const res = await estimateCal(formData);
    setResult({
      total_calories: res.total_calories,
      items: res.items,
      ai_text: res.ai_text,
    });
    const imageUrl = await uploadImage();
    const saveFormData: SaveFormDataType = {
      kakaoEmail: kakaoEmail,
      mealType: mealType,
      imageUrl: imageUrl as string,
      calorie: res.total_calories,
      items: res.items,
      ai_text: res.ai_text,
    };
    saveMeal(saveFormData);
    setSubmitted(true);
    setLoading(false);
  };

  const handleReset = () => {
    setMealType("breakfast");
    setSelectedImage(null);
    setTextarea("");
    setSubmitted(false);
    setResult({ total_calories: 0, items: "", ai_text: "" });
  };

  const handleReportClick = () => {
    router.push("/report"); // '/report' 페이지로 이동
  };

  return (
    <>
      {isClient && (
        <Joyride
          steps={steps}
          callback={handleJoyrideCallback}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={false}
          showSkipButton={true}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      )}
      <header className={styles.header}>
        <div className={styles.title}>칼로리 측정</div>
        <div
          className={styles.reportButton}
          onClick={handleReportClick}
          data-tour="1"
        >
          <Image
            src="/calendar.png"
            alt="레포트 아이콘"
            width={24}
            height={24}
            color="#ffffff"
          />
        </div>
      </header>

      <div className={styles.container}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {!submitted ? (
          <>
            <div className={styles.inputContainer}>
              <input
                type="file"
                accept="image/*,image/heic,image/heif"
                className={styles.fileInput}
                id="file"
                onChange={handleImageChange}
                style={{ display: selectedImage ? "none" : "block" }}
              />
              {!selectedImage && (
                <label
                  htmlFor="file"
                  className={styles.uploadButton}
                  data-tour="2"
                >
                  이미지 업로드
                </label>
              )}
              {selectedImage && (
                <div
                  className={styles.imagePreview}
                  onClick={() => document.getElementById("file")?.click()}
                >
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    className={styles.image}
                    width={320}
                    height={320}
                  />
                </div>
              )}
            </div>
            <div className={styles.textareaContainer} data-tour="3">
              <textarea
                id="textarea" // 텍스트 입력창에 id 추가
                placeholder="계란 2개, 닭가슴살 100g"
                className={styles.textarea}
                value={textarea}
                onChange={handleTextareaChange}
              ></textarea>
            </div>
            <button
              id="submitButton" // 측정 버튼에 id 추가
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              측정
            </button>
          </>
        ) : (
          <div className={styles.resultContainer}>
            {selectedImage && (
              <div className={styles.imagePreview}>
                <Image
                  src={selectedImage}
                  alt="Selected"
                  className={styles.image}
                  width={320}
                  height={320}
                />
              </div>
            )}
            <div className={styles.calorie}>
              Calorie: {result.total_calories} kcal
            </div>
            <div className={styles.tagContainer}>
              <span className={styles.tag}>
                # {getMealTypeKorean(mealType)}
              </span>
              {result.items.split(", ").map((item, index) => (
                <span key={index} className={styles.tag}>
                  # {item}
                </span>
              ))}
            </div>
            <div className={styles.aiText}>{result.ai_text}</div>
            <div className={styles.additionalInfo}>
              칼로리는 여성 평균 1인분 기준으로 측정하였습니다.
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.resetButton} onClick={handleReset}>
                다시하기
              </button>
              <KakaoShareButton
                result={result}
                mealType={mealType}
                selectedImage={selectedImage}
                uploadedImageUrl={uploadedImageUrl}
              />
            </div>
          </div>
        )}
        <footer className={styles.footer}>
          <Image
            src="/banner.gif"
            alt="Banner"
            width={400}
            height={400}
            className={styles.bannerImage}
          />
        </footer>
      </div>
    </>
  );
}
