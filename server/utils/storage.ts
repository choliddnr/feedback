import { createStorage } from 'unstorage';
import fsLiteDriver from 'unstorage/drivers/fs-lite';

export const userPictureStorage = createStorage({
  driver: fsLiteDriver({ base: './public/user_picture' }),
});

export const merchantLogoStorage = createStorage({
  driver: fsLiteDriver({ base: './public/merchant/logo' }),
});

export const merchantImageBackgroundStorage = createStorage({
  driver: fsLiteDriver({ base: './public/merchant/image_background' }),
});

export const productImageStorage = createStorage({
  driver: fsLiteDriver({ base: './public/product' }),
});
