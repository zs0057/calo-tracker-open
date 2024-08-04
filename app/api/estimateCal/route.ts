import { openAiRequest } from "@/lib/api/openapi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  try {
    const body = await req.json(); // JSON 본문을 파싱
    const text = body.description;
    const base64Image = body.selectedImage;
    console.log();
    const aiText = await openAiRequest(base64Image, text);
    console.log(aiText);
    return NextResponse.json(aiText);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse JSON" },
      { status: 400 }
    );
  }
}
