export const imageBlobToWebp = async (blob: Blob): Promise<Blob> => {
  const image = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const reader = new FileReader();
  const promise = new Promise<Blob>((resolve, reject) => {
    reader.onload = () => {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx!.drawImage(image, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/webp",
          0.8
        );
      };
      image.src = reader.result as string;
    };
    reader.onerror = reject;
  });
  reader.readAsDataURL(blob);
  return promise;
};
