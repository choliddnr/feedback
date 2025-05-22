import { merchants, eq } from "~~/server/utils/db/schema";
import { H3Event, type MultiPartData } from "h3";
import { Merchant, NewProduct, Product } from "~~/shared/types";
import { stringToSlug } from "~~/server/utils";
import type { Storage } from "unstorage";
import { productImageStorage } from "~~/server/utils/storage";
import { record } from "better-auth";
import { error } from "better-auth/api";

/**
 *
 * Future improvement
 * 1. Server side validation
 * 2. split these func into lib/module
 */

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
  storage: Storage
) => {
  const [_mime, ext] = String(file.type).split("/");
  const filename = `${name}.${ext}`;
  await storage.setItemRaw(filename, file.data);
  return filename;
};

export default defineEventHandler(async (e) => {
  const merchant_id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof Product,
    any
  >;
  let newData = {} as Product;
  // newData["owner"] = Number(session.user.id);
  if (body.merchant) newData["merchant"] = Number(body.merchant) as number;
  if (body.title) newData["title"] = body.title;
  if (body.description) newData["description"] = body.description;

  // const body =
  // return await db.insert(merchants).values({ name: "Dan" }).returning();});

  try {
    if (body.image) {
      newData["image"] = await saveFile(
        Date.now().toString(),
        body.image,
        productImageStorage
      );
    }
    return await db
      .update(products)
      .set(newData)
      .where(eq(products.id, merchant_id));
  } catch (err) {
    return sendError(
      e,
      createError(
        err instanceof Error ? err.message : "Unknown usr/id/patch error"
      )
    );
  }
});
