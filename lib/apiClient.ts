export interface FormDataType {
  mealType: string;
  selectedImage: string | null;
  description: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/estimateCal";

export const estimateCal = async (formData: FormDataType) => {
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

  return { items, total_calories };
};
