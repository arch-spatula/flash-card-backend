import { helpers } from '../deps.ts';
import type { Context } from '../deps.ts';
import { getCard, patchCard, postCard, deleteCard } from '../api/mongoAPI.ts';

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

    response.status = 201;
    response.body = await postCard({
      question,
      answer,
      submitDate,
      stackCount,
      userId,
    });
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
    response.body = await getCard(userId);
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

    response.status = 200;
    response.body = await patchCard(id, {
      userId,
      question,
      answer,
      submitDate,
      stackCount,
    });
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

async function removeCard(ctx: Context) {
  const { response } = ctx;
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    await deleteCard(id);
    response.status = 204;
    response.body = null;
  } catch (error) {
    response.status = 400;
    response.body = {
      success: false,
      msg: `${error}`,
    };
  }
}

export { getCards, addCard, updateCard, removeCard };
