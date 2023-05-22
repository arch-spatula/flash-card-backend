import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { it, beforeAll } from "https://deno.land/std@0.188.0/testing/bdd.ts";
// import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import CardRecord from "../model/cards.ts";
import MongoAPI from "./mongoAPI.ts";

// const { APP_ID, CARD_API_KEY } = config();

Deno.test("MongoAPI", () => {
  let mongoAPI: MongoAPI;

  beforeAll(() => {
    mongoAPI = MongoAPI.getInstance();
  });

  it("getCards should fetch cards from the database", async () => {
    const response = await mongoAPI.getCards();
    // const data = await response.json();

    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("postCards should insert a card into the database", async () => {
    const card = new CardRecord("Question", "Answer", new Date(), 0, "user123");
    const response = await mongoAPI.postCards(card);
    // const data = await response.json();

    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("patchCards should update a card in the database", async () => {
    const card = new CardRecord(
      "Updated Question",
      "Updated Answer",
      new Date(),
      1,
      "user123",
      "card123"
    );
    const response = await mongoAPI.patchCards(card);
    // const data = await response.json();

    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("deleteCards should delete a card from the database", async () => {
    const cardId = "card123";
    const response = await mongoAPI.deleteCards(cardId);
    // const data = await response.json();

    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });
});
