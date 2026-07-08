
import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  boutique: Types.ObjectId;
  order?: Types.ObjectId;

  invoiceNumber: string;
  amount?: number;
  advance?: number;
  balance?: number;
  invoiceDate: Date;

  payments?: Types.ObjectId[];

  pdfUrl?: string;
}

const transactionSchema = new Schema<ITransaction>({
  boutique: {
    type: Schema.Types.ObjectId,
    ref: "Boutique",
    required: true,
    index: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },

  invoiceNumber: {
    type: String,
    required: true,
  },

  amount: Number,
  advance: Number,
  balance: Number,

  invoiceDate: {
    type: Date,
    default: Date.now,
  },

  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],

  pdfUrl: String,
}, { timestamps: true });

transactionSchema.index({ boutique: 1, invoiceNumber: 1 }, { unique: true });

const Transaction: Model<ITransaction> =
  (mongoose.models.Transaction as Model<ITransaction>) ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
