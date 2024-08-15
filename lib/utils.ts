export const resizeImage = (
  dataUrl: string,
  width: number,
  height: number,
  callback: (resizedDataUrl: string) => void
) => {
  if (typeof window === "undefined") {
    return;
  }

  const img = new window.Image();
  img.src = dataUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataUrl = canvas.toDataURL("image/jpeg");
      callback(resizedDataUrl);
    }
  };
};

export const getMealTypeKorean = (mealType: string) => {
  switch (mealType) {
    case "breakfast":
      return "아침";
    case "lunch":
      return "점심";
    case "dinner":
      return "저녁";
    case "snack":
      return "간식";
    default:
      return "";
  }
};

export const resizeImage64 = (
  base64Image: string,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // 가로 4, 세로 3 비율로 크기 조정
      if (width / height > 4 / 3) {
        // 이미지가 이미 가로 4, 세로 3 비율보다 더 넓은 경우
        height = (width * 3) / 4;
      } else {
        // 이미지가 가로 4, 세로 3 비율보다 더 좁거나 같은 경우
        width = (height * 4) / 3;
      }

      // 최대 크기 제한 적용
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Image resizing failed"));
            }
          },
          "image/jpeg",
          0.9 // 품질 설정 (0.0에서 1.0 사이)
        );
      } else {
        reject(new Error("Canvas context is not available"));
      }
    };

    img.onerror = (error) => reject(error);
  });
};

// lib/utils.ts
export async function getCurrentRoom(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/getCurrentRoom?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getWeeklyReport(userId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${baseUrl}/api/getWeeklyReport?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getWeeklyReport1(userId: string, date: Date) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const formatedDate = formatDate(date);
  try {
    const res = await fetch(
      `${baseUrl}/api/getWeeklyReport?user_id=${userId}&date=${formatedDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getContent(userId: string, date: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(
      `${baseUrl}/api/getReport?user_id=${userId}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export async function getUserId(uuid: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/api/getUserId?uuid=${uuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("error");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}

export const getYesterDate = () => {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000; // 현재 시간을 UTC로 변환
  const kstTime = utcNow + 9 * 60 * 60 * 1000; // UTC 시간을 KST로 변환
  const kstDate = new Date(kstTime);

  // KST 기준으로 어제 날짜 계산
  kstDate.setDate(kstDate.getDate() - 1);

  const year = kstDate.getFullYear();
  const month = (kstDate.getMonth() + 1).toString().padStart(2, "0");
  const day = kstDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 날짜를 형식화하는 함수
export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 한국 시간대로 어제 날짜를 가져오는 함수
export const getTodayDateInKorea = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000; // 분 단위를 밀리초 단위로 변환
  const koreaOffset = 9 * 60 * 60000; // 한국 시간대 오프셋 (UTC+9)
  const koreaTime = new Date(now.getTime() + utcOffset + koreaOffset);

  koreaTime.setDate(koreaTime.getDate()); // 어제 날짜로 설정
  return koreaTime;
};

// 한국 표준시(KST)를 기준으로 날짜 범위를 생성하는 함수
export function getKoreanDateRange(date: string): {
  startDate: string;
  endDate: string;
} {
  // date 문자열을 KST 기준으로 변환
  const startDate = new Date(`${date}T00:00:00+09:00`); // KST 자정 시작
  const endDate = new Date(`${date}T23:59:59.999+09:00`); // KST 마지막 시간

  // UTC로 변환
  const utcStartDate = startDate.toISOString();
  const utcEndDate = endDate.toISOString();

  return {
    startDate: utcStartDate,
    endDate: utcEndDate,
  };
}

export function generateLabelDates(date: string, days: number): string[] {
  const labelDate: string[] = [];
  let currentDate = new Date(date);

  for (let i = 0; i < days; i++) {
    // 날짜를 MM.DD 형식의 문자열로 변환
    const month = (currentDate.getMonth() + 1).toString(); // 월은 0부터 시작하므로 +1
    const day = currentDate.getDate().toString();

    // "8.15" 형식으로 저장
    labelDate.unshift(`${month}.${day}`); // 배열 앞에 추가

    // 날짜를 하루씩 낮춤
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return labelDate;
}

// 사용 예시
const date = "2024-08-15";
const labelDate = generateLabelDates(date, 7);
console.log(labelDate);
