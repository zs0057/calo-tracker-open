import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { SaveFormDataType } from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const formData: SaveFormDataType = await request.json();
    console.log(formData);
    const { kakaoEmail, mealType, imageUrl, calorie, items, ai_text } =
      formData;
    const { data, error } = await supabase.from("meals").insert([
      {
        kakao_email: kakaoEmail,
        meal_type: mealType,
        image_url: imageUrl,
        calorie: calorie,
        items: items,
        ai_text,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
