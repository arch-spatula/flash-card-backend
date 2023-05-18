class Card {
  private question: string;
  private id: string;
  private answer: string;
  private submitDate: Date;
  constructor(question: string, id: string, answer: string, date: Date) {
    this.question = question;
    this.id = id;
    this.answer = answer;
    this.submitDate = date;
  }
}

export default Card;
