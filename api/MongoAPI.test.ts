import { CardRecord } from '../model/cards.ts';
import MongoAPI, {
  getCard,
  postCard,
  patchCard,
  removeCard,
} from './mongoAPI.ts';
import { assert, assertEquals, beforeEach } from '../deps.ts';

const mongoAPI = MongoAPI.getInstance();

Deno.test('server', () => {
  let mockServer;

  beforeEach(() => {
    mockServer = Deno.serve((req) => new Response('hello world'));
  });
});

Deno.test('postCards should insert a card into the database', async () => {
  const newCard = {
    question: 'Question',
    answer: 'Answer',
    submitDate: new Date(),
    stackCount: 0,
    userId: 'user1234',
  };

  // await superdeno()
  assert(postCard(newCard));

  const insertedCard = await postCard(newCard);
  assertEquals(insertedCard.question, newCard.question);
  assertEquals(insertedCard.answer, newCard.answer);
});

Deno.test('getCards should fetch cards from the database', async () => {
  const response = await getCard('user1234');

  // assertEquals(response, 200);
  assert(Array.isArray(response));
  // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
});

Deno.test('patchCards should update a card in the database', async () => {
  const card = new CardRecord(
    'Updated Question',
    'Updated Answer',
    new Date(),
    1,
    'user123',
    'card123'
  );
  const response = await mongoAPI.patchCards(card);
  const data = await response.json();

  assertEquals(response.status, 200);
  assert(data.getOwnPropertyNames('modifiedCount'));
  // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
});

Deno.test('deleteCards should delete a card from the database', async () => {
  const cardId = 'card123';
  const response = await mongoAPI.deleteCards(cardId);
  const data = await response.json();

  assertEquals(response.status, 200);
  assert(data.getOwnPropertyNames('deletedCount'));
  // 여기에서 데이터에 대한 추가 검증을 수행할 수 있습니다.
});

Deno.test('getUser should fetch user from the database', async () => {
  const email = 'user@example.com';
  const response = await mongoAPI.getUser(email);
  const data = await response.json();

  assertEquals(response.status, 200);
  assert(data.getOwnPropertyNames('email'));
  // 데이터에 대한 추가 검증을 수행할 수 있습니다.
});

Deno.test('postUser should insert a user into the database', async () => {
  const user = {
    email: 'user@example.com',
    passwordHash: 'hashedPassword',
    passwordSalt: 'salt',
  };
  const response = await mongoAPI.postUser(user);
  const data = await response.json();

  assertEquals(response.status, 200);
  assert(data.getOwnPropertyNames('insertedId'));
  // 데이터에 대한 추가 검증을 수행할 수 있습니다.
});

Deno.test('should fail', () => {
  assertEquals(false, true);
});
