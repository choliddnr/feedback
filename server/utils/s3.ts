import { S3Client } from "bun";

const minio = new S3Client({
  accessKeyId: "bWTu4Dq9PFEDYu7POqtT",
  secretAccessKey: "DDK7OZCneDdPryXARIW922017pr78KXksDFZMnTz",
  bucket: "feedback",
  region: "mlg-skl-wsl-1",

  // Make sure to use the correct endpoint URL
  // It might not be localhost in production!
  endpoint: "http://localhost:9000",
});

export default minio;
