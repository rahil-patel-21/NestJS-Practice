export class Transaction {
  date?: Date;
  type?: string;
  description?: string;
  category?: string;
  amount?: number;
  mode?: string;

  constructor(
    date?: Date,
    type?: string,
    description?: string,
    category?: string,
    amount?: number,
    mode?: string,
  ) {
    this.date = date;
    this.type = type;
    this.description = description;
    this.category = category;
    this.amount = amount;
    this.mode = mode;
  }
}
