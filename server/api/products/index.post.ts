import { merchants, eq } from "~~/server/utils/db/schema";
import { H3Event, type MultiPartData } from "h3";
import { Merchant, NewProduct, Product } from "~~/shared/types";
import { generateNewFilename, stringToSlug } from "~~/server/utils";
import type { Storage } from "unstorage";
import { productImageStorage } from "~~/server/utils/storage";
import { record } from "better-auth";

/**
 *
 * Future improvement
 * 1. Server side validation
 */

export default defineEventHandler(async (e) => {
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof NewProduct,
    any
  >;
  let newData = {} as NewProduct;
  // newData["owner"] = Number(session.user.id);
  if (!body.title || !body.merchant || !body.description)
    createError({
      statusCode: 400,
      statusMessage: "Invalid Bed Request",
    });

  newData["merchant"] = Number(body.merchant) as number;
  newData["title"] = body.title;
  newData["description"] = body.description;

  // const body =
  // return await db(e).insert(merchants).values({ name: "Dan" }).returning();});

  try {
    if (body.image) {
      /**
       *  handle image upload when using fs storage
       */
      // newData["image"] = await saveFile(
      //   Date.now().toString(),
      //   body.image,
      //   productImageStorage
      // );

      /**
       * logic to add product image when using bunny.net storage
       * Since we are using bunny.net storage that require raw File data,
       * we used readFormData to get the file data
       * and then upload it to the storage
       */

      const image_file = (await readFormData(e)).get("image") as File;
      let filename = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, image_file, filename); // all uploaded images are saved as webp format
      newData["image"] = filename;
    }
    return await db(e).insert(products).values(newData).returning();
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
