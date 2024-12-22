import type { Fn } from "@vueuse/core";

export const isEmptyObject = (obj: Object) => {
  let isEmpty = true;
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      isEmpty = false;
      break;
    }
  }
  return isEmpty;
};

export const countObjectAttribute = (
  obj: { [key: string]: any } | undefined,
  withEmptyValue: boolean = false
) => {
  let count = 0;
  if (!obj) return 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (withEmptyValue) {
        count++;
      } else {
        if (obj[key] !== "" && obj[key] !== undefined) count++;
      }
    }
  }
  return count;
};

// export const testObj = ()=

// Image reduction logic
export const reduceImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  callback: Fn
) => {
  const reader = new FileReader();
  reader.onload = function (event: Event) {
    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height && width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      } else if (height > width && height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      } else if (height > maxHeight) {
        height = maxHeight;
        width = maxHeight;
      }
      console.log("cal dim", width, height, maxHeight, maxWidth);

      // Draw the image on a canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, width, height);

      // Convert the canvas content to a Blob
      canvas.toBlob(callback, file.type, 0.8); // Adjust quality if needed
    };
    img.src = (event.target as FileReader).result as string;
  };
  reader.readAsDataURL(file);
};

// Image reduction logic
export const cropImage = (
  file: File,
  x: number,
  y: number,
  width: number,
  height: number,
  callback: Fn
) => {
  const reader = new FileReader();
  reader.onload = function (event: Event) {
    const img = new Image();
    img.onload = function () {
      let imgWidth = img.width;
      let imgHeight = img.height;

      // Draw the image on a canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      // ctx!.drawImage(img, 0, 0, width, height);
      // Draw the cropped area onto the canvas
      ctx?.drawImage(
        img,
        x,
        y,
        width,
        height, // Source (x, y, width, height)
        0,
        0,
        width,
        height // Destination (x, y, width, height)
      );

      // Convert the canvas content to a Blob
      canvas.toBlob(callback, file.type, 1);
    };
    img.src = (event.target as FileReader).result as string;
  };
  reader.readAsDataURL(file);
};

export const getImageDimensions = (
  image: File
): Promise<{ width: number; height: number }> => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (!image.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(image);
  });
};
