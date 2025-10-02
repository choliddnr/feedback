import { InsertProductSchema } from "~~/server/utils/db/schema";
import { NewProduct } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";
import { logger } from "~~/server/utils/logger";

/**
 * @api {post} /api/products Create a new product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiParam {Number} merchant Merchant ID.
 * @apiParam {String} title Product title.
 * @apiParam {String} description Product description.
 * @apiParam {File} image Product image (multipart/form-data).
 *
 * @apiSuccess {Object[]} product Created product data.
 * @apiSuccessExample {json}
 *    HTTP/1.1 200 OK
 *    [
 *      {
 *        "id": 1,
 *        "merchant": 1,
 *        "title": "New Product",
 *        "description": "This is a new product.",
 *        "image": "product/uuid.webp",
 *        "created_at": "2023-01-01T00:00:00Z"
 *      }
 *    ]
 *
 * @apiError (422 Unprocessable Entity) InvalidRequest Invalid input data.
 * @apiError (500 Internal Server Error) UnknownError An unknown error occurred.
 */
export default defineEventHandler(async (e) => {
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof NewProduct,
    any
  >;
  const newData = {} as NewProduct;
  newData.merchant = Number(body.merchant) as number;
  newData.title = body.title;
  newData.description = body.description;

  if (!body.image) {
    logger.warn("Product image is required for new product creation.");
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "Product image is required",
      })
    );
  }

  newData.image = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache

  /**
   * Validate the data before inserting into the database
   */

  const validate = InsertProductSchema.safeParse(newData);
  if (!validate.success) {
    logger.warn("Invalid product data received", validate.error.issues);
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
    await saveImg(e, body.image.data, newData.image); // all uploaded images are saved as webp format
    const result = await db(e).insert(products).values(newData).returning();
    logger.info("New product created successfully", {
      productId: result[0]?.id,
    });
    return result;
  } catch (err) {
    logger.error("Error creating new product", err as Error);
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage: err instanceof Error ? err.message : "Unknown error",
      })
    );
  }
});
