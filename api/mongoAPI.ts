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
  private constructor() {
    this.baseURL = `https://us-west-2.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`;
    this.options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "cards_db",
        collection: "cards",
      }),
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "cards_db",
        collection: "cards",
        document,
      }),
    });
  }

  async patchCards(document: CardRecord) {
    const {} = document;
    return await fetch(`${this.baseURL}/updateOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "cards_db",
        collection: "cards",
        filter: { _id: { $oid: document.getId } },
        update: {
          $set: {
            question: document.getQuestion,
            answer: document.getAnswer,
            stackCount: document.getStackCount,
            submitDate: document.getSubmitDate,
          },
        },
      }),
    });
  }

  async deleteCards(id: string) {
    return await fetch(`${this.baseURL}/deleteOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "cards_db",
        collection: "cards",
        filter: { _id: { $oid: id } },
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
  // console.log(new ObjectId("6466174969f8ad73a9122e39"));
  // console.log(await mongoApi.getCards());
  // console.log(await mongoApi.postCards(card));
} catch (error) {
  console.log(error);
}

export default MongoAPI;
