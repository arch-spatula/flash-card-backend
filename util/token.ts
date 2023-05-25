import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

async function makeKey() {
  const key = await crypto.subtle.generateKey(
    { name: "HMAC", hash: { name: "SHA-512" } },
    true,
    ["sign", "verify"]
  );
  return key;
}

async function makeToken(userId: string, sec = 3600) {
  const key = await makeKey();
  const jwt = await create(
    { alg: "HS512" },
    { exp: getNumericDate(sec), sub: userId },
    key
  );
  return {
    jwt,
    expires: {
      expires: new Date(new Date().getTime() + sec * 1000),
    },
  };
}

export { makeToken, makeKey };
