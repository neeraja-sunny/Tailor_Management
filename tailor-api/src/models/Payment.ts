import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  boutique: mongoose.Schema.Types.ObjectId;
  order?: mongoose.Schema.Types.ObjectId;
  transaction?: mongoose.Schema.Types.ObjectId;
  customer?: mongoose.Schema.Types.ObjectId;
  amount: number;
  date: Date;
  method: string;
  receiptUrl?: string;
  note?: string;
  createdBy?: mongoose.Schema.Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>(
  {
    boutique: { type: Schema.Types.ObjectId, ref: "Boutique", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    method: { type: String, required: true },
    receiptUrl: String,
    note: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
