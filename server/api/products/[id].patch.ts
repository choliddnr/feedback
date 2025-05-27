import { merchants, eq } from "~~/server/utils/db/schema";
import { H3Event, type MultiPartData } from "h3";
import { Merchant, NewProduct, Product } from "~~/shared/types";
import { generateNewFilename, stringToSlug } from "~~/server/utils";
import type { Storage } from "unstorage";
import { productImageStorage } from "~~/server/utils/storage";
import { record } from "better-auth";
import { error } from "better-auth/api";

/**
 *
 * Future improvement
 * 1. Server side validation
 * 2. split these func into lib/module
 */

// const FILE_KEYS = ["name", "filename", "type", "data"];
// const isFIle = (data: MultiPartData) => {
//   const dataKeysSet = new Set(Object.keys(data));
//   return FILE_KEYS.every((key) => dataKeysSet.has(key));
// };
// const parseMultipartData = (data?: MultiPartData[]) => {
//   const arr = (Array.isArray(data) ? data : []) as MultiPartData[];
//   const result = arr.reduce((prev: Record<string, any>, curr) => {
//     prev[String(curr.name)] = isFIle(curr) ? curr : curr.data.toString("utf8");
//     return prev;
//   }, {});
//   return result;
// };

// const saveFile = async (
//   name: string,
//   file: MultiPartData,
//   storage: Storage
// ) => {
//   const [_mime, ext] = String(file.type).split("/");
//   const filename = `${name}.${ext}`;
//   await storage.setItemRaw(filename, file.data);
//   return filename;
// };

export default defineEventHandler(async (e) => {
  const merchant_id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e)) as Record<
    keyof Product,
    any
  > &
    Record<"image_filename", string | null>;
  let newData = {} as Product;
  // newData["owner"] = Number(session.user.id);
  if (body.merchant) newData["merchant"] = Number(body.merchant) as number;
  if (body.title) newData["title"] = body.title;
  if (body.description) newData["description"] = body.description;

  // const body =
  // return await db(e).insert(merchants).values({ name: "Dan" }).returning();});

  try {
    if (body.image) {
      /**
       * If using fs storage, use the following code
       * to save the file in the local storage
       */
      // newData["image"] = await saveFile(
      //   Date.now().toString(),
      //   body.image,
      //   productImageStorage
      // );

      /**
       * logic to update product image when using bunny.net storage
       * Since we are using bunny.net storage that require raw File data,
       * we used readFormData to get the file data
       * and then upload it to the storage
       */

      /**
       * Add delete old image logic
       * If the image is updated, we need to delete the old image
       */
      if (body.image_filename) await deleteImg(e, body.image_filename); // user image could be null, delete it if exists

      const image_file = (await readFormData(e)).get("image") as File;
      let filename = "product/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, image_file, filename); // all uploaded images are saved as webp format
      newData["image"] = filename;
    }
    return await db(e)
      .update(products)
      .set(newData)
      .where(eq(products.id, merchant_id));
  } catch (err) {
    return sendError(
      e,
      createError(
        err instanceof Error ? err.message : "Unknown usr/id/patch error"
      )
    );
  }
});
