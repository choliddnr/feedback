// server/utils/image.ts
import { AwsClient } from 'aws4fetch';
import type { H3Event } from 'h3';

const endpoint = (e: H3Event, key: string) => {
  const config = useRuntimeConfig(e);
  return `https://s3.ap-southeast-1.wasabisys.com/${config.WASABI_BUCKET}/${key}`;
};
const aws = (e: H3Event) => {
  const config = useRuntimeConfig(e);
  return new AwsClient({
    accessKeyId: config.WASABI_KEY!,
    secretAccessKey: config.WASABI_SECRET!,
    service: 's3',
    region: 'ap-southeast-1', // Wasabi ignores this, so it can be anything
  });
};

export const saveImg = async (e: H3Event, file: Blob, key: string) => {
  const res = await aws(e).fetch(endpoint(e, key), {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: await res.text(),
    });
  }

  return { success: true };
};

export const getImg = async (e: H3Event, key: string) => {
  const res = await aws(e).fetch(endpoint(e, key));
  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: await res.text(),
    });
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type':
        res.headers.get('content-type') || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600', // optional caching
    },
  });
};

export const deleteImg = async (e: H3Event, key: string) => {
  const res = await aws(e).fetch(endpoint(e, key), {
    method: 'DELETE',
  });

  if (!res.ok) {
    return {
      success: false,
      error: await res.text(),
    };
  }

  return {
    success: true,
  };
};
