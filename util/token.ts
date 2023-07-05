import { create, getNumericDate, verify, config } from '../deps.ts';

class TokenError extends Error {}

/**
 * @see https://deno.land/x/djwt@v2.8
 */

async function generateKey() {
  return await crypto.subtle.generateKey(
    { name: 'HMAC', hash: { name: 'SHA-512' } },
    true,
    ['sign', 'verify']
  );
}

const PUBLIC_KEY = JSON.parse(
  Deno.env.get('PUBLIC_KEY') || config()['PUBLIC_KEY']
);

const privateKey = await crypto.subtle.importKey(
  'jwk',
  PUBLIC_KEY,
  { name: 'HMAC', hash: { name: 'SHA-512' } },
  true,
  ['sign', 'verify']
);

async function generateRefreshToken(
  userId: string,
  expiresInSec = 86400,
  key = privateKey
) {
  const jwt = await create(
    { alg: 'HS512' },
    { exp: getNumericDate(expiresInSec), sub: userId },
    key
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
    key
  );
  return {
    jwt,
    expires: new Date(new Date().getTime() + expiresInSec * 1000),
  };
}

/**
 * sub는 라이브러리에서 문자열을 할당하도록 예약되어 있습니다.
 */
async function convertTokenToUserId(jwt: string, key = privateKey) {
  try {
    const { sub: userId } = await verify(jwt, key);
    return userId;
  } catch (_error) {
    return null;
  }
}

async function refreshAccessToken(refreshToken: string, key = privateKey) {
  try {
    const userId = await convertTokenToUserId(refreshToken, key);

    if (!userId) throw new TokenError('토큰이 만료되었습니다.');

    const { jwt: accessToken } = await generateAccessToken(userId);
    return { accessToken, success: true };
  } catch (error) {
    return { accessToken: null, success: false, error };
  }
}

export {
  generateKey,
  generateRefreshToken,
  generateAccessToken,
  convertTokenToUserId,
  refreshAccessToken,
};
