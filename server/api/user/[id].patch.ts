import { toNumber } from "@vue/shared";
import { H3Event, type MultiPartData } from "h3";
import { userPictureStorage } from "~~/server/utils/storage";
import { user, eq } from "~~/server/utils/db/schema";
import { User } from "~~/shared/types";

// import { User } from "#auth-utils";

const FILE_KEYS = ["name", "filename", "type", "data"];
const isFIle = (data: MultiPartData) => {
  const dataKeysSet = new Set(Object.keys(data));
  return FILE_KEYS.every((key) => dataKeysSet.has(key));
};
const parseMultipartData = (data?: MultiPartData[]) => {
  const arr = (Array.isArray(data) ? data : []) as MultiPartData[];
  const result = arr.reduce((prev: Record<string, any>, curr) => {
    prev[String(curr.name)] = isFIle(curr) ? curr : curr.data.toString("utf8");
    return prev;
  }, {});
  return result;
};

const saveFile = async (name: string, file: MultiPartData) => {
  const [_mime, ext] = String(file.type).split("/");
  const filename = `${name}_${Date.now()}.${ext}`;
  console.log(filename);
  await userPictureStorage.setItemRaw(filename, file.data);
  return filename;
};
const deleteFile = async (id: number) => {
  const oldUserPic = await db
    .select({ image: user.image })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);
  userPictureStorage.removeItem(oldUserPic[0].image!);
};

export default defineEventHandler(async (e: H3Event) => {
  const id = toNumber(getRouterParam(e, "id")) as number;
  const body = parseMultipartData(await readMultipartFormData(e));
  // console.log(id, body);

  let newData = {} as Partial<User>;
  if (body.username) newData["username"] = body.username;
  if (body.name) newData["name"] = body.name;
  if (body.defaultMerchant) newData["defaultMerchant"] = body.defaultMerchant;
  console.log(
    "newData[defaultMerchant]",
    newData["defaultMerchant"],
    body.defaultMerchant
  );

  try {
    if (body.image) {
      deleteFile(id);
      newData["image"] = await saveFile(`user_pic_${id}`, body.image);
    }

    // newData["updatedAt"] = Date.now();
    const newuser = await db
      .update(user)
      .set(newData)
      .where(eq(user.id, id))
      .returning();
    // await setUserSession(e, { user: newuser[0], loggedInAt: new Date() });
    // return await getUserSession(e);
    return auth.api.getSession({
      headers: e.headers,
    });
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
