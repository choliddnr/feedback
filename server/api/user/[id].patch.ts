import { toNumber } from "@vue/shared";
import { type MultiPartData } from "h3";
import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";
import { randomUUID } from "node:crypto";
import { users, eq } from "../../../shared/db.schema";

const storage = createStorage({ driver: fsLiteDriver({ base: "./data" }) });
const FILE_KEYS = ["name", "filename", "type", "data"];
const isFIle = (data: MultiPartData) => {
  // return Object.keys(data).every((key) => FILE_KEYS.includes(key));
  // Object.keys(data).filter((key)=>FILE_KEYS.indexOf(key)!==-1).length === FILE_KEYS.length;
  const dataKeysSet = new Set(Object.keys(data));
  return FILE_KEYS.every((key) => dataKeysSet.has(key));
};
const parseMultipartData = (data?: MultiPartData[]) => {
  const arr = (Array.isArray(data) ? data : []) as MultiPartData[];
  const result = arr.reduce((prev: Record<string, any>, curr) => {
    prev[String(curr.name)] = isFIle(curr) ? curr : curr.data.toString("utf8");
    return prev;
  }, {});
  return result;
};

const saveFile = async (file: MultiPartData) => {
  const id = randomUUID();
  const [_mime, ext] = String(file.type).split("/");
  const filename = `${id}.${ext}`;
  await storage.setItemRaw(filename, file.data);
  return filename;
};

export default defineEventHandler(async (e) => {
  const id = toNumber(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));
  try {
    console.log(body!);
    const newData = {
      username: body!.username,
      name: body!.name,
      picture: await saveFile(body!.picture),
      updated: new Date(),
    };
    return await useDB().update(users).set(newData).where(eq(users.id, id));
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
