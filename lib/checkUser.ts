import { supabase } from "./supabaseClient";

export async function checkAndInsertKakaoEmail(email: string): Promise<number> {
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
    console.error("Error inserting email:", insertError);
    throw new Error("Failed to insert email.");
  }

  return 0;
}
