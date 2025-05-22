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
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));

  let newData = {} as Partial<Omit<Merchant, "id">>;

  if (body.title) newData["title"] = body.title;
  if (body.slug) newData["slug"] = body.slug;
  if (body.description) newData["description"] = body.description;
  if (body.category) newData["category"] = body.category;
  if (body.greeting) newData["greeting"] = body.category;

  // const body =
  // return await db.insert(merchants).values({ name: "Dan" }).returning();});

  try {
    let oldData = [] as Merchant[];
    if (body.logo || body.image_background) {
      oldData = await $fetch<Merchant[]>("/api/merchants/" + id, {
        headers: e.headers,
      });
      if (oldData?.length === 0) {
        return sendError(
          e,
          createError({
            statusCode: 403,
            statusMessage: "merchant doesn't exist",
          })
        );
      }
      if (body.logo) {
        merchantLogoStorage.removeItem(oldData[0]!.logo!);
        newData["logo"] = await saveFile(
          Date.now().toString(),
          body.logo,
          merchantLogoStorage
        );
      }
      if (body.image_background) {
        merchantImageBackgroundStorage.removeItem(
          oldData[0]!.image_background!
        );
        newData["image_background"] = await saveFile(
          Date.now().toString(),
          body.image_background,
          merchantImageBackgroundStorage
        );
      }
    }

    return await db
      .update(merchants)
      .set(newData)
      .where(
        and(eq(merchants.owner, Number(session.user.id)), eq(merchants.id, id))
      )
      .returning();

    // newData["updatedAt"] = Date.now();
    // return await db.insert(merchants).values(newData).returning();
    // await setUserSession(e, { user: newuser[0], loggedInAt: new Date() });
    // return await getUserSession(e);
    // return anew;
  } catch (err) {
    return sendError(
      e,
      createError(
        err instanceof Error ? err.message : "Unknown usr/id/patch error"
      )
    );
  }
});
