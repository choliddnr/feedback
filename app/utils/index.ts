export const toKebabCase = (str: string) => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};

/**
 * construct img url
 * @param src: string
 * @returns :string
 */
export const getImg = (src: string) => {
  if (isValidURL(src)) return src;
  const config = useRuntimeConfig();
  return config.public.BASE_URL + "/api/image/" + src;
};

/**
 * Upload an image to the server.
 * @param src - The source path of the image.
 * @param file - The image file to upload.
 * @returns The URL of the uploaded image.
 */
// export const uploadImg = async (src: string, file: File) => {
//   await $fetch(`/api/image/${src}`, {
//     method: "PUT",
//     body: file,
//   });
//   return getImg(src); // Return the URL of the uploaded image
// };

/**
 * is the string a valid URL?
 * @param str - The string to validate as a URL.
 * @returns boolean
 */
export const isValidURL = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};
