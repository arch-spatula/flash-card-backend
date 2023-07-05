import {
  assertEquals,
  assert,
  assertInstanceOf,
  assertRejects,
} from '../deps.ts';
import {
  convertTokenToUserId,
  generateAccessToken,
  generateKey,
  generateRefreshToken,
  refreshAccessToken,
} from './token.ts';

Deno.test('should return access token', async () => {
  const privateKey = await generateKey();
  const userId = 'user123';
  const expiresInSec = 3600;

  const result = await generateAccessToken(userId, expiresInSec, privateKey);

  assertEquals(typeof result.jwt, 'string');
  assertInstanceOf(result.expires, Date);
});

Deno.test('should return refresh token', async () => {
  const privetKey = await generateKey();
  const userId = 'user123';
  const expiresInSec = 3600;

  const result = await generateRefreshToken(userId, expiresInSec, privetKey);

  assertEquals(typeof result.jwt, 'string');
  assertInstanceOf(result.expires, Date);
});

Deno.test('should refresh access token', async () => {
  const privetKey = await generateKey();
  const userId = 'userId123';
  const expiresInSec = 3600;
  const refreshToken = (
    await generateRefreshToken(userId, expiresInSec, privetKey)
  ).jwt;

  const result = await refreshAccessToken(refreshToken, privetKey);

  assertEquals(typeof result.accessToken, 'string');
  assert(result.success, 'true');
});

Deno.test('should convert token as userId', async () => {
  const privateKey = await generateKey();
  const userId = 'userId123';
  const expiresInSec = 3600;
  const accessToken = (
    await generateAccessToken(userId, expiresInSec, privateKey)
  ).jwt;

  const result = await convertTokenToUserId(accessToken, privateKey);

  console.log(result);
  assertEquals(result, userId);
});

Deno.test('should throw error for invalid token', async () => {
  const privateKey = await generateKey();
  const invalidToken = 'invalid-token';

  assertEquals(await convertTokenToUserId(invalidToken, privateKey), null);
});

Deno.test('should throw error for expired token', async () => {
  const privateKey = await generateKey();
  const userId = 'userId123';
  const expiresInSec = -10;
  const expiredToken = (
    await generateAccessToken(userId, expiresInSec, privateKey)
  ).jwt;

  assertEquals(await convertTokenToUserId(expiredToken, privateKey), null);
});
