import { supabase } from "./supabaseClient";

// Supabase Error 타입 지정 (간단한 예제)
interface SupabaseError {
  message: string;
  details: string | null;
  hint: string | null;
  code: string | null;
  status: number; // status 코드를 명시적으로 포함
}

export async function checkAndInsertKakaoEmail(email: string): Promise<number> {
  try {
    // 먼저 해당 이메일이 존재하는지 확인합니다.
    const { data, error } = await supabase
      .from("users")
      .select("kakao_email")
      .eq("kakao_email", email);

    if (error) {
      console.error("Error checking email:", error);
      throw new Error("Failed to check email.");
    }

    // 데이터가 존재하면 1을 리턴합니다.
    if (data && data.length > 0) {
      return 1;
    }

    // 데이터가 없으면 새로 삽입하고 0을 리턴합니다.
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ kakao_email: email }]);

    if (insertError) {
      const supabaseError = insertError as SupabaseError; // 에러를 SupabaseError로 타입 캐스팅
      // 409 Conflict error를 명시적으로 처리
      if (supabaseError.status === 409) {
        console.warn("Email already exists in the database.");
        return 1; // 이미 존재하므로 1을 리턴
      }
      console.error("Error inserting email:", insertError);
      throw new Error("Failed to insert email.");
    }

    return 0;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred.");
  }
}
