import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import CardRecord from "../model/cards.ts";
import {
  hash,
  genSalt,
  compare,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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

  async signup({ email, password }: { email: string; password: string }) {
    try {
      if ((await this.getUser(email)) === null) {
        return await this.postUser(email, password);
      } else {
        throw Error("이미 가입한 아이디입니다.");
      }
    } catch (error) {
      return error;
    }
  }

  async signin({ email, password }: { email: string; password: string }) {
    try {
      const document = await this.getUser(email);
      if (document === null) {
        throw Error("이메일이 없습니다.");
      } else {
        if (!(await compare(password, document.passwordHash))) {
          throw Error("비밀번호가 알치하지 않습니다.");
        } else {
          return document;
        }
      }
    } catch (error) {
      return error;
    }
  }

  private async postUser(email: string, password: string) {
    try {
      const passwordSalt = await genSalt(8);
      const passwordHash = await hash(password, passwordSalt);
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

  private async getUser(email: string) {
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
