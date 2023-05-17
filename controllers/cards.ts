import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { helpers } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import type { Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
// import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

const { APP_ID, CARD_API_KEY } = config();

const BASE_URI = `https://us-west-2.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`; // /action
const DATA_SOURCE = "Cluster0";
const DATABASE = "cards_db";
const COLLECTION = "cards";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": CARD_API_KEY,
  },
  body: "",
};

async function addCard(ctx: Context) {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      const body = await ctx.request.body();
      const card = await body.value;
      const URI = `${BASE_URI}/insertOne`;

      const query = {
        collection: COLLECTION,
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: card,
      };
      options.body = JSON.stringify(query);
      const dataResponse = await fetch(URI, options);
      console.log(dataResponse);

      ctx.response.status = 201;
      ctx.response.body = "??";
    }
  } catch (error) {
    ctx.response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

function getCards(ctx: Context) {
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  // ctx.response.body = `check ${id} and ${APP_ID}, ${CARD_API_KEY}`;
  try {
    ctx.response.status = 200;
    ctx.response.body = "??";
  } catch (error) {
    ctx.response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { getCards, addCard };
