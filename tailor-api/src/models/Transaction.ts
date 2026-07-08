import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {

   order?: mongoose.Schema.Types.ObjectId;

   invoiceNumber: string;

   amount?: number;

   advance?: number;

   balance?: number;

   invoiceDate: Date;

   payments?: mongoose.Schema.Types.ObjectId[];

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

  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  
  pdfUrl: String

  },

  { timestamps: true }

);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
