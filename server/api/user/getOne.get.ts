import { toNumber } from '@vue/shared';
import { user, eq } from '~~/server/utils/db/schema';
export default defineEventHandler(async (e) => {
  const key = getQuery(e).k as string;
  const value = getQuery(e).v as string;
  let query;
  if (!key || !value)
    throw createError({ status: 400, message: 'Missing k/v' });
  if (key === 'id') query = eq(user.id, toNumber(value));
  if (key === 'username') query = eq(user.username, toNumber(value));
  if (key === 'email') query = eq(user.email, toNumber(value));

  return await db(e).select().from(user).where(query).limit(1);
});
