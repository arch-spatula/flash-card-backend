import type { Middleware } from '../deps.ts';
import { convertTokenToUserId } from '../util/token.ts';

class BadRequestError extends Error {}
class AuthorizationError extends Error {}

/**
 * @see https://github.com/gitdagray/mern_stack_course/blob/main/lesson_13-backend/middleware/verifyJWT.js
 * @todo refresh token 생성 요청 endpoint 추가
 */
const authMiddleware: Middleware = async (
  { request, response, state },
  next
) => {
  try {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken || !accessToken.startsWith('Bearer '))
      throw new BadRequestError('Bad Request');

    const userId = await convertTokenToUserId(accessToken.split(' ')[1]);
    if (!userId) throw new AuthorizationError('expired');

    state.userId = userId;
    await next();
  } catch (error) {
    if (error instanceof BadRequestError) {
      response.status = 400;
      response.body = {
        success: false,
        msg: `${error}`,
      };
    } else if (error instanceof AuthorizationError) {
      response.status = 401;
      response.body = {
        success: false,
        msg: `${error}`,
      };
    } else {
      response.status = 406;
      response.body = {
        success: false,
        msg: `${error}`,
      };
    }
  }
};

export { authMiddleware };
