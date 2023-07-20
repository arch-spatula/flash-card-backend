import { model, Schema } from 'npm:mongoose@^7.4.0';

const userSchema = new Schema<{
  email: string;
  passwordHash: string;
  passwordSalt: string;
}>({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
});

export default model('User', userSchema, 'user');
