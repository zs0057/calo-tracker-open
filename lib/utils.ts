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

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
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
