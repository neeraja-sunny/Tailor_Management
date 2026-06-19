import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {

    order?: mongoose.Schema.Types.ObjectId;

    invoiceNumber: string;

    amount?: number;

    advance?: number;

    balance?: number;

    invoiceDate: Date;

    payments?: {
         amount: number;
            date: Date;
            method: string;
            note: string;
    }[];

    pdfUrl?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

  invoiceNumber: { type: String, required: true, unique: true },

  amount: Number,

  advance: Number,

  balance: Number,

  invoiceDate: { type: Date, default: Date.now },

  payments: [{
     amount: Number,
     date: Date,
     method: String,
     note: String
  }],
  
  pdfUrl: String

  },

  { timestamps: true }

);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
