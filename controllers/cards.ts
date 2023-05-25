import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { helpers } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";

const mongoAPI = MongoAPI.getInstance();

async function addCard({ request, response }: Context) {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await request.body();
      const card = await body.value;

      response.status = 201;
      response.body = await mongoAPI.postCards(card);
    }
  } catch (error) {
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function getCards({ request, response, cookies }: Context) {
  // const { id } = helpers.getQuery(ctx, { mergeParams: true });
  // ctx.response.body = `check ${id} and ${APP_ID}, ${CARD_API_KEY}`;
  try {
    if (!(await cookies.get(""))) {
      throw Error("인증이 안 되어 있습니다.");
    }
    const body = await request.body();
    const card = await body.value;
    console.log(card);

    response.status = 200;
    response.body = await mongoAPI.getCards();
  } catch (error) {
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { getCards, addCard };
