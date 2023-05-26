import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";
import Token from "../util/token.ts";
import {
  hash,
  genSalt,
  compare,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const mongoAPI = MongoAPI.getInstance();
const token = Token.getInstance();

async function signup({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      throw Error("body가 없습니다.");
    }
    const input = await request.body().value;

    if (!input.email || !input.password) {
      throw Error("이메일 혹은 비밀 번호가 없습니다.");
    }

    const document = await mongoAPI.getUser(input.email);
    if (document === undefined) throw Error("document is undefined");

    if (document !== null) {
      throw Error("이미 가입한 아이디입니다.");
    } else {
      const passwordSalt = await genSalt(8);
      const passwordHash = await hash(input.password, passwordSalt);

      response.status = 201;
      response.body = await mongoAPI.postUser({
        email: input.email,
        passwordHash,
        passwordSalt,
      });
    }
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function signin({ request, response, cookies }: Context) {
  try {
    if (!request.hasBody) {
      throw Error("body가 없습니다.");
    }

    const input = await request.body().value;
    if (!input.email || !input.password) {
      throw Error("이메일 혹은 비밀번호가 없습니다.");
    }

    const document = await mongoAPI.getUser(input.email);
    if (document === null) throw Error("이메일이 없습니다.");
    else {
      if (await compare(input.password, document.passwordHash)) {
        response.status = 201;
        response.body = document;

        const { jwt, expires } = await token.makeToken(document._id, 60 * 60);
        cookies.set("user", jwt, expires);
      } else {
        throw Error("비밀번호가 알치하지 않습니다.");
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

export { signup, signin };
