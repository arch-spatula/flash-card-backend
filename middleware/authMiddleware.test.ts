import { assertEquals, assert } from '../deps.ts';
import { testing } from '../deps.ts';
import { authMiddleware } from './authMiddleware.ts';

/**
 * @see https://github.com/oakserver/oak/pull/422/files#diff-724220dfa022a67c646170cb3066895fd7cda6e16a6d4d4c98a1e17aca7bde06
 * oak testing에서 cookie는 set으로 작성하고 get으로 읽을 수 없습니다.
 */

Deno.test({
  name: 'auth Middleware access token과 refresh token 모두가 유효한 경우',
  async fn() {
    const ctx = testing.createMockContext({
      headers: [['Authorization', 'accessToken']],
    });
    ctx.cookies.set('user', 'refreshToken');
    const next = testing.createMockNext();

    await authMiddleware(ctx, next);

    assert(ctx.cookies.get('user'), 'refreshToken');
    assert(ctx.request.headers.get('Authorization'), 'accessToken');
    assertEquals(ctx.response.body, undefined);
  },
});

Deno.test({
  name: 'access token이 만료 refresh token은 유효',
  async fn() {
    const refreshCookie = 'refreshToken';
    const ctx = testing.createMockContext({
      headers: [
        ['Authorization', ''],
        ['cookie', `user=${refreshCookie}`],
      ],
    });
    const next = testing.createMockNext();

    await authMiddleware(ctx, next);

    assert(ctx.response.status === 401, '401');
    assertEquals(
      ctx.response.body,
      {
        msg: '토큰이 만료되었습니다.',
        accessToken: Promise.resolve({ accessToken: null, success: false }),
      },
      'access token 갱신 응답'
    );
  },
});

Deno.test({
  name: '모든 Token이 만료',
  async fn() {
    const ctx = testing.createMockContext({
      headers: [['Authorization', '']],
    });
    await ctx.cookies.set('user', null);
    const next = testing.createMockNext();

    await authMiddleware(ctx, next);

    assert(ctx.response.status === 400, '400');
    assertEquals(ctx.response.body, { msg: '로그아웃 되었습니다.' });
  },
});
