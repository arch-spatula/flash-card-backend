import type { Context } from '../deps.ts';
import MongoAPI from '../api/mongoAPI.ts';
import {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
} from '../util/token.ts';
import { compare, genSalt, hash } from '../util/customBcrypt.ts';

const mongoAPI = MongoAPI.getInstance();

async function signUp({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      throw Error('body가 없습니다.');
    }
    const input = await request.body().value;

    if (!input.email || !input.password) {
      throw Error('이메일 혹은 비밀 번호가 없습니다.');
    }

    const document = await mongoAPI.getUser(input.email);
    if (document === undefined) throw Error('document is undefined');

    if (document !== null) {
      throw Error(`이미 가입한 아이디입니다. ${document.email}`);
    } else {
      const passwordSalt = await genSalt(8);
      const passwordHash = await hash(input.password, passwordSalt);

      await mongoAPI.postUser({
        email: input.email,
        passwordHash,
        passwordSalt,
      });

      response.status = 201;
      response.body = null;
    }
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function signIn({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      throw Error('body가 없습니다.');
    }

    const input = await request.body().value;
    if (!input.email || !input.password) {
      throw Error('이메일 혹은 비밀번호가 없습니다.');
    }

    const document = await mongoAPI.getUser(input.email);
    if (document === null) throw Error('이메일이 없습니다.');
    else {
      if (await compare(input.password, document.passwordHash)) {
        const { jwt: refreshToken } = await generateRefreshToken(document._id);
        const { jwt: access_token } = await generateAccessToken(document._id);

        response.status = 201;
        response.body = {
          success: true,
          access_token,
          refreshToken,
        };
      } else {
        throw Error('비밀번호가 일치하지 않습니다.');
      }
    }
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function refreshUserAccessToken({ request, response }: Context) {
  try {
    const refreshToken = request.headers.get('Authorization');
    if (!refreshToken || !refreshToken.startsWith('Bearer '))
      throw new Error('Bad Request');

    const { accessToken, success } = await refreshAccessToken(
      refreshToken.split(' ')[1]
    );
    if (!accessToken || !success) throw new Error('expired');

    response.status = 200;
    response.body = {
      success: true,
      access_token: accessToken,
    };
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { signUp, signIn, refreshUserAccessToken };
