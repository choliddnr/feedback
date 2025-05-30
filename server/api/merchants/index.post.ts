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
  // newData["owner"] = Number(1);

  newData["owner"] = Number(session!.user.id);
  newData["title"] = body.title;
  newData["slug"] = body.slug;
  newData["description"] = body.description;
  newData["category"] = Number(body.category);
  newData["greeting"] = "greeting "; //not used for now

  /**
   * Since we are using bunny.net storage that require raw File data,
   * we used readFormData to get the file data
   * and then upload it to the storage
   */
  const logo_file = (await readFormData(e)).get("logo") as File;
  const filename = "merchant/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
  newData["logo"] = filename;

  try {
    await saveImg(e, logo_file, filename); // all uploaded images are saved as webp format

    /**
     * Validate the data before inserting it into the database
     */

    const validate = await InsertMerchantSchema.safeParseAsync(newData);
    if (!validate.success) {
      return sendError(
        e,
        createError({
          statusCode: 422,
          statusMessage: JSON.stringify(validate.error),
        })
      );
    }

    return await db(e).insert(merchants).values(newData).returning();
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
