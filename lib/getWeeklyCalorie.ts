import { supabase } from "@/lib/supabaseClient";
import { formatDate, getKoreanDateRange } from "./utils";

type Content = {
  breakfast: number[];
  lunch: number[];
  dinner: number[];
  snack: number[];
};

export async function getWeeklyCalorie(
  kakaoEmail: string,
  date: string
): Promise<Content> {
  // 기준 날짜를 KST로 설정
  const endDate = new Date(`${date}T00:00:00+09:00`);

  // 초기값을 빈 배열로 설정
  const content: Content = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

  // 7일 동안의 데이터를 반복하여 가져옴
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() - i);

    const { startDate, endDate: currentEndDate } = getKoreanDateRange(
      formatDate(currentDate)
    );

    const { data, error } = await supabase
      .from("meals")
      .select("meal_type, calorie")
      .eq("kakao_email", kakaoEmail)
      .gte("created_at", startDate)
      .lte("created_at", currentEndDate);

    if (error) {
      console.error("Error fetching meal data:", error);
      throw new Error("Failed to fetch meal data");
    }

    // 각 meal_type에 맞는 칼로리를 합산하여 배열에 추가
    const dailyCalories: { [key in keyof Content]: number } = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };

    if (data) {
      data.forEach((meal) => {
        const mealType = meal.meal_type as keyof Content;
        const calorie = meal.calorie || 0;
        dailyCalories[mealType] += calorie;
      });
    }

    content.breakfast.unshift(dailyCalories.breakfast);
    content.lunch.unshift(dailyCalories.lunch);
    content.dinner.unshift(dailyCalories.dinner);
    content.snack.unshift(dailyCalories.snack);
  }

  return content;
}
