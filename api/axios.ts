import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import axios from "https://deno.land/x/redaxios@0.5.1/mod.ts";

// axios 싱글튼
const { APP_ID, CARD_API_KEY } = config();
const baseURL = `https://us-west-2.aws.data.mongodb-api.com/app/${APP_ID}/endpoint/data/v1/action`; // /action
const DATA_SOURCE = "Cluster0";
const DATABASE = "cards_db";
const COLLECTION = "cards";

class AxiosAPI {
  private static instance: AxiosAPI;
  private axiosConfig;
  private constructor() {
    this.axiosConfig = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "api-key": CARD_API_KEY,
      },
    });
  }
  public static getInstance(): AxiosAPI {
    if (!AxiosAPI.instance) {
      AxiosAPI.instance = new AxiosAPI();
    }
    return AxiosAPI.instance;
  }
  async getCards() {
    this.axiosConfig.post("");
  }
  async postCards() {}
  async patchCards() {}
  async deleteCards() {}
  async singin() {}
  async singup() {}
}

export default AxiosAPI;
