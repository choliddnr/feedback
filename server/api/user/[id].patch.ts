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
  if (body.username) newData["username"] = body.username;
  if (body.name) newData["name"] = body.name;
  if (body.defaultMerchant)
    newData["defaultMerchant"] = Number(body.defaultMerchant);
  const validate = UpdateUserSchema.safeParse(newData);

  console.log("validation", validate);
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
  console.log("validation 2", validate);
  try {
    if (newData["username"]) {
      const username = await db(e)
        .select()
        .from(user)
        .where(eq(user.username, newData["username"]))
        .limit(1)
        .get();
      console.log("username", username);
      if (username) {
        return sendError(
          e,
          createError({
            statusCode: 422,
            statusMessage: "username is already taken",
          })
        );
      }
      console.log("body", body, username);
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
       * Add delete old image logic
       * If the logo is updated, we need to delete the old logo image
       */
      if (oldData.image && !isValidURL(oldData.image))
        await deleteImg(e, oldData.image); // user image could be null, delete it if exists

      let filename = "user/" + generateNewFilename("_.webp"); // modify the filename to avoid conflicts and load cache
      await saveImg(e, body.image.data, filename); // all uploaded images are saved as webp format
      newData["image"] = filename;
    }
    console.log("newData update user", newData);
    await db(e).update(user).set(newData).where(eq(user.id, id));
    return auth(e).api.getSession({
      headers: e.headers,
    });
  } catch (e) {
    throw createError(e instanceof Error ? e.message : "Unknown  error");
  }
});
