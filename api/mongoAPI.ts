import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import CardRecord from "../model/cards.ts";

const { APP_ID, CARD_API_KEY } = config();

class MongoAPI {
  private static instance: MongoAPI;
  private baseURL: string;
  private options: {
    method: string;
    headers: { "Content-Type": string; "api-key": string };
    body: BodyInit;
  };
  private cardBody: {
    dataSource: string;
    database: string;
    collection: string;
  };
  private constructor() {
    this.baseURL = `https://us-west-2.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`;
    this.options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      body: "",
    };
    this.cardBody = {
      dataSource: "Cluster0",
      database: "cards_db",
      collection: "cards",
    };
  }

  static getInstance(): MongoAPI {
    if (!MongoAPI.instance) {
      MongoAPI.instance = new MongoAPI();
    }
    return MongoAPI.instance;
  }

  async getCards() {
    return await fetch(`${this.baseURL}/find`, this.options);
  }

  async postCards(document: CardRecord) {
    return await fetch(`${this.baseURL}/insertOne`, {
      ...this.options,
      body: JSON.stringify({
        ...this.cardBody,
        document,
      }),
    });
  }

  async patchCards(document: CardRecord) {
    const {
      getQuestion: question,
      getAnswer: answer,
      getStackCount: stackCount,
      getSubmitDate: submitDate,
      getId: $oid,
    } = document;

    return await fetch(`${this.baseURL}/updateOne`, {
      ...this.options,
      body: JSON.stringify({
        ...this.cardBody,
        filter: { _id: { $oid } },
        update: {
          $set: {
            question,
            answer,
            stackCount,
            submitDate,
          },
        },
      }),
    });
  }

  async deleteCards($oid: string) {
    return await fetch(`${this.baseURL}/deleteOne`, {
      ...this.options,
      body: JSON.stringify({
        ...this.cardBody,
        filter: { _id: { $oid } },
      }),
    });
  }
  async singin() {}
  async singup() {}
}

const mongoAPI = MongoAPI.getInstance();

try {
  const card = new CardRecord(
    "순수 함수를 활용합니다.",
    "부작용이 없습니다.",
    new Date(),
    2,
    "1",
    "646a089f1c75ae5b5752d35d"
  );
  console.log(await mongoAPI.patchCards(card));
} catch (error) {
  console.log(error);
}

export default MongoAPI;
