import {
  hash as hashPromise,
  hashSync,
  compare as comparePromise,
  compareSync,
  genSalt as genSaltPromise,
  genSaltSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * @see https://github.com/JamesBroadberry/deno-bcrypt/issues/26
 * deno deploy 환경에서는 worker가 없어서 아래 방식으로 처리했습니다.
 */

export const isRunningInDenoDeploy = (globalThis as any).Worker === undefined; // This is crude check for if the code in running in Deno Deploy. It works for now but may not work in the future.

export const hash: typeof hashPromise = isRunningInDenoDeploy
  ? (plaintext: string, salt: string | undefined = undefined) =>
      new Promise((res) => res(hashSync(plaintext, salt)))
  : hashPromise;

export const compare: typeof comparePromise = isRunningInDenoDeploy
  ? (plaintext: string, hash: string) =>
      new Promise((res) => res(compareSync(plaintext, hash)))
  : comparePromise;

export const genSalt: typeof genSaltPromise = isRunningInDenoDeploy
  ? (plaintext: number | undefined) =>
      new Promise((res) => res(genSaltSync(plaintext)))
  : genSaltPromise;
