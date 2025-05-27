import { H3Event, type MultiPartData } from "h3";

export const stringToSlug = (str: string): string => {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-word characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
};

const FILE_KEYS = ["name", "filename", "type", "data"];
const isFIle = (data: MultiPartData) => {
  const dataKeysSet = new Set(Object.keys(data));
  return FILE_KEYS.every((key) => dataKeysSet.has(key));
};

/**
 * Parsing multipart data from the request body
 * @param data
 * @returns
 */
export const parseMultipartData = (data?: MultiPartData[]) => {
  const arr = (Array.isArray(data) ? data : []) as MultiPartData[];
  const result = arr.reduce((prev: Record<string, any>, curr) => {
    prev[String(curr.name)] = isFIle(curr) ? curr : curr.data.toString("utf8");
    return prev;
  }, {});
  return result;
};

/**
 * Upload image into storage
 * @param name
 * @param file
 * @returns filename
 */

// const saveFile = async (
//   name: string,
//   file: MultiPartData,
//   storage: Storage
// ) => {
//   const [_mime, ext] = String(file.type).split("/");
//   const filename = `${name}.${ext}`;
//   await storage.setItemRaw(filename, file.data);
//   return filename;
// };

/**
 * Generate a new filename using UUID
 * This is useful to avoid conflicts and cache issues
 * @param filename
 * @returns string
 */
export const generateNewFilename = (filename: string): string => {
  const [_mime, ext] = String(filename).split(".");
  return crypto.randomUUID() + "." + ext;
};
