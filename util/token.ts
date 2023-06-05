import { create, getNumericDate, verify } from '../deps.ts';

class TokenError extends Error {}

/**
 * @see https://deno.land/x/djwt@v2.8
 */

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
      { exp: getNumericDate(expiresInSec), userId: userId },
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
      { exp: getNumericDate(expiresInSec), userId: userId },
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
    } catch (_error) {
      return { accessToken: null, success: false };
    }
  }

  async tokenToUserId(jwt: string) {
    const { userId } = await verify(jwt, await this.key, {});
    return userId as string;
  }
}

async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'HMAC', hash: { name: 'SHA-512' } },
    true,
    ['sign', 'verify']
  );
}

const privateKey = generateKey();

async function generateRefreshToken(
  userId: string,
  expiresInSec = 2592000,
  key = privateKey
) {
  const jwt = await create(
    { alg: 'HS512' },
    { exp: getNumericDate(expiresInSec), sub: userId },
    await key
  );
  return {
    jwt,
    expires: new Date(new Date().getTime() + expiresInSec * 1000),
  };
}

async function generateAccessToken(
  userId: string,
  expiresInSec = 3600,
  key = privateKey
) {
  const jwt = await create(
    { alg: 'HS512' },
    { exp: getNumericDate(expiresInSec), sub: userId },
    await key
  );
  return {
    jwt,
    expires: new Date(new Date().getTime() + expiresInSec * 1000),
  };
}

/**
 * sub을 사용해야 하는 이유
 */
async function convertTokenToUserId(jwt: string, key = privateKey) {
  const { sub: userId } = await verify(jwt, await key);
  return userId;
}

async function refreshAccessToken(refreshToken: string, key = privateKey) {
  try {
    const userId = await convertTokenToUserId(refreshToken, key);

    if (!userId) {
      throw new TokenError('토큰이 만료되었습니다.');
    }

    const { jwt: accessToken } = await generateAccessToken(userId);
    return { accessToken, success: true };
  } catch (error) {
    if (error instanceof TokenError) {
      return { error, success: false };
    } else {
      return { accessToken: null, success: false };
    }
  }
}

export {
  generateKey,
  generateRefreshToken,
  generateAccessToken,
  convertTokenToUserId,
  refreshAccessToken,
};

export default Token;
