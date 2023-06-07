import { assertEquals } from '../deps.ts';
import { testing } from '../deps.ts';

import { authMiddleware } from './authMiddleware.ts';

/**
 * @see https://github.com/oakserver/oak/pull/422/files#diff-724220dfa022a67c646170cb3066895fd7cda6e16a6d4d4c98a1e17aca7bde06
 * oak testing에서 cookie는 set으로 작성하고 get으로 읽을 수 없습니다.
 *
 * 라이브러리 신뢰할 수 없기 때문에 테스트를 보류합니다.
 */

Deno.test('should not pass', () => {
  const ctx = testing.createMockContext({
    headers: [['Authorization', '']],
  });
});

Deno.test('should refresh token by setting cookie', () => {});

Deno.test('should pass and call next function', () => {});

// Deno.test(
//   'authMiddleware should set userId header and call next() when both refresh token and access token are present',
//   async () => {
//     let nextCalled = false;
//     const next = async () => {
//       nextCalled = true;
//     };
//     const userId = 'mockUserId';
//     const ctx = testing.createMockContext({
//       headers: [['Authorization', '']],
//     });

//     await authMiddleware(ctx, next);

//     assertEquals(ctx.request.headers.get('userId'), userId);
//     assertEquals(nextCalled, true);
//   }
// );

// Deno.test(
//   'authMiddleware should return an error response when refreshToken is missing',
//   async () => {
//     const request = {
//       headers: new Headers(),
//     };
//     const response = {};
//     const cookies = {
//       get: async () => 'accessToken',
//     };

//     await authMiddleware({ request, response, cookies }, () => {});

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       success: false,
//       msg: 'Bad Request',
//     });
//   }
// );

// Deno.test(
//   'authMiddleware should return an error response when refreshToken is not in Bearer format',
//   async () => {
//     const request = {
//       headers: new Headers({
//         Authorization: 'InvalidFormat',
//       }),
//     };
//     const response = {};
//     const cookies = {
//       get: async () => 'accessToken',
//     };

//     await authMiddleware({ request, response, cookies }, () => {});

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       success: false,
//       msg: 'Bad Request',
//     });
//   }
// );

// Deno.test(
//   'authMiddleware should return an error response when accessToken is missing',
//   async () => {
//     const request = {
//       headers: new Headers({
//         Authorization: 'Bearer refreshToken',
//       }),
//     };
//     const response = {};
//     const cookies = {
//       get: async () => null,
//     };

//     await authMiddleware({ request, response, cookies }, () => {});

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       success: false,
//       msg: 'Bad Request',
//     });
//   }
// );

// Deno.test(
//   'authMiddleware should return an error response when accessToken is invalid',
//   async () => {}
// );
