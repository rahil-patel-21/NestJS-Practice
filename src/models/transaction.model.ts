export class Transaction {
  date?: Date;
  type?: string;
  description?: string;
  category?: string;
  amount?: number;

  constructor(
    date?: Date,
    type?: string,
    description?: string,
    category?: string,
    amount?: number,
  ) {
    this.date = date;
    this.type = type;
    this.description = description;
    this.category = category;
    this.amount = amount;
  }
}
