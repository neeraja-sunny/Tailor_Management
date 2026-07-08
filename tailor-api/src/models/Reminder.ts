import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  boutique: mongoose.Schema.Types.ObjectId;
  order?: mongoose.Schema.Types.ObjectId;
  customer?: mongoose.Schema.Types.ObjectId;
  type: "trial" | "delivery" | "balance" | "custom";
  channel: "sms" | "whatsapp" | "both";
  sendAt: Date;
  message: string;
  sent?: boolean;
  attempts?: number;
  sentAt?: Date;
  createdBy?: mongoose.Schema.Types.ObjectId;
}

const reminderSchema = new Schema<IReminder>(
  {
    boutique: { type: Schema.Types.ObjectId, ref: "Boutique", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    type: { type: String, enum: ["trial", "delivery", "balance", "custom"], default: "custom" },
    channel: { type: String, enum: ["sms", "whatsapp", "both"], default: "sms" },
    sendAt: { type: Date, required: true, index: true },
    message: { type: String, required: true },
    sent: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    sentAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<IReminder>("Reminder", reminderSchema);
