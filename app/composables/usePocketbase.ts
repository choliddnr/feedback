import Pocketbase from "pocketbase";
import type Client from "pocketbase";
import { createSharedComposable } from "@vueuse/core";

const _pb = (): Client => {
  return new Pocketbase("127.0.0.1:8090");
};
export const pb = createSharedComposable(_pb);
