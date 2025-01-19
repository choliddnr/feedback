import { toNumber } from "@vue/shared";
import { useDB, eq, and } from "../../utils/db";
import { users } from "../../../shared/db.schema";
export default defineEventHandler(async (e) => {
  const id = toNumber(getRouterParam(e, "id"));
  return useDB().select().from(users).where(eq(users.id, id));
});
