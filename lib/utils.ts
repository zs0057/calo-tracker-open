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
