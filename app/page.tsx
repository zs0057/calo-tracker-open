"use client";

import { ChangeEvent, Suspense, useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useStore from "@/lib/store";
import { checkAndInsertKakaoEmail } from "@/lib/checkUser";
import Head from "next/head";
import MixpanelComponent from "@/components/MixpanelComponent";
import analytics from "@/lib/analytics";
import { FaRedoAlt } from "react-icons/fa"; // restart 아이콘 추가

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
      content: "측정한 칼로리의 기록들을 볼 수 있어요!",
      disableBeacon: true,
    },
    {
      target: '[data-tour="2"]', // Use the data-tour attribute for inputContainer
      content: "음식이미지를 업로드 해주세요!",
    },
    {
      target: '[data-tour="3"]', // Use the data-tour attribute for textareaContainer
      content:
        "정확한 측정을 위해 음식에 대한 설명을 적어주세요! (예시: 계란2개, 닭가슴살 150g)",
    },
  ];

  // const handleJoyrideCallback = (data: CallBackProps) => {
  //   const { status } = data;
  //   const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
  //   if (finishedStatuses.includes(status)) {
  //     // Do something after the tour ends
  //   }
  // };
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
        setkakaoEmail(session.user.email);
        console.log("session: ", session.user.email);
        // 함수 호출 예시
        const check = await checkAndInsertKakaoEmail(session.user.email);
        if (check == 0) {
          setIsClient(true);
        }
      }
      return session.user.email;
    }
  }

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get("utm_source");
      if (utmSource) {
        localStorage.setItem("utm_source", utmSource);
      }

      const storedMealType = localStorage.getItem("mealType");
      const storedImage = localStorage.getItem("selectedImage");
      const storedDescription = localStorage.getItem("description");

      if (storedMealType) setMealType(storedMealType);
      if (storedImage) setSelectedImage(storedImage);
      if (storedDescription) setTextarea(storedDescription);

      analytics.page();
    }
  }, []);

  useEffect(() => {
    // mealType, selectedImage, description이 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem("mealType", mealType);
    if (selectedImage) localStorage.setItem("selectedImage", selectedImage);
    localStorage.setItem("description", textarea);
  }, [mealType, selectedImage, textarea]);

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
    analytics.track("측정버튼클릭");

    const email = await signInWithKakao();

    if (!email) {
      console.error("이메일을 가져오지 못했습니다.");
      return;
    }
    setLoading(true);
    const formData: FormDataType = {
      mealType,
      selectedImage: selectedImage,
      description: textarea,
    };
    console.log("submit: ", email);

    const res = await estimateCal(formData);
    setResult({
      total_calories: res.total_calories,
      items: res.items,
      ai_text: res.ai_text,
    });
    const imageUrl = await uploadImage();
    const saveFormData: SaveFormDataType = {
      kakaoEmail: email as string,
      mealType: mealType,
      imageUrl: imageUrl as string,
      calorie: res.total_calories,
      items: res.items,
      ai_text: res.ai_text,
    };
    saveMeal(saveFormData);
    setSubmitted(true);
    setLoading(false);
    localStorage.removeItem("mealType");
    localStorage.removeItem("selectedImage");
    localStorage.removeItem("description");
  };

  const handleReset = () => {
    setMealType("breakfast");
    setSelectedImage(null);
    setTextarea("");
    setSubmitted(false);
    setResult({ total_calories: 0, items: "", ai_text: "" });
  };

  const handleReportClick = () => {
    analytics.track("레포트 이동");
    router.push("/report"); // '/report' 페이지로 이동
  };

  const handleFooterClick = () => {
    // 로컬 스토리지에서 utm_source 값 가져오기
    const utmSource = localStorage.getItem("utm_source");

    // 기본 URL 설정
    let url = "https://dietchallenge.vercel.app/?from=calory";

    // utm_source가 존재하면 쿼리 스트링에 추가
    if (utmSource) {
      url += `&utm_source=${utmSource}`;

      // router.push 이후 로컬 스토리지에서 utm_source 삭제
      router.push(url);
      localStorage.removeItem("utm_source");
    } else {
      // utm_source가 없으면 그냥 이동
      router.push(url);
    }

    // 이벤트 트래킹
    analytics.track("랜딩페이지 이동");
  };

  return (
    <>
      {/* {isClient && (
        <div>
          <MixpanelComponent name="Joyride" />
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
        </div>
      )} */}
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
            {" "}
            <div className={styles.mealButtons}>
              <button
                className={`${styles.mealButton} ${
                  mealType === "breakfast" ? styles.activeMeal : ""
                }`}
                onClick={() => setMealType("breakfast")}
              >
                아침
              </button>
              <button
                className={`${styles.mealButton} ${
                  mealType === "lunch" ? styles.activeMeal : ""
                }`}
                onClick={() => setMealType("lunch")}
              >
                점심
              </button>
              <button
                className={`${styles.mealButton} ${
                  mealType === "dinner" ? styles.activeMeal : ""
                }`}
                onClick={() => setMealType("dinner")}
              >
                저녁
              </button>
              <button
                className={`${styles.mealButton} ${
                  mealType === "snack" ? styles.activeMeal : ""
                }`}
                onClick={() => setMealType("snack")}
              >
                간식
              </button>
            </div>
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
                <FaRedoAlt /> {/* restart 아이콘 */}
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
      </div>

      <footer className={styles.footer} onClick={handleFooterClick}>
        <Image
          src="/banner.gif"
          alt="Banner"
          width={290}
          height={100}
          className={styles.bannerImage}
          unoptimized={true}
        />
      </footer>
      <div className="text-center text-gray-400 mt-0.5 text-xs">
        해당 챌린지에서 챌린저들과 같이 감량해 도전해보세요
      </div>
    </>
  );
}
