import { toNumber } from "@vue/shared";
import { type MultiPartData } from "h3";
import { userPictureStorage } from "../../utils/storage";
import { users, eq } from "../../../shared/db.schema";
import { User } from "#auth-utils";

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
  await userPictureStorage.setItemRaw(filename, file.data);
  return filename;
};
const deleteFile = async (id: number) => {
  const oldUserPic = await useDB()
    .select({ picture: users.picture })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  userPictureStorage.removeItem(oldUserPic[0].picture!);
};
export default defineEventHandler(async (e) => {
  const id = toNumber(getRouterParam(e, "id")) as number;
  const body = parseMultipartData(await readMultipartFormData(e));
  let newData = {} as Partial<User>;
  if (body.username) newData["username"] = body.username;
  if (body.name) newData["name"] = body.name;

  try {
    if (body.picture) {
      deleteFile(id);
      newData["picture"] = await saveFile(`user_pic_${id}`, body.picture);
    }

    newData["updated"] = new Date();
    const newuser = await useDB()
      .update(users)
      .set(newData)
      .where(eq(users.id, id))
      .returning();
    await setUserSession(e, { user: newuser[0], loggedInAt: new Date() });
    return await getUserSession(e);
  } catch (e) {
    throw createError(
      e instanceof Error ? e.message : "Unknown usr/id/patch error"
    );
  }
});
