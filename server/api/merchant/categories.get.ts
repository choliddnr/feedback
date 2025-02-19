import { merchant_categories } from "../../../shared/db.schema";

export default defineEventHandler(async (e) => {
  return await useDB().select().from(merchant_categories);
});
