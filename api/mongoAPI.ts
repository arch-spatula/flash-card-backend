import { updateCard } from '../controllers/cards.ts';
import { config } from '../deps.ts';
import type { CardRecord } from '../model/cards.ts';
import Card from '../model/cards.ts';
import User from '../model/user.ts';
import mongoose, { Types } from 'npm:mongoose@^7.4.0';

const MONGO_URL = Deno.env.get('MONGO_URL') || config()['MONGO_URL'];

await mongoose.connect(MONGO_URL);

async function getCard(userId: string) {
  try {
    return await Card.find({ userId });
  } catch (error) {
    return error;
  }
}

async function postCard(document: Card) {
  const card = new Card(document);
  try {
    return await card.save();
  } catch (error) {
    return error;
  }
}

async function patchCard(
  _id: string,
  { question, answer, stackCount, submitDate, userId }: Card
) {
  try {
    return await Card.findByIdAndUpdate(_id, {
      question,
      answer,
      stackCount,
      submitDate,
      userId,
    });
  } catch (error) {
    return error;
  }
}

async function deleteCard(_id: string) {
  try {
    return await Card.findByIdAndDelete(_id);
  } catch (error) {
    return error;
  }
}

async function postUser(user: User) {
  const newUser = new User(user);
  try {
    return await newUser.save();
  } catch (error) {
    return error;
  }
}

async function getUser(email: string) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return error;
  }
}

export { getUser, postUser, getCard, postCard, patchCard, deleteCard };

// --------------------------------------------------------------------------

const MONGO_URI = Deno.env.get('MONGO_URI') || config()['MONGO_URI'];
const CARD_API_KEY = Deno.env.get('CARD_API_KEY') || config()['CARD_API_KEY'];

type Collection = {
  dataSource: string;
  database: string;
  collection: string;
};

/**
 * @see https://www.mongodb.com/developer/languages/rust/getting-started-deno-mongodb/
 * 모든 method가 POST로 고정되어 있습니다. 특정 메서드에 맞게 갱신은 없습니다.
 */

class MongoAPI {
  private static instance: MongoAPI;
  private baseURL: string;
  private options: {
    method: string;
    headers: { 'Content-Type': string; 'api-key': string };
    body: BodyInit;
  };
  private cardBody: Collection;
  private userBody: Collection;
  private constructor() {
    this.baseURL = MONGO_URI;
    this.options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': CARD_API_KEY,
      },
      body: '',
    };
    this.cardBody = {
      dataSource: 'Cluster0',
      database: 'cards_db',
      collection: 'cards',
    };
    this.userBody = {
      dataSource: 'Cluster0',
      database: 'cards_db',
      collection: 'user',
    };
  }

  static getInstance(): MongoAPI {
    if (!MongoAPI.instance) {
      MongoAPI.instance = new MongoAPI();
    }
    return MongoAPI.instance;
  }

  async getCards(userId: string) {
    try {
      const result = await fetch(`${this.baseURL}/find`, {
        ...this.options,
        body: JSON.stringify({ ...this.cardBody, filter: { userId } }),
      });
      return result.json();
    } catch (error) {
      return error;
    }
  }

  async getAllCards() {
    try {
      const result = await fetch(`${this.baseURL}/find`, {
        ...this.options,
        body: JSON.stringify({ ...this.cardBody }),
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

  async postUser({
    email,
    passwordHash,
    passwordSalt,
  }: {
    email: string;
    passwordHash: string;
    passwordSalt: string;
  }) {
    try {
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

  async getUser(email: string) {
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
