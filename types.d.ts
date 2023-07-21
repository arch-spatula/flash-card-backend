type Card = {
  _id?: import('npm:mongoose@^7.4.0').Types.ObjectId;
  question: string;
  answer: string;
  submitDate: Date;
  stackCount: number;
  userId: string;
};

type User = {
  _id?: import('npm:mongoose@^7.4.0').Types.ObjectId;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};
