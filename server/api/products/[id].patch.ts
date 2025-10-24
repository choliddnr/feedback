import { eq, UpdateProductSchema } from "~~/server/utils/db/schema";
import { Product } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";
// import { isValidURL } from '~/utils';

export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof Product,
    any
  >;

  const newData = {} as Product;
  newData.merchant = Number(body.merchant) as number;
  newData.title = body.title;
  newData.description = body.description;

  /**
   * validate
   */

  const validate = UpdateProductSchema.safeParse(newData);
  if (!validate.success) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "Invalid Request",
        data: validate.error,
      })
    );
  }

  try {
    const oldData = await db(e)
      .select()
      .from(products)
      .where(eq(products.id, id))
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
    if (body.image) {
      /**
       * Add delete old image logic
       * If the image is updated, we need to delete the old image
       */
      // if (oldData.image && !isValidURL(oldData.image))
      if (oldData.image) await deleteImg(e, oldData.image); // user image could be null, delete it if exists
      const filename = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, body.image.data, filename); // all uploaded images are saved as webp format
      newData.image = filename;
    }

    return await db(e).update(products).set(newData).where(eq(products.id, id));
  } catch (err) {
    return sendError(
      e,
      createError(err instanceof Error ? err.message : "Unknown error")
    );
  }
});
