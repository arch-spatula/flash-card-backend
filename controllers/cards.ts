import { helpers } from '../deps.ts';
import type { Context } from '../deps.ts';
import MongoAPI from '../api/mongoAPI.ts';
import { CardRecord } from '../model/cards.ts';

const mongoAPI = MongoAPI.getInstance();

async function addCard({ request, response, state }: Context) {
  try {
    if (!request.hasBody) throw Error('No Data');

    const userId = state.userId ?? '';

    const { question, answer, submitDate, stackCount } = await request.body()
      .value;
    if (!question || !answer || !submitDate || stackCount === undefined)
      // stackCount의 0은 falsy 하기 때문에 undefined으로 활용
      throw Error(
        'question, answer, submitDate, stackCount 중 값이 1개 없습니다.'
      );

    const card = new CardRecord(
      question,
      answer,
      submitDate,
      stackCount,
      userId
    );
    response.status = 201;
    response.body = await mongoAPI.postCards(card);
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function getCards({ response, state }: Context) {
  try {
    const userId = state.userId ?? '';

    response.status = 200;
    response.body = await mongoAPI.getCards(userId);
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function updateCard(ctx: Context) {
  const { request, response, state } = ctx;
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    if (!request.hasBody) throw Error('No Data');

    const userId = state.userId ?? '';

    const { question, answer, submitDate, stackCount } = await request.body()
      .value;
    if (!question || !answer || !submitDate || stackCount === undefined)
      throw Error(
        'question, answer, submitDate, stackCount 중 값이 1개 없습니다.'
      );

    const card = new CardRecord(
      question,
      answer,
      submitDate,
      stackCount,
      userId,
      id
    );

    response.status = 200;
    response.body = await mongoAPI.patchCards(card);
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function deleteCard(ctx: Context) {
  const { response } = ctx;
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    response.status = 204;
    await mongoAPI.deleteCards(id);
    response.body = null;
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { getCards, addCard, updateCard, deleteCard };
