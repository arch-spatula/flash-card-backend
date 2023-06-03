import type { Context } from '../deps.ts';
import Token from '../util/token.ts';

const token = Token.getInstance();

/**
 * @see https://github.com/gitdagray/mern_stack_course/blob/main/lesson_13-backend/middleware/verifyJWT.js
 */
async function authMiddleware({ request, response, cookies }: Context) {
  const accessToken = request.headers.get('Authorization');
  if (accessToken) {
  } else {
    const refreshToken = await cookies.get('user');
    if (!refreshToken) {
      throw new Error('토큰이 만료되었습니다.');
    } else {
      return token.refreshAccessToken(refreshToken);
    }
  }
}

// const userId = await token.tokenToUserId(jwt);
// if (!userId) throw Error('사용자 id가 없습니다.');
export { authMiddleware };
