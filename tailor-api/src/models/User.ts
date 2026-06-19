import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone?: string;
  fullName?: string;
  userPhoto?: string;

  role: "owner" | "staff";
  
  boutiques?: Types.ObjectId[];
  activeBoutique?: Types.ObjectId;
  boutique?: Types.ObjectId;
  createdBy?: Types.ObjectId;

  password?: string;
  otp?: string;
  otpExpires?: Date;
  isProfileCompleted: boolean;
  isActive: boolean; 
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    phone: String,
    fullName: String,
    userPhoto: String,

    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "owner",
    },

    // OWNER
    boutiques: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Boutique",
      },
    ],
    activeBoutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
    },

    boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    password: {
      type: String,
      select: false,
    },

    otp: String,
    otpExpires: Date,

    isProfileCompleted: { type: Boolean, default: false },

    isActive: {
    type: Boolean,
    default: true,
}
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
