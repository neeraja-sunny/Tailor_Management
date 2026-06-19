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
      bottomlength: String,
      ankle: String,
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
      bottomlength: string;
      ankle: string;
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
},
  { timestamps: true }
);

export default mongoose.model<IOrderItem>("OrderItem", orderitemSchema);
