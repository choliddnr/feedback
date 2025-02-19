import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";

export const userPictureStorage = createStorage({
  driver: fsLiteDriver({ base: "./data/user_picture" }),
});

export const merchantLogoStorage = createStorage({
  driver: fsLiteDriver({ base: "./data/merchant/logo" }),
});

export const merchantImageBackgroundStorage = createStorage({
  driver: fsLiteDriver({ base: "./data/merchant/image_background" }),
});
