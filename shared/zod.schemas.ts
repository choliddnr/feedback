import { object, string, ZodError } from "zod";
import { users, eq } from "./db.schema";
import type { User } from "#auth-utils";
const isUsernameUnique = async (username: string): Promise<boolean> => {
  const data = await $fetch<User[]>("/api/user/getOne", {
    query: { k: "username", v: username },
  });
  if (data.length === 0) return true;
  const { user } = useUserSession();
  if (data[0]?.username === user.value?.username) return true;
  return false;
};

export const userSchema = object({
  name: string().min(4),
  username: string()
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        "Username hanya boleh berupa huruf, angka, garis bawah dan titik.",
    })
    .min(3, { message: "minimal 3 karakter" })
    .max(30, { message: "maksimal 30 karakter" })
    .refine(async (username) => await isUsernameUnique(username), {
      message: "username sudah digunakan.",
    }),
});
