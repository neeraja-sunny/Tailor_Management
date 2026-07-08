import mongoose, { Document, Schema } from "mongoose";

export interface IEnquiry extends Document {
  boutique: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  note?: string;
  status: "new" | "contacted" | "converted";
  createdAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Boutique", required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    note: { type: String, trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  { timestamps: true }
);

enquirySchema.index({ boutique: 1, createdAt: -1 });

export default mongoose.model<IEnquiry>("Enquiry", enquirySchema);
