import { helpers } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import MongoAPI from "../api/mongoAPI.ts";
import { Token } from "../util/token.ts";
import CardRecord from "../model/cards.ts";

const mongoAPI = MongoAPI.getInstance();
const token = Token.getInstance();

async function addCard({ request, response, cookies }: Context) {
  try {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const jwt = await cookies.get("user");
      if (!jwt) {
        throw Error("인증이 안 되어 있습니다.");
      }
      const userId = await token.tokenToUserId(jwt);
      if (!userId) throw Error("사용자 id가 없습니다.");

      const { question, answer, submitDate, stackCount } = await request.body()
        .value;
      if (!question || !answer || !submitDate || !stackCount)
        throw Error("question, answer, data, stackCount 중 값이 1개 없습니다.");

      const card = new CardRecord(
        question,
        answer,
        submitDate,
        stackCount,
        userId
      );
      response.status = 201;
      response.body = await mongoAPI.postCards(card);
    }
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function getCards({ response, cookies }: Context) {
  // const { id } = helpers.getQuery(ctx, { mergeParams: true });
  // ctx.response.body = `check ${id} and ${APP_ID}, ${CARD_API_KEY}`;
  try {
    const jwt = await cookies.get("user");
    if (!jwt) {
      throw Error("인증이 안 되어 있습니다.");
    }

    const userId = await token.tokenToUserId(jwt);
    if (!userId) throw Error("사용자 id가 없습니다.");
    console.log(userId);

    response.status = 200;
    response.body = await mongoAPI.getCards(userId);
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { getCards, addCard };
