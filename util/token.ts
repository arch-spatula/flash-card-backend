import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.8/mod.ts";

class Token {
  private static instance: Token;
  readonly key: Promise<CryptoKey>;

  private constructor() {
    this.key = (async () => {
      const key = await crypto.subtle.generateKey(
        { name: "HMAC", hash: { name: "SHA-512" } },
        true,
        ["sign", "verify"]
      );
      return key;
    })();
  }

  static getInstance(): Token {
    if (!Token.instance) {
      Token.instance = new Token();
    }
    return Token.instance;
  }

  async makeToken(userId: string, sec = 3600) {
    const jwt = await create(
      { alg: "HS512" },
      { exp: getNumericDate(sec), sub: userId },
      await this.key
    );
    return {
      jwt,
      expires: {
        expires: new Date(new Date().getTime() + sec * 1000),
      },
    };
  }

  async tokenToUserId(jwt: string) {
    const { sub } = await verify(jwt, await this.key);
    return sub;
  }
}

export { Token };
