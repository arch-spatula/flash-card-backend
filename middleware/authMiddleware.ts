import type { Middleware } from '../deps.ts';
import { convertTokenToUserId, refreshAccessToken } from '../util/token.ts';

class BadRequestError extends Error {}
class AuthorizationError extends Error {}

/**
 * @see https://github.com/gitdagray/mern_stack_course/blob/main/lesson_13-backend/middleware/verifyJWT.js
 */
const authMiddleware: Middleware = async (
  { request, response, cookies, state },
  next
) => {
  try {
    const refreshToken = request.headers.get('Authorization');
    const accessToken = await cookies.get('user');
    if (!refreshToken || !refreshToken.startsWith('Bearer ') || !accessToken)
      throw new BadRequestError('Bad Request');

    const userId = await convertTokenToUserId(accessToken);
    if (!userId) {
      const isNotExpired = await convertTokenToUserId(refreshToken);
      if (!isNotExpired) {
        throw new AuthorizationError('Unauthorized');
      }

      const { accessToken } = await refreshAccessToken(refreshToken);
      response.status = 401;
      response.body = {
        success: false,
        mag: 'new token is required',
        access_token: accessToken,
      };
      return;
    }

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
