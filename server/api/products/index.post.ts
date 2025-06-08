import { InsertProductSchema } from "~~/server/utils/db/schema";
import { NewProduct } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";

export default defineEventHandler(async (e) => {
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof NewProduct,
    any
  >;
  let newData = {} as NewProduct;
  newData["merchant"] = Number(body.merchant) as number;
  newData["title"] = body.title;
  newData["description"] = body.description;

  if (!body.image) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "Product image is required",
      })
    );
  }

  newData["image"] = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache

  /**
   * Validate the data before inserting into the database
   */

  const validate = InsertProductSchema.safeParse(newData);
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
    await saveImg(e, body.image.data, newData["image"]); // all uploaded images are saved as webp format
    return await db(e).insert(products).values(newData).returning();
  } catch (e) {
    throw createError(e instanceof Error ? e.message : "Unknown error");
  }
});
