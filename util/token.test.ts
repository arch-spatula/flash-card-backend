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
  const privateKey = generateKey();
  const userId = 'user123';
  const expiresInSec = 3600;

  const result = await generateAccessToken(privateKey, userId, expiresInSec);

  assertEquals(typeof result.jwt, 'string');
  assertInstanceOf(result.expires, Date);
});

Deno.test('should return refresh token', async () => {
  const privetKey = generateKey();
  const userId = 'user123';
  const expiresInSec = 3600;

  const result = await generateRefreshToken(privetKey, userId, expiresInSec);

  assertEquals(typeof result.jwt, 'string');
  assertInstanceOf(result.expires, Date);
});

Deno.test('should refresh access token', async () => {
  const privetKey = generateKey();
  const userId = 'userId123';
  const refreshToken = (await generateRefreshToken(privetKey, userId)).jwt;

  const result = await refreshAccessToken(privetKey, refreshToken);

  assertEquals(typeof result.accessToken, 'string');
  assert(result.success, 'true');
});

Deno.test('should convert token as userId', async () => {
  const privateKey = generateKey();
  const userId = 'userId123';
  const accessToken = (await generateAccessToken(privateKey, userId)).jwt;

  const result = await convertTokenToUserId(privateKey, accessToken);

  assertEquals(result, userId);
});

Deno.test('should throw error for invalid token', async () => {
  const privateKey = generateKey();
  const invalidToken = 'invalid-token';

  await assertRejects(
    async () => {
      return await convertTokenToUserId(privateKey, invalidToken);
    },
    Error,
    'The serialization of the jwt is invalid.',
    'throw different error'
  );
});

Deno.test('should throw error for expired token', async () => {
  const privateKey = generateKey();
  const userId = 'userId123';
  const expiresInSec = -1;
  const expiredToken = (
    await generateAccessToken(privateKey, userId, expiresInSec)
  ).jwt;

  await assertRejects(
    async () => {
      return await convertTokenToUserId(privateKey, expiredToken);
    },
    Error,
    'The jwt is expired.',
    'throw different error'
  );
});
