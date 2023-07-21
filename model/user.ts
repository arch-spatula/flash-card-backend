import { Schema, model } from '../deps.ts';

const userSchema = new Schema<{
  email: string;
  passwordHash: string;
  passwordSalt: string;
}>(
  {
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
  },
  { versionKey: false }
);

export default model('User', userSchema, 'user');
