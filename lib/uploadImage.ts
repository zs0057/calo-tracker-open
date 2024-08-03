import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const uploadImageToSupabase = async (
  base64Image: string
): Promise<string | null> => {
  try {
    const base64Data = base64Image.split(",")[1]; // "data:image/jpeg;base64," 부분을 제거하고 이미지 데이터만 추출
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    // 파일 경로를 UUID를 사용하여 랜덤으로 생성
    const filePath = `images/${uuidv4()}.jpg`;

    const { data, error } = await supabase.storage
      .from("images") // 버킷 이름을 입력하세요
      .upload(filePath, blob, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const { publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(filePath).data;

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
};
