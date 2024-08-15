import { supabase } from "@/lib/supabaseClient";
import { getKoreanDateRange } from "./utils";

type Content = {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
};

export async function getMealCaloriesByDateAndEmail(
  kakaoEmail: string,
  date: string
): Promise<Content> {
  const { startDate, endDate } = getKoreanDateRange(date);

  const { data, error } = await supabase
    .from("meals")
    .select("meal_type, calorie")
    .eq("kakao_email", kakaoEmail)
    .gte("created_at", startDate)
    .lte("created_at", endDate);

  if (error) {
    console.error("Error fetching meal data:", error);
    throw new Error("Failed to fetch meal data");
  }

  // 초기값을 0으로 설정
  const content: Content = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  };

  // 데이터가 존재할 경우 각 meal_type에 맞는 칼로리 합산
  if (data) {
    data.forEach((meal) => {
      const mealType = meal.meal_type as keyof Content;
      const calorie = meal.calorie || 0;
      content[mealType] += calorie;
    });
  }

  return content;
}
