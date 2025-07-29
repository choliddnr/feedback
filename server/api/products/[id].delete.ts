import { eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { products } from '~~/server/utils/db/schema';
import { deleteImg } from '~~/server/utils/image';
import { logger } from '~~/server/utils/logger';

export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, 'id'));
  try {
    const product = await db(e)
      .select()
      .from(products)
      .where(eq(products.id, id))
      .get();
    if (!product) {
      logger.warn(`Product with ID ${id} not found for deletion.`);
      return sendError(
        e,
        createError({ statusCode: 404, statusMessage: 'product not found' }),
      );
    }

    await deleteImg(e, product.image);

    const result = await db(e).delete(products).where(eq(products.id, id));
    logger.info(`Product with ID ${id} deleted successfully.`);
    return result;
  } catch (err) {
    logger.error(`Error deleting product with ID ${id}`, err as Error);
    return sendError(
      e,
      createError({ statusCode: 500, statusMessage: 'Unknown Error - ' + err }),
    );
  }
});
