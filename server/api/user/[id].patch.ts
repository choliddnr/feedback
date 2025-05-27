import { H3Event, type MultiPartData } from "h3";
import { user, eq } from "~~/server/utils/db/schema";
import { User } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";

export default defineEventHandler(async (e: H3Event) => {
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));

  let newData = {} as Partial<User>;
  if (body.username) newData["username"] = body.username;
  if (body.name) newData["name"] = body.name;
  if (body.defaultMerchant) newData["defaultMerchant"] = body.defaultMerchant;

  try {
    if (body.image) {
      /**
       * update user image when using fs storage
       */

      // deleteFile(e, id);
      // newData["image"] = await saveFile(`user_pic_${id}`, body.image);

      /**
       * logic to update user image when using bunny.net storage
       * Since we are using bunny.net storage that require raw File data,
       * we used readFormData to get the file data
       * and then upload it to the storage
       */

      /**
       * Add delete old image logic
       * If the logo is updated, we need to delete the old logo image
       */
      console.log(
        "body.image_filename",
        body.image_filename === undefined,
        body.image_filename === "null",
        body.image_filename === null
      );
      if (body.image_filename !== "null")
        await deleteImg(e, body.image_filename); // user image could be null, delete it if exists

      const image_file = (await readFormData(e)).get("image") as File;
      let filename = "user/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, image_file, filename); // all uploaded images are saved as webp format
      newData["image"] = filename;
    }

    const newuser = await db(e)
      .update(user)
      .set(newData)
      .where(eq(user.id, id));
    return auth(e).api.getSession({
      headers: e.headers,
    });
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
