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

  /**
   * logic to add product image when using bunny.net storage
   * Since we are using bunny.net storage that require raw File data,
   * we used readFormData to get the file data
   * and then upload it to the storage
   */

  const image_file = (await readFormData(e)).get("image") as File;
  let filename = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
  newData["image"] = filename;

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
    await saveImg(e, image_file, filename); // all uploaded images are saved as webp format
    return await db(e).insert(products).values(newData).returning();
  } catch (e) {
    throw createError(e instanceof Error ? e.message : "Unknown error");
  }
});
