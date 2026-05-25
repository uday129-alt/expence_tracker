import mongoose from 'mongoose';

export interface IExpense {
  _id?: string;
  storeName: string;
  date: Date;
  amount: number;
  category: string;
  items: string[];
  rawText: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExpenseSchema = new mongoose.Schema<IExpense>(
  {
    storeName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    items: {
      type: [String],
      default: [],
    },
    rawText: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model<IExpense>('Expense', ExpenseSchema);
