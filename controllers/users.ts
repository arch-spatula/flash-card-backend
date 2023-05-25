import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";
import {
  hash,
  genSalt,
  compare,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const mongoAPI = MongoAPI.getInstance();

async function signup({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      throw Error("body가 없습니다.");
    }
    const card = await request.body().value;

    if (!card.email || !card.password) {
      throw Error("이메일 혹은 비밀 번호가 없습니다.");
    }

    const document = await mongoAPI.getUser(card.email);

    if (document !== null) {
      throw Error("이미 가입한 아이디입니다.");
    } else {
      const passwordSalt = await genSalt(8);
      const passwordHash = await hash(card.password, passwordSalt);

      response.status = 201;
      response.body = await mongoAPI.postUser({
        email: card.email,
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
    const card = await request.body().value;
    if (!card.email || !card.password) {
      throw Error("이메일 혹은 비밀 번호가 없습니다.");
    }
    const document = await mongoAPI.getUser(card.email);
    if (!document) throw Error("이메일이 없습니다.");
    else {
      if (await compare(card.password, document.passwordHash)) {
        response.status = 201;
        response.body = document;
        cookies.set("user", document._id);
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
