import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import CardRecord from "../model/cards.ts";

const { APP_ID, CARD_API_KEY } = config();

type Collection = {
  dataSource: string;
  database: string;
  collection: string;
};

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

  async getCards() {
    try {
      const result = await fetch(`${this.baseURL}/find`, {
        ...this.options,
        body: JSON.stringify({ ...this.cardBody, filter: { userId: "1" } }),
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
