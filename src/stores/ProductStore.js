import { persistentAtom } from "@nanostores/persistent";

export const productStore = persistentAtom("products", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});