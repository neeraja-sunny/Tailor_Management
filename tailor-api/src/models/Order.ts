import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {

    orderNumber: string;

    customer: mongoose.Schema.Types.ObjectId;

    items: mongoose.Schema.Types.ObjectId[];

    trialDate?: Date;

    deliveryDate?: Date;

    totalAmount?: number;

    advanceGiven?: number;

    balanceDue?: number;

    status?: "draft" | "active" | "past_due" | "upcoming" | "pending_payment" | "delivered" | "cancelled";

    additionalCharges?: {
    reason: string;
    amount: number;
    createdAt: Date;
    }[];

    createdAt: Date;

    updatedAt?: Date;

    notes?: string;

    isArchived?: boolean;

    boutique?: mongoose.Schema.Types.ObjectId;

}

const orderSchema = new Schema<IOrder>(

  {

  orderNumber: { type: String, required: true, unique: true },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],

  trialDate: Date,

  deliveryDate: Date,

  totalAmount: { type: Number, default: 0 },

  advanceGiven: { type: Number, default: 0 },

  balanceDue: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ["draft","active","past_due","upcoming","pending_payment","delivered","cancelled"], 
    default: "draft" 
  },

  additionalCharges: [
  {
    reason: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  }
],


  createdAt: { type: Date, default: Date.now },

  updatedAt: Date,

  notes: String,
  
  isArchived: { type: Boolean, default: false },

  boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Boutique", required: true },

  },

  { timestamps: true }

);

export default mongoose.model<IOrder>("Order", orderSchema);
