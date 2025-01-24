import minio from "../../utils/s3";
export default defineEventHandler(async (e) => {
  //   const file = minio.file("feedback/user_picture/kurma-al-qaseem-750g.png");
  //   const url = file.presign({
  //     expiresIn: 60 * 60 * 24, // 1 day
  //     acl: "public-read",
  //   });
  await minio.write("my-file.txt", "Hello World!");
  return minio.presign("user_picture/kurma-al-qaseem-750g.png");
});
