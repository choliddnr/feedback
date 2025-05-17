import { merchants, eq } from "~~/server/utils/db/schema";
import { H3Event, type MultiPartData } from "h3";
import { Merchant } from "~~/shared/types";
import { stringToSlug } from "~~/server/utils";
import type { Storage } from "unstorage";

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
  // console.log(filename);
  await storage.setItemRaw(filename, file.data);
  return filename;
};

export default defineEventHandler(async (e) => {
  const session = await auth.api.getSession({
    headers: e.headers,
  });
  if (!session?.user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  // return await db.select().from(merchants).where(eq(merchants.owner, user.id!));

  const body = parseMultipartData(await readMultipartFormData(e));
  let newData = {} as Omit<Merchant, "id">;
  newData["owner"] = Number(session.user.id);
  newData["title"] = body.title || "no title";
  newData["description"] = body.description;
  newData["category"] = body.category;
  newData["greeting"] = "kjdsghksdjg ";

  // const body =
  // return await db.insert(merchants).values({ name: "Dan" }).returning();});

  try {
    if (body.logo) {
      newData["logo"] = await saveFile(
        stringToSlug(body.title),
        body.logo,
        merchantLogoStorage
      );
    }
    if (body.image_background) {
      newData["image_background"] = await saveFile(
        stringToSlug(body.title),
        body.image_background,
        merchantImageBackgroundStorage
      );
    }

    // newData["updatedAt"] = Date.now();
    return await db.insert(merchants).values(newData).returning();
    // await setUserSession(e, { user: newuser[0], loggedInAt: new Date() });
    // return await getUserSession(e);
    // return anew;
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
