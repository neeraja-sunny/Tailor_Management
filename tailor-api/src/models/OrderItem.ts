import mongoose, { Schema, Document } from "mongoose";

const CustomMeasurementSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    imageUrl: String,
  },
  { _id: false }
);

const MeasurementsSchema = new Schema(
  {
    defaults: {
      chest: String,
      waist: String,
      hip: String,
      shoulder: String,
      neck: String,
      sleeveLength: String,
      wrist: String,
      armhole: String,
      hipCircumference: String,
      kneeCircumference: String,
      fullLength: String,
      topLength: String,
      bottomlength: String,
      ankle: String,
      bust: String,
      underBust: String,
      thigh: String,
      calf: String,
      crotchDepth: String,
      inseam: String,
      frontNeckDepth: String,
      backNeckDepth: String,
      flare: String,
    },
    custom: [CustomMeasurementSchema],
  },
  { _id: false }
);

export interface IOrderItem extends Document {

    name?: string;

    category?: string;

    quantity?: number;

    type?: "stitching" | "alteration";

    inspirationLink?: string;

    audioUrl?: string;

    specialInstructions?: string;

    referenceImages?: string;

    measurements?: {
    defaults?: {
      chest?: string;
      waist?: string;
      hip?: string;
      shoulder?: string;
      neck: string;
      sleeveLength: string;
      wrist: string;
      armhole: string;
      hipCircumference: string;
      kneeCircumference: string;
      fullLength: string;
      topLength: string;
      bottomlength: string;
      ankle: string;
      bust?: string;
      underBust?: string;
      thigh?: string;
      calf?: string;
      crotchDepth?: string;
      inseam?: string;
      frontNeckDepth?: string;
      backNeckDepth?: string;
      flare?: string;
    };
    custom?: {
      name: string;
      size: string;
      imageUrl?: string;
    }[];
  };

    stitchOptions?: Map<string, string>;

    stitchingPrice?: number;

    additionalPrice?: number;

    status?: "accepted" | "cutting" | "stitching" | "finishing" | "completed";

    trialDate?: Date,

    deliveryDate?: Date,

    boutique?: mongoose.Schema.Types.ObjectId;

    assignedStaff?: mongoose.Types.ObjectId;
    workAssignments?: {
      workType: string;
      staff: mongoose.Types.ObjectId;
      assignedAt: Date;
    }[];
   
}

const orderitemSchema = new Schema<IOrderItem>(

{

  name: { type: String, required: true }, 

  category: String,

  quantity: { type: Number, default: 1 },

  type: { type: String, enum: ["stitching","alteration"], default: "stitching" },

  inspirationLink: String,

  audioUrl: String,

  specialInstructions: String,

  referenceImages: [{ url: String, publicId: String }],

  measurements: MeasurementsSchema,

  stitchOptions: { type: Map, of: String }, 

  stitchingPrice: { type: Number, default: 0 },

  additionalPrice: { type: Number, default: 0 }, 

  status: { type: String, enum: ["accepted","cutting","stitching","finishing","completed"], default: "accepted" },

  trialDate: Date,

  deliveryDate: Date,

  boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Boutique", required: true },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workAssignments: [{
    workType: { type: String, required: true, trim: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedAt: { type: Date, default: Date.now },
  }],
},
  { timestamps: true }
);

orderitemSchema.index({ boutique: 1, deliveryDate: 1 });

export default mongoose.model<IOrderItem>("OrderItem", orderitemSchema);
