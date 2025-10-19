import { merchants, eq, UpdateMerchantSchema } from "~~/server/utils/db/schema";
import { Merchant } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";
import { saveImg } from "~~/server/utils/image";
import { isValidURL } from "~/utils";

export default defineEventHandler(async (e) => {
  const session = await _auth(e).api.getSession({
    headers: e.headers,
  });
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));

  const newData = {} as Partial<Omit<Merchant, "id">>;

  if (body.title) newData.title = body.title;
  if (body.slug) newData.slug = body.slug;
  if (body.description) newData.description = body.description;
  if (body.category) newData.category = Number(body.category);
  if (body.logo) {
    newData.logo = "merchant/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache - all uploaded images are saved as webp format
  }

  /**
   * Validate the data before inserting it into the database
   */
  const validate = UpdateMerchantSchema.safeParse(newData);
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
    if (newData.slug) {
      const slug = await db(e)
        .select()
        .from(merchants)
        .where(eq(merchants.slug, newData.slug))
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
    }
    const oldData = await db(e)
      .select()
      .from(merchants)
      .where(eq(merchants.id, id))
      .limit(1)
      .get();
    if (!oldData) {
      return sendError(
        e,
        createError({
          statusCode: 404,
          statusMessage: "Missing data to update",
        })
      );
    }

    /**
     * delete old logo logic
     * If the logo is updated, we need to delete the old logo image
     */

    if (body.logo) {
      if (oldData.logo && !isValidURL(oldData.logo))
        await deleteImg(e, oldData.logo); // user image could be null, delete it if exists
      if (newData.logo) await saveImg(e, body.logo.data, newData.logo);
    }

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
