export interface FormDataType {
  mealType: string;
  selectedImage: string | null;
  description: string;
}
export interface SaveFormDataType {
  kakaoEmail: string;
  mealType: string;
  imageUrl: string;
  calorie: number;
  items: string;
  ai_text: string;
}

export const estimateCal = async (formData: FormDataType) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/estimateCal";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // JSON 데이터를 보내기 위한 Content-Type 설정
    },
    body: JSON.stringify(formData), // formData 객체를 JSON 문자열로 변환
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Failed to submit form");
  }

  const parseJson = JSON.parse(await response.json());
  const items = parseJson.items;
  const total_calories = parseJson.total_calories;
  const ai_text = parseJson.ai_text;
  return { items, total_calories, ai_text };
};

export const saveMeal = async (formData: SaveFormDataType) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/saveMeal";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 데이터를 보내기 위한 Content-Type 설정
      },
      body: JSON.stringify(formData), // formData 객체를 JSON 문자열로 변환
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to submit form");
    }

    const parsedJson = await response.json(); // JSON 응답을 파싱
    const { items, total_calories, ai_text } = parsedJson;

    return { items, total_calories, ai_text };
  } catch (error) {
    console.error("Error saving meal:", error);
    throw error;
  }
};
