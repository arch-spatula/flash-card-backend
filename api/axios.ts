import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import axios from "https://deno.land/x/redaxios@0.5.1/mod.ts";

// axios 싱글튼
const { APP_ID, CARD_API_KEY } = config();
const baseURL = `https://us-west-2.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`; // /action

type Card = {
  question: string;
  answer: string;
  submitDate: string;
  stackCount: number;
};
class AxiosAPI {
  private static instance: AxiosAPI;
  private axiosConfig;
  private query: {
    dataSource: string;
    database: string;
    collection: string;
    document?: Card;
  };

  private constructor() {
    this.axiosConfig = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
      method: "POST",
    });
    this.query = {
      dataSource: "Cluster0",
      database: "cards_db",
      collection: "cards",
    };
  }

  static getInstance(): AxiosAPI {
    if (!AxiosAPI.instance) {
      AxiosAPI.instance = new AxiosAPI();
    }
    return AxiosAPI.instance;
  }

  async getCards() {
    const body = JSON.stringify({});
    // {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "api-key": "qLnkJigiiCtNuBy7XmOOHTR6ruuYxtK8PnBhL85i3hFtQ3hKlGXGqvXHl3PbR43u"
    //   },
    //   body: '{"collection":"cards","database":"cards_db","dataSource":"Cluster0"}'
    // }
    return await this.axiosConfig.post("/find", {
      body: JSON.stringify({
        dataSource: "Cluster0",
        database: "cards_db",
        collection: "cards",
      }),
    });
    // document: "",
    // return await this.axiosConfig.get("/find");
  }

  async postCards(payload: Card) {
    this.query.document = payload;
    return await this.axiosConfig.post("/insertOne", this.query);
  }

  async patchCards() {}
  async deleteCards() {}
  async singin() {}
  async singup() {}
}

const axiosLog = AxiosAPI.getInstance();

try {
  console.log(await axiosLog.getCards());
} catch (error) {
  console.log(error);
}

export default AxiosAPI;
