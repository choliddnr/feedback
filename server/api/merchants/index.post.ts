import { merchants } from "~~/server/utils/db/schema";
import { Merchant } from "~~/shared/types";
import {
  generateNewFilename,
  parseMultipartData,
  stringToSlug,
} from "~~/server/utils";
import { saveImg } from "~~/server/utils/image";

export default defineEventHandler(async (e) => {
  const session = await auth(e).api.getSession({
    headers: e.headers,
  });

  const body = parseMultipartData(await readMultipartFormData(e));
  let newData = {} as Omit<Merchant, "id">;

  newData["owner"] = Number(session!.user.id);
  newData["title"] = body.title;
  newData["slug"] = body.slug;
  newData["description"] = body.description;
  newData["category"] = Number(body.category);
  newData["greeting"] = "greeting "; //not used for now

  const filename = "merchant/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
  newData["logo"] = filename;

  /**
   * Validate the data before inserting it into the database
   */

  const validate = InsertMerchantSchema.safeParse(newData);
  if (!validate.success) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: JSON.stringify(validate.error),
      })
    );
  }
  try {
    const slug = await db(e)
      .select()
      .from(merchants)
      .where(eq(merchants.slug, newData["slug"]))
      .limit(1)
      .get();
    if (slug) {
      return sendError(
        e,
        createError({
          statusCode: 422,
          statusMessage: "slug is already taken",
        })
      );
    }
    console.log("body.logo.data,", body.logo.data);
    await saveImg(e, body.logo.data, filename); // all uploaded images are saved as webp format
    return await db(e).insert(merchants).values(newData).returning();
  } catch (err) {
    throw createError(
      err instanceof Error ? err.message : "Unknown usr/id/patch error"
    );
  }
});
