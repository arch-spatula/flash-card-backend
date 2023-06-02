import { helpers } from '../deps.ts';
import type { Context } from '../deps.ts';
import MongoAPI from '../api/mongoAPI.ts';
import Token from '../util/token.ts';
import CardRecord from '../model/cards.ts';

const mongoAPI = MongoAPI.getInstance();
const token = Token.getInstance();

async function addCard({ request, response, cookies }: Context) {
  try {
    if (!request.hasBody) throw Error('No Data');

    const jwt = await cookies.get('user');
    if (!jwt) {
      throw Error('인증이 안 되어 있습니다.');
    }
    const userId = await token.tokenToUserId(jwt);
    if (!userId) throw Error('사용자 id가 없습니다.');

    const { question, answer, submitDate, stackCount } = await request.body()
      .value;
    if (!question || !answer || !submitDate || !stackCount)
      throw Error('question, answer, data, stackCount 중 값이 1개 없습니다.');

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

async function getCards({ response, cookies }: Context) {
  try {
    const jwt = await cookies.get('user');
    if (!jwt) {
      throw Error('인증이 안 되어 있습니다.');
    }

    const userId = await token.tokenToUserId(jwt);
    if (!userId) throw Error('사용자 id가 없습니다.');

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
  const { request, response, cookies } = ctx;
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    if (!request.hasBody) throw Error('No Data');

    const jwt = await cookies.get('user');
    if (!jwt) {
      throw Error('인증이 안 되어 있습니다.');
    }

    const userId = await token.tokenToUserId(jwt);
    if (!userId) throw Error('사용자 id가 없습니다.');

    const { question, answer, submitDate, stackCount } = await request.body()
      .value;
    if (!question || !answer || !submitDate || !stackCount)
      throw Error('question, answer, data, stackCount 중 값이 1개 없습니다.');

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
  const { response, cookies } = ctx;
  const { id } = helpers.getQuery(ctx, { mergeParams: true });
  try {
    const jwt = await cookies.get('user');
    if (!jwt) {
      throw Error('인증이 안 되어 있습니다.');
    }

    const userId = await token.tokenToUserId(jwt);
    if (!userId) throw Error('사용자 id가 없습니다.');

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
