import { merchants, eq } from "~~/server/utils/db/schema";
import { H3Event, type MultiPartData } from "h3";
import { Merchant, NewProduct, Product } from "~~/shared/types";
import { stringToSlug } from "~~/server/utils";
import type { Storage } from "unstorage";
import { productImageStorage } from "~~/server/utils/storage";
import { record } from "better-auth";

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
  // const session = await auth.api.getSession({
  //   headers: e.headers,
  // });
  // if (!session?.user)
  //   throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  // return await db.select().from(merchants).where(eq(merchants.owner, user.id!));

  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof NewProduct,
    any
  >;
  let newData = {} as NewProduct;
  // newData["owner"] = Number(session.user.id);
  if (!body.title || !body.merchant || !body.description)
    createError({
      statusCode: 400,
      statusMessage: "Invalid Bed Request",
    });

  newData["merchant"] = Number(body.merchant) as number;
  newData["title"] = body.title;
  newData["description"] = body.description;

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
    // newData["updatedAt"] = Date.now();
    return await db.insert(products).values(newData).returning();
    // await setUserSession(e, { user: newuser[0], loggedInAt: new Date() });
    // return await getUserSession(e);
    // return anew;
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
