import { merchants, eq } from "~~/server/utils/db/schema";
import { Merchant } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";
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
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));

  let newData = {} as Partial<Omit<Merchant, "id">>;

  if (body.title) newData["title"] = body.title;
  if (body.slug) newData["slug"] = body.slug;
  if (body.description) newData["description"] = body.description;
  if (body.category) newData["category"] = body.category;
  if (body.greeting) newData["greeting"] = body.category;

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

      /**
       * Add delete old image logic
       * If the logo is updated, we need to delete the old logo image
       */
      await deleteImg(e, body.logo_filename);

      const logo_file = (await readFormData(e)).get("logo") as File;
      let filename = "merchant/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
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

    return await db(e)
      .update(merchants)
      .set(newData)
      .where(
        and(eq(merchants.owner, Number(session!.user.id)), eq(merchants.id, id))
      );
  } catch (err) {
    return sendError(
      e,
      createError(
        err instanceof Error ? err.message : "Unknown usr/id/patch error"
      )
    );
  }
});
