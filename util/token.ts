import { create, getNumericDate, verify } from '../deps.ts';

class Token {
  private static instance: Token;
  readonly key: Promise<CryptoKey>;

  private constructor() {
    this.key = (async () => {
      const key = await crypto.subtle.generateKey(
        { name: 'HMAC', hash: { name: 'SHA-512' } },
        true,
        ['sign', 'verify']
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

  async makeAccessToken(userId: string, expiresInSec = 3600) {
    const jwt = await create(
      { alg: 'HS512' },
      { exp: getNumericDate(expiresInSec), sub: userId },
      await this.key
    );
    return {
      jwt,
      expires: new Date(new Date().getTime() + expiresInSec * 1000),
    };
  }

  async makeRefreshToken(userId: string, expiresInSec = 2592000) {
    const jwt = await create(
      { alg: 'HS512' },
      { exp: getNumericDate(expiresInSec), sub: userId },
      await this.key
    );
    return {
      jwt,
      expires: new Date(new Date().getTime() + expiresInSec * 1000),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const userId = await this.tokenToUserId(refreshToken);

      if (!userId) throw new Error('토큰이 만료되었습니다.');

      const { jwt: accessToken } = await this.makeAccessToken(userId);
      return { accessToken, success: true };
    } catch (error) {
      return { accessToken: null, success: false };
    }
  }

  async tokenToUserId(jwt: string) {
    const { sub } = await verify(jwt, await this.key, {});
    return sub;
  }
}

export default Token;
