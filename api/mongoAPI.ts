import { config } from '../deps.ts';
import Card from '../model/cards.ts';
import User from '../model/user.ts';
// import mongoose, { Types } from 'npm:mongoose@^7.4.0';
import mongoose from 'https://esm.sh/mongoose@7.4.0';

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
