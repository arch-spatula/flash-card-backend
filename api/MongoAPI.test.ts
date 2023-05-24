import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { it, beforeAll } from "https://deno.land/std@0.188.0/testing/bdd.ts";
import CardRecord from "../model/cards.ts";
import MongoAPI from "./mongoAPI.ts";

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

  it("deleteCards should delete a card from the database", async () => {
    const cardId = "card123";
    const response = await mongoAPI.deleteCards(cardId);
    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("signup should create a new user if the email is not already registered", async () => {
    const email = "newuser@example.com";
    const password = "password123";
    const response = await mongoAPI.signup({ email, password });
    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("signup should throw an error if the email is already registered", async () => {
    const email = "existinguser@example.com";
    const password = "password123";
    const response = await mongoAPI.signup({ email, password });
    assertEquals(response.error, "이미 가입한 아이디입니다.");
  });

  it("signin should return the user document if the email and password are correct", async () => {
    const email = "existinguser@example.com";
    const password = "password123";
    const response = await mongoAPI.signin({ email, password });
    assertEquals(response.status, 200);
    // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
  });

  it("signin should throw an error if the email is not registered", async () => {
    const email = "nonexistentuser@example.com";
    const password = "password123";
    const response = await mongoAPI.signin({ email, password });
    assertEquals(response.error, "이메일이 없습니다.");
  });

  it("signin should throw an error if the password is incorrect", async () => {
    const email = "existinguser@example.com";
    const password = "incorrectpassword";
    const response = await mongoAPI.signin({ email, password });
    assertEquals(response.error, "비밀번호가 알치하지 않습니다.");
  });
});
