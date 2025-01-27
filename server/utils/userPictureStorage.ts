import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";

export const userPictureStorage = createStorage({
  driver: fsLiteDriver({ base: "./data" }),
});
