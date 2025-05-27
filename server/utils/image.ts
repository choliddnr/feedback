import type { H3Event } from "h3";

export const saveImg = async (e: H3Event, file: File, src: string) => {
  // const file = (await readRawBody(e)) as File | undefined;
  const config = useRuntimeConfig(e);
  const response = await $fetch(
    "https://storage.bunnycdn.com/feedback-demo/" + src,
    {
      method: "PUT",
      body: file,
      headers: {
        AccessKey: config.BUNNY_ACCESS_KEY,
        "Content-Type": "application/octet-stream",
      },
      onResponse: ({ response }) => {
        console.log("Response :", response.status, response._data);
      },
    }
  );
  return response;
};

export const getImg = async (e: H3Event, src: string) => {
  const config = useRuntimeConfig(e);
  const response = await $fetch<Blob>(
    "https://storage.bunnycdn.com/feedback-demo/" + src,
    {
      headers: {
        AccessKey: config.BUNNY_ACCESS_KEY,
      },
      responseType: "blob",
    }
  );
  setHeader(e, "Content-Type", "image/*");
  return response;
};

export const deleteImg = async (e: H3Event, src: string) => {
  const config = useRuntimeConfig(e);
  const response = await $fetch(
    "https://storage.bunnycdn.com/feedback-demo/" + src,
    {
      method: "DELETE",
      headers: {
        AccessKey: config.BUNNY_ACCESS_KEY,
      },
      onResponseError: ({ response }) => {
        if (response.status === 404) {
          console.warn("Image not found, nothing to delete:", src);
        }
      },
    }
  );
};
