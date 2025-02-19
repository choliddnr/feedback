import { toNumber } from "@vue/shared";
import { type MultiPartData } from "h3";
import {
  merchantLogoStorage,
  merchantImageBackgroundStorage,
} from "../../utils/storage";
import { merchants, eq } from "../../../shared/db.schema";
import { User } from "#auth-utils";
import { type Merchant } from "../../../shared/types";
import type { Storage, StorageValue } from "unstorage";

const FILE_KEYS = ["name", "filename", "type", "data"];
const isFIle = (data: MultiPartData) => {
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

const saveFile = async (
  name: string,
  file: MultiPartData,
  storage: Storage<StorageValue>
) => {
  const [_mime, ext] = String(file.type).split("/");
  const filename = `${name}_${Date.now()}.${ext}`;
  await storage.setItemRaw(filename, file.data);
  return filename;
};

export default defineEventHandler(async (e) => {
  const id = toNumber(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));
  let newData = {} as Partial<
    Pick<
      Merchant,
      | "title"
      | "description"
      | "category"
      | "greeting"
      | "primary_color"
      | "logo"
      | "image_background"
    > & { updated: Date }
  >;
  if (body.title) newData["title"] = body.title;
  if (body.description) newData["description"] = body.description;
  if (body.greeting) newData["greeting"] = body.greeting;
  if (body.primary_color) newData["primary_color"] = body.primary_color;
  if (body.category) newData["category"] = body.category as number;

  try {
    //     if (body.logo) {
    //       const oldFIle = await useDB()
    //         .select({ logo: merchants.logo })
    //         .from(merchants)
    //         .where(eq(merchants.id, id))
    //         .limit(1);
    //       merchantLogoStorage.removeItem(oldFIle[0].logo!);
    //       newData["logo"] = await saveFile(
    //         `merchant_logo_${id}`,
    //         body.picture,
    //         merchantLogoStorage
    //       );
    //     }
    //     if (body.image_background) {
    //       const oldFile = await useDB()
    //         .select({ image_background: merchants.image_background })
    //         .from(merchants)
    //         .where(eq(merchants.id, id))
    //         .limit(1);
    //       merchantImageBackgroundStorage.removeItem(oldFile[0].image_background!);
    //       newData["image_background"] = await saveFile(
    //         `merchant_image_background_${id}`,
    //         body.picture,
    //         merchantImageBackgroundStorage
    //       );
    //     }

    newData["updated"] = new Date();
    const newMerchant = await useDB()
      .update(merchants)
      .set(newData)
      .where(eq(merchants.id, id))
      .returning();
    return newMerchant[0];
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown merchant/id/patch error"
    );
  }

  //   return newData;
});
