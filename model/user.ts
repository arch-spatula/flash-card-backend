import { model, Schema } from 'https://esm.sh/mongoose@7.4.0';

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
