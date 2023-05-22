class CardRecord {
  private _id?: string;
  private question: string;
  private answer: string;
  private submitDate: Date;
  private stackCount: number;
  private userId: string;
  constructor(
    question: string,
    answer: string,
    date: Date,
    stackCount: number,
    userId: string,
    _id?: string
  ) {
    this._id = _id;
    this.question = question;
    this.answer = answer;
    this.submitDate = date;
    this.stackCount = stackCount;
    this.userId = userId;
  }
  get getId() {
    return this._id;
  }
  get getQuestion() {
    return this.question;
  }
  get getAnswer() {
    return this.answer;
  }
  get getSubmitDate() {
    return this.submitDate;
  }
  get getStackCount() {
    return this.stackCount;
  }
}

// const card = new CardRecord(
//   "CPU의 본딧말",
//   "Central Processing Unit",
//   new Date(),
//   0,
//   "1",
//   "0"
// );

export default CardRecord;
