import { H3Event, type MultiPartData } from "h3";
import { user, eq } from "~~/server/utils/db/schema";
import { User } from "~~/shared/types";
import { generateNewFilename } from "~~/server/utils";
import { isValidURL } from "~/utils";
import { z } from "zod";

export default defineEventHandler(async (e: H3Event) => {
  const id = Number(getRouterParam(e, "id"));
  const body = parseMultipartData(await readMultipartFormData(e));

  let newData = {} as Partial<User>;
  newData["username"] = body.username;
  newData["name"] = body.name;
  newData["defaultMerchant"] = Number(body.defaultMerchant);
  const validate = UpdateUserSchema.safeParse(newData);
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
    const username = await db(e)
      .select()
      .from(user)
      .where(eq(user.username, newData["username"]))
      .limit(1)
      .get();
    if (username) {
      return sendError(
        e,
        createError({
          statusCode: 422,
          statusMessage: "username is already taken",
        })
      );
    }

    const oldData = await db(e)
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1)
      .get();
    if (!oldData) {
      return sendError(
        e,
        createError({
          statusCode: 404,
          statusMessage: "Missing data to update",
          data: validate.error,
        })
      );
    }

    if (body.image) {
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
      if (oldData.image && !isValidURL(oldData.image))
        await deleteImg(e, oldData.image); // user image could be null, delete it if exists

      const image_file = (await readFormData(e)).get("image") as File;
      let filename = "user/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, image_file, filename); // all uploaded images are saved as webp format
      newData["image"] = filename;
    }

    await db(e).update(user).set(newData).where(eq(user.id, id));
    return auth(e).api.getSession({
      headers: e.headers,
    });
  } catch (e) {
    throw createError(e instanceof Error ? e.message : "Unknown  error");
  }
});
