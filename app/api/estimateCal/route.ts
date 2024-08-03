import { openAiRequest } from "@/lib/api/openapi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // JSON 본문을 파싱
    const text = body.description;
    const base64Image = body.selectedImage;

    const aiText = await openAiRequest(base64Image, text);

    return NextResponse.json(aiText);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse JSON" },
      { status: 400 }
    );
  }
}
