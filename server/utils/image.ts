import type { H3Event } from 'h3';

// This is the binding name for the R2 bucket in wrangler.toml
// Make sure it matches your configuration.
const R2_BINDING = 'R2_BUCKET';

// Helper to get the R2 bucket binding from the event context.
// For type support, ensure `@cloudflare/workers-types` is added to your tsconfig.json
function getBucket(e: H3Event) {
  // The 'cloudflare' property is added to the context by nitro.
  // @ts-ignore
  if (!e.context.cloudflare.env.R2_BUCKET) {
    throw new Error(`R2 binding '${R2_BINDING}' not found.`);
  }
  // @ts-ignore
  return e.context.cloudflare.env.R2_BUCKET;
}

export const saveImg = async (e: H3Event, file: Blob | ArrayBuffer | Uint8Array | string, key: string) => {
  const bucket = getBucket(e);

  try {
    let body = file;

    
    // Convert Node Buffer (or other ArrayBufferView) to Uint8Array for R2 compatibility
    // @ts-ignore
     if (file && typeof file === 'object' && 'buffer' in file) {
      // @ts-ignore
      body = new Uint8Array(file);
    }
    
    await bucket.put(key, body as any);
    return { success: true };
  } catch (error: any) {
    console.error('Error uploading to R2:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to upload image: ${error.message}`,
    });
  }
};

export const getImg = async (e: H3Event, key: string) => {
  const bucket = getBucket(e);
  
  const object = await bucket.get(key);

  if (object === null) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image not found',
    });
  }
  return object

  // const headers = new Headers();
  // object.writeHttpMetadata(headers);
  // headers.set('etag', object.httpEtag);
  // headers.set('Cache-Control', 'public, max-age=3600'); // optional caching

  // return new Response(object.body, {
  //   headers,
  // });
};

export const deleteImg = async (e: H3Event, key: string) => {
  const bucket = getBucket(e);
  try {
    await bucket.delete(key);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting from R2:', error);
    return {
      success: false,
      error: `Failed to delete image: ${error.message}`,
    };
  }
};
