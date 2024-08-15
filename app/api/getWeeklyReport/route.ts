import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  const date = searchParams.get("date");

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("current_room")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    return new NextResponse(JSON.stringify({ error: userError.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (!userData) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const getDateRange = (endDateStr: string): string[] => {
    const endDate = new Date(endDateStr);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    const dateArray = [];
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dateArray.push(date.toISOString().split("T")[0]);
    }
    return dateArray;
  };

  const dateArray = getDateRange(date as string);

  const results = [];
  for (const dateString of dateArray) {
    const { data, error } = await supabase
      .from("daily_reports")
      .select("date, breakfast, lunch, dinner, snack, weight, exercise_minutes")
      .eq("user_id", userId)
      .eq("date", dateString)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching report data:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    results.push({
      date: dateString,
      breakfast: data?.breakfast ?? 0,
      lunch: data?.lunch ?? 0,
      dinner: data?.dinner ?? 0,
      snack: data?.snack ?? 0,
      weight: data?.weight ?? 0,
      exercise_minutes: data?.exercise_minutes ?? 0,
    });
  }

  return new NextResponse(JSON.stringify(results), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
