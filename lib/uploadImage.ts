import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { resizeImage64 } from "./utils";

export const uploadImageToSupabase = async (
  base64Image: string
): Promise<string | null> => {
  try {
    // 이미지 리사이즈 (200x200)
    const resizedBlob = await resizeImage64(base64Image, 512, 512);

    // 파일 경로를 UUID를 사용하여 랜덤으로 생성
    const filePath = `images/${uuidv4()}.jpg`;

    const { data, error } = await supabase.storage
      .from("images") // 버킷 이름을 입력하세요
      .upload(filePath, resizedBlob, {
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
