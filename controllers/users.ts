import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";

const mongoAPI = MongoAPI.getInstance();

async function signup({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      throw Error("body가 없습니다.");
    }
    const { email, password } = await request.body().value;
    if (!email || !password) {
      throw Error("이메일 혹은 비밀 번호가 없습니다.");
    }
    response.status = 201;
    response.body = await mongoAPI.signup({ email, password });
  } catch (error) {
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
    const { email, password } = await request.body().value;
    response.status = 201;
    response.body = await mongoAPI.signin({ email, password });
    cookies.set("user", "1234");
  } catch (error) {
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { signup, signin };
