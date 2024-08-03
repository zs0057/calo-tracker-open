"use client";

import { FormDataType } from "@/lib/apiClient";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import styles from "./Home.module.css";
import { estimateCal } from "@/lib/apiClient";
import { getMealTypeKorean, resizeImage } from "@/lib/utils";
import KakaoShareButton from "@/components/KakaoShareButton";

export default function Home() {
  const [mealType, setMealType] = useState<string>("breakfast");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textarea, setTextarea] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    total_calories: number;
    items: string;
  }>({ total_calories: 0, items: "" });

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
    });
    setSubmitted(true);
    setLoading(false);
  };

  const handleReset = () => {
    setMealType("breakfast");
    setSelectedImage(null);
    setTextarea("");
    setSubmitted(false);
    setResult({ total_calories: 0, items: "" });
  };

  return (
    <>
      <header className={styles.header}>칼로리 측정</header>
      <div className={styles.container}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {!submitted ? (
          <>
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
                <label htmlFor="file" className={styles.uploadButton}>
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
            <div className={styles.textareaContainer}>
              <textarea
                placeholder="설명을 입력하세요. 예시: 계란 2개"
                className={styles.textarea}
                value={textarea}
                onChange={handleTextareaChange}
              ></textarea>
            </div>
            <button className={styles.submitButton} onClick={handleSubmit}>
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
            <div className={styles.actionButtons}>
              <button className={styles.resetButton} onClick={handleReset}>
                다시하기
              </button>
              <KakaoShareButton
                result={result}
                mealType={mealType}
                selectedImage={selectedImage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
