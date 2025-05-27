import { merchants } from "~~/server/utils/db/schema";
import { Merchant } from "~~/shared/types";
import {
  generateNewFilename,
  parseMultipartData,
  stringToSlug,
} from "~~/server/utils";
import { saveImg } from "~~/server/utils/image";

/**
 *
 * Future improvement
 * 1. Server side validation
 */

export default defineEventHandler(async (e) => {
  const session = await auth(e).api.getSession({
    headers: e.headers,
  });

  const body = parseMultipartData(await readMultipartFormData(e));
  let newData = {} as Omit<Merchant, "id">;
  newData["owner"] = Number(session!.user.id);
  newData["title"] = body.title || "no title";
  newData["slug"] = body.slug || "no slug";
  newData["description"] = body.description;
  newData["category"] = body.category;
  newData["greeting"] = "kjdsghksdjg ";

  try {
    if (body.logo) {
      /**
       * If you are using fs storage, you can use the following code
       * to save the file in the local storage
       */
      // newData["logo"] = await saveFile(
      //   stringToSlug(body.title),
      //   body.logo,
      //   merchantLogoStorage
      // );

      /**
       * Since we are using bunny.net storage that require raw File data,
       * we used readFormData to get the file data
       * and then upload it to the storage
       */
      const logo_file = (await readFormData(e)).get("logo") as File;
      const filename = "merchant/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, logo_file, filename); // all uploaded images are saved as webp format
      newData["logo"] = filename;
    }

    /**
     * Image background is not used in the current version,
     */

    // if (body.image_background) {
    //   newData["image_background"] = await saveFile(
    //     stringToSlug(body.title),
    //     body.image_background,
    //     merchantImageBackgroundStorage
    //   );
    // }

    return await db(e).insert(merchants).values(newData).returning();
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
