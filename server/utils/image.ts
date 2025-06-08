import type { H3Event } from "h3";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = (e: H3Event) => {
  const config = useRuntimeConfig(e);
  return new S3Client({
    region: "ap-southeast-1", // or your region
    endpoint: "https://s3.ap-southeast-1.wasabisys.com",
    credentials: {
      accessKeyId: config.WASABI_KEY!,
      secretAccessKey: config.WASABI_SECRET!,
    },
  });
};

export const saveImg = async (e: H3Event, file: File, src: string) => {
  const config = useRuntimeConfig(e);
  const command = new PutObjectCommand({
    Bucket: config.WASABI_BUCKET!,
    Key: src,
    Body: file,
    ContentType: "application/octet-stream",
  });
  try {
    await s3(e).send(command);
  } catch (error) {
    console.error("Upload image error:", error);
    return { success: false, error };
  }
};

export const getImg = async (e: H3Event, src: string) => {
  const config = useRuntimeConfig(e);
  const command = new GetObjectCommand({
    Bucket: config.WASABI_BUCKET!,
    Key: src,
  });
  try {
    return await s3(e).send(command);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "get image error",
    });
  }
};

export const deleteImg = async (e: H3Event, src: string) => {
  const config = useRuntimeConfig(e);
  const command = new DeleteObjectCommand({
    Bucket: config.WASABI_BUCKET!,
    Key: src,
  });

  try {
    await s3(e).send(command);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error };
  }
};
