// import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { load } from "https://deno.land/std@0.189.0/dotenv/mod.ts";
import CardRecord from "../model/cards.ts";

// const { CARD_API_KEY, MONGO_URI } = config();
// const MONGO_URI = Deno.env.get("MONGO_URI");
// const CARD_API_KEY = Deno.env.get("CARD_API_KEY");
// if (!MONGO_URI || !CARD_API_KEY) throw Error("No Env Value");

const env = await load();
const MONGO_URI = env["MONGO_URI"];
const CARD_API_KEY = env["CARD_API_KEY"];

type Collection = {
  dataSource: string;
  database: string;
  collection: string;
};

/**
 * @see https://www.mongodb.com/developer/languages/rust/getting-started-deno-mongodb/
 * 모든 method가 POST로 고정되어 있습니다. 특정 메서드에 맞게 갱신은 없습니다.
 */

class MongoAPI {
  private static instance: MongoAPI;
  private baseURL: string;
  private options: {
    method: string;
    headers: { "Content-Type": string; "api-key": string };
    body: BodyInit;
  };
  private cardBody: Collection;
  private userBody: Collection;
  private constructor() {
    this.baseURL = MONGO_URI;
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
    this.userBody = {
      dataSource: "Cluster0",
      database: "cards_db",
      collection: "user",
    };
  }

  static getInstance(): MongoAPI {
    if (!MongoAPI.instance) {
      MongoAPI.instance = new MongoAPI();
    }
    return MongoAPI.instance;
  }

  async getCards(userId: string) {
    try {
      const result = await fetch(`${this.baseURL}/find`, {
        ...this.options,
        body: JSON.stringify({ ...this.cardBody, filter: { userId } }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async getAllCards() {
    try {
      const result = await fetch(`${this.baseURL}/find`, {
        ...this.options,
        body: JSON.stringify({ ...this.cardBody }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async postCards(document: CardRecord) {
    try {
      const result = await fetch(`${this.baseURL}/insertOne`, {
        ...this.options,
        body: JSON.stringify({
          ...this.cardBody,
          document,
        }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async patchCards(document: CardRecord) {
    try {
      const {
        getQuestion: question,
        getAnswer: answer,
        getStackCount: stackCount,
        getSubmitDate: submitDate,
        getId: $oid,
      } = document;
      const result = await fetch(`${this.baseURL}/updateOne`, {
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
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async deleteCards($oid: string) {
    try {
      const result = await fetch(`${this.baseURL}/deleteOne`, {
        ...this.options,
        body: JSON.stringify({
          ...this.cardBody,
          filter: { _id: { $oid } },
        }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async postUser({
    email,
    passwordHash,
    passwordSalt,
  }: {
    email: string;
    passwordHash: string;
    passwordSalt: string;
  }) {
    try {
      const result = await fetch(`${this.baseURL}/insertOne`, {
        ...this.options,
        body: JSON.stringify({
          ...this.userBody,
          document: { email, passwordHash, passwordSalt },
        }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async getUser(email: string) {
    try {
      const result = await fetch(`${this.baseURL}/findOne`, {
        ...this.options,
        body: JSON.stringify({
          ...this.userBody,
          filter: { email },
        }),
      });
      const data = await result.json();
      return data.document;
    } catch (error) {
      return error;
    }
  }
}

export default MongoAPI;
