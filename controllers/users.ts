import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";

async function signup({ request, response }: Context) {
  try {
    const body = await request.body().value;
    //
    response.status = 201;
    response.body = "ok";
    // console.log(body.email);
  } catch (error) {
    console.log(error);
  }
}

async function signin({ request, response }: Context) {
  const body = 0;
}

export { signup, signin };
