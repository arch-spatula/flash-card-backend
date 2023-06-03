import type { Context, Middleware } from '../deps.ts';
import Token from '../util/token.ts';

const token = Token.getInstance();

/**
 * @see https://github.com/gitdagray/mern_stack_course/blob/main/lesson_13-backend/middleware/verifyJWT.js
 */
const authMiddleware: Middleware = async (
  { request, response, cookies },
  next
) => {
  const accessToken = request.headers.get('Authorization');
  if (accessToken) {
    await next();
  } else {
    const refreshToken = await cookies.get('user');
    if (!refreshToken) {
      response.status = 400;
      response.body = {
        msg: '로그아웃 되었습니다.',
      };
    } else {
      response.status = 401;
      response.body = {
        msg: '토큰이 만료되었습니다.',
        accessToken: token.refreshAccessToken(refreshToken),
      };
    }
  }
};

export { authMiddleware };
