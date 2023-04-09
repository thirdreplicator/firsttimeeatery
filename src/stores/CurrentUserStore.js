import { persistentAtom } from "@nanostores/persistent";

export const currentUser = persistentAtom("currentUser", {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const isLoggedIn = (user) => Object.keys(user).length != 0