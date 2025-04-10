// ledMatrixUtils.js
export const ledMatrixCache = new Map();

export async function loadImageAndGetData(imgSrc, height, resolution, blurAmount) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const aspect = img.width / img.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = height * resolution;
      canvas.width = canvas.height * aspect;
      if (blurAmount > 0) {
        ctx.filter = `blur(${blurAmount}px)`;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    img.onerror = (err) => reject(err);
  });
}