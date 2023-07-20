import { assertEquals } from '../deps.ts';
import { beforeEach } from '../deps.ts';
import { addCard, removeCard, getCards, updateCard } from './cards.ts';
import type { Context } from '../deps.ts';
// import MongoAPI from '../api/mongoAPI.ts';
import CardRecord from '../model/cards.ts';
// 테스트 코드를 작성할 때 필요한 모듈을 가져옵니다.
// Mocking
// class MockMongoAPI implements Partial<MongoAPI> {
//   async getCards(userId: string) {
//     return { success: true, userId };
//   }

//   async postCards(card: CardRecord) {
//     return { success: true, card };
//   }

//   async patchCards(card: CardRecord) {
//     return { success: true, card };
//   }

//   async deleteCards(id: string) {
//     return { success: true, id };
//   }
// }

// class MockToken implements Partial<Token> {
//   async tokenToUserId(jwt: string) {
//     if (jwt === 'validToken') {
//       return 'userId';
//     } else {
//       return null;
//     }
//   }
// }

// // 테스트 코드를 그룹으로 묶을 수 있습니다.
// Deno.test('API 테스트', () => {
//   let response: Response;
//   const mockMongoAPI = new MockMongoAPI();
//   const mockToken = new MockToken();

//   // 각 테스트 함수 실행 전에 실행되는 부분입니다.
//   beforeEach(async () => {
//     // response = { status: 0, body: null };
//   });

//   // 테스트 코드 예시 1: getCards
//   Deno.test('getCards 테스트', async () => {
//     const ctx: Context = {
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     await getCards(ctx);

//     assertEquals(response.status, 200);
//     // assertEquals(response.body, { success: true, userId: 'userId' });
//   });

//   // 테스트 코드 예시 2: addCard
//   Deno.test('addCard 테스트', async () => {
//     const ctx: Context = {
//       request: {
//         hasBody: true,
//         body: () =>
//           Promise.resolve({
//             value: {
//               question: 'Question',
//               answer: 'Answer',
//               submitDate: '2023-05-25',
//               stackCount: 5,
//             },
//           }),
//       } as any,
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     await addCard(ctx);

//     assertEquals(response.status, 201);
//     // assertEquals(response.body, {
//     //   success: true,
//     //   card: {
//     //     question: 'Question',
//     //     answer: 'Answer',
//     //     submitDate: '2023-05-25',
//     //     stackCount: 5,
//     //     userId: 'userId',
//     //   },
//     // });
//   });

//   // 테스트 코드 예시 3: updateCard
//   Deno.test('updateCard 테스트', async () => {
//     const ctx: Context = {
//       request: {
//         hasBody: true,
//         body: () =>
//           Promise.resolve({
//             value: {
//               question: 'Updated Question',
//               answer: 'Updated Answer',
//               submitDate: '2023-05-26',
//               stackCount: 10,
//             },
//           }),
//       } as any,
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     const helpers = { getQuery: () => ({ id: 'cardId' }) };
//     // await updateCard({});

//     assertEquals(response.status, 200);
//     // assertEquals(response.body, {
//     //   success: true,
//     //   card: {
//     //     question: 'Updated Question',
//     //     answer: 'Updated Answer',
//     //     submitDate: '2023-05-26',
//     //     stackCount: 10,
//     //     userId: 'userId',
//     //     _id: 'cardId',
//     //   },
//     // });
//   });

//   // 테스트 코드 예시 4: deleteCard
//   Deno.test('deleteCard 테스트', async () => {
//     const ctx: Context = {
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     const helpers = { getQuery: () => ({ id: 'cardId' }) };
//     await deleteCard({ ...ctx, ...helpers });

//     assertEquals(response.status, 204);
//     assertEquals(response.body, null);
//   });

//   // 테스트 코드 예시 5: 인증이 안 된 경우
//   Deno.test('인증되지 않은 사용자 테스트', async () => {
//     const ctx: Context = {
//       response,
//       cookies: { get: () => Promise.resolve(null) },
//     } as any;
//     await getCards(ctx);

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       success: false,
//       msg: '인증이 안 되어 있습니다.',
//     });
//   });

//   // 테스트 코드 예시 6: 요청 데이터가 부족한 경우
//   Deno.test('요청 데이터 부족 테스트', async () => {
//     const ctx: Context = {
//       request: {
//         hasBody: true,
//         body: () =>
//           Promise.resolve({
//             value: {
//               question: 'Question',
//               answer: '',
//               submitDate: '',
//               stackCount: 5,
//             },
//           }),
//       } as any,
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     await addCard(ctx);

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       success: false,
//       msg: 'question, answer, data, stackCount 중 값이 1개 없습니다.',
//     });
//   });

//   // 테스트 코드 예시 7: 토큰에서 사용자 ID를 가져올 수 없는 경우
//   Deno.test('사용자 ID 없는 경우 테스트', async () => {
//     const ctx: Context = {
//       response,
//       cookies: { get: () => Promise.resolve('invalidToken') },
//     } as any;
//     await getCards(ctx);

//     assertEquals(response.status, 400);
//     assertEquals(response.body, {
//       // success: false,
//       msg: '사용자 id가 없습니다.',
//     });
//   });

//   // 테스트 코드 예시 8: 예외가 발생하는 경우
//   Deno.test('예외 발생 테스트', async () => {
//     const ctx: Context = {
//       request: {
//         hasBody: false,
//         body: () => Promise.resolve({}),
//       } as any,
//       response,
//       cookies: { get: () => Promise.resolve('validToken') },
//     } as any;
//     await addCard(ctx);

//     assertEquals(response.status, 400);
//     assertEquals(response.body, { success: false, msg: 'No Data' });
//   });
// });
